"""
Alternative approach: Process existing FCC summary CSV data

If you already have the FCC summary CSV (like the one you showed),
this script converts it to tract-level coverage data.

This is faster than downloading raw hexagon data but less flexible.
"""

import pandas as pd
import geopandas as gpd
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def process_fcc_summary_csv(csv_path: str) -> pd.DataFrame:
    """
    Process FCC summary CSV into coverage data

    Args:
        csv_path: Path to CSV with columns like:
            - geography_type (e.g., "Census Place")
            - geography_id
            - technology
            - speed_25_3 (coverage percentage for 25/3 Mbps)
            etc.

    Returns:
        DataFrame with processed coverage data
    """
    logger.info(f"Loading FCC summary CSV from {csv_path}")
    df = pd.read_csv(csv_path)

    logger.info(f"Loaded {len(df)} rows")
    logger.info(f"Columns: {df.columns.tolist()}")

    # Filter to specific geography type if needed
    if 'geography_type' in df.columns:
        logger.info(f"Geography types: {df['geography_type'].unique()}")

    # Filter to specific technology if needed
    if 'technology' in df.columns:
        logger.info(f"Technologies: {df['technology'].unique()}")

    return df


def extract_tract_coverage_from_summary(
    summary_df: pd.DataFrame,
    technology: str = "Any Technology",
    geography_type: str = "Census Tract"
) -> pd.DataFrame:
    """
    Extract coverage data for census tracts from summary CSV

    Args:
        summary_df: FCC summary data
        technology: Technology type to filter (e.g., "Any Technology", "Fiber")
        geography_type: Geography type (e.g., "Census Tract", "Census Place")

    Returns:
        DataFrame with tract-level coverage
    """
    logger.info(f"Extracting {geography_type} coverage for {technology}")

    # Filter to desired geography and technology
    filtered = summary_df[
        (summary_df['geography_type'] == geography_type) &
        (summary_df['technology'] == technology)
    ].copy()

    logger.info(f"Found {len(filtered)} matching records")

    # Rename columns for clarity
    coverage_df = filtered.rename(columns={
        'geography_id': 'tract_geoid',
        'geography_desc': 'tract_name',
        'speed_25_3': 'coverage_percent_25_3',
        'speed_100_20': 'coverage_percent_100_20',
        'speed_1000_100': 'coverage_percent_1000_100'
    })

    return coverage_df


def join_summary_with_geometries(
    coverage_df: pd.DataFrame,
    tracts_gdf: gpd.GeoDataFrame,
    geoid_column: str = 'GEOID'
) -> gpd.GeoDataFrame:
    """
    Join coverage data with census tract geometries

    Args:
        coverage_df: Coverage data from FCC summary
        tracts_gdf: Census tract geometries
        geoid_column: Column name for tract GEOID in geometries

    Returns:
        GeoDataFrame with coverage data and geometries
    """
    logger.info("Joining coverage data with tract geometries...")

    # Ensure GEOIDs are strings and match format
    coverage_df['tract_geoid'] = coverage_df['tract_geoid'].astype(str).str.zfill(11)
    tracts_gdf[geoid_column] = tracts_gdf[geoid_column].astype(str)

    # Merge
    result = tracts_gdf.merge(
        coverage_df,
        left_on=geoid_column,
        right_on='tract_geoid',
        how='left'
    )

    # Fill NaN coverage values with 0
    coverage_cols = [col for col in result.columns if col.startswith('coverage_percent_')]
    for col in coverage_cols:
        result[col] = result[col].fillna(0)

    logger.info(f"Merged {len(result)} tracts with coverage data")

    return result


def main():
    """Example usage"""

    # Path to your FCC summary CSV
    csv_path = "data/bdc_13_fixed_broadband_summary_by_geography_place_D24_11nov2025.csv"

    # Process the CSV
    summary_df = process_fcc_summary_csv(csv_path)

    # If this is Census Place data, not Census Tract, you'll need the tract-level version
    # Download from: https://broadbandmap.fcc.gov/data-download
    # Select "Summary" -> "Census Tract" -> Georgia

    # Load census tract geometries
    logger.info("Loading census tract geometries...")
    tiger_url = "https://www2.census.gov/geo/tiger/TIGER2023/TRACT/tl_2023_13_tract.zip"
    tracts_gdf = gpd.read_file(tiger_url)

    logger.info(f"Loaded {len(tracts_gdf)} census tracts")

    # If you have tract-level summary data, join it:
    # result = join_summary_with_geometries(tract_coverage_df, tracts_gdf)

    # Save results
    # result.to_file("georgia_tract_coverage_from_summary.gpkg", driver="GPKG")

    logger.info("Done!")


if __name__ == "__main__":
    main()
