"""
Calculate census tract coverage from existing FCC CSV data

This script uses the FCC data you already have in data/ folder.
No downloads or API calls needed!

The CSV has columns:
- provider_id, brand_name, location_id, technology
- max_advertised_download_speed, max_advertised_upload_speed
- low_latency, business_residential_code
- state_usps, block_geoid, h3_res8_id
"""

import pandas as pd
import geopandas as gpd
from pathlib import Path
import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def load_fcc_csv_files(data_dir: str = "data") -> pd.DataFrame:
    """
    Load all FCC CSV files from data directory

    Args:
        data_dir: Directory containing FCC CSV files

    Returns:
        Combined DataFrame with all FCC provider data
    """
    data_path = Path(data_dir)

    # Find all FCC CSV files (they have pattern: bdc_13_*_D24_*.csv)
    fcc_files = list(data_path.glob("florida_fcc_cable.csv"))

    # Exclude summary files
    fcc_files = [f for f in fcc_files if "summary" not in f.name.lower()]

    if not fcc_files:
        logger.error(f"No FCC data files found in {data_path}")
        return pd.DataFrame()

    logger.info(f"Found {len(fcc_files)} FCC data files:")
    for f in fcc_files:
        logger.info(f"  - {f.name}")

    # Load and combine all files
    all_data = []
    for file_path in fcc_files:
        logger.info(f"Loading {file_path.name}...")
        try:
            # Read CSV with special handling for large integers
            # First read with float to get full precision, then convert
            df = pd.read_csv(file_path)

            # Convert block_geoid from scientific notation to proper 15-digit string
            if "block_geoid" in df.columns:
                # Convert to integer first (this reads the full value from scientific notation)
                # Then format as 15-digit string with leading zeros
                df["block_geoid"] = df["block_geoid"].apply(
                    lambda x: format(int(x), "015d") if pd.notna(x) else None
                )

            # Convert h3_res8_id to string
            if "h3_res8_id" in df.columns:
                df["h3_res8_id"] = df["h3_res8_id"].astype(str)

            logger.info(f"  Loaded {len(df):,} rows")
            all_data.append(df)
        except Exception as e:
            logger.error(f"  Error loading {file_path}: {e}")

    if not all_data:
        logger.error("No data loaded")
        return pd.DataFrame()

    # Combine all dataframes
    combined = pd.concat(all_data, ignore_index=True)
    logger.info(f"\nTotal rows: {len(combined):,}")
    logger.info(f"Columns: {combined.columns.tolist()}")

    return combined


def extract_tract_from_block(block_geoid: str) -> str:
    """
    Extract census tract GEOID from block GEOID

    Block GEOID format: SSCCCTTTTTTBBBB (15 digits)
    - SS = State (2 digits)
    - CCC = County (3 digits)
    - TTTTTT = Tract (6 digits)
    - BBBB = Block (4 digits)

    Tract GEOID format: SSCCCTTTTTT (11 digits)
    """
    if pd.isna(block_geoid) or block_geoid == "" or block_geoid == "None":
        return None

    try:
        # Block GEOID should already be formatted as 15-digit string
        block_str = str(block_geoid).strip()

        # Verify it's 15 digits
        if len(block_str) != 15:
            logger.warning(
                f"Block GEOID has unexpected length {len(block_str)}: {block_str}"
            )
            return None

        # Extract first 11 digits (state + county + tract)
        tract_geoid = block_str[:11]

        return tract_geoid
    except (ValueError, TypeError) as e:
        logger.warning(f"Could not parse block GEOID: {block_geoid}, error: {e}")
        return None


