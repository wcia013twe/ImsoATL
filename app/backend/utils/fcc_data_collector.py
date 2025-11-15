"""
FCC Broadband Coverage Data Collection

This module downloads and processes FCC National Broadband Map data
to identify areas with low broadband coverage.
"""

import os
import requests
import geopandas as gpd
import pandas as pd
import tempfile
import zipfile
from pathlib import Path
from typing import Optional, List
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FCCDataCollector:
    """Handles FCC Broadband Map API interactions"""

    def __init__(self):
        self.api_base = "https://bdc.fcc.gov/api/public/map"
        self.username = os.getenv("FCC_USERNAME")
        self.api_token = os.getenv("FCC_API_TOKEN")

        if not self.username or not self.api_token:
            logger.warning("FCC credentials not found in environment variables")

    @property
    def headers(self):
        """API request headers"""
        return {"username": self.username, "hash_value": self.api_token}

    def list_available_dates(self) -> List[dict]:
        """
        Get list of available data snapshot dates from FCC

        Returns:
            List of available dates with data types
        """
        url = f"{self.api_base}/listAsOfDates"

        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            data = response.json()
            return data.get("data", [])
        except requests.RequestException as e:
            logger.error(f"Error fetching available dates: {e}")
            return []

    def list_coverage_files(
        self,
        as_of_date: str = "2025-11-15",
        state_fips: Optional[str] = None,
        category: str = "State",
        subcategory: str = "Hexagon Coverage",
        technology_type: str = "Fixed Broadband",
    ) -> List[dict]:
        """
        List available FCC coverage files for download

        Args:
            as_of_date: Data snapshot date (YYYY-MM-DD)
            state_fips: Two-digit state FIPS code (e.g., "13" for Georgia)
            category: Data category (default: "State")
            subcategory: Data subcategory (default: "Hexagon Coverage")
            technology_type: Type of broadband (default: "Fixed Broadband")

        Returns:
            List of available files with metadata
        """
        url = f"{self.api_base}/downloads/listAvailabilityData/{as_of_date}"

        params = {
            "category": category,
            "subcategory": subcategory,
            "technology_type": technology_type,
        }

        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            data = response.json()
            files = data.get("data", [])

            # Filter by state if specified
            if state_fips:
                files = [f for f in files if f.get("state_fips") == state_fips]

            logger.info(f"Found {len(files)} files for state FIPS {state_fips}")
            return files

        except requests.RequestException as e:
            logger.error(f"Error listing coverage files: {e}")
            return []

    def download_file(
        self,
        file_id: str,
        data_type: str = "availability",
        file_type: str = "2",  # 1=Shapefile, 2=GeoPackage
    ) -> Optional[Path]:
        """
        Download a specific FCC data file

        Args:
            file_id: Unique file identifier from list_coverage_files()
            data_type: Type of data ("availability" or "challenge")
            file_type: GIS format (1=Shapefile, 2=GeoPackage)

        Returns:
            Path to downloaded file, or None if download failed
        """
        url = (
            f"{self.api_base}/downloads/downloadFile/{data_type}/{file_id}/{file_type}"
        )

        try:
            logger.info(f"Downloading file ID {file_id}...")
            response = requests.get(url, headers=self.headers, stream=True)
            response.raise_for_status()

            # Create temporary file
            temp_dir = tempfile.gettempdir()
            temp_file = Path(temp_dir) / f"fcc_{file_id}.zip"

            # Save file
            with open(temp_file, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)

            logger.info(f"Downloaded to {temp_file}")
            return temp_file

        except requests.RequestException as e:
            logger.error(f"Error downloading file {file_id}: {e}")
            return None

    def extract_gis_file(self, zip_path: Path) -> Optional[Path]:
        """
        Extract GIS file from downloaded zip archive

        Args:
            zip_path: Path to downloaded zip file

        Returns:
            Path to extracted .gpkg file, or None if extraction failed
        """
        try:
            extract_dir = zip_path.parent / f"{zip_path.stem}_extracted"
            extract_dir.mkdir(exist_ok=True)

            with zipfile.ZipFile(zip_path, "r") as zip_ref:
                zip_ref.extractall(extract_dir)

            # Find .gpkg file
            gpkg_files = list(extract_dir.glob("*.gpkg"))
            if gpkg_files:
                logger.info(f"Extracted GeoPackage: {gpkg_files[0]}")
                return gpkg_files[0]

            logger.warning("No .gpkg file found in archive")
            return None

        except Exception as e:
            logger.error(f"Error extracting file: {e}")
            return None


def download_fcc_hexagon_data(
    state_fips: str, as_of_date: str = "2024-06-30"
) -> gpd.GeoDataFrame:
    """
    Download FCC hexagon coverage data for a specific state

    Args:
        state_fips: Two-digit state FIPS code (e.g., "13" for Georgia)
        as_of_date: Data snapshot date in YYYY-MM-DD format

    Returns:
        GeoDataFrame containing H3 hexagon coverage data with FCC metrics
    """
    collector = FCCDataCollector()

    # List available coverage files for the state
    files = collector.list_coverage_files(as_of_date=as_of_date, state_fips=state_fips)

    if not files:
        logger.warning(f"No coverage files found for state {state_fips}")
        return gpd.GeoDataFrame()

    # Download and combine all coverage files for the state
    gdfs = []

    for file_info in files[:5]:  # Limit to first 5 files for testing
        file_id = file_info.get("file_id")

        # Download file
        zip_path = collector.download_file(file_id, file_type="2")
        if not zip_path:
            continue

        # Extract GeoPackage
        gpkg_path = collector.extract_gis_file(zip_path)
        if not gpkg_path:
            continue

        # Load into GeoDataFrame
        try:
            gdf = gpd.read_file(gpkg_path)
            gdfs.append(gdf)
            logger.info(f"Loaded {len(gdf)} hexagons from file {file_id}")
        except Exception as e:
            logger.error(f"Error loading GeoPackage {gpkg_path}: {e}")

    # Combine all GeoDataFrames
    if gdfs:
        combined_gdf = gpd.GeoDataFrame(
            pd.concat(gdfs, ignore_index=True), crs=gdfs[0].crs
        )
        logger.info(f"Total hexagons loaded: {len(combined_gdf)}")
        return combined_gdf

    return gpd.GeoDataFrame()


def get_fcc_data_for_location(parsed_query: dict) -> gpd.GeoDataFrame:
    """
    Get FCC coverage data for a specific location using parsed query data

    Args:
        parsed_query: Dictionary from query_parse.py containing:
            - state_fips: Two-digit state FIPS code
            - geography: Location string
            - coverage_threshold: Optional coverage threshold

    Returns:
        GeoDataFrame with hexagon coverage data for that state
    """
    state_fips = parsed_query.get("state_fips")

    if not state_fips:
        logger.error("No state_fips found in parsed query")
        return gpd.GeoDataFrame()

    logger.info(
        f"Fetching FCC data for {parsed_query.get('geography', 'unknown location')}"
    )

    return download_fcc_hexagon_data(state_fips)
