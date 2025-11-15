"""
Census Data Collection

This module fetches census tract boundaries and demographic data
from the US Census Bureau API.
"""

import os
import requests
import geopandas as gpd
import pandas as pd
from pathlib import Path
from typing import Optional
import logging
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CensusDataCollector:
    """Handles US Census Bureau API interactions"""

    def __init__(self):
        self.api_base = "https://api.census.gov/data"
        self.tiger_base = "https://tigerweb.geo.census.gov/arcgis/rest/services"
        self.api_key = os.getenv("CENSUS_API_KEY")

        if not self.api_key:
            logger.warning("CENSUS_API_KEY not found - API may have rate limits")

    def get_tract_boundaries(
        self, state_fips: str, year: int = 2023
    ) -> gpd.GeoDataFrame:
        """
        Fetch census tract boundaries for a state using Census TIGER/Line API

        Args:
            state_fips: Two-digit state FIPS code (e.g., "13" for Georgia)
            year: Census year (default: 2020)

        Returns:
            GeoDataFrame with tract geometries and GEOID
        """
        logger.info(f"Fetching tract boundaries for state {state_fips}, year {year}")

        # Use Census Cartographic Boundary Files API
        # Format: https://www2.census.gov/geo/tiger/GENZ{year}/shp/cb_{year}_13_tract_500k.zip
        url = f"https://www2.census.gov/geo/tiger/GENZ{year}/shp/cb_{year}_{state_fips}_tract_500k.zip"

        try:
            # Download shapefile
            logger.info(f"Downloading tract boundaries from {url}")
            gdf = gpd.read_file(url)

            logger.info(f"Loaded {len(gdf)} census tracts for state {state_fips}")

            # Standardize column names
            if "GEOID" not in gdf.columns and "TRACTCE" in gdf.columns:
                # Construct GEOID from state + county + tract codes
                gdf["GEOID"] = (
                    gdf["STATEFP"].astype(str)
                    + gdf["COUNTYFP"].astype(str)
                    + gdf["TRACTCE"].astype(str)
                )

            # Ensure proper CRS
            if gdf.crs is None:
                gdf = gdf.set_crs("EPSG:4326")
            elif gdf.crs.to_string() != "EPSG:4326":
                gdf = gdf.to_crs("EPSG:4326")

            return gdf

        except Exception as e:
            logger.error(f"Error fetching tract boundaries: {e}")
            return gpd.GeoDataFrame()

    def get_demographic_data(
        self, state_fips: str, year: int = 2021, dataset: str = "acs/acs5"
    ) -> pd.DataFrame:
        """
        Fetch demographic data for all census tracts in a state

        Args:
            state_fips: Two-digit state FIPS code
            year: Data year (default: 2021 for most recent ACS 5-year)
            dataset: Census dataset (default: "acs/acs5" for American Community Survey)

        Returns:
            DataFrame with demographic variables by census tract
        """
        logger.info(f"Fetching demographic data for state {state_fips}, year {year}")

        # Census API variables
        # B01003_001E: Total population
        # B19013_001E: Median household income
        # B17001_002E: Population below poverty level
        # B17001_001E: Total population for poverty calculation
        variables = [
            "NAME",
            "B01003_001E",  # Total population
            "B19013_001E",  # Median household income
            "B17001_002E",  # Below poverty
            "B17001_001E",  # Total for poverty calc
        ]

        url = f"{self.api_base}/{year}/{dataset}"

        params = {
            "get": ",".join(variables),
            "for": "tract:*",
            "in": f"state:{state_fips}",
        }

        if self.api_key:
            params["key"] = self.api_key

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()

            # Convert to DataFrame
            headers = data[0]
            rows = data[1:]
            df = pd.DataFrame(rows, columns=headers)

            # Create GEOID from state + county + tract
            df["GEOID"] = df["state"] + df["county"] + df["tract"]

            # Rename and convert columns
            df = df.rename(
                columns={
                    "B01003_001E": "population",
                    "B19013_001E": "median_income",
                    "B17001_002E": "poverty_count",
                    "B17001_001E": "poverty_total",
                }
            )

            # Convert to numeric
            numeric_cols = [
                "population",
                "median_income",
                "poverty_count",
                "poverty_total",
            ]
            for col in numeric_cols:
                df[col] = pd.to_numeric(df[col], errors="coerce")

            # Calculate poverty rate (as percentage)
            df["poverty_rate"] = (
                df["poverty_count"] / df["poverty_total"] * 100
            ).fillna(0)

            # Select final columns
            df = df[["GEOID", "NAME", "population", "median_income", "poverty_rate"]]

            logger.info(f"Fetched demographic data for {len(df)} census tracts")

            return df

        except requests.RequestException as e:
            logger.error(f"Error fetching demographic data: {e}")
            return pd.DataFrame()
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            logger.error(f"Error parsing Census API response: {e}")
            return pd.DataFrame()

    def get_tracts_with_demographics(
        self, state_fips: str, boundary_year: int = 2020, demographic_year: int = 2021
    ) -> gpd.GeoDataFrame:
        """
        Get census tracts with both boundaries and demographic data

        Args:
            state_fips: Two-digit state FIPS code
            boundary_year: Year for tract boundaries (default: 2020)
            demographic_year: Year for demographic data (default: 2021)

        Returns:
            GeoDataFrame with tract geometries and demographic variables
        """
        # Get boundaries
        boundaries_gdf = self.get_tract_boundaries(state_fips, boundary_year)

        if len(boundaries_gdf) == 0:
            logger.error("Failed to fetch tract boundaries")
            return gpd.GeoDataFrame()

        # Get demographics
        demographics_df = self.get_demographic_data(state_fips, demographic_year)

        if len(demographics_df) == 0:
            logger.error("Failed to fetch demographic data")
            return boundaries_gdf  # Return boundaries only

        # Merge on GEOID
        combined_gdf = boundaries_gdf.merge(demographics_df, on="GEOID", how="left")

        logger.info(f"Combined {len(combined_gdf)} tracts with demographics")

        return combined_gdf