def aggregate_to_tract_level(fcc_df: pd.DataFrame) -> pd.DataFrame:
    """
    Aggregate provider-level data to census tract level

    For each tract, calculate:
    - Number of unique blocks with service
    - Number of providers
    - Maximum speeds available
    - Coverage percentage by speed tier

    Args:
        fcc_df: FCC provider-level data

    Returns:
        DataFrame with tract-level aggregated data
    """
    logger.info("Aggregating to census tract level...")

    # Show sample block GEOIDs before processing
    logger.info(f"Sample block GEOIDs: {fcc_df['block_geoid'].head(3).tolist()}")

    # Extract tract GEOID from block GEOID
    fcc_df["tract_geoid"] = fcc_df["block_geoid"].apply(extract_tract_from_block)

    # Show sample tract GEOIDs after extraction
    logger.info(f"Sample tract GEOIDs: {fcc_df['tract_geoid'].head(3).tolist()}")

    # Remove rows with invalid tract IDs
    valid_before = len(fcc_df)
    fcc_df = fcc_df[fcc_df["tract_geoid"].notna()]
    valid_after = len(fcc_df)

    logger.info(f"Valid rows after extraction: {valid_after:,}/{valid_before:,}")
    logger.info(f"Data covers {fcc_df['tract_geoid'].nunique():,} census tracts")

    # Speed tiers
    speed_tiers = {
        "25_3": (25, 3),  # FCC broadband
        "100_20": (100, 20),
        "1000_100": (1000, 100),
    }

    # For each tract, calculate coverage
    tract_coverage = []

    for tract_geoid, tract_data in fcc_df.groupby("tract_geoid"):
        # Get unique blocks in this tract with service
        blocks_with_service = tract_data["block_geoid"].nunique()

        # Get provider count
        provider_count = tract_data["provider_id"].nunique()

        # Get max speeds
        max_down = tract_data["max_advertised_download_speed"].max()
        max_up = tract_data["max_advertised_upload_speed"].max()

        # Calculate which speed tiers are met by ANY provider in ANY block
        tract_row = {
            "tract_geoid": tract_geoid,
            "blocks_with_service": blocks_with_service,
            "provider_count": provider_count,
            "max_download_speed": max_down,
            "max_upload_speed": max_up,
        }

        # For each speed tier, check if ANY block has service at that level
        for tier_name, (min_down, min_up) in speed_tiers.items():
            # Count blocks with service at this tier
            blocks_at_tier = tract_data[
                (tract_data["max_advertised_download_speed"] >= min_down)
                & (tract_data["max_advertised_upload_speed"] >= min_up)
            ]["block_geoid"].nunique()

            tract_row[f"blocks_with_{tier_name}"] = blocks_at_tier
            tract_row[f"has_{tier_name}"] = int(blocks_at_tier > 0)

        tract_coverage.append(tract_row)

    result = pd.DataFrame(tract_coverage)
    logger.info(f"Aggregated to {len(result):,} census tracts")

    return result


def calculate_coverage_percentage(
    tract_coverage: pd.DataFrame, tracts_gdf: gpd.GeoDataFrame
) -> gpd.GeoDataFrame:
    """
    Calculate coverage percentage for each tract

    Coverage % = (blocks with service) / (total blocks in tract) * 100

    Args:
        tract_coverage: Aggregated tract-level data
        tracts_gdf: Census tract geometries with block counts

    Returns:
        GeoDataFrame with coverage percentages
    """
    logger.info("Calculating coverage percentages...")

    # Get total blocks per tract from Census
    # For now, we'll estimate based on the data we have
    # You can download block counts from Census if needed

    # Calculate coverage percentage based on block counts
    for tier in ["25_3", "100_20", "1000_100"]:
        blocks_col = f"blocks_with_{tier}"
        if blocks_col in tract_coverage.columns:
            # Percentage of blocks with service (relative to blocks we observe)
            tract_coverage[f"coverage_percent_{tier}"] = (
                (
                    tract_coverage[blocks_col]
                    / tract_coverage["blocks_with_service"]
                    * 100
                )
                .fillna(0)
                .clip(0, 100)
            )

    # Merge with tract geometries
    logger.info(
        f"Sample tract GEOIDs from Census: {tracts_gdf['GEOID'].head(3).tolist()}"
    )
    logger.info(
        f"Sample tract GEOIDs from coverage data: {tract_coverage['tract_geoid'].head(3).tolist()}"
    )

    result = tracts_gdf.merge(
        tract_coverage, left_on="GEOID", right_on="tract_geoid", how="left"
    )

    # Log merge results
    matched_tracts = result["tract_geoid"].notna().sum()
    total_tracts = len(result)
    logger.info(f"Matched {matched_tracts}/{total_tracts} tracts with coverage data")

    # Fill NaN values with 0 for tracts without service
    numeric_cols = result.select_dtypes(include=["float64", "int64"]).columns
    result[numeric_cols] = result[numeric_cols].fillna(0)

    return result


