"""
Multi-agent orchestrator that routes user prompts to specialist agents.

The orchestrator follows the pattern described in the ADK documentation:
1. Receive the user's prompt.
2. Delegate demographic analysis to a specialized agent.
3. Retrieve GeoJSON for the selected tracts.
4. Emit a map overlay event for the frontend.
5. Summarize the findings back to the user.
"""

from __future__ import annotations

import logging
import re
from statistics import mean
from typing import Dict, List, Optional

import pandas as pd
from google.adk.agents import LlmAgent
from google.adk.runners import InMemoryRunner
from google.genai import types
from us import states

from app.backend.tools.census_data_tool import CensusDataTool
from app.backend.tools.map_display_tool import MapDisplayTool
from app.backend.tools.scoring_tool import ScoringTool
from app.backend.tools.tract_geometry_tool import TractGeometryTool

logger = logging.getLogger(__name__)

# Simple lookup for common deployment cities that do not include their state name.
CITY_TO_STATE = {
    "atlanta": states.GA,
    "miami": states.FL,
    "orlando": states.FL,
    "tampa": states.FL,
    "jacksonville": states.FL,
}

DEFAULT_STATE = states.GA


class DemographicsAgent:
    """
    Agent responsible for analyzing census tracts based on user queries.

    This class wraps an LlmAgent configuration so the orchestrator can register
    it as a sub-agent, but uses flexible scoring logic to answer various
    demographic questions.
    """

    def __init__(self, model: str = "gemini-2.5-flash", max_tracts: int = 12):
        self.max_tracts = max_tracts
        self.model = model
        self.agent = LlmAgent(
            name="demographics_agent",
            model=model,
            instruction=(
                "Analyze the user's prompt to understand what demographic patterns "
                "they're asking about. Extract census data and rank tracts according "
                "to what the user wants to know."
            ),
            description="Analyzes census tracts based on user queries.",
        )
        self.census_tool = CensusDataTool()

    async def identify_underrepresented_tracts(
        self, prompt: str, state_fips: str
    ) -> Dict[str, object]:
        """Runs the census/scoring/geometry workflow for a target state."""
        logger.info("Demographics agent analyzing prompt='%s'", prompt)

        try:
            census_rows = self.census_tool.run(state_fips=state_fips)
        except Exception as exc:
            logger.exception("Failed to pull census data: %s", exc)
            raise

        if not census_rows:
            logger.warning("No census rows returned for state %s", state_fips)
            return {
                "tracts": [],
                "geojson": {"type": "FeatureCollection", "features": []},
                "reasoning": "No census records were returned for the requested area.",
            }

        census_df = pd.DataFrame(census_rows)
        census_df["GEOID"] = (
            census_df["state"].astype(str)
            + census_df["county"].astype(str)
            + census_df["tract"].astype(str)
        )

        poverty_rate = self._numeric_series(census_df, "poverty_rate")
        no_internet_pct = self._numeric_series(census_df, "no_internet_pct")
        student_pct = self._numeric_series(census_df, "student_pct")

        scoring_df = pd.DataFrame(
            {
                "GEOID": census_df["GEOID"],
                "poverty_rate": poverty_rate / 100.0,
                "internet_access": 1 - (no_internet_pct / 100.0),
                "student_rate": student_pct / 100.0,
            }
        )

        # Use LLM to determine what the user is asking for
        query_intent = await self._interpret_query(prompt)

        # Score and rank based on the query intent
        ranked_geoids = self._rank_tracts(scoring_df, query_intent)
        top_geoids = ranked_geoids[: self.max_tracts]

        if not top_geoids:
            return {
                "tracts": [],
                "geojson": {"type": "FeatureCollection", "features": []},
                "reasoning": "Unable to score tracts because the dataset was incomplete.",
                "query_intent": query_intent,
            }

        metric_lookup = census_df.set_index("GEOID")
        scoring_df.set_index("GEOID", inplace=True)
        scoring_df["score"] = (
            scoring_df["poverty_rate"] * 0.5
            + (1 - scoring_df["internet_access"]) * 0.3
            + scoring_df["student_rate"] * 0.2
        )

        underrepresented: List[Dict[str, object]] = []
        for geoid in top_geoids:
            row = metric_lookup.loc[geoid]
            score = scoring_df.loc[geoid, "score"]
            underrepresented.append(
                {
                    "geoid": geoid,
                    "name": row.get("name", "Unknown tract"),
                    "poverty_rate": float(row.get("poverty_rate", 0)),
                    "no_internet_pct": float(row.get("no_internet_pct", 0)),
                    "student_pct": float(row.get("student_pct", 0)),
                    "priority_score": round(float(score), 4),
                }
            )

        underrepresented.sort(key=lambda tract: tract["priority_score"], reverse=True)

        geometry_tool = TractGeometryTool(geoids=top_geoids)
        try:
            geojson = geometry_tool.run()
        except Exception as exc:
            logger.exception("Failed to fetch tract geometries: %s", exc)
            geojson = {"type": "FeatureCollection", "features": []}

        reasoning = await self._build_reasoning(underrepresented, query_intent)

        return {
            "tracts": underrepresented,
            "geojson": geojson,
            "reasoning": reasoning,
            "query_intent": query_intent,
        }

    async def _interpret_query(self, prompt: str) -> Dict[str, any]:
        """Use LLM to interpret what the user is asking for."""
        import json

        interpret_agent = LlmAgent(
            name="query_interpreter",
            model=self.model,
            instruction=f"""Analyze this census data query: "{prompt}"

Determine:
1. What metric are they interested in? (poverty, internet_access, students, wealth, connectivity)
2. Do they want HIGH or LOW values of that metric?
3. What's the primary focus?

Respond with ONLY a JSON object like:
{{"metric": "poverty_rate", "direction": "high", "focus": "underserved communities"}}
OR
{{"metric": "poverty_rate", "direction": "low", "focus": "wealthy communities"}}
OR
{{"metric": "internet_access", "direction": "high", "focus": "well-connected areas"}}

Metric options: poverty_rate, internet_access, student_rate
Direction options: high, low""",
        )

        try:
            runner = InMemoryRunner(agent=interpret_agent, app_name="query_interpret")

            # Create session
            session = await runner.session_service.create_session(
                app_name=runner.app_name,
                user_id="temp_user",
                session_id="temp_session"
            )

            message = types.Content(role='user', parts=[types.Part(text="Interpret the query")])
            response_text = ""

            async for event in runner.run_async(user_id="temp_user", session_id="temp_session", new_message=message):
                if event.is_final_response() and event.content and event.content.parts:
                    for part in event.content.parts:
                        if part.text:
                            response_text += part.text

            # Extract JSON from response
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                return json.loads(response_text[json_start:json_end])
        except Exception as exc:
            logger.warning("Failed to interpret query, using default: %s", exc)

        # Default to underserved communities
        return {"metric": "poverty_rate", "direction": "high", "focus": "underserved communities"}

    def _rank_tracts(self, scoring_df: pd.DataFrame, query_intent: Dict[str, any]) -> List[str]:
        """Rank tracts based on the interpreted query intent."""
        metric = query_intent.get("metric", "poverty_rate")
        direction = query_intent.get("direction", "high")

        # Calculate composite score based on the query
        if "poverty" in metric or "underserved" in query_intent.get("focus", ""):
            # Traditional underserved scoring
            scoring_df["score"] = (
                scoring_df["poverty_rate"] * 0.5
                + (1 - scoring_df["internet_access"]) * 0.3
                + scoring_df["student_rate"] * 0.2
            )
            ascending = False  # High scores = more underserved
        elif "wealth" in query_intent.get("focus", "") or "rich" in query_intent.get("focus", ""):
            # Wealthy areas = low poverty
            scoring_df["score"] = (
                (1 - scoring_df["poverty_rate"]) * 0.6
                + scoring_df["internet_access"] * 0.4
            )
            ascending = False  # High scores = wealthier
        elif "internet" in metric or "connect" in query_intent.get("focus", ""):
            if direction == "high":
                # Well-connected areas
                scoring_df["score"] = scoring_df["internet_access"]
                ascending = False
            else:
                # Poorly connected areas
                scoring_df["score"] = 1 - scoring_df["internet_access"]
                ascending = False
        elif "student" in metric:
            if direction == "high":
                scoring_df["score"] = scoring_df["student_rate"]
                ascending = False
            else:
                scoring_df["score"] = 1 - scoring_df["student_rate"]
                ascending = False
        else:
            # Default scoring
            scoring_df["score"] = (
                scoring_df["poverty_rate"] * 0.5
                + (1 - scoring_df["internet_access"]) * 0.3
                + scoring_df["student_rate"] * 0.2
            )
            ascending = False

        # Sort and return GEOIDs
        sorted_df = scoring_df.sort_values("score", ascending=ascending)
        return sorted_df["GEOID"].tolist()

    @staticmethod
    def _numeric_series(
        df: pd.DataFrame, column: str, default: float = 0.0
    ) -> pd.Series:
        if column in df.columns:
            return pd.to_numeric(df[column], errors="coerce").fillna(default)
        return pd.Series([default] * len(df), index=df.index)

    async def _build_reasoning(self, tracts: List[Dict[str, object]], query_intent: Dict[str, any]) -> str:
        """Generate natural, conversational analysis of the tract data."""
        if not tracts:
            return "I couldn't find any qualifying tracts that match the criteria."

        poverty_avg = mean([t["poverty_rate"] for t in tracts])
        no_internet_avg = mean([t["no_internet_pct"] for t in tracts])
        student_avg = mean([t["student_pct"] for t in tracts])

        sample_tracts = tracts[:3]
        tract_examples = "\n".join([
            f"- {t['name']}: {t['poverty_rate']:.1f}% poverty, "
            f"{t['no_internet_pct']:.1f}% without internet, "
            f"{t['student_pct']:.1f}% students"
            for t in sample_tracts
        ])

        # Adapt the context based on what the user asked for
        focus = query_intent.get("focus", "communities")
        context_hint = ""
        if "wealth" in focus or "rich" in focus:
            context_hint = "These are affluent areas with low poverty rates and good internet access."
        elif "underserved" in focus or "poverty" in query_intent.get("metric", ""):
            context_hint = "These are underserved communities facing economic challenges."
        elif "connect" in focus or "internet" in query_intent.get("metric", ""):
            context_hint = "These areas were selected based on internet connectivity patterns."

        reasoning_agent = LlmAgent(
            name="reasoning_generator",
            model=self.agent.model if isinstance(self.agent.model, str) else "gemini-2.5-flash",
            instruction=f"""You're analyzing census tract data. Here's what you found:

{len(tracts)} tracts matching the query. Examples:

{tract_examples}

Overall averages across all {len(tracts)} tracts:
- Poverty rate: {poverty_avg:.1f}%
- Households without internet: {no_internet_avg:.1f}%
- Student population: {student_avg:.1f}%

Context: {context_hint}

Explain what you're seeing in this data in a natural, conversational way. Talk about what the numbers
tell you about these communities, keeping in mind the context above. Be human and thoughtful, not robotic.
Keep it to 2-3 sentences.""",
        )

        try:
            runner = InMemoryRunner(agent=reasoning_agent, app_name="reasoning")

            # Create session first
            session = await runner.session_service.create_session(
                app_name=runner.app_name,
                user_id="temp_user",
                session_id="temp_session"
            )

            message = types.Content(role='user', parts=[types.Part(text="Generate the reasoning.")])
            response_text = ""

            async for event in runner.run_async(user_id="temp_user", session_id="temp_session", new_message=message):
                if event.is_final_response() and event.content and event.content.parts:
                    for part in event.content.parts:
                        if part.text:
                            response_text += part.text

            return response_text.strip() if response_text else self._fallback_reasoning(len(tracts), poverty_avg, no_internet_avg, query_intent)
        except Exception as exc:
            logger.warning("Failed to generate LLM reasoning, using fallback: %s", exc)
            return self._fallback_reasoning(len(tracts), poverty_avg, no_internet_avg, query_intent)

    @staticmethod
    def _fallback_reasoning(num_tracts: int, poverty_avg: float, no_internet_avg: float, query_intent: Dict[str, any]) -> str:
        """Fallback reasoning when LLM generation fails."""
        focus = query_intent.get("focus", "communities")
        if "wealth" in focus or "rich" in focus:
            return (
                f"Looking at these {num_tracts} affluent neighborhoods, the data shows prosperity. "
                f"Average poverty rates are just {poverty_avg:.0f}% and only {no_internet_avg:.0f}% of families "
                f"lack internet access - these are well-connected, economically stable communities."
            )
        else:
            return (
                f"Looking at these {num_tracts} neighborhoods, I'm seeing some real challenges. "
                f"About {poverty_avg:.0f}% poverty rates and {no_internet_avg:.0f}% of families "
                f"without internet access - these are communities that would really benefit from "
                f"better connectivity."
            )


