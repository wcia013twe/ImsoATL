"""
Calculate broadband coverage percentage for all census tracts in Georgia

This script:
1. Downloads FCC broadband data (H3 hexagons) for Georgia
2. Loads census tract geometries for Georgia
3. Calculates coverage percentage for each tract by:
   - Intersecting hexagons with tract boundaries
   - Aggregating provider data to determine if hexagons have service
   - Computing what % of tract area has broadband coverage
"""

import os
import sys
import geopandas as gpd
import pandas as pd
from pathlib import Path
import logging
from typing import Optional, Dict

# Add app directory to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.backend.agents.fcc_filter import FCCDataCollector
from app.backend.config import FCC_DATA_DIR

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def load_georgia_census_tracts() -> gpd.GeoDataFrame:
    """
    Load census tract geometries for Georgia from US Census Bureau

    Returns:
        GeoDataFrame with census tract geometries and metadata
    """
    logger.info("Loading Georgia census tracts...")

    # Option 1: Load from Census TIGER/Line files
    # You can download from: https://www2.census.gov/geo/tiger/TIGER2023/TRACT/
    tiger_url = "https://www2.census.gov/geo/tiger/TIGER2023/TRACT/tl_2023_13_tract.zip"

    try:
        tracts_gdf = gpd.read_file(tiger_url)
        logger.info(f"Loaded {len(tracts_gdf)} census tracts for Georgia")

        # Ensure projected to WGS84 for consistency with FCC data
        if tracts_gdf.crs != "EPSG:4326":
            tracts_gdf = tracts_gdf.to_crs("EPSG:4326")

        return tracts_gdf

    except Exception as e:
        logger.error(f"Error loading census tracts: {e}")
        return gpd.GeoDataFrame()


def download_all_fcc_data_for_georgia(
    as_of_date: str = "2024-06-30",
    limit_files: Optional[int] = None
) -> gpd.GeoDataFrame:
    """
    Download all FCC broadband data for Georgia

    Args:
        as_of_date: Data snapshot date (YYYY-MM-DD)
        limit_files: Optional limit on number of files to download (for testing)

    Returns:
        GeoDataFrame with all H3 hexagon data for Georgia
    """
    state_fips = "13"  # Georgia
    collector = FCCDataCollector()

    logger.info(f"Fetching FCC data files for Georgia (as of {as_of_date})...")
    files = collector.list_coverage_files(as_of_date=as_of_date, state_fips=state_fips)

    if not files:
        logger.warning("No FCC files found for Georgia")
        return gpd.GeoDataFrame()

    logger.info(f"Found {len(files)} files for Georgia")

    if limit_files:
        files = files[:limit_files]
        logger.info(f"Limiting to first {limit_files} files for testing")

    # Download and combine all files
    all_hexagons = []

    for i, file_info in enumerate(files, 1):
        file_id = file_info.get("file_id")
        logger.info(f"Processing file {i}/{len(files)}: {file_id}")

        # Download
        zip_path = collector.download_file(file_id, file_type="2")
        if not zip_path:
            continue

        # Extract
        gpkg_path = collector.extract_gis_file(zip_path)
        if not gpkg_path:
            continue

        # Load
        try:
            gdf = gpd.read_file(gpkg_path)
            all_hexagons.append(gdf)
            logger.info(f"  Loaded {len(gdf)} records")
        except Exception as e:
            logger.error(f"  Error loading {gpkg_path}: {e}")

    # Combine all data
    if all_hexagons:
        combined = gpd.GeoDataFrame(
            pd.concat(all_hexagons, ignore_index=True),
            crs=all_hexagons[0].crs
        )
        logger.info(f"Total records loaded: {len(combined)}")

        # Save combined data
        output_file = FCC_DATA_DIR / f"fcc_georgia_all_{as_of_date}.gpkg"
        combined.to_file(output_file, driver="GPKG")
        logger.info(f"Saved combined data to {output_file}")

        return combined

    return gpd.GeoDataFrame()


