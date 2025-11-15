"""
<<<<<<< HEAD
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
=======
Proximity Ranker

Maps FCC broadband coverage data from H3 hexagons to census tracts
using centroid-based spatial joins.
"""

import geopandas as gpd
import pandas as pd
from typing import Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def assign_coverage_to_tracts(
    tracts_gdf: gpd.GeoDataFrame,
    hexagons_gdf: gpd.GeoDataFrame,
    coverage_column: str = "coverage_percent",
) -> gpd.GeoDataFrame:
    """
    Assign FCC coverage data to census tracts using centerpoint mapping

    This function calculates the centroid of each census tract and finds
    which H3 hexagon contains that centroid. The hexagon's coverage data
    is then assigned to the tract.

    Args:
        tracts_gdf: GeoDataFrame of census tracts with geometries
        hexagons_gdf: GeoDataFrame of FCC H3 hexagons with coverage data
        coverage_column: Name of column to store coverage percentage

    Returns:
        GeoDataFrame of census tracts with added coverage metrics
    """
    if len(tracts_gdf) == 0:
        logger.warning("Empty tracts GeoDataFrame provided")
        return tracts_gdf

    if len(hexagons_gdf) == 0:
        logger.warning("Empty hexagons GeoDataFrame provided")
        tracts_gdf[coverage_column] = 0
        return tracts_gdf

    logger.info(
        f"Mapping coverage from {len(hexagons_gdf)} hexagons to {len(tracts_gdf)} tracts"
    )

    # Ensure both GeoDataFrames use the same CRS
    if tracts_gdf.crs != hexagons_gdf.crs:
        logger.info(f"Reprojecting hexagons from {hexagons_gdf.crs} to {tracts_gdf.crs}")
        hexagons_gdf = hexagons_gdf.to_crs(tracts_gdf.crs)

    # Create a copy to avoid modifying the original
    tracts_enriched = tracts_gdf.copy()

    # Calculate centroids of census tracts
    logger.info("Calculating tract centroids...")
    tracts_enriched["centroid"] = tracts_enriched.geometry.centroid

    # Create a temporary GeoDataFrame with centroids as geometry
    centroids_gdf = gpd.GeoDataFrame(
        tracts_enriched.drop(columns=["geometry"]),
        geometry="centroid",
        crs=tracts_enriched.crs,
    )

    # Perform spatial join: find which hexagon contains each tract centroid
    logger.info("Performing spatial join between centroids and hexagons...")
    joined = gpd.sjoin(
        centroids_gdf,
        hexagons_gdf,
        how="left",
        predicate="within",
    )

    # Handle multiple columns from FCC data
    # Common FCC columns: coverage, max_advertised_download_speed, max_advertised_upload_speed, provider_count
    fcc_columns = identify_coverage_columns(hexagons_gdf)

    # Map FCC data to tracts
    for fcc_col in fcc_columns:
        if fcc_col in joined.columns:
            tracts_enriched[fcc_col] = joined[fcc_col].values

    # Add a general coverage_percent column if not already present
    if coverage_column not in tracts_enriched.columns:
        # Try to derive coverage from available columns
        if "coverage" in tracts_enriched.columns:
            tracts_enriched[coverage_column] = tracts_enriched["coverage"]
        elif "max_advertised_download_speed" in tracts_enriched.columns:
            # Convert speed to coverage percentage (speeds >= 25 Mbps = 100% coverage)
            tracts_enriched[coverage_column] = (
                tracts_enriched["max_advertised_download_speed"]
                .apply(lambda x: min(100, (x / 25) * 100) if pd.notna(x) else 0)
            )
        else:
            # Default to 0 if no coverage data available
            tracts_enriched[coverage_column] = 0

    # Fill NaN values with 0 (tracts not covered by any hexagon)
    tracts_enriched[coverage_column] = tracts_enriched[coverage_column].fillna(0)

    # Drop the centroid column
    tracts_enriched = tracts_enriched.drop(columns=["centroid"])

    # Log summary statistics
    avg_coverage = tracts_enriched[coverage_column].mean()
    tracts_with_coverage = (tracts_enriched[coverage_column] > 0).sum()
    logger.info(
        f"Coverage assignment complete. "
        f"Average coverage: {avg_coverage:.2f}%, "
        f"{tracts_with_coverage}/{len(tracts_enriched)} tracts have coverage data"
    )

    return tracts_enriched


