"""
Agent Orchestrator
Coordinates all specialized agents and streams progress updates
"""
from typing import AsyncGenerator, Dict
import sys
import os

# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from data_sources.census_client import CensusDataClient
from data_sources.fcc_client import FCCBroadbandClient
from data_sources.civic_assets import CivicAssetsClient
from census_scorer import CensusScorerAgent
from fcc_filter import FCCFilterAgent
from asset_locater import AssetLocatorAgent
from proximity_ranker import ProximityRankerAgent
from explainer import ExplainerAgent


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

        try:
            # Step 1: Generate reasoning plan
            yield {
                "type": "agent_step",
                "agent": "🔍 Query Parser",
                "action": "Analyzing your question and planning approach",
                "status": "in_progress"
            }

            reasoning_steps = await self.explainer_agent.generate_reasoning_steps(user_message)

            yield {
                "type": "agent_step",
                "agent": "🔍 Query Parser",
                "action": "Identified analysis strategy",
                "status": "completed",
                "data": {"steps": reasoning_steps}
            }

            # Step 2: Census demographic analysis
            yield {
                "type": "agent_step",
                "agent": "📊 Census Data Agent",
                "action": "Fetching poverty, internet access, and student population data for Georgia",
                "status": "in_progress"
            }

            scored_tracts = await self.census_agent.score_tracts_by_need(state_fips)
            census_summary = await self.census_agent.get_summary_statistics(scored_tracts)

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

            # Step 3: FCC broadband coverage analysis
            yield {
                "type": "agent_step",
                "agent": "📡 FCC Data Agent",
                "action": "Checking broadband coverage gaps (25/3 Mbps threshold)",
                "status": "in_progress"
            }

            coverage_gaps = await self.fcc_agent.identify_coverage_gaps(state_fips)
            merged_coverage = await self.fcc_agent.merge_with_census_data(coverage_gaps, scored_tracts)
            fcc_prioritized = await self.fcc_agent.prioritize_by_impact(merged_coverage)
            fcc_summary = await self.fcc_agent.get_coverage_summary(state_fips)

            yield {
                "type": "agent_step",
                "agent": "📡 FCC Data Agent",
                "action": f"Found {len(coverage_gaps)} tracts with coverage gaps. {len([g for g in coverage_gaps if g.get('gap_severity') == 'critical'])} critical gaps identified.",
                "status": "completed",
                "data": {
                    "total_gaps": len(coverage_gaps),
                    "critical_gaps": len([g for g in coverage_gaps if g.get('gap_severity') == 'critical'])
                }
            }

            # Step 4: Civic assets analysis
            yield {
                "type": "agent_step",
                "agent": "🏛️ Civic Assets Agent",
                "action": "Locating libraries, community centers, schools, and transit stops",
                "status": "in_progress"
            }

            anchor_sites = await self.asset_agent.find_candidate_anchor_sites()
            high_need_tracts = scored_tracts[:20]  # Top 20 highest need
            assets_near_need = await self.asset_agent.find_assets_near_high_need_areas(high_need_tracts)
            asset_summary = await self.asset_agent.get_asset_coverage_summary()

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

            # Step 5: Synthesize and rank
            yield {
                "type": "agent_step",
                "agent": "⚖️ Ranking Agent",
                "action": "Cross-referencing all datasets and scoring candidate sites",
                "status": "in_progress"
            }

            ranked_sites = await self.ranker_agent.rank_deployment_sites(
                scored_tracts,
                fcc_prioritized,
                anchor_sites
            )

            deployment_plan = await self.ranker_agent.generate_deployment_plan(ranked_sites)

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

            # Step 6: Generate explanation
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

            # Step 7: Final response
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

        except Exception as e:
            yield {
                "type": "error",
                "message": f"An error occurred during analysis: {str(e)}"
            }