def aggregate_hexagon_coverage(hexagons_gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """
    Aggregate provider-level data to hexagon-level coverage

    Each hexagon may have multiple rows (one per provider). This function:
    - Groups by hexagon ID (h3_res8_id or location_id)
    - Determines if hexagon has service at various speed tiers
    - Creates one row per hexagon with coverage flags

    Args:
        hexagons_gdf: Raw FCC data with provider-level records

    Returns:
        GeoDataFrame with one row per hexagon and coverage indicators
    """
    logger.info("Aggregating provider data to hexagon-level coverage...")

    # Identify the hexagon ID column
    hex_id_col = None
    for col in ['h3_res8_id', 'location_id', 'block_geoid']:
        if col in hexagons_gdf.columns:
            hex_id_col = col
            break

    if not hex_id_col:
        logger.error("No hexagon ID column found!")
        return hexagons_gdf

    logger.info(f"Using '{hex_id_col}' as hexagon identifier")

    # Speed tiers (Mbps down/up)
    speed_tiers = {
        'has_2_0.2': (2, 0.2),
        'has_10_1': (10, 1),
        'has_25_3': (25, 3),      # FCC broadband definition
        'has_100_20': (100, 20),
        'has_250_25': (250, 25),
        'has_1000_100': (1000, 100)
    }

    # Group by hexagon and aggregate
    def aggregate_hexagon(group):
        """Aggregate providers within a hexagon"""
        # Get maximum speeds available in this hexagon
        max_down = group['max_advertised_download_speed'].max()
        max_up = group['max_advertised_upload_speed'].max()

        # Determine which speed tiers are met
        result = {
            hex_id_col: group[hex_id_col].iloc[0],
            'max_down_speed': max_down,
            'max_up_speed': max_up,
            'provider_count': group['provider_id'].nunique() if 'provider_id' in group.columns else len(group),
            'geometry': group.geometry.iloc[0]  # Keep geometry
        }

        # Check each speed tier
        for tier_name, (min_down, min_up) in speed_tiers.items():
            result[tier_name] = int(max_down >= min_down and max_up >= min_up)

        return pd.Series(result)

    # Perform aggregation
    aggregated = hexagons_gdf.groupby(hex_id_col, group_keys=False).apply(aggregate_hexagon)
    aggregated_gdf = gpd.GeoDataFrame(aggregated, geometry='geometry', crs=hexagons_gdf.crs)

    logger.info(f"Aggregated to {len(aggregated_gdf)} unique hexagons")

    return aggregated_gdf


def calculate_tract_coverage(
    tracts_gdf: gpd.GeoDataFrame,
    hexagons_gdf: gpd.GeoDataFrame
) -> gpd.GeoDataFrame:
    """
    Calculate coverage percentage for each census tract

    Method:
    1. Intersect hexagons with census tracts
    2. For hexagons with broadband (25/3 Mbps), calculate coverage area
    3. Compute coverage % = (covered area) / (total tract area)

    Args:
        tracts_gdf: Census tract geometries
        hexagons_gdf: Aggregated hexagon data with coverage flags

    Returns:
        Census tracts with coverage percentages added
    """
    logger.info("Calculating coverage for each census tract...")

    # Ensure same CRS
    if tracts_gdf.crs != hexagons_gdf.crs:
        hexagons_gdf = hexagons_gdf.to_crs(tracts_gdf.crs)

    # Filter to hexagons with broadband service (25/3 Mbps)
    if 'has_25_3' in hexagons_gdf.columns:
        broadband_hexagons = hexagons_gdf[hexagons_gdf['has_25_3'] == 1].copy()
        logger.info(f"Found {len(broadband_hexagons)} hexagons with 25/3 Mbps service")
    else:
        logger.warning("No 'has_25_3' column found, using all hexagons")
        broadband_hexagons = hexagons_gdf.copy()

    # Intersect hexagons with tracts
    logger.info("Performing spatial intersection...")
    intersections = gpd.overlay(
        tracts_gdf[['GEOID', 'NAME', 'geometry']],
        broadband_hexagons[['geometry']],
        how='intersection'
    )

    # Calculate intersection areas
    logger.info("Calculating coverage areas...")
    # Use equal-area projection for accurate area calculation
    intersections_projected = intersections.to_crs('EPSG:5070')  # Albers Equal Area
    intersections_projected['covered_area'] = intersections_projected.geometry.area

    # Sum covered area by tract
    coverage_by_tract = intersections_projected.groupby('GEOID').agg({
        'covered_area': 'sum'
    }).reset_index()

    # Calculate total tract areas
    tracts_projected = tracts_gdf.to_crs('EPSG:5070')
    tracts_projected['total_area'] = tracts_projected.geometry.area

    # Merge and calculate percentages
    tracts_with_coverage = tracts_gdf.merge(
        tracts_projected[['GEOID', 'total_area']],
        on='GEOID',
        how='left'
    )

    tracts_with_coverage = tracts_with_coverage.merge(
        coverage_by_tract,
        on='GEOID',
        how='left'
    )

    # Calculate coverage percentage
    tracts_with_coverage['covered_area'] = tracts_with_coverage['covered_area'].fillna(0)
    tracts_with_coverage['coverage_percent_25_3'] = (
        tracts_with_coverage['covered_area'] / tracts_with_coverage['total_area'] * 100
    ).clip(0, 100)  # Ensure 0-100 range

    # Calculate coverage for other speed tiers
    for tier in ['has_2_0.2', 'has_10_1', 'has_100_20', 'has_250_25', 'has_1000_100']:
        if tier in hexagons_gdf.columns:
            tier_hexagons = hexagons_gdf[hexagons_gdf[tier] == 1].copy()

            tier_intersections = gpd.overlay(
                tracts_gdf[['GEOID', 'geometry']],
                tier_hexagons[['geometry']],
                how='intersection'
            )

            tier_intersections_proj = tier_intersections.to_crs('EPSG:5070')
            tier_intersections_proj['area'] = tier_intersections_proj.geometry.area

            tier_coverage = tier_intersections_proj.groupby('GEOID')['area'].sum().reset_index()
            tier_coverage.columns = ['GEOID', f'covered_area_{tier}']

            tracts_with_coverage = tracts_with_coverage.merge(
                tier_coverage,
                on='GEOID',
                how='left'
            )

            tracts_with_coverage[f'covered_area_{tier}'] = tracts_with_coverage[f'covered_area_{tier}'].fillna(0)
            tracts_with_coverage[f'coverage_percent_{tier}'] = (
                tracts_with_coverage[f'covered_area_{tier}'] / tracts_with_coverage['total_area'] * 100
            ).clip(0, 100)

    # Clean up intermediate columns
    area_cols = [col for col in tracts_with_coverage.columns if col.startswith('covered_area')]
    tracts_with_coverage = tracts_with_coverage.drop(columns=area_cols + ['total_area'])

    # Log summary
    avg_coverage = tracts_with_coverage['coverage_percent_25_3'].mean()
    tracts_with_service = (tracts_with_coverage['coverage_percent_25_3'] > 0).sum()
    logger.info(f"Average coverage (25/3 Mbps): {avg_coverage:.2f}%")
    logger.info(f"Tracts with some coverage: {tracts_with_service}/{len(tracts_with_coverage)}")

    return tracts_with_coverage


def main():
    """Main execution function"""
    logger.info("="*60)
    logger.info("Georgia Census Tract Broadband Coverage Calculator")
    logger.info("="*60)

    # Step 1: Load census tracts
    tracts = load_georgia_census_tracts()
    if len(tracts) == 0:
        logger.error("Failed to load census tracts")
        return

    # Step 2: Download FCC data (or load from cache)
    fcc_data_file = FCC_DATA_DIR / "fcc_georgia_all_2024-06-30.gpkg"

    if fcc_data_file.exists():
        logger.info(f"Loading cached FCC data from {fcc_data_file}")
        hexagons = gpd.read_file(fcc_data_file)
    else:
        # Download fresh data (limit to 5 files for testing)
        hexagons = download_all_fcc_data_for_georgia(limit_files=5)

    if len(hexagons) == 0:
        logger.error("Failed to load FCC hexagon data")
        return

    # Step 3: Aggregate hexagon coverage
    hexagons_agg = aggregate_hexagon_coverage(hexagons)

    # Step 4: Calculate tract coverage
    tracts_with_coverage = calculate_tract_coverage(tracts, hexagons_agg)

    # Step 5: Save results
    output_file = Path("georgia_tract_coverage.gpkg")
    tracts_with_coverage.to_file(output_file, driver="GPKG")
    logger.info(f"Saved results to {output_file}")

    # Also save as CSV for easy viewing
    csv_file = Path("georgia_tract_coverage.csv")
    coverage_df = tracts_with_coverage.drop(columns=['geometry'])
    coverage_df.to_csv(csv_file, index=False)
    logger.info(f"Saved CSV to {csv_file}")

    # Print summary statistics
    logger.info("\n" + "="*60)
    logger.info("Coverage Summary (25/3 Mbps Broadband)")
    logger.info("="*60)
    logger.info(f"Total census tracts: {len(tracts_with_coverage)}")
    logger.info(f"Average coverage: {tracts_with_coverage['coverage_percent_25_3'].mean():.2f}%")
    logger.info(f"Median coverage: {tracts_with_coverage['coverage_percent_25_3'].median():.2f}%")
    logger.info(f"Min coverage: {tracts_with_coverage['coverage_percent_25_3'].min():.2f}%")
    logger.info(f"Max coverage: {tracts_with_coverage['coverage_percent_25_3'].max():.2f}%")
    logger.info(f"\nTracts with 0% coverage: {(tracts_with_coverage['coverage_percent_25_3'] == 0).sum()}")
    logger.info(f"Tracts with <50% coverage: {(tracts_with_coverage['coverage_percent_25_3'] < 50).sum()}")
    logger.info(f"Tracts with 100% coverage: {(tracts_with_coverage['coverage_percent_25_3'] == 100).sum()}")
    logger.info("="*60)


if __name__ == "__main__":
    main()