def identify_coverage_columns(hexagons_gdf: gpd.GeoDataFrame) -> list:
    """
    Identify FCC coverage-related columns in the hexagons GeoDataFrame

    Args:
        hexagons_gdf: GeoDataFrame of FCC hexagons

    Returns:
        List of column names containing coverage data
    """
    # Common FCC column names
    potential_columns = [
        "coverage",
        "max_advertised_download_speed",
        "max_advertised_upload_speed",
        "provider_count",
        "technology_code",
        "business_residential_code",
    ]

    # Find which columns exist in the data
    existing_columns = [col for col in potential_columns if col in hexagons_gdf.columns]

    logger.info(f"Found FCC coverage columns: {existing_columns}")

    return existing_columns


def filter_tracts_by_coverage(
    tracts_gdf: gpd.GeoDataFrame,
    min_coverage: float = 0,
    max_coverage: float = 100,
    coverage_column: str = "coverage_percent",
) -> gpd.GeoDataFrame:
    """
    Filter census tracts by coverage percentage range

    Args:
        tracts_gdf: GeoDataFrame of census tracts with coverage data
        min_coverage: Minimum coverage threshold (0-100)
        max_coverage: Maximum coverage threshold (0-100)
        coverage_column: Name of coverage column to filter on

    Returns:
        Filtered GeoDataFrame
    """
    if coverage_column not in tracts_gdf.columns:
        logger.warning(f"Coverage column '{coverage_column}' not found in tracts")
        return tracts_gdf

    filtered = tracts_gdf[
        (tracts_gdf[coverage_column] >= min_coverage)
        & (tracts_gdf[coverage_column] <= max_coverage)
    ].copy()

    logger.info(
        f"Filtered {len(filtered)} tracts with coverage between "
        f"{min_coverage}% and {max_coverage}% (from {len(tracts_gdf)} total)"
    )

    return filtered


def get_underserved_tracts(
    tracts_gdf: gpd.GeoDataFrame,
    coverage_threshold: float = 50,
    coverage_column: str = "coverage_percent",
) -> gpd.GeoDataFrame:
    """
    Get census tracts with low broadband coverage (underserved areas)

    Args:
        tracts_gdf: GeoDataFrame of census tracts with coverage data
        coverage_threshold: Coverage threshold below which areas are underserved
        coverage_column: Name of coverage column

    Returns:
        GeoDataFrame of underserved tracts
    """
    return filter_tracts_by_coverage(
        tracts_gdf,
        min_coverage=0,
        max_coverage=coverage_threshold,
        coverage_column=coverage_column,
    )


def rank_tracts_by_coverage(
    tracts_gdf: gpd.GeoDataFrame,
    coverage_column: str = "coverage_percent",
    ascending: bool = True,
) -> gpd.GeoDataFrame:
    """
    Rank census tracts by coverage percentage

    Args:
        tracts_gdf: GeoDataFrame of census tracts with coverage data
        coverage_column: Name of coverage column to rank by
        ascending: If True, rank from lowest to highest (lowest first)

    Returns:
        Ranked GeoDataFrame with added 'coverage_rank' column
    """
    if coverage_column not in tracts_gdf.columns:
        logger.warning(f"Coverage column '{coverage_column}' not found")
        return tracts_gdf

    ranked = tracts_gdf.copy()
    ranked["coverage_rank"] = ranked[coverage_column].rank(
        ascending=ascending, method="dense"
    )

    ranked = ranked.sort_values("coverage_rank").reset_index(drop=True)

    logger.info(f"Ranked {len(ranked)} tracts by coverage (ascending={ascending})")

    return ranked


def get_coverage_summary(
    tracts_gdf: gpd.GeoDataFrame,
    coverage_column: str = "coverage_percent",
) -> dict:
    """
    Generate summary statistics for tract coverage data

    Args:
        tracts_gdf: GeoDataFrame of census tracts with coverage data
        coverage_column: Name of coverage column

    Returns:
        Dictionary with coverage statistics
    """
    if coverage_column not in tracts_gdf.columns:
        return {"error": "Coverage column not found"}

    coverage_data = tracts_gdf[coverage_column]

    summary = {
        "total_tracts": len(tracts_gdf),
        "avg_coverage": round(coverage_data.mean(), 2),
        "median_coverage": round(coverage_data.median(), 2),
        "min_coverage": round(coverage_data.min(), 2),
        "max_coverage": round(coverage_data.max(), 2),
        "tracts_with_no_coverage": (coverage_data == 0).sum(),
        "tracts_with_partial_coverage": ((coverage_data > 0) & (coverage_data < 100)).sum(),
        "tracts_with_full_coverage": (coverage_data == 100).sum(),
        "underserved_tracts_50pct": (coverage_data < 50).sum(),
        "underserved_tracts_25pct": (coverage_data < 25).sum(),
    }

    return summary
>>>>>>> origin/feature/backend