class OrchestratorAgent:
    """Front-door agent that interprets the prompt and manages sub-agents."""

    def __init__(self, model: str = "gemini-2.5-flash"):
        self.model = model
        self.demographics_agent = DemographicsAgent(model=model)
        self.agent = LlmAgent(
            name="orchestrator",
            model=model,
            instruction=(
                "You are Atlas, a civic broadband planning assistant. "
                "Hold the main conversation, determine which specialist "
                "agent is needed, delegate work, and then summarize the "
                "results clearly for the user."
            ),
            description="Primary orchestrator for broadband planning prompts.",
            sub_agents=[self.demographics_agent.agent],
        )

    async def run(self, prompt: str, city: Optional[str] = None) -> Dict[str, object]:
        """
        Entry point used by the FastAPI websocket handler.

        Args:
            prompt: Raw user prompt.
            city: Optional city passed from the UI dropdown.
        """
        if not prompt:
            return {
                "type": "final_response",
                "agent": self.agent.name,
                "explanation": "Please provide a question so I can help.",
            }

        # First, determine if the user wants data analysis or just conversation
        needs_analysis = await self._should_run_analysis(prompt)

        if not needs_analysis:
            # Just have a conversation
            return {
                "type": "final_response",
                "agent": self.agent.name,
                "explanation": await self._generate_conversational_response(prompt),
            }

        # User wants analysis - proceed with demographics workflow
        target_state = self._resolve_state(prompt, city)
        logger.info(
            "Routing prompt='%s' to demographics agent for %s",
            prompt,
            target_state.name,
        )

        analysis = await self.demographics_agent.identify_underrepresented_tracts(
            prompt=prompt, state_fips=target_state.fips
        )
        map_event = MapDisplayTool(analysis["geojson"]).run()

        response = {
            "type": "final_response",
            "agent": self.agent.name,
            "state": {"name": target_state.name, "fips": target_state.fips},
            "explanation": await self._compose_summary(prompt, target_state.name, analysis, analysis.get("query_intent", {})),
            "underrepresented_tracts": analysis["tracts"],
            "map_event": map_event,
            "reasoning": analysis["reasoning"],
        }

        return response

    async def _should_run_analysis(self, prompt: str) -> bool:
        """Determine if the user wants data analysis or just conversation."""
        intent_agent = LlmAgent(
            name="intent_classifier",
            model=self.model,
            instruction="""You are a classifier. Determine if the user wants data analysis or conversation.

Respond with ONLY one word:
- "ANALYZE" if they want census data, demographics, underserved areas, or tract analysis
- "CHAT" if they're greeting you, asking how you are, or just conversing""",
        )

        try:
            runner = InMemoryRunner(agent=intent_agent, app_name="intent_check")
            response_text = await self._run_agent_for_response(runner, prompt)
            return "ANALYZE" in response_text.upper()
        except Exception as exc:
            logger.warning("Failed to determine intent, defaulting to analysis: %s", exc)
            return True

    async def _run_agent_for_response(self, runner: InMemoryRunner, user_message: str) -> str:
        """Helper to run an agent and extract the text response."""
        try:
            # Create a session first
            session = await runner.session_service.create_session(
                app_name=runner.app_name,
                user_id="temp_user",
                session_id="temp_session"
            )

            message = types.Content(role='user', parts=[types.Part(text=user_message)])
            response_text = ""

            async for event in runner.run_async(user_id="temp_user", session_id="temp_session", new_message=message):
                if event.is_final_response() and event.content and event.content.parts:
                    for part in event.content.parts:
                        if part.text:
                            response_text += part.text

            return response_text.strip()
        except Exception as exc:
            logger.error("Failed to run agent: %s", exc)
            raise

    async def _generate_conversational_response(self, prompt: str) -> str:
        """Generate a natural conversational response without running analysis."""
        conversation_agent = LlmAgent(
            name="conversational_assistant",
            model=self.model,
            instruction="""You are Atlas, a friendly civic broadband planning assistant.

Respond naturally and conversationally, like a helpful colleague would. Be warm, professional,
and let them know you're here to help analyze census data and find underserved communities when
they're ready. Keep it brief - 1-2 sentences.""",
        )

        try:
            runner = InMemoryRunner(agent=conversation_agent, app_name="conversation")
            return await self._run_agent_for_response(runner, prompt)
        except Exception as exc:
            logger.error("Failed to generate conversational response: %s", exc)
            return "Hi! I'm here to help you find underserved communities that need better internet access. What would you like to know?"

    def _resolve_state(self, prompt: str, city: Optional[str]) -> states.State:
        """Pick a state from the prompt text, city, or fall back to the default."""
        text = f"{prompt} {city or ''}".lower()

        # Direct name match
        for state_obj in states.STATES:
            if state_obj.name and state_obj.name.lower() in text:
                return state_obj

        # Abbreviation match using word boundaries to avoid false positives.
        tokens = re.findall(r"[A-Za-z]{2,}", text)
        for token in tokens:
            state_obj = states.lookup(token.upper())
            if state_obj is not None:
                return state_obj

        # City mapping fallback.
        if city:
            city_state = CITY_TO_STATE.get(city.strip().lower())
            if city_state:
                return city_state

        return DEFAULT_STATE

    async def _compose_summary(
        self, prompt: str, state_name: str, analysis: Dict[str, object], query_intent: Dict[str, any]
    ) -> str:
        """Generate a natural, conversational summary using the LLM."""
        tracts = analysis.get("tracts", [])

        if not tracts:
            # Even for empty results, be conversational
            no_data_agent = LlmAgent(
                name="no_data_responder",
                model=self.model,
                instruction=f"""The user asked: "{prompt}"

You looked at Census data for {state_name}, but didn't find any tracts matching the criteria
or there was no data available. Respond naturally and conversationally, like you're explaining
this to a colleague. Suggest what they might want to try instead or ask for clarification.
Keep it brief and friendly.""",
            )

            try:
                runner = InMemoryRunner(agent=no_data_agent, app_name="no_data_response")
                return await self._run_agent_for_response(runner, "Respond to the user.")
            except Exception as exc:
                logger.warning("Failed to generate LLM summary: %s", exc)
                return f"I couldn't find any data for {state_name}."

        # Prepare top tract highlights
        top_tracts = tracts[:5]
        tract_highlights = "\n".join([
            f"- {t['name']} (GEOID {t['geoid']}): "
            f"{t['poverty_rate']:.1f}% poverty, {t['no_internet_pct']:.1f}% no internet, "
            f"priority score {t['priority_score']}"
            for t in top_tracts
        ])

        # Adapt the description based on what the user asked for
        focus = query_intent.get("focus", "communities")
        tract_description = "census tracts"
        if "wealth" in focus or "rich" in focus:
            tract_description = "affluent census tracts with the lowest poverty rates"
        elif "underserved" in focus or "poverty" in query_intent.get("metric", ""):
            tract_description = "underserved census tracts facing economic challenges"
        elif "connect" in focus and query_intent.get("direction") == "high":
            tract_description = "census tracts with the best internet connectivity"
        elif "connect" in focus and query_intent.get("direction") == "low":
            tract_description = "census tracts with the poorest internet connectivity"

        # Let the LLM compose a natural response
        summary_agent = LlmAgent(
            name="summary_composer",
            model=self.model,
            instruction=f"""You're Atlas, a civic broadband planning assistant having a conversation with someone.

They asked: "{prompt}"

You analyzed Census data for {state_name} and identified {len(tracts)} {tract_description}.
Here are the top areas:

{tract_highlights}

Key insight: {analysis.get('reasoning', '')}

Respond naturally like you're explaining your findings to a colleague. Talk about what you discovered
and what you've put on the map for them to review. Frame your response based on what they asked for -
if they asked about rich areas, talk about wealth and low poverty; if they asked about underserved areas,
talk about challenges and needs. Be conversational and human - use "I" statements, show genuine interest
in the data, and help them understand what you found. Don't just list facts. Keep it to 3-4 sentences max.""",
        )

        try:
            runner = InMemoryRunner(agent=summary_agent, app_name="summary")
            return await self._run_agent_for_response(runner, "Compose the summary.")
        except Exception as exc:
            logger.warning("Failed to generate LLM summary, using fallback: %s", exc)
            # Conversational fallback - adapt to query intent
            if "wealth" in focus or "rich" in focus:
                return (
                    f"I analyzed the Census data for {state_name} and identified {len(tracts)} affluent areas. "
                    f"{tracts[0]['name']} stands out with just {tracts[0]['poverty_rate']:.0f}% poverty rate "
                    f"and {100 - tracts[0]['no_internet_pct']:.0f}% of households with internet access. "
                    f"I've highlighted all {len(tracts)} prosperous areas on the map for you."
                )
            else:
                return (
                    f"So I dug into the Census data for {state_name} and found {len(tracts)} neighborhoods "
                    f"that really stand out. {tracts[0]['name']} caught my eye with {tracts[0]['poverty_rate']:.0f}% "
                    f"poverty and {tracts[0]['no_internet_pct']:.0f}% of households without internet. "
                    f"I've highlighted all {len(tracts)} priority areas on the map for you."
                )
