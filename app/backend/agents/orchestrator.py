
"""
Agent Orchestrator
Coordinates all specialized agents and streams progress updates
"""
from typing import AsyncGenerator, Dict
import sys
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from data_sources.census_client import CensusDataClient
from data_sources.fcc_client import FCCBroadbandClient
from data_sources.civic_assets import CivicAssetsClient
from agents.census_scorer import CensusScorerAgent
from agents.fcc_filter import FCCFilterAgent
from agents.asset_locater import AssetLocatorAgent
from agents.proximity_ranker import ProximityRankerAgent
from agents.explainer import ExplainerAgent


class AgentOrchestrator:
    """Orchestrates multi-agent WiFi deployment planning workflow"""

    def __init__(self, gemini_api_key: str, census_api_key: str):
        # Initialize data clients
        self.census_client = CensusDataClient(census_api_key)
        self.fcc_client = FCCBroadbandClient()
        self.assets_client = CivicAssetsClient()

        # Initialize agents
        self.census_agent = CensusScorerAgent(self.census_client)
        self.fcc_agent = FCCFilterAgent(self.fcc_client)
        self.asset_agent = AssetLocatorAgent(self.assets_client)
        self.ranker_agent = ProximityRankerAgent()
        self.explainer_agent = ExplainerAgent(gemini_api_key)

        # Store intermediate results for dynamic pipeline
        self.pipeline_data = {}

    async def execute_census_agent(self, state_fips: str):
        """Execute Census Data Agent"""
        logger.info("Executing Census Data Agent")
        yield {
            "type": "agent_step",
            "agent": "📊 Census Data Agent",
            "action": "Fetching poverty, internet access, and student population data for Georgia",
            "status": "in_progress"
        }

        scored_tracts = await self.census_agent.score_tracts_by_need(state_fips)
        census_summary = await self.census_agent.get_summary_statistics(scored_tracts)

        self.pipeline_data['scored_tracts'] = scored_tracts
        self.pipeline_data['census_summary'] = census_summary

        logger.info(f"Census analysis complete: {len(scored_tracts)} tracts analyzed")

        yield {
            "type": "agent_step",
            "agent": "📊 Census Data Agent",
            "action": f"Analyzed {len(scored_tracts)} census tracts. Found {census_summary.get('critical_need_tracts', 0)} critical need areas.",
            "status": "completed",
            "data": {
                "tracts_analyzed": len(scored_tracts),
                "critical_need": census_summary.get('critical_need_tracts', 0),
                "avg_poverty_rate": census_summary.get('avg_poverty_rate', 0)
            }
        }

    async def execute_fcc_agent(self, state_fips: str):
        """Execute FCC Data Agent"""
        logger.info("Executing FCC Data Agent")
        yield {
            "type": "agent_step",
            "agent": "📡 FCC Data Agent",
            "action": "Checking broadband coverage gaps (25/3 Mbps threshold)",
            "status": "in_progress"
        }

        coverage_gaps = await self.fcc_agent.identify_coverage_gaps(state_fips)
        scored_tracts = self.pipeline_data.get('scored_tracts', [])
        merged_coverage = await self.fcc_agent.merge_with_census_data(coverage_gaps, scored_tracts)
        fcc_prioritized = await self.fcc_agent.prioritize_by_impact(merged_coverage)
        fcc_summary = await self.fcc_agent.get_coverage_summary(state_fips)

        self.pipeline_data['coverage_gaps'] = coverage_gaps
        self.pipeline_data['fcc_prioritized'] = fcc_prioritized
        self.pipeline_data['fcc_summary'] = fcc_summary

        critical_gaps = len([g for g in coverage_gaps if g.get('gap_severity') == 'critical'])
        logger.info(f"FCC analysis complete: {len(coverage_gaps)} gaps found")

        yield {
            "type": "agent_step",
            "agent": "📡 FCC Data Agent",
            "action": f"Found {len(coverage_gaps)} tracts with coverage gaps. {critical_gaps} critical gaps identified.",
            "status": "completed",
            "data": {
                "total_gaps": len(coverage_gaps),
                "critical_gaps": critical_gaps
            }
        }

    async def execute_assets_agent(self):
        """Execute Civic Assets Agent"""
        logger.info("Executing Civic Assets Agent")
        yield {
            "type": "agent_step",
            "agent": "🏛️ Civic Assets Agent",
            "action": "Locating libraries, community centers, schools, and transit stops",
            "status": "in_progress"
        }

        anchor_sites = await self.asset_agent.find_candidate_anchor_sites()
        scored_tracts = self.pipeline_data.get('scored_tracts', [])
        high_need_tracts = scored_tracts[:20]  # Top 20 highest need
        assets_near_need = await self.asset_agent.find_assets_near_high_need_areas(high_need_tracts)
        asset_summary = await self.asset_agent.get_asset_coverage_summary()

        self.pipeline_data['anchor_sites'] = anchor_sites
        self.pipeline_data['asset_summary'] = asset_summary

        logger.info(f"Civic assets analysis complete: {len(anchor_sites)} sites found")

        yield {
            "type": "agent_step",
            "agent": "🏛️ Civic Assets Agent",
            "action": f"Identified {len(anchor_sites)} potential anchor sites. {len(assets_near_need)} located near high-need areas.",
            "status": "completed",
            "data": {
                "total_anchors": len(anchor_sites),
                "near_high_need": len(assets_near_need),
                "libraries": asset_summary.get('asset_type_breakdown', {}).get('library', 0)
            }
        }

    async def execute_ranking_agent(self):
        """Execute Ranking Agent"""
        logger.info("Executing Ranking Agent")
        yield {
            "type": "agent_step",
            "agent": "⚖️ Ranking Agent",
            "action": "Cross-referencing all datasets and scoring candidate sites",
            "status": "in_progress"
        }

        scored_tracts = self.pipeline_data.get('scored_tracts', [])
        fcc_prioritized = self.pipeline_data.get('fcc_prioritized', [])
        anchor_sites = self.pipeline_data.get('anchor_sites', [])

        ranked_sites = await self.ranker_agent.rank_deployment_sites(
            scored_tracts,
            fcc_prioritized,
            anchor_sites
        )

        deployment_plan = await self.ranker_agent.generate_deployment_plan(ranked_sites)

        self.pipeline_data['ranked_sites'] = ranked_sites
        self.pipeline_data['deployment_plan'] = deployment_plan

        logger.info(f"Ranking complete: {len(ranked_sites)} sites ranked")

        yield {
            "type": "agent_step",
            "agent": "⚖️ Ranking Agent",
            "action": f"Ranked {len(ranked_sites)} sites by composite score. Top {deployment_plan.get('recommended_sites_count', 0)} sites selected.",
            "status": "completed",
            "data": {
                "sites_ranked": len(ranked_sites),
                "sites_recommended": deployment_plan.get('recommended_sites_count', 0)
            }
        }

    async def process_query(
        self,
        user_message: str,
        city: str = "Atlanta"
    ) -> AsyncGenerator[Dict, None]:
        """
        Process user query through multi-agent workflow with streaming updates

        Args:
            user_message: User's question
            city: City context (currently only Atlanta supported)

        Yields:
            Progress updates as dicts with type, agent, message, data
        """
        # Map city to state FIPS (currently only Georgia)
        state_fips = "13"

        logger.info("="*80)
        logger.info(f"NEW QUERY RECEIVED: '{user_message}'")
        logger.info(f"City: {city}, State FIPS: {state_fips}")
        logger.info("="*80)

        try:
            # Check if this is a conversational query (greeting, thanks, etc.)
            logger.info("Checking if query is conversational...")
            is_conversational = await self.explainer_agent.is_conversational_query(user_message)

            if is_conversational:
                logger.info("Query identified as conversational - generating friendly response")
                response = await self.explainer_agent.generate_conversational_response(user_message)
                logger.info(f"Conversational response: {response}")
                logger.info("="*80)
                yield {
                    "type": "final_response",
                    "explanation": response,
                    "is_conversational": True
                }
                return

            # Step 1: Generate reasoning plan
            logger.info("STEP 1: Query Parser - Generating reasoning plan")
            yield {
                "type": "agent_step",
                "agent": "🔍 Query Parser",
                "action": "Analyzing your question and planning approach...",
                "status": "in_progress"
            }

            reasoning_steps = await self.explainer_agent.generate_reasoning_steps(user_message)
            logger.info(f"Generated {len(reasoning_steps)} reasoning steps")
            for i, step in enumerate(reasoning_steps, 1):
                logger.info(f"  Step {i}: {step.get('agent')} - {step.get('action')}")

            # Show the planned steps
            steps_summary = " → ".join([step.get('agent', 'Agent') for step in reasoning_steps])
            yield {
                "type": "agent_step",
                "agent": "🔍 Query Parser",
                "action": f"Plan: {steps_summary}",
                "status": "completed",
                "data": {"steps": reasoning_steps}
            }
            logger.info(f"Query parsing complete. Plan: {steps_summary}")

            # Show orchestrator planning message
            yield {
                "type": "agent_step",
                "agent": "🤖 Orchestrator",
                "action": f"Coordinating {len(reasoning_steps)} specialized agents to answer your question",
                "status": "in_progress"
            }

            # Reset pipeline data for this query
            self.pipeline_data = {}

            # Dynamic agent execution based on reasoning steps
            agent_map = {
                "Census Data Agent": lambda: self.execute_census_agent(state_fips),
                "FCC Data Agent": lambda: self.execute_fcc_agent(state_fips),
                "Civic Assets Agent": lambda: self.execute_assets_agent(),
                "Ranking Agent": lambda: self.execute_ranking_agent(),
            }

            # Execute each agent in the reasoning plan
            for step in reasoning_steps:
                agent_name = step.get('agent', '')

                # Find matching agent executor
                executor = None
                for key, func in agent_map.items():
                    if key in agent_name:
                        executor = func
                        break

                if executor:
                    # Execute the agent and yield all its updates
                    async for update in executor():
                        yield update
                else:
                    logger.warning(f"No executor found for agent: {agent_name}")

            # Generate explanation if we have deployment plan
            deployment_plan = self.pipeline_data.get('deployment_plan')
            if deployment_plan:
                logger.info("Generating explanation")
                yield {
                    "type": "agent_step",
                    "agent": "✨ Explainer Agent",
                    "action": "Generating human-readable explanation",
                    "status": "in_progress"
                }

                explanation = await self.explainer_agent.explain_recommendation(
                    deployment_plan,
                    user_message
                )

                census_summary = self.pipeline_data.get('census_summary', {})
                fcc_summary = self.pipeline_data.get('fcc_summary', {})
                asset_summary = self.pipeline_data.get('asset_summary', {})

                data_synthesis_explanation = await self.explainer_agent.explain_data_synthesis(
                    census_summary,
                    fcc_summary,
                    asset_summary
                )

                yield {
                    "type": "agent_step",
                    "agent": "✨ Explainer Agent",
                    "action": "Analysis complete",
                    "status": "completed"
                }

                logger.info("="*80)
                logger.info("QUERY PROCESSING COMPLETE")
                logger.info("="*80)

                # Final response
                yield {
                    "type": "final_response",
                    "explanation": explanation,
                    "data_synthesis": data_synthesis_explanation,
                    "deployment_plan": deployment_plan,
                    "summaries": {
                        "census": census_summary,
                        "fcc": fcc_summary,
                        "assets": asset_summary
                    }
                }
            else:
                # Query didn't need full deployment plan - just provide summary
                logger.info("Query completed without full deployment plan")

                # Generate simpler explanation based on available data
                summary_text = "I've analyzed the available data based on your query. "

                if 'census_summary' in self.pipeline_data:
                    census = self.pipeline_data['census_summary']
                    summary_text += f"Census analysis found {census.get('critical_need_tracts', 0)} critical need areas. "

                if 'fcc_summary' in self.pipeline_data:
                    fcc = self.pipeline_data['fcc_summary']
                    summary_text += f"FCC data shows {fcc.get('tracts_with_gaps', 0)} areas with coverage gaps. "

                if 'asset_summary' in self.pipeline_data:
                    assets = self.pipeline_data['asset_summary']
                    summary_text += f"Found {assets.get('total_assets', 0)} civic assets that could serve as anchor points."

                yield {
                    "type": "final_response",
                    "explanation": summary_text,
                    "summaries": {
                        "census": self.pipeline_data.get('census_summary', {}),
                        "fcc": self.pipeline_data.get('fcc_summary', {}),
                        "assets": self.pipeline_data.get('asset_summary', {})
                    }
                }

        except Exception as e:
            logger.error("="*80)
            logger.error(f"ERROR during query processing: {str(e)}")
            logger.error("="*80)
            import traceback
            logger.error(traceback.format_exc())
            yield {
                "type": "error",
                "message": f"An error occurred during analysis: {str(e)}"
            }
