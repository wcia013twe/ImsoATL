"""
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
