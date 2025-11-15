"""
Calculate Georgia census tract coverage WITHOUT FCC API credentials

This approach uses publicly downloadable files instead of the API.
You manually download the data once, then run this script.

Steps:
1. Go to: https://broadbandmap.fcc.gov/data-download
2. Select:
   - Data Type: Availability
   - Download Format: Hexagon Coverage
   - State: Georgia
   - File Format: GeoPackage (.gpkg)
3. Download all files for Georgia
4. Extract them to data/fcc_hexagons/ folder
5. Run this script
"""

import geopandas as gpd
import pandas as pd
from pathlib import Path
import logging
from typing import List

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def load_census_tracts() -> gpd.GeoDataFrame:
    """Load Georgia census tracts from US Census TIGER/Line (no auth needed)"""
    logger.info("Loading Georgia census tracts from US Census...")

    # This is a public URL, no credentials needed
    url = "https://www2.census.gov/geo/tiger/TIGER2023/TRACT/tl_2023_13_tract.zip"

    try:
        tracts = gpd.read_file(url)
        logger.info(f"Loaded {len(tracts)} census tracts")

        # Ensure WGS84
        if tracts.crs != "EPSG:4326":
            tracts = tracts.to_crs("EPSG:4326")

        return tracts
    except Exception as e:
        logger.error(f"Error loading census tracts: {e}")
        return gpd.GeoDataFrame()


def load_local_fcc_hexagons(data_dir: str = "data/fcc_hexagons") -> gpd.GeoDataFrame:
    """
    Load FCC hexagon files from local directory

    Args:
        data_dir: Directory containing .gpkg files downloaded from FCC

    Returns:
        Combined GeoDataFrame of all hexagons
    """
    data_path = Path(data_dir)

    if not data_path.exists():
        logger.error(f"Directory not found: {data_path}")
        logger.info("Please download FCC hexagon files from https://broadbandmap.fcc.gov/data-download")
        return gpd.GeoDataFrame()

    # Find all .gpkg files
    gpkg_files = list(data_path.glob("*.gpkg"))

    if not gpkg_files:
        logger.error(f"No .gpkg files found in {data_path}")
        logger.info("Please download and extract FCC hexagon GeoPackage files to this directory")
        return gpd.GeoDataFrame()

    logger.info(f"Found {len(gpkg_files)} GeoPackage files")

    # Load all files
    all_hexagons = []
    for gpkg_file in gpkg_files:
        try:
            logger.info(f"Loading {gpkg_file.name}...")
            gdf = gpd.read_file(gpkg_file)
            all_hexagons.append(gdf)
            logger.info(f"  Loaded {len(gdf)} records")
        except Exception as e:
            logger.error(f"  Error loading {gpkg_file}: {e}")

    if not all_hexagons:
        logger.error("No hexagon data loaded")
        return gpd.GeoDataFrame()

    # Combine
    combined = gpd.GeoDataFrame(
        pd.concat(all_hexagons, ignore_index=True),
        crs=all_hexagons[0].crs
    )

    logger.info(f"Total records: {len(combined)}")
    logger.info(f"Columns: {combined.columns.tolist()}")

    return combined


