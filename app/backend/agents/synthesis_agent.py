"""
Synthesis/Decision Agent
Combines results from FCC, Census, and Asset agents into actionable WiFi deployment recommendations.
This agent focuses ONLY on decision-making, not data fetching.

Design Principles:
- Specialization: Only handles cross-domain synthesis and ranking
- Transparency: Clear scoring methodology with explainable weights
- Flexibility: Easy to adjust scoring criteria without touching data agents
- Scalability: Can integrate new data sources by adding new scoring components
- Explainability: Provides detailed justification for each recommendation
"""
from typing import Dict, List, Optional, Tuple
import logging
from data_sources.atlanta_boundary import AtlantaBoundaryClient
from data_sources.tract_centroids import TractCentroidClient

logger = logging.getLogger(__name__)


class SynthesisAgent:
    """
    Synthesis Agent that combines multi-source data into prioritized recommendations.

    This agent is the final step in the pipeline - it receives structured data
    from specialized agents and applies strategic decision logic to produce
    actionable WiFi deployment recommendations.
    """

    def __init__(self):
        # Default scoring weights (can be overridden by user)
        self.default_weights = {
            'equity_need': 0.40,        # Census poverty + digital divide
            'coverage_gap': 0.30,       # FCC broadband gaps
            'civic_anchor': 0.20,       # Proximity to libraries, centers, etc.
            'student_density': 0.10     # School-age population density
        }

        # Scoring thresholds for categorization
        self.thresholds = {
            'critical': 85,    # Immediate deployment
            'high': 70,        # Phase 1 deployment
            'medium': 50,      # Phase 2 deployment
            'low': 0           # Future consideration
        }

        # Initialize geospatial validation clients
        try:
            self.boundary_client = AtlantaBoundaryClient()
            self.centroid_client = TractCentroidClient()
            logger.info("✓ Geospatial validation clients initialized")
        except Exception as e:
            logger.warning(f"⚠️  Geospatial validation disabled: {e}")
            self.boundary_client = None
            self.centroid_client = None

    async def synthesize_recommendations(
        self,
        census_data: List[Dict],
        fcc_data: List[Dict],
        asset_data: List[Dict],
        user_weights: Optional[Dict[str, float]] = None,
        max_sites: int = 15
    ) -> Dict:
        """
        Main synthesis pipeline: combine all data sources into ranked recommendations.

        Args:
            census_data: Scored census tracts with poverty, internet, student data
            fcc_data: Coverage gap analysis from FCC broadband data
            asset_data: Civic asset locations (libraries, centers, etc.)
            user_weights: Optional custom priority weights
            max_sites: Maximum number of sites to recommend

        Returns:
            Complete deployment plan with ranked sites and justifications
        """
        logger.info("="*60)
        logger.info("SYNTHESIS AGENT: Starting cross-domain analysis")
        logger.info("="*60)

        # Use custom weights if provided, otherwise defaults
        weights = user_weights or self.default_weights
        logger.info(f"Scoring weights: {weights}")

        # Step 1: Create unified data structure
        logger.info("Step 1: Merging data from all sources")
        unified_sites = self._merge_data_sources(census_data, fcc_data, asset_data)
        logger.info(f"Unified {len(unified_sites)} potential deployment sites")

        # Step 1.5: Filter to only Atlanta city limits
        logger.info("Step 1.5: Filtering sites to Atlanta city limits")
        atlanta_sites = self._filter_to_atlanta(unified_sites)
        logger.info(f"Filtered to {len(atlanta_sites)} sites within Atlanta (removed {len(unified_sites) - len(atlanta_sites)})")

        # Step 2: Calculate composite scores
        logger.info("Step 2: Calculating composite scores")
        scored_sites = self._score_all_sites(atlanta_sites, weights)

        # Step 3: Rank and categorize
        logger.info("Step 3: Ranking and categorizing sites")
        ranked_sites = self._rank_sites(scored_sites)

        # Step 4: Select top N sites
        logger.info(f"Step 4: Selecting top {max_sites} sites")
        selected_sites = ranked_sites[:max_sites]

        # Step 5: Generate deployment plan
        logger.info("Step 5: Creating phased deployment plan")
        deployment_plan = self._create_deployment_plan(selected_sites, weights)

        # Step 6: Generate justifications
        logger.info("Step 6: Generating recommendation justifications")
        self._add_justifications(deployment_plan)

        logger.info("="*60)
        logger.info("SYNTHESIS COMPLETE")
        logger.info(f"Recommended {len(selected_sites)} sites across {len(deployment_plan['phases'])} phases")
        logger.info("="*60)

        return deployment_plan

    def _merge_data_sources(
        self,
        census_data: List[Dict],
        fcc_data: List[Dict],
        asset_data: List[Dict]
    ) -> List[Dict]:
        """
        Merge data from Census, FCC, and Asset agents into unified site records.

        Creates a comprehensive view of each potential site by combining:
        - Demographic need from Census
        - Coverage gaps from FCC
        - Proximity to civic anchors from Assets
        """
        # Create lookups for efficient merging
        census_lookup = {self._get_tract_id(t): t for t in census_data}
        fcc_lookup = {self._get_tract_id(t): t for t in fcc_data}

        # Get all unique tract IDs across datasets
        all_tract_ids = set(list(census_lookup.keys()) + list(fcc_lookup.keys()))

        unified_sites = []

        for tract_id in all_tract_ids:
            census_record = census_lookup.get(tract_id, {})
            fcc_record = fcc_lookup.get(tract_id, {})

            # Find nearby civic assets
            tract_county = census_record.get('county') or fcc_record.get('county')
            nearby_assets = self._find_nearby_assets(
                tract_county,
                census_record.get('latitude'),
                census_record.get('longitude'),
                asset_data
            )

            # Merge all data
            unified_site = {
                'tract_id': tract_id,
                'state': census_record.get('state') or fcc_record.get('state'),
                'county': tract_county,
                'tract': census_record.get('tract') or fcc_record.get('tract'),

                # Census metrics
                'total_population': census_record.get('total_population', 0),
                'poverty_rate': census_record.get('poverty_rate', 0),
                'below_poverty_count': census_record.get('below_poverty_count', 0),
                'no_internet_pct': census_record.get('no_internet_pct', 0),
                'no_internet_count': census_record.get('no_internet_count', 0),
                'student_population': census_record.get('student_population', 0),
                'need_score': census_record.get('need_score', 0),

                # FCC metrics
                'has_broadband': fcc_record.get('has_broadband', True),
                'gap_severity': fcc_record.get('gap_severity', 'none'),
                'impact_score': fcc_record.get('impact_score', 0),

                # Asset proximity
                'nearby_assets': nearby_assets,
                'nearby_asset_count': len(nearby_assets),
                'nearest_library': self._find_nearest_asset(nearby_assets, 'library'),
                'nearest_community_center': self._find_nearest_asset(nearby_assets, 'community_center'),

                # Will be populated in scoring phase
                'composite_score': 0,
                'score_breakdown': {},
                'priority_tier': '',
                'justification': ''
            }

            unified_sites.append(unified_site)

        return unified_sites

    def _score_all_sites(
        self,
        sites: List[Dict],
        weights: Dict[str, float]
    ) -> List[Dict]:
        """
        Calculate composite scores for all sites using weighted components.

        Scoring Components:
        1. Equity Need (40%): Poverty + digital divide + student population
        2. Coverage Gap (30%): FCC broadband availability
        3. Civic Anchor (20%): Proximity to libraries, centers
        4. Student Density (10%): School-age population concentration
        """
        for site in sites:
            # Component 1: Equity Need Score (0-100)
            equity_score = self._calculate_equity_score(site)

            # Component 2: Coverage Gap Score (0-100)
            coverage_score = self._calculate_coverage_score(site)

            # Component 3: Civic Anchor Score (0-100)
            anchor_score = self._calculate_anchor_score(site)

            # Component 4: Student Density Score (0-100)
            student_score = self._calculate_student_score(site)

            # Calculate weighted composite score
            composite = (
                equity_score * weights['equity_need'] +
                coverage_score * weights['coverage_gap'] +
                anchor_score * weights['civic_anchor'] +
                student_score * weights['student_density']
            )

            site['composite_score'] = round(composite, 2)
            site['score_breakdown'] = {
                'equity_need': round(equity_score, 2),
                'coverage_gap': round(coverage_score, 2),
                'civic_anchor': round(anchor_score, 2),
                'student_density': round(student_score, 2)
            }

        return sites

    def _calculate_equity_score(self, site: Dict) -> float:
        """
        Calculate equity need score based on poverty and internet access.
        Higher poverty + lower internet access = higher score
        """
        poverty_rate = site.get('poverty_rate', 0)
        no_internet_pct = site.get('no_internet_pct', 0)

        # Both metrics range 0-100, so average them
        equity_score = (poverty_rate + no_internet_pct) / 2

        return min(equity_score, 100)

    def _calculate_coverage_score(self, site: Dict) -> float:
        """
        Calculate coverage gap score from FCC data.
        No broadband or critical gap = higher score
        """
        has_broadband = site.get('has_broadband', True)
        gap_severity = site.get('gap_severity', 'none')
        impact_score = site.get('impact_score', 0)

        # Use FCC impact score if available, otherwise derive from gap severity
        if impact_score > 0:
            return min(impact_score, 100)

        if not has_broadband:
            return 100
        elif gap_severity == 'critical':
            return 90
        elif gap_severity == 'high':
            return 70
        elif gap_severity == 'medium':
            return 50
        else:
            return 20

    def _calculate_anchor_score(self, site: Dict) -> float:
        """
        Calculate civic anchor proximity score.
        More nearby assets = higher score (easier deployment)
        """
        asset_count = site.get('nearby_asset_count', 0)

        # Normalize: 0 assets=0, 5+ assets=100
        anchor_score = min((asset_count / 5) * 100, 100)

        # Bonus for having a library (ideal anchor)
        if site.get('nearest_library'):
            anchor_score = min(anchor_score + 15, 100)

        return anchor_score

    def _calculate_student_score(self, site: Dict) -> float:
        """
        Calculate student population density score.
        Higher student population = higher score (educational equity)
        """
        student_pop = site.get('student_population', 0)
        total_pop = site.get('total_population', 1)  # Avoid division by zero

        # Calculate student percentage
        student_pct = (student_pop / total_pop) * 100 if total_pop > 0 else 0

        # Typical student percentage is ~20-25%, so normalize
        # 25%+ students = 100 score
        student_score = min((student_pct / 25) * 100, 100)

        return student_score

    def _rank_sites(self, sites: List[Dict]) -> List[Dict]:
        """
        Rank sites by composite score and assign priority tiers.
        """
        # Sort by composite score (descending)
        ranked = sorted(sites, key=lambda x: x['composite_score'], reverse=True)

        # Assign priority tiers based on thresholds
        for site in ranked:
            score = site['composite_score']
            if score >= self.thresholds['critical']:
                site['priority_tier'] = 'critical'
                site['tier_label'] = 'Critical - Deploy Immediately'
            elif score >= self.thresholds['high']:
                site['priority_tier'] = 'high'
                site['tier_label'] = 'High Priority - Phase 1'
            elif score >= self.thresholds['medium']:
                site['priority_tier'] = 'medium'
                site['tier_label'] = 'Medium Priority - Phase 2'
            else:
                site['priority_tier'] = 'low'
                site['tier_label'] = 'Low Priority - Future'

        return ranked

    def _create_deployment_plan(
        self,
        sites: List[Dict],
        weights: Dict[str, float]
    ) -> Dict:
        """
        Create a phased deployment plan from ranked sites.
        """
        # Organize into phases by priority tier
        critical_sites = [s for s in sites if s['priority_tier'] == 'critical']
        high_sites = [s for s in sites if s['priority_tier'] == 'high']
        medium_sites = [s for s in sites if s['priority_tier'] == 'medium']
        low_sites = [s for s in sites if s['priority_tier'] == 'low']

        phases = []

        if critical_sites:
            phases.append({
                'phase_number': 1,
                'phase_name': 'Critical Need Deployment',
                'site_count': len(critical_sites),
                'sites': critical_sites,
                'timeline': 'Immediate (0-3 months)',
                'priority': 'CRITICAL'
            })

        if high_sites:
            phases.append({
                'phase_number': 2,
                'phase_name': 'High Impact Expansion',
                'site_count': len(high_sites),
                'sites': high_sites,
                'timeline': 'Short-term (3-9 months)',
                'priority': 'HIGH'
            })

        if medium_sites:
            phases.append({
                'phase_number': 3,
                'phase_name': 'Strategic Expansion',
                'site_count': len(medium_sites),
                'sites': medium_sites,
                'timeline': 'Medium-term (9-18 months)',
                'priority': 'MEDIUM'
            })

        if low_sites:
            phases.append({
                'phase_number': 4,
                'phase_name': 'Future Consideration',
                'site_count': len(low_sites),
                'sites': low_sites,
                'timeline': 'Long-term (18+ months)',
                'priority': 'LOW'
            })

        # Calculate aggregate impact
        total_population = sum(s.get('total_population', 0) for s in sites)
        total_poverty = sum(s.get('below_poverty_count', 0) for s in sites)
        total_no_internet = sum(s.get('no_internet_count', 0) for s in sites)
        total_students = sum(s.get('student_population', 0) for s in sites)

        return {
            'recommended_sites_count': len(sites),
            'recommended_sites': sites,
            'phases': phases,
            'scoring_methodology': {
                'weights_used': weights,
                'thresholds': self.thresholds,
                'components': [
                    'Equity Need (poverty + digital divide)',
                    'Coverage Gap (FCC broadband data)',
                    'Civic Anchor (asset proximity)',
                    'Student Density (educational priority)'
                ]
            },
            'projected_impact': {
                'total_population_served': total_population,
                'residents_in_poverty_served': total_poverty,
                'households_without_internet_served': total_no_internet,
                'students_served': total_students,
                'equity_reach_percentage': round((total_poverty / total_population * 100), 2) if total_population > 0 else 0
            }
        }

    def _add_justifications(self, deployment_plan: Dict):
        """
        Add human-readable justifications for each recommendation.
        """
        for site in deployment_plan['recommended_sites']:
            breakdown = site['score_breakdown']

            justification_parts = []

            # Equity component
            if breakdown['equity_need'] >= 70:
                justification_parts.append(
                    f"High equity need ({site.get('poverty_rate', 0):.1f}% poverty, "
                    f"{site.get('no_internet_pct', 0):.1f}% without internet)"
                )

            # Coverage component
            if breakdown['coverage_gap'] >= 70:
                justification_parts.append(
                    f"Significant broadband coverage gap ({site.get('gap_severity', 'unknown')} severity)"
                )

            # Anchor component
            if breakdown['civic_anchor'] >= 60:
                asset_count = site.get('nearby_asset_count', 0)
                justification_parts.append(
                    f"{asset_count} nearby civic assets for easy deployment"
                )

            # Student component
            if breakdown['student_density'] >= 50:
                student_pop = site.get('student_population', 0)
                justification_parts.append(
                    f"Serves {student_pop} students (educational priority)"
                )

            site['justification'] = '; '.join(justification_parts) if justification_parts else 'Meets multiple deployment criteria'

    def _filter_to_atlanta(self, sites: List[Dict]) -> List[Dict]:
        """
        Filter sites to only those within Atlanta city limits.

        Uses point-in-polygon validation with census tract centroids.
        If geospatial clients are not available, returns all sites.

        Args:
            sites: List of unified site dictionaries

        Returns:
            Filtered list containing only sites within Atlanta
        """
        if not self.boundary_client or not self.centroid_client:
            logger.warning("Geospatial validation disabled - returning all sites")
            return sites

        atlanta_sites = []
        skipped_count = 0

        for site in sites:
            tract_id = self._get_tract_id(site)

            # Get tract centroid coordinates
            centroid = self.centroid_client.get_centroid(tract_id)

            if not centroid:
                logger.debug(f"No centroid found for tract {tract_id}")
                skipped_count += 1
                continue

            lat, lng = centroid

            # Check if centroid is within Atlanta boundary
            if self.boundary_client.is_point_in_atlanta(lat, lng):
                # Add coordinates to site data
                site['lat'] = lat
                site['lng'] = lng
                atlanta_sites.append(site)
            else:
                logger.debug(f"Tract {tract_id} outside Atlanta boundary")

        if skipped_count > 0:
            logger.info(f"⚠️  Skipped {skipped_count} sites with missing centroids")

        return atlanta_sites

    # Helper methods

    def _get_tract_id(self, tract: Dict) -> str:
        """Generate tract ID from components"""
        return f"{tract.get('state', '')}{tract.get('county', '')}{tract.get('tract', '')}"

    def _find_nearby_assets(
        self,
        county: str,
        lat: float,
        lon: float,
        assets: List[Dict]
    ) -> List[Dict]:
        """Find assets near a tract (simplified to county match for now)"""
        if not county:
            return []
        return [a for a in assets if a.get('county') == county][:5]  # Top 5

    def _find_nearest_asset(self, assets: List[Dict], asset_type: str) -> Optional[Dict]:
        """Find nearest asset of a specific type"""
        typed_assets = [a for a in assets if a.get('type') == asset_type]
        return typed_assets[0] if typed_assets else None
