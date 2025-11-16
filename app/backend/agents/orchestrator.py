"""
Gemini-powered orchestrator for chat sidebar functionality.

Handles natural language queries about WiFi deployment recommendations,
census tract details, and methodology explanations.
"""

import os
import json
import asyncio
from typing import Dict, Any, AsyncGenerator, Optional
import google.generativeai as genai
from pathlib import Path
import pandas as pd

from data_pipeline.run_pipeline import run_deployment_pipeline_with_location


class GeminiOrchestrator:
    """
    Orchestrates chat queries using Gemini 2.0 Flash.

    Handles:
    - Deployment recommendation queries
    - Census tract detail queries
    - Methodology explanation queries
    """

    def __init__(self, gemini_api_key: str, census_api_key: str):
        """
        Initialize the Gemini orchestrator.

        Args:
            gemini_api_key: Google Gemini API key
            census_api_key: Census API key (for future use)
        """
        if not gemini_api_key:
            raise ValueError("Gemini API key is required")

        # Configure Gemini
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel("gemini-2.5-flash")
        self.census_api_key = census_api_key

        # Load Florida tract coverage data for detailed queries
        project_root = Path(__file__).parent.parent.parent.parent
        self.coverage_data = None
        try:
            coverage_path = project_root / "florida_tract_coverage.csv"
            if coverage_path.exists():
                self.coverage_data = pd.read_csv(coverage_path)
        except Exception as e:
            print(f"Warning: Could not load coverage data: {e}")

    async def process_query(
        self, user_message: str, city: str
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Process a user query and stream agent steps + final response.

        Args:
            user_message: The user's question
            city: The city/location context (e.g., "Atlanta", "Madison County")

        Yields:
            Dict containing agent steps and final response
        """
        try:
            # STEP 1: Query Understanding
            yield {
                "type": "agent_step",
                "agent": "Query Parser",
                "action": "Understanding your question...",
                "status": "in_progress",
            }

            # Use Gemini to classify the query intent
            intent = await self._classify_intent(user_message, city)

            yield {
                "type": "agent_step",
                "agent": "Query Parser",
                "action": f"Identified intent: {intent['type']}",
                "status": "completed",
            }

            # STEP 2: Data Processing based on intent
            if intent["type"] == "deployment_recommendation":
                async for step in self._handle_deployment_query(
                    user_message, city, intent
                ):
                    yield step

            elif intent["type"] == "tract_details":
                async for step in self._handle_tract_details_query(
                    user_message, intent
                ):
                    yield step

            elif intent["type"] == "methodology":
                async for step in self._handle_methodology_query(user_message, intent):
                    yield step

            else:
                # General query - provide helpful response
                async for step in self._handle_general_query(user_message, city):
                    yield step

        except Exception as e:
            yield {"type": "error", "message": f"Failed to process query: {str(e)}"}

    async def _classify_intent(self, user_message: str, city: str) -> Dict[str, Any]:
        """
        Use Gemini to classify the user's intent.

        Returns:
            Dict with 'type' and extracted parameters
        """
        prompt = f"""Analyze this user query and classify its intent.

User query: "{user_message}"
Location context: {city}

Classify into ONE of these categories:
1. deployment_recommendation - ONLY if user explicitly asks about WHERE to deploy WiFi, which sites to prioritize, or requests deployment recommendations for a SPECIFIC location
2. tract_details - User asks about a specific census tract's details (must mention tract or GEOID)
3. methodology - User asks how rankings work, what scores mean, or methodology questions
4. general - Greetings, general conversation, questions without a specific location, or unclear requests

IMPORTANT:
- Greetings like "hello", "hi", "I'm ready" should be "general"
- Questions without a specific location should be "general"
- Only classify as deployment_recommendation if a specific location is mentioned or implied

Also extract any relevant parameters (set to null if not mentioned):
- location_name (city/county name if explicitly mentioned, otherwise null)
- location_type (state or city)
- tract_id (GEOID if asking about specific tract)

Respond ONLY with valid JSON in this format:
{{
  "type": "general",
  "location_name": null
}}

OR if location is mentioned:
{{
  "type": "deployment_recommendation",
  "location_name": "Madison County",
  "location_type": "city",
  "state_name": "Florida"
}}"""

        # Run Gemini classification
        response = await asyncio.to_thread(lambda: self.model.generate_content(prompt))

        # Parse JSON response
        try:
            # Extract JSON from response
            response_text = response.text.strip()
            # Remove markdown code blocks if present
            if response_text.startswith("```"):
                response_text = response_text.split("```")[1]
                if response_text.startswith("json"):
                    response_text = response_text[4:]

            intent = json.loads(response_text.strip())
            return intent
        except json.JSONDecodeError:
            # Fallback: assume general query if parsing fails
            return {
                "type": "general",
                "location_name": None,
            }

    async def _handle_deployment_query(
        self, user_message: str, city: str, intent: Dict[str, Any]
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Handle deployment recommendation queries."""

        yield {
            "type": "agent_step",
            "agent": "Data Pipeline",
            "action": f"Analyzing deployment sites for {city}...",
            "status": "in_progress",
        }

        # Extract location parameters
        location_name = intent.get("location_name", city)
        location_type = intent.get("location_type", "city")
        state_name = intent.get("state_name", "Florida")

        # Validate location_name
        if not location_name or location_name == "None":
            yield {
                "type": "error",
                "message": "Please specify a location (city or county) for deployment recommendations. For example: 'Where should we deploy WiFi in Madison County?'"
            }
            return

        # Run the deployment pipeline
        try:
            slug = location_name.lower().replace(" ", "-") if location_name else "unknown"
            pipeline_result = await asyncio.to_thread(
                lambda: run_deployment_pipeline_with_location(
                    location_name=location_name,
                    location_type=location_type,
                    state_name=state_name,
                    slug=slug,
                )
            )

            total_sites = len(pipeline_result.get("sites", []))

            yield {
                "type": "agent_step",
                "agent": "Data Pipeline",
                "action": f"Found {total_sites} deployment sites",
                "status": "completed",
            }

        except Exception as e:
            yield {"type": "error", "message": f"Pipeline execution failed: {str(e)}"}
            return

        # STEP 3: Synthesis with Gemini
        yield {
            "type": "agent_step",
            "agent": "Synthesis Agent",
            "action": "Generating explanation...",
            "status": "in_progress",
        }

        # Generate human-readable explanation
        explanation = await self._generate_deployment_explanation(
            user_message, pipeline_result
        )

        yield {
            "type": "agent_step",
            "agent": "Synthesis Agent",
            "action": "Explanation complete",
            "status": "completed",
        }

        # Format deployment plan for frontend
        deployment_plan = self._format_deployment_plan(pipeline_result)

        # FINAL RESPONSE
        yield {
            "type": "final_response",
            "explanation": explanation,
            "deployment_plan": deployment_plan,
            "tract_geometries": pipeline_result.get("geometries"),
            "all_wifi_zones": pipeline_result.get("all_wifi_zones"),
        }

    async def _handle_tract_details_query(
        self, user_message: str, intent: Dict[str, Any]
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Handle census tract detail queries."""

        yield {
            "type": "agent_step",
            "agent": "Data Pipeline",
            "action": "Fetching tract details...",
            "status": "in_progress",
        }

        # Extract tract ID if provided
        tract_id = intent.get("tract_id")

        # Search for tract in coverage data
        tract_data = None
        if self.coverage_data is not None:
            if tract_id:
                tract_data = self.coverage_data[
                    self.coverage_data["geoid"].astype(str) == str(tract_id)
                ]
            else:
                # Try to extract from query using Gemini
                # For now, return general info
                pass

        yield {
            "type": "agent_step",
            "agent": "Data Pipeline",
            "action": "Tract data retrieved",
            "status": "completed",
        }

        # Generate explanation
        yield {
            "type": "agent_step",
            "agent": "Synthesis Agent",
            "action": "Analyzing tract details...",
            "status": "in_progress",
        }

        if tract_data is not None and len(tract_data) > 0:
            explanation = await self._generate_tract_explanation(
                user_message, tract_data.iloc[0].to_dict()
            )
        else:
            explanation = "I don't have specific tract data available for that query. Please try asking about deployment recommendations for a specific location, or provide a valid tract GEOID."

        yield {
            "type": "agent_step",
            "agent": "Synthesis Agent",
            "action": "Analysis complete",
            "status": "completed",
        }

        yield {"type": "final_response", "explanation": explanation}

    async def _handle_methodology_query(
        self, user_message: str, intent: Dict[str, Any]
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Handle methodology explanation queries."""

        yield {
            "type": "agent_step",
            "agent": "Synthesis Agent",
            "action": "Preparing methodology explanation...",
            "status": "in_progress",
        }

        # Generate explanation about methodology
        methodology_context = """
Our WiFi deployment recommendation system uses a data-driven approach:

**Impact Score Calculation:**
- 40% Population Score: Prioritizes areas with more residents
- 40% Poverty Score: Prioritizes underserved communities with higher poverty rates
- 20% Income Score: Considers median household income

**Deployment Tiers:**
- Tier 1 (Critical): Ranks 1-10 - Highest priority sites
- Tier 2 (High): Ranks 11-25 - High priority sites
- Tier 3 (Medium): Ranks 26-40 - Medium priority sites
- Tier 4 (Low): Ranks 41+ - Lower priority sites

**Data Sources:**
- Census demographic data (population, poverty rate, median income)
- FCC broadband coverage data
- OpenStreetMap civic assets (schools, libraries, community centers, transit)

**WiFi Zone Generation:**
- Each tract gets 3 WiFi deployment points in a triangular pattern
- Zones are positioned ~0.5km from the tract centroid
- All zones are validated to be within tract boundaries
        """

        explanation = await self._generate_methodology_explanation(
            user_message, methodology_context
        )

        yield {
            "type": "agent_step",
            "agent": "Synthesis Agent",
            "action": "Explanation ready",
            "status": "completed",
        }

        yield {"type": "final_response", "explanation": explanation}

    async def _handle_general_query(
        self, user_message: str, city: str
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Handle general queries."""

        yield {
            "type": "agent_step",
            "agent": "Synthesis Agent",
            "action": "Processing your question...",
            "status": "in_progress",
        }

        prompt = f"""You are an AI assistant helping with WiFi deployment planning for underserved communities.

User asked: "{user_message}"
Context: {city}

Provide a helpful response. If they're asking about deployment recommendations, tract details, or methodology, guide them to ask more specific questions.

Be concise and helpful."""

        response = await asyncio.to_thread(lambda: self.model.generate_content(prompt))

        yield {
            "type": "agent_step",
            "agent": "Synthesis Agent",
            "action": "Response ready",
            "status": "completed",
        }

        yield {"type": "final_response", "explanation": response.text}

    async def _generate_deployment_explanation(
        self, user_message: str, pipeline_result: Dict[str, Any]
    ) -> str:
        """Generate human-readable explanation of deployment results."""

        sites = pipeline_result.get("sites", [])
        total_sites = len(sites)

        # Get top 3 sites for explanation
        top_sites = sites[:3] if len(sites) >= 3 else sites

        # Build summary
        summary = f"Based on your query, I've analyzed deployment opportunities and found {total_sites} potential sites.\n\n"

        if top_sites:
            summary += "**Top Priority Sites:**\n\n"
            for i, site in enumerate(top_sites, 1):
                impact = site.get("impact_score", 0)
                pop = site.get("population", "N/A")
                poverty = site.get("poverty_rate", "N/A")
                summary += f"{i}. Census Tract {site.get('geoid', 'Unknown')}\n"
                summary += f"   - Impact Score: {impact:.1f}\n"
                summary += f"   - Population: {pop:,}\n"
                summary += f"   - Poverty Rate: {poverty}%\n\n"

        # Use Gemini to enhance the explanation
        prompt = f"""Enhance this WiFi deployment summary with a brief, conversational explanation.

User asked: "{user_message}"

Summary: {summary}

Make it conversational (2-3 sentences) explaining why these sites were chosen and what impact they could have. Focus on serving underserved communities."""

        try:
            response = await asyncio.to_thread(
                lambda: self.model.generate_content(prompt)
            )
            return f"{summary}\n{response.text}"
        except:
            return summary

    async def _generate_tract_explanation(
        self, user_message: str, tract_data: Dict[str, Any]
    ) -> str:
        """Generate explanation about a specific census tract."""

        prompt = f"""Provide a brief explanation about this census tract.

User asked: "{user_message}"

Tract Data:
- GEOID: {tract_data.get('geoid')}
- Coverage: {tract_data.get('coverage_percent', 0):.1f}%
- Population: {tract_data.get('population', 0):,}
- Median Income: ${tract_data.get('median_income', 0):,}
- Poverty Rate: {tract_data.get('poverty_rate', 0):.1f}%
- Schools: {tract_data.get('schools', 0)}
- Libraries: {tract_data.get('libraries', 0)}
- Community Centers: {tract_data.get('community_centers', 0)}
- Transit Stops: {tract_data.get('transit_stops', 0)}

Write 2-3 sentences highlighting key demographics and why this tract might be prioritized for WiFi deployment."""

        response = await asyncio.to_thread(lambda: self.model.generate_content(prompt))
        return response.text

    async def _generate_methodology_explanation(
        self, user_message: str, methodology_context: str
    ) -> str:
        """Generate explanation about the methodology."""

        prompt = f"""Answer this question about our WiFi deployment methodology.

User asked: "{user_message}"

Methodology:
{methodology_context}

Provide a clear, concise answer (2-4 sentences) addressing their specific question."""

        response = await asyncio.to_thread(lambda: self.model.generate_content(prompt))
        return response.text

    def _extract_county_from_geoid(self, geoid: str) -> str:
        """Extract county name from census tract GEOID."""
        if not geoid or len(geoid) < 5:
            return "Unknown County"

        state_fips = geoid[:2]
        county_fips = geoid[2:5]

        # Florida county FIPS codes
        florida_counties = {
            '001': 'Alachua', '003': 'Baker', '005': 'Bay', '007': 'Bradford',
            '009': 'Brevard', '011': 'Broward', '013': 'Calhoun', '015': 'Charlotte',
            '017': 'Citrus', '019': 'Clay', '021': 'Collier', '023': 'Columbia',
            '027': 'DeSoto', '029': 'Dixie', '031': 'Duval', '033': 'Escambia',
            '035': 'Flagler', '037': 'Franklin', '039': 'Gadsden', '041': 'Gilchrist',
            '043': 'Glades', '045': 'Gulf', '047': 'Hamilton', '049': 'Hardee',
            '051': 'Hendry', '053': 'Hernando', '055': 'Highlands', '057': 'Hillsborough',
            '059': 'Holmes', '061': 'Indian River', '063': 'Jackson', '065': 'Jefferson',
            '067': 'Lafayette', '069': 'Lake', '071': 'Lee', '073': 'Leon',
            '075': 'Levy', '077': 'Liberty', '079': 'Madison', '081': 'Manatee',
            '083': 'Marion', '085': 'Martin', '086': 'Miami-Dade', '087': 'Monroe',
            '089': 'Nassau', '091': 'Okaloosa', '093': 'Okeechobee', '095': 'Orange',
            '097': 'Osceola', '099': 'Palm Beach', '101': 'Pasco', '103': 'Pinellas',
            '105': 'Polk', '107': 'Putnam', '109': 'St. Johns', '111': 'St. Lucie',
            '113': 'Santa Rosa', '115': 'Sarasota', '117': 'Seminole', '119': 'Sumter',
            '121': 'Suwannee', '123': 'Taylor', '125': 'Union', '127': 'Volusia',
            '129': 'Wakulla', '131': 'Walton', '133': 'Washington',
        }

        if state_fips == '12':  # Florida
            return florida_counties.get(county_fips, f"County {county_fips}")

        return f"County {county_fips}"

    def _format_deployment_plan(
        self, pipeline_result: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Format pipeline result into deployment plan for frontend."""

        sites = pipeline_result.get("sites", [])

        # Calculate tier-based deployment plan
        formatted_sites = []
        for site in sites:
            geoid = site.get("geoid", "")
            county_name = self._extract_county_from_geoid(geoid)

            formatted_sites.append(
                {
                    "tract_id": geoid,
                    "name": f"{county_name} County",
                    "state": "Florida",
                    "county": f"{county_name} County",
                    "tract": geoid[5:] if len(geoid) > 5 else "",
                    "composite_score": site.get("impact_score", 0),
                    "recommendation_tier": self._map_tier(site.get("deployment_tier")),
                    "poverty_rate": site.get("poverty_rate", 0),
                    "no_internet_pct": 100 - site.get("coverage_percent", 0),
                    "total_population": site.get("population", 0),
                    "nearby_anchor_count": site.get("total_assets", 0),
                    "centroid": site.get("centroid", {}),
                }
            )

        # Calculate projected impact
        total_pop = sum(s.get("population", 0) for s in sites)
        poverty_served = sum(
            s.get("population", 0) * s.get("poverty_rate", 0) / 100 for s in sites
        )

        return {
            "recommended_sites_count": len(formatted_sites),
            "recommended_sites": formatted_sites,
            "projected_impact": {
                "total_population_served": int(total_pop),
                "residents_below_poverty_served": int(poverty_served),
                "households_without_internet_served": int(total_pop * 0.15),  # Estimate
            },
        }

    def _map_tier(self, backend_tier: str) -> str:
        """Map backend tier to frontend tier."""
        tier_map = {
            "tier_1_critical": "top_priority",
            "tier_2_high": "high_priority",
            "tier_3_medium": "medium_priority",
            "tier_4_low": "low_priority",
        }
        return tier_map.get(backend_tier, "low_priority")


# Alias for backwards compatibility with existing main.py import
AgentOrchestrator = GeminiOrchestrator