def aggregate_hexagon_coverage(hexagons_gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Aggregate provider-level data to hexagon-level coverage

    Groups by hexagon ID and determines if ANY provider offers service
    at various speed thresholds.
    """
    logger.info("Aggregating provider data to hexagon-level...")

    # Find hexagon ID column
    hex_id_col = None
    for col in ['h3_res8_id', 'location_id', 'block_geoid']:
        if col in hexagons_gdf.columns:
            hex_id_col = col
            break

    if not hex_id_col:
        logger.error("No hexagon ID column found!")
        logger.info(f"Available columns: {hexagons_gdf.columns.tolist()}")
        return hexagons_gdf

    logger.info(f"Using '{hex_id_col}' as hexagon identifier")

    # Speed thresholds
    speed_tiers = {
        'has_25_3': (25, 3),      # FCC broadband
        'has_100_20': (100, 20),
        'has_1000_100': (1000, 100)
    }

    # Check if speed columns exist
    if 'max_advertised_download_speed' not in hexagons_gdf.columns:
        logger.error("Speed columns not found!")
        logger.info(f"Available columns: {hexagons_gdf.columns.tolist()}")
        return hexagons_gdf

    # Aggregate by hexagon
    def agg_hex(group):
        max_down = group['max_advertised_download_speed'].max()
        max_up = group['max_advertised_upload_speed'].max()

        result = {
            hex_id_col: group[hex_id_col].iloc[0],
            'max_down': max_down,
            'max_up': max_up,
            'geometry': group.geometry.iloc[0]
        }

        # Check speed tiers
        for tier_name, (min_down, min_up) in speed_tiers.items():
            result[tier_name] = int(max_down >= min_down and max_up >= min_up)

        return pd.Series(result)

    aggregated = hexagons_gdf.groupby(hex_id_col, group_keys=False).apply(agg_hex)
    aggregated_gdf = gpd.GeoDataFrame(aggregated, geometry='geometry', crs=hexagons_gdf.crs)

    logger.info(f"Aggregated to {len(aggregated_gdf)} unique hexagons")

    # Log coverage stats
    for tier in ['has_25_3', 'has_100_20', 'has_1000_100']:
        if tier in aggregated_gdf.columns:
            count = aggregated_gdf[tier].sum()
            pct = count / len(aggregated_gdf) * 100
            logger.info(f"  {tier}: {count} hexagons ({pct:.1f}%)")

    return aggregated_gdf


def calculate_tract_coverage(
    tracts_gdf: gpd.GeoDataFrame,
    hexagons_gdf: gpd.GeoDataFrame
) -> gpd.GeoDataFrame:
    """
    Calculate coverage percentage for each census tract
    using spatial intersection of hexagons
    """
    logger.info("Calculating tract-level coverage...")

    # Ensure same CRS
    if tracts_gdf.crs != hexagons_gdf.crs:
        hexagons_gdf = hexagons_gdf.to_crs(tracts_gdf.crs)

    # Calculate coverage for each speed tier
    for tier in ['has_25_3', 'has_100_20', 'has_1000_100']:
        if tier not in hexagons_gdf.columns:
            logger.warning(f"Skipping {tier} - column not found")
            continue

        logger.info(f"Processing {tier}...")

        # Filter to hexagons with this speed tier
        tier_hexagons = hexagons_gdf[hexagons_gdf[tier] == 1].copy()

        if len(tier_hexagons) == 0:
            logger.warning(f"  No hexagons with {tier}")
            tracts_gdf[f'coverage_percent_{tier}'] = 0
            continue

        # Intersect with tracts
        intersections = gpd.overlay(
            tracts_gdf[['GEOID', 'geometry']],
            tier_hexagons[['geometry']],
            how='intersection'
        )

        # Calculate areas (use equal-area projection)
        intersections_proj = intersections.to_crs('EPSG:5070')  # Albers Equal Area
        intersections_proj['covered_area'] = intersections_proj.geometry.area

        # Sum by tract
        coverage_by_tract = intersections_proj.groupby('GEOID')['covered_area'].sum().reset_index()

        # Get total tract areas
        tracts_proj = tracts_gdf.to_crs('EPSG:5070')
        tract_areas = tracts_proj[['GEOID', 'geometry']].copy()
        tract_areas['total_area'] = tract_areas.geometry.area

        # Merge and calculate percentage
        coverage_by_tract = coverage_by_tract.merge(
            tract_areas[['GEOID', 'total_area']],
            on='GEOID',
            how='right'
        )

        coverage_by_tract['covered_area'] = coverage_by_tract['covered_area'].fillna(0)
        coverage_by_tract[f'coverage_percent_{tier}'] = (
            coverage_by_tract['covered_area'] / coverage_by_tract['total_area'] * 100
        ).clip(0, 100)

        # Add to tracts
        tracts_gdf = tracts_gdf.merge(
            coverage_by_tract[['GEOID', f'coverage_percent_{tier}']],
            on='GEOID',
            how='left'
        )

        tracts_gdf[f'coverage_percent_{tier}'] = tracts_gdf[f'coverage_percent_{tier}'].fillna(0)

        avg = tracts_gdf[f'coverage_percent_{tier}'].mean()
        logger.info(f"  Average {tier} coverage: {avg:.2f}%")

    return tracts_gdf


def main():
    """Main execution"""
    logger.info("="*70)
    logger.info("Georgia Census Tract Coverage Calculator (No API Required)")
    logger.info("="*70)

    # Step 1: Load census tracts
    tracts = load_census_tracts()
    if len(tracts) == 0:
        logger.error("Failed to load census tracts. Exiting.")
        return

    # Step 2: Load local FCC hexagon files
    hexagons = load_local_fcc_hexagons("data/fcc_hexagons")
    if len(hexagons) == 0:
        logger.error("Failed to load FCC hexagon data. Exiting.")
        logger.info("\nTo download the data:")
        logger.info("1. Go to: https://broadbandmap.fcc.gov/data-download")
        logger.info("2. Select: Availability → Hexagon Coverage → Georgia → GeoPackage")
        logger.info("3. Download all files")
        logger.info("4. Extract .gpkg files to: data/fcc_hexagons/")
        return

    # Step 3: Aggregate hexagons
    hexagons_agg = aggregate_hexagon_coverage(hexagons)

    # Step 4: Calculate tract coverage
    tracts_with_coverage = calculate_tract_coverage(tracts, hexagons_agg)

    # Step 5: Save results
    output_file = Path("georgia_tract_coverage.gpkg")
    tracts_with_coverage.to_file(output_file, driver="GPKG")
    logger.info(f"\nSaved GeoPackage to: {output_file}")

    csv_file = Path("georgia_tract_coverage.csv")
    coverage_df = tracts_with_coverage.drop(columns=['geometry'])
    coverage_df.to_csv(csv_file, index=False)
    logger.info(f"Saved CSV to: {csv_file}")

    # Summary statistics
    logger.info("\n" + "="*70)
    logger.info("Coverage Summary")
    logger.info("="*70)
    logger.info(f"Total census tracts: {len(tracts_with_coverage)}")

    for tier in ['coverage_percent_has_25_3', 'coverage_percent_has_100_20', 'coverage_percent_has_1000_100']:
        if tier in tracts_with_coverage.columns:
            tier_name = tier.replace('coverage_percent_', '').upper()
            data = tracts_with_coverage[tier]
            logger.info(f"\n{tier_name}:")
            logger.info(f"  Average: {data.mean():.2f}%")
            logger.info(f"  Median: {data.median():.2f}%")
            logger.info(f"  0% coverage: {(data == 0).sum()} tracts")
            logger.info(f"  <50% coverage: {(data < 50).sum()} tracts")
            logger.info(f"  100% coverage: {(data == 100).sum()} tracts")

    logger.info("="*70)


if __name__ == "__main__":
    main()
