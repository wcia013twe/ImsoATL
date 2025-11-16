"""
Filter Underserved Census Tracts

This script filters census tracts based on:
1. Spatial intersection with city boundary (if provided)
2. Coverage < 100% (not fully covered)
3. Population > 500 (exclude very low population tracts)

Input: florida_tract_coverage.csv, city boundary GeoJSON (optional)
Output: underserved_tracts.json
"""

import pandas as pd
import json
from pathlib import Path
import logging
from shapely.geometry import shape, Point
from shapely.ops import unary_union

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def filter_underserved_tracts(
    coverage_csv_path: Path,
    output_json_path: Path,
    city_boundary_path: Path = None,
    tract_geometry_path: Path = None,
    coverage_threshold: float = 100.0,
    min_population: int = 500
):
    """
    Filter tracts that are underserved based on spatial location, coverage and population

    Args:
        coverage_csv_path: Path to coverage CSV file
        output_json_path: Path to save filtered JSON
        city_boundary_path: Path to city boundary GeoJSON (optional)
        tract_geometry_path: Path to tract geometries GeoJSON (optional, required if city_boundary_path is provided)
        coverage_threshold: Maximum coverage to include (default 100 = exclude fully covered)
        min_population: Minimum population to include (default 500)
    """
    logger.info("=" * 70)
    logger.info("Filtering Underserved Census Tracts")
    logger.info("=" * 70)

    # Load coverage data
    logger.info(f"Loading coverage data from {coverage_csv_path}...")
    df = pd.read_csv(coverage_csv_path)
    logger.info(f"  Loaded {len(df):,} total tracts")

    # Show available columns
    logger.info(f"  Columns: {df.columns.tolist()}")

    initial_count = len(df)

    # Filter 0: Spatial intersection with city boundary (if provided)
    if city_boundary_path and tract_geometry_path:
        logger.info(f"\nApplying spatial filter with city boundary from {city_boundary_path}...")

        # Load city boundary
        with open(city_boundary_path, 'r') as f:
            city_data = json.load(f)

        # Convert city boundary to shapely geometry
        city_geom = shape(city_data['geometry'])
        logger.info(f"  City boundary type: {city_data['geometry']['type']}")

        # Load tract geometries
        with open(tract_geometry_path, 'r') as f:
            tract_geo_data = json.load(f)

        logger.info(f"  Loaded {len(tract_geo_data['features']):,} tract geometries")

        # Find tracts that intersect with city boundary
        intersecting_geoids = set()
        for feature in tract_geo_data['features']:
            geoid = feature['properties'].get('GEOID') or feature['properties'].get('geoid')
            if not geoid:
                continue

            tract_geom = shape(feature['geometry'])

            # Check if tract intersects with city boundary
            if city_geom.intersects(tract_geom):
                intersecting_geoids.add(str(geoid))

        logger.info(f"  Found {len(intersecting_geoids):,} tracts within city boundary")

        # Filter df to only include tracts within city
        df = df[df['GEOID'].astype(str).isin(intersecting_geoids)].copy()
        after_spatial = len(df)
        logger.info(f"  After spatial filter: {after_spatial:,} tracts ({initial_count - after_spatial:,} removed)")
    else:
        logger.info("\nNo city boundary provided, skipping spatial filter")
        after_spatial = initial_count

    # Apply filters
    logger.info(f"\nApplying demographic filters:")
    logger.info(f"  1. Coverage < {coverage_threshold}%")
    logger.info(f"  2. Population > {min_population}")

    # Filter 1: Coverage < threshold
    df_filtered = df[df['coverage'] < coverage_threshold].copy()
    after_coverage = len(df_filtered)
    logger.info(f"\n  After coverage filter: {after_coverage:,} tracts ({initial_count - after_coverage:,} removed)")

    # Filter 2: Population > minimum
    df_filtered = df_filtered[df_filtered['population'] > min_population].copy()
    after_population = len(df_filtered)
    logger.info(f"  After population filter: {after_population:,} tracts ({after_coverage - after_population:,} removed)")

    # Prepare output data
    tracts = []
    for _, row in df_filtered.iterrows():
        tract = {
            'geoid': str(row['GEOID']),
            'coverage_percent': float(row['coverage']),
            'population': int(row['population']) if pd.notna(row['population']) else 0,
            'median_income': int(row['median_income']) if pd.notna(row['median_income']) else 0,
            'poverty_rate': float(row['poverty_rate']) if pd.notna(row['poverty_rate']) else 0,
        }

        # Add asset counts if available
        asset_types = ['schools', 'libraries', 'community_centers', 'transit_stops']
        for asset_type in asset_types:
            col_name = f'asset_count_{asset_type}'
            if col_name in row:
                tract[asset_type] = int(row[col_name]) if pd.notna(row[col_name]) else 0

        # Calculate total assets
        tract['total_assets'] = sum(tract.get(at, 0) for at in asset_types)

        tracts.append(tract)

    # Create output JSON
    output_data = {
        'generated_at': pd.Timestamp.now().isoformat(),
        'filters': {
            'city_boundary': str(city_boundary_path) if city_boundary_path else None,
            'max_coverage': coverage_threshold,
            'min_population': min_population
        },
        'total_tracts': len(tracts),
        'tracts': tracts
    }

    # Save to file
    output_json_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_json_path, 'w') as f:
        json.dump(output_data, f, indent=2)

    logger.info(f"\n✅ Saved {len(tracts)} underserved tracts to {output_json_path}")

    # Summary statistics
    logger.info("\n" + "=" * 70)
    logger.info("Summary Statistics")
    logger.info("=" * 70)
    logger.info(f"Coverage range: {df_filtered['coverage'].min():.1f}% - {df_filtered['coverage'].max():.1f}%")
    logger.info(f"Population range: {df_filtered['population'].min():.0f} - {df_filtered['population'].max():.0f}")
    logger.info(f"Poverty rate range: {df_filtered['poverty_rate'].min():.1f}% - {df_filtered['poverty_rate'].max():.1f}%")
    logger.info(f"Median income range: ${df_filtered['median_income'].min():.0f} - ${df_filtered['median_income'].max():.0f}")
    logger.info("=" * 70)

    return output_data


def main():
    """Main execution"""
    import sys

    project_root = Path(__file__).parent.parent.parent.parent

    # Input files
    coverage_csv = project_root / "florida_tract_coverage.csv"

    # Check if city boundary was provided as argument
    city_boundary = None
    tract_geometry = None

    if len(sys.argv) > 1:
        city_slug = sys.argv[1]
        city_boundary = project_root / f"app/frontend/public/data/cities/{city_slug}.json"
        tract_geometry = project_root / "app/frontend/public/data/processed/underserved_tracts_geo.json"

        if not city_boundary.exists():
            logger.error(f"City boundary file not found: {city_boundary}")
            sys.exit(1)

        logger.info(f"Filtering for city: {city_slug}")
    else:
        logger.info("No city specified - filtering all Florida tracts")

    # Output file
    output_file = project_root / "app/frontend/public/data/processed/underserved_tracts.json"

    # Filter underserved tracts
    filter_underserved_tracts(
        coverage_csv_path=coverage_csv,
        output_json_path=output_file,
        city_boundary_path=city_boundary,
        tract_geometry_path=tract_geometry,
        coverage_threshold=100.0,  # Exclude fully covered (100%)
        min_population=500  # Exclude low population tracts
    )


if __name__ == "__main__":
    main()