def download_census_tract_data(
    state_fips: str,
    save_dir: Optional[Path] = None,
    boundary_year: int = 2020,
    demographic_year: int = 2021,
) -> gpd.GeoDataFrame:
    """
    Download census tract data for a state and save to disk

    Args:
        state_fips: Two-digit state FIPS code (e.g., "13" for Georgia)
        save_dir: Directory to save data (default: app/data/census)
        boundary_year: Year for tract boundaries
        demographic_year: Year for demographic data

    Returns:
        GeoDataFrame with tract boundaries and demographics
    """
    collector = CensusDataCollector()

    # Get combined data
    gdf = collector.get_tracts_with_demographics(
        state_fips, boundary_year, demographic_year
    )

    if len(gdf) == 0:
        logger.warning(f"No census data retrieved for state {state_fips}")
        return gpd.GeoDataFrame()

    # Save to disk if directory provided
    if save_dir:
        save_dir = Path(save_dir)
        save_dir.mkdir(parents=True, exist_ok=True)

        # Save as GeoPackage
        output_file = save_dir / f"census_tracts_{state_fips}_{boundary_year}.gpkg"
        gdf.to_file(output_file, driver="GPKG")
        logger.info(f"Saved census data to {output_file}")

        # Also save as GeoJSON for web use
        geojson_file = save_dir / f"census_tracts_{state_fips}_{boundary_year}.geojson"
        gdf.to_file(geojson_file, driver="GeoJSON")
        logger.info(f"Saved GeoJSON to {geojson_file}")

    return gdf


def get_census_data_for_location(
    parsed_query: dict, save_dir: Optional[Path] = None
) -> gpd.GeoDataFrame:
    """
    Get census tract data for a location using parsed query data

    Args:
        parsed_query: Dictionary from query_parse.py containing:
            - state_fips: Two-digit state FIPS code
            - geography: Location string
        save_dir: Optional directory to save data

    Returns:
        GeoDataFrame with census tract data for that state
    """
    state_fips = parsed_query.get("state_fips")

    if not state_fips:
        logger.error("No state_fips found in parsed query")
        return gpd.GeoDataFrame()

    logger.info(
        f"Fetching census data for {parsed_query.get('geography', 'unknown location')}"
    )

    return download_census_tract_data(state_fips, save_dir)
