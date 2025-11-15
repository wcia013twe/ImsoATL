"""
Explainer Agent
Uses Gemini to generate human-readable explanations of WiFi deployment recommendations
"""
import google.generativeai as genai
from typing import Dict, List
import json


class ExplainerAgent:
    """Agent for generating natural language explanations"""

    def __init__(self, gemini_api_key: str):
        genai.configure(api_key=gemini_api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')

    async def explain_recommendation(
        self,
        deployment_plan: Dict,
        user_query: str
    ) -> str:
        """
        Generate human-readable explanation of deployment recommendations

        Args:
            deployment_plan: Deployment plan from ProximityRankerAgent
            user_query: Original user query

        Returns:
            Natural language explanation
        """
        # Extract key data points
        site_count = deployment_plan.get('recommended_sites_count', 0)
        impact = deployment_plan.get('projected_impact', {})
        top_sites = deployment_plan.get('recommended_sites', [])[:5]

        # Build context for Gemini
        context = f"""
You are a civic technology assistant explaining WiFi deployment recommendations.

Original User Question: {user_query}

Analysis Results:
- Recommended {site_count} deployment sites
- Projected Impact:
  * Total population served: {impact.get('total_population_served', 0):,}
  * Residents below poverty line served: {impact.get('residents_below_poverty_served', 0):,}
  * Households without internet served: {impact.get('households_without_internet_served', 0):,}

Top 5 Recommended Sites:
"""
        for i, site in enumerate(top_sites, 1):
            context += f"""
{i}. Census Tract: {site.get('name', 'Unknown')}
   - Composite Score: {site.get('composite_score', 0)}/100
   - Poverty Rate: {site.get('poverty_rate', 0)}%
   - Households without internet: {site.get('no_internet_pct', 0)}%
   - Nearby civic assets: {site.get('nearby_anchor_count', 0)}
   - Priority Level: {site.get('recommendation_tier', 'unknown')}
"""

        prompt = f"""{context}

Generate a clear, concise explanation of these recommendations that:
1. Directly answers the user's question
2. Highlights the most important findings (2-3 key insights)
3. Explains WHY these sites were selected (cite specific data)
4. Mentions the projected community impact
5. Keeps the tone professional but accessible

Format your response in 2-3 paragraphs."""

        response = self.model.generate_content(prompt)
        return response.text

    async def explain_data_synthesis(
        self,
        census_summary: Dict,
        fcc_summary: Dict,
        asset_summary: Dict
    ) -> str:
        """
        Explain how data from multiple sources was synthesized

        Args:
            census_summary: Census data summary
            fcc_summary: FCC coverage summary
            asset_summary: Civic assets summary

        Returns:
            Explanation of data synthesis process
        """
        prompt = f"""
Explain how we synthesized data from multiple sources for WiFi deployment planning:

Census Data (Demographics):
- Analyzed {census_summary.get('total_tracts_analyzed', 0)} census tracts
- Found {census_summary.get('critical_need_tracts', 0)} critical need areas
- Average poverty rate: {census_summary.get('avg_poverty_rate', 0)}%
- Average households without internet: {census_summary.get('avg_no_internet_pct', 0)}%

FCC Data (Broadband Coverage):
- Total tracts analyzed: {fcc_summary.get('total_tracts', 0)}
- Tracts with coverage gaps: {fcc_summary.get('tracts_with_gaps', 0)}
- Coverage rate: {fcc_summary.get('coverage_rate_pct', 0)}%

Civic Assets (Anchor Sites):
- Total assets identified: {asset_summary.get('total_assets', 0)}
- Libraries: {asset_summary.get('asset_type_breakdown', {}).get('library', 0)}
- Community Centers: {asset_summary.get('asset_type_breakdown', {}).get('community_center', 0)}
- Schools: {asset_summary.get('asset_type_breakdown', {}).get('school', 0)}

Write a brief (3-4 sentences) explanation of how we cross-referenced these datasets
to identify high-impact deployment sites. Use clear, accessible language."""

        response = self.model.generate_content(prompt)
        return response.text

    async def generate_reasoning_steps(
        self,
        user_query: str
    ) -> List[Dict[str, str]]:
        """
        Generate step-by-step reasoning plan based on user query

        Args:
            user_query: User's question

        Returns:
            List of reasoning steps
        """
        prompt = f"""
A user asked: "{user_query}"

Identify what this user is trying to accomplish and break it into logical analysis steps.

Return ONLY a JSON array of steps, where each step has:
- "agent": which specialized agent handles this (Census Data Agent, FCC Data Agent, Civic Assets Agent, or Ranking Agent)
- "action": what the agent will do
- "rationale": why this step is needed

Example format:
[
  {{
    "agent": "Census Data Agent",
    "action": "Fetch poverty and internet access data for Georgia",
    "rationale": "Identify communities with highest need based on socioeconomic factors"
  }}
]

Return 3-4 steps maximum. Return ONLY valid JSON, no other text."""

        response = self.model.generate_content(prompt)
        try:
            steps = json.loads(response.text.strip())
            return steps
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return [
                {
                    "agent": "Census Data Agent",
                    "action": "Analyze demographic data",
                    "rationale": "Identify high-need communities"
                },
                {
                    "agent": "FCC Data Agent",
                    "action": "Check broadband coverage",
                    "rationale": "Find areas with connectivity gaps"
                },
                {
                    "agent": "Civic Assets Agent",
                    "action": "Locate potential anchor sites",
                    "rationale": "Identify existing infrastructure"
                },
                {
                    "agent": "Ranking Agent",
                    "action": "Synthesize data and generate recommendations",
                    "rationale": "Prioritize sites by impact potential"
                }
            ]
