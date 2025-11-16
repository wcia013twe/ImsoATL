"""
Data Pipeline Orchestrator

Runs the complete deployment site pipeline for a given city:
1. Filter underserved tracts by city boundary
2. Rank deployment sites by impact
3. Fetch tract geometries
4. Return all results as JSON

This replaces static file generation with dynamic API responses.
"""

import json
import logging
from pathlib import Path
from typing import Dict, Any
import pandas as pd
from shapely.geometry import shape
from fetch_tract_geometry import TractGeometryFetcher

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def run_deployment_pipeline(city_slug: str) -> Dict[str, Any]:
    """
    Run complete deployment pipeline for a city

    Args:
        city_slug: City identifier (e.g., 'madison-county-fl')

    Returns:
        Dictionary containing:
        - underserved_tracts: List of filtered tracts
        - ranked_sites: List of ranked deployment sites
        - tract_geometries: GeoJSON FeatureCollection of tract polygons
    """
    logger.info(f"=" * 70)
    logger.info(f"Running Deployment Pipeline for: {city_slug}")
    logger.info(f"=" * 70)

    project_root = Path(__file__).parent.parent.parent.parent

    # Input files
    coverage_csv = project_root / "florida_tract_coverage.csv"
    city_boundary_path = project_root / f"app/frontend/public/data/cities/{city_slug}.json"

    if not city_boundary_path.exists():
        raise FileNotFoundError(f"City boundary file not found: {city_boundary_path}")

    # Step 1: Filter underserved tracts by city boundary
    logger.info("\n[1/3] Filtering underserved tracts...")

    # Load coverage data
    df = pd.read_csv(coverage_csv)
    initial_count = len(df)

    # Load city boundary and filter spatially
    with open(city_boundary_path, 'r') as f:
        city_data = json.load(f)

    city_geom = shape(city_data['geometry'])

    # We need tract geometries from the cached/pre-generated file for spatial filtering
    logger.info("  Loading tract geometries for spatial filtering...")

    # Load pre-generated tract geometries (from the 65 underserved tracts)
    tract_geo_path = project_root / "app/frontend/public/data/processed/underserved_tracts_geo.json"

    if not tract_geo_path.exists():
        raise FileNotFoundError(
            f"Tract geometry file not found: {tract_geo_path}. "
            "Run fetch_tract_geometry.py first to generate geometries."
        )

    with open(tract_geo_path, 'r') as f:
        tract_geo_data = json.load(f)

    tract_features = tract_geo_data.get('features', [])

    # Find tracts that intersect with city boundary
    intersecting_geoids = set()
    for feature in tract_features:
        geoid = feature['properties'].get('GEOID')
        if not geoid:
            continue

        tract_geom = shape(feature['geometry'])
        if city_geom.intersects(tract_geom):
            intersecting_geoids.add(str(geoid))

    logger.info(f"  Found {len(intersecting_geoids)} tracts within city boundary")

    # Filter df to only include tracts within city
    df_spatial = df[df['GEOID'].astype(str).isin(intersecting_geoids)].copy()
    logger.info(f"  After spatial filter: {len(df_spatial)} tracts ({initial_count - len(df_spatial)} removed)")

    # Apply coverage and population filters
    df_filtered = df_spatial[df_spatial['coverage'] < 100.0].copy()
    after_coverage = len(df_filtered)
    logger.info(f"  After coverage < 100% filter: {after_coverage} tracts")

    df_filtered = df_filtered[df_filtered['population'] > 500].copy()
    after_population = len(df_filtered)
    logger.info(f"  After population > 500 filter: {after_population} tracts")

    # Prepare underserved tracts data
    underserved_tracts = []
    for _, row in df_filtered.iterrows():
        tract = {
            'geoid': str(row['GEOID']),
            'coverage_percent': float(row['coverage']),
            'population': int(row['population']) if pd.notna(row['population']) else 0,
            'median_income': int(row['median_income']) if pd.notna(row['median_income']) else 0,
            'poverty_rate': float(row['poverty_rate']) if pd.notna(row['poverty_rate']) else 0,
        }

        # Add asset counts
        asset_types = ['schools', 'libraries', 'community_centers', 'transit_stops']
        for asset_type in asset_types:
            col_name = f'asset_count_{asset_type}'
            if col_name in row:
                tract[asset_type] = int(row[col_name]) if pd.notna(row[col_name]) else 0

        tract['total_assets'] = sum(tract.get(at, 0) for at in asset_types)
        underserved_tracts.append(tract)

    logger.info(f"  ✓ Filtered to {len(underserved_tracts)} underserved tracts")

    # Step 2: Rank deployment sites
    logger.info("\n[2/3] Ranking deployment sites...")

    ranked_sites = []
    if len(underserved_tracts) > 0:
        # Calculate impact scores
        for tract in underserved_tracts:
            pop = tract['population']
            poverty = tract['poverty_rate']
            income = tract['median_income']

            # Normalize scores
            pop_score = min(100, (pop / 10000) * 100)
            poverty_score = min(100, poverty)
            income_score = 100 - min(100, (income / 100000) * 100)

            # Calculate composite impact score
            impact_score = (0.4 * pop_score) + (0.4 * poverty_score) + (0.2 * income_score)
            tract['impact_score'] = round(impact_score, 1)

        # Sort by impact score
        ranked_sites = sorted(underserved_tracts, key=lambda x: x['impact_score'], reverse=True)

        # Assign ranks and tiers
        for rank, site in enumerate(ranked_sites, 1):
            site['deployment_rank'] = rank

            # Assign tier based on rank
            if rank <= 10:
                site['deployment_tier'] = 'tier_1_critical'
            elif rank <= 25:
                site['deployment_tier'] = 'tier_2_high'
            elif rank <= 40:
                site['deployment_tier'] = 'tier_3_medium'
            else:
                site['deployment_tier'] = 'tier_4_low'

        logger.info(f"  ✓ Ranked {len(ranked_sites)} deployment sites")
        logger.info(f"  Top site: GEOID {ranked_sites[0]['geoid']} (Impact: {ranked_sites[0]['impact_score']})")
    else:
        logger.info("  ⚠ No tracts to rank")

    # Step 3: Fetch tract geometries
    logger.info("\n[3/3] Fetching tract geometries...")

    tract_geoids = [t['geoid'] for t in ranked_sites]
    tract_geo_features = []

    # Filter the previously fetched features to only include ranked sites
    for feature in tract_features:
        geoid = feature['properties'].get('GEOID')
        if str(geoid) in tract_geoids:
            # Merge with ranking data
            site_data = next((s for s in ranked_sites if s['geoid'] == str(geoid)), None)
            if site_data:
                feature['properties'].update(site_data)
                tract_geo_features.append(feature)

    logger.info(f"  ✓ Fetched {len(tract_geo_features)} tract geometries")

    # Return results
    result = {
        'city_slug': city_slug,
        'total_tracts': len(ranked_sites),
        'sites': ranked_sites,
        'geometries': {
            'type': 'FeatureCollection',
            'features': tract_geo_features
        }
    }

    logger.info(f"\n{'=' * 70}")
    logger.info(f"✓ Pipeline complete for {city_slug}")
    logger.info(f"  Total deployment sites: {len(ranked_sites)}")
    logger.info(f"{'=' * 70}\n")

    return result


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python run_pipeline.py <city-slug>")
        print("Example: python run_pipeline.py madison-county-fl")
        sys.exit(1)

    city_slug = sys.argv[1]
    result = run_deployment_pipeline(city_slug)

    # Pretty print summary
    print(f"\nGenerated {result['total_tracts']} deployment sites for {city_slug}")