def load_census_tracts(state_fips: str = "13") -> gpd.GeoDataFrame:
    """
    Load census tracts from US Census

    Args:
        state_fips: Two-digit state FIPS code (13=Georgia, 12=Florida, etc.)
    """
    state_names = {"13": "Georgia", "12": "Florida"}
    state_name = state_names.get(state_fips, f"State {state_fips}")

    logger.info(f"Loading {state_name} census tracts...")

    url = f"https://www2.census.gov/geo/tiger/TIGER2023/TRACT/tl_2023_{state_fips}_tract.zip"

    try:
        tracts = gpd.read_file(url)
        logger.info(f"Loaded {len(tracts)} census tracts")

        if tracts.crs != "EPSG:4326":
            tracts = tracts.to_crs("EPSG:4326")

        return tracts
    except Exception as e:
        logger.error(f"Error loading census tracts: {e}")
        return gpd.GeoDataFrame()


def main():
    """Main execution"""
    logger.info("=" * 70)
    logger.info("Census Tract Coverage Calculator")
    logger.info("Using your existing FCC CSV files")
    logger.info("=" * 70)

    # Step 1: Load FCC CSV data
    fcc_data = load_fcc_csv_files("data")
    if len(fcc_data) == 0:
        logger.error("No FCC data loaded. Exiting.")
        return

    # Detect state from block GEOIDs (first 2 digits)
    sample_blocks = fcc_data['block_geoid'].head(100).apply(lambda x: str(x)[:2])
    state_fips = sample_blocks.mode()[0]  # Most common state code
    logger.info(f"Detected state FIPS code: {state_fips}")

    # Step 2: Aggregate to tract level
    tract_coverage = aggregate_to_tract_level(fcc_data)

    # Step 3: Load census tract geometries for the detected state
    tracts_gdf = load_census_tracts(state_fips=state_fips)
    if len(tracts_gdf) == 0:
        logger.error("Failed to load census tracts. Exiting.")
        return

    # Step 4: Calculate coverage percentages
    tracts_with_coverage = calculate_coverage_percentage(tract_coverage, tracts_gdf)

    # Step 5: Save results
    state_names = {"13": "georgia", "12": "florida"}
    state_name = state_names.get(state_fips, f"state_{state_fips}")

    output_file = Path(f"{state_name}_tract_coverage.gpkg")
    tracts_with_coverage.to_file(output_file, driver="GPKG")
    logger.info(f"\nSaved GeoPackage to: {output_file}")

    # Save simplified CSV with just GEOID and overall coverage
    csv_file = Path(f"{state_name}_tract_coverage.csv")

    # Use 25/3 Mbps as the standard broadband coverage threshold
    coverage_df = tracts_with_coverage[["GEOID", "coverage_percent_25_3"]].copy()
    coverage_df = coverage_df.rename(columns={"coverage_percent_25_3": "coverage"})

    coverage_df.to_csv(csv_file, index=False)
    logger.info(f"Saved CSV to: {csv_file}")

    # Summary statistics
    logger.info("\n" + "=" * 70)
    logger.info("Coverage Summary")
    logger.info("=" * 70)
    logger.info(f"Total census tracts: {len(tracts_with_coverage)}")
    logger.info(
        f"Tracts with service: {(tracts_with_coverage['blocks_with_service'] > 0).sum()}"
    )

    logger.info(
        f"\nAverage providers per tract: {tracts_with_coverage['provider_count'].mean():.1f}"
    )
    logger.info(
        f"Max providers in a tract: {tracts_with_coverage['provider_count'].max():.0f}"
    )

    # Coverage by speed tier
    for tier in ["25_3", "100_20", "1000_100"]:
        has_col = f"has_{tier}"
        if has_col in tracts_with_coverage.columns:
            count = tracts_with_coverage[has_col].sum()
            pct = count / len(tracts_with_coverage) * 100
            logger.info(
                f"\nTracts with {tier.replace('_', '/')} Mbps service: {count:,} ({pct:.1f}%)"
            )

    logger.info("=" * 70)

    # Show top 10 underserved tracts
    logger.info("\nTop 10 Underserved Tracts (least coverage):")
    logger.info("-" * 70)

    underserved = (
        tracts_with_coverage[
            [
                "GEOID",
                "NAME",
                "blocks_with_service",
                "provider_count",
                "max_download_speed",
            ]
        ]
        .sort_values("blocks_with_service")
        .head(10)
    )

    for _, row in underserved.iterrows():
        logger.info(
            f"  {row['GEOID']}: {row['blocks_with_service']:.0f} blocks, "
            f"{row['provider_count']:.0f} providers, "
            f"{row['max_download_speed']:.0f} Mbps max"
        )

    logger.info("=" * 70)


if __name__ == "__main__":
    main()
