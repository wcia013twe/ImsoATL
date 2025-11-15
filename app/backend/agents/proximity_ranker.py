"""
Proximity Ranker Agent
Synthesizes data from multiple sources and ranks candidate WiFi deployment sites
"""
from typing import Dict, List


class ProximityRankerAgent:
    """Agent for ranking and synthesizing WiFi deployment recommendations"""

    def __init__(self):
        pass

    async def rank_deployment_sites(
        self,
        census_scored_tracts: List[Dict],
        fcc_prioritized_tracts: List[Dict],
        anchor_assets: List[Dict],
        user_priorities: Dict[str, float] = None
    ) -> List[Dict]:
        """
        Synthesize data from all sources and rank candidate deployment sites

        Args:
            census_scored_tracts: Tracts scored by demographic need
            fcc_prioritized_tracts: Tracts prioritized by coverage gaps
            anchor_assets: Civic assets suitable as anchor sites
            user_priorities: User-specified priority weights

        Returns:
            Ranked list of recommended deployment sites
        """
        # Default priorities
        if user_priorities is None:
            user_priorities = {
                'demographic_need': 0.35,
                'coverage_gap': 0.35,
                'anchor_proximity': 0.30
            }

        # Create lookup dicts
        census_lookup = self._create_tract_lookup(census_scored_tracts)
        fcc_lookup = self._create_tract_lookup(fcc_prioritized_tracts)

        # Merge all data sources
        merged_sites = self._merge_data_sources(
            census_lookup,
            fcc_lookup,
            anchor_assets
        )

        # Calculate composite scores
        ranked_sites = []
        for site in merged_sites:
            composite_score = self._calculate_composite_score(
                site,
                user_priorities
            )

            site['composite_score'] = composite_score
            site['recommendation_tier'] = self._categorize_recommendation(composite_score)

            ranked_sites.append(site)

        # Sort by composite score
        ranked_sites.sort(key=lambda x: x['composite_score'], reverse=True)

        return ranked_sites

    def _create_tract_lookup(self, tracts: List[Dict]) -> Dict:
        """Create lookup dictionary keyed by tract ID"""
        lookup = {}
        for tract in tracts:
            tract_id = f"{tract.get('state')}{tract.get('county')}{tract.get('tract')}"
            lookup[tract_id] = tract
        return lookup

    def _merge_data_sources(
        self,
        census_lookup: Dict,
        fcc_lookup: Dict,
        anchor_assets: List[Dict]
    ) -> List[Dict]:
        """
        Merge data from census, FCC, and asset sources

        Args:
            census_lookup: Census data keyed by tract ID
            fcc_lookup: FCC data keyed by tract ID
            anchor_assets: List of anchor asset locations

        Returns:
            Merged site data
        """
        # Get all unique tract IDs
        all_tract_ids = set(list(census_lookup.keys()) + list(fcc_lookup.keys()))

        merged_sites = []

        for tract_id in all_tract_ids:
            census_data = census_lookup.get(tract_id, {})
            fcc_data = fcc_lookup.get(tract_id, {})

            # Find nearby anchor assets (simplified - using county match)
            tract_county = census_data.get('county') or fcc_data.get('county')
            nearby_anchors = [
                asset for asset in anchor_assets
                if asset.get('county') == tract_county
            ]

            merged_site = {
                'tract_id': tract_id,
                **census_data,
                **fcc_data,
                'nearby_anchor_count': len(nearby_anchors),
                'nearby_anchors': nearby_anchors[:3]  # Top 3
            }

            merged_sites.append(merged_site)

        return merged_sites

    def _calculate_composite_score(
        self,
        site: Dict,
        priorities: Dict[str, float]
    ) -> float:
        """
        Calculate composite score for a site

        Args:
            site: Merged site data
            priorities: Priority weights

        Returns:
            Composite score (0-100)
        """
        # Demographic need score (from Census agent)
        need_score = site.get('need_score', 0)
        demographic_component = need_score * priorities['demographic_need']

        # Coverage gap score (from FCC agent)
        impact_score = site.get('impact_score', 0)
        coverage_component = impact_score * priorities['coverage_gap']

        # Anchor proximity score
        anchor_count = site.get('nearby_anchor_count', 0)
        # Normalize: 0 anchors = 0, 3+ anchors = 100
        anchor_score = min((anchor_count / 3) * 100, 100)
        anchor_component = anchor_score * priorities['anchor_proximity']

        composite = demographic_component + coverage_component + anchor_component

        return round(composite, 2)

    def _categorize_recommendation(self, composite_score: float) -> str:
        """Categorize recommendation strength"""
        if composite_score >= 80:
            return "top_priority"
        elif composite_score >= 60:
            return "high_priority"
        elif composite_score >= 40:
            return "medium_priority"
        else:
            return "low_priority"

    async def generate_deployment_plan(
        self,
        ranked_sites: List[Dict],
        budget_constraint: int = None,
        coverage_goal: int = None
    ) -> Dict:
        """
        Generate deployment plan based on ranked sites

        Args:
            ranked_sites: List of ranked site recommendations
            budget_constraint: Max number of sites (budget limit)
            coverage_goal: Target number of residents to serve

        Returns:
            Deployment plan dict
        """
        # Default to top 10 sites if no constraint
        max_sites = budget_constraint or 10

        selected_sites = ranked_sites[:max_sites]

        # Calculate projected impact
        total_population = sum(site.get('total_population', 0) for site in selected_sites)
        total_below_poverty = sum(site.get('below_poverty_count', 0) for site in selected_sites)
        total_no_internet = sum(site.get('no_internet_count', 0) for site in selected_sites)

        return {
            'recommended_sites_count': len(selected_sites),
            'recommended_sites': selected_sites,
            'projected_impact': {
                'total_population_served': total_population,
                'residents_below_poverty_served': total_below_poverty,
                'households_without_internet_served': total_no_internet
            },
            'deployment_phases': self._create_deployment_phases(selected_sites)
        }

    def _create_deployment_phases(self, sites: List[Dict]) -> List[Dict]:
        """
        Organize sites into deployment phases

        Args:
            sites: Selected deployment sites

        Returns:
            List of deployment phases
        """
        # Phase by priority tier
        phases = []

        # Phase 1: Top priority sites
        phase_1 = [s for s in sites if s.get('recommendation_tier') == 'top_priority']
        if phase_1:
            phases.append({
                'phase': 1,
                'name': 'Critical Need Sites',
                'sites_count': len(phase_1),
                'sites': phase_1
            })

        # Phase 2: High priority sites
        phase_2 = [s for s in sites if s.get('recommendation_tier') == 'high_priority']
        if phase_2:
            phases.append({
                'phase': 2,
                'name': 'High Impact Sites',
                'sites_count': len(phase_2),
                'sites': phase_2
            })

        # Phase 3: Medium priority sites
        phase_3 = [s for s in sites if s.get('recommendation_tier') == 'medium_priority']
        if phase_3:
            phases.append({
                'phase': 3,
                'name': 'Expansion Sites',
                'sites_count': len(phase_3),
                'sites': phase_3
            })

        return phases
