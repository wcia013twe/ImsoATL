"""
Unit tests for fcc_filter.py

Tests the FCC Broadband Map API data collection functionality.
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from pathlib import Path
import geopandas as gpd
import pandas as pd
from shapely.geometry import Polygon
import tempfile
import zipfile
import json
import requests

import sys
import os

# Add parent directory to path to import modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.backend.agents.fcc_filter import (
    FCCDataCollector,
    download_fcc_hexagon_data,
    get_fcc_data_for_location,
)


class TestFCCDataCollector:
    """Test FCCDataCollector class methods"""

    @pytest.fixture
    def collector(self):
        """Create a test FCCDataCollector instance"""
        with patch.dict(
            os.environ,
            {"FCC_USERNAME": "test_user", "FCC_API_TOKEN": "test_token"},
        ):
            return FCCDataCollector()

    def test_init_with_credentials(self, collector):
        """Test initialization with credentials"""
        assert collector.username == "test_user"
        assert collector.api_token == "test_token"
        assert collector.api_base == "https://bdc.fcc.gov/api/public/map"

    def test_init_without_credentials(self):
        """Test initialization without credentials"""
        with patch.dict(os.environ, {}, clear=True):
            collector = FCCDataCollector()
            assert collector.username is None
            assert collector.api_token is None

    def test_headers_property(self, collector):
        """Test headers property returns correct format"""
        headers = collector.headers
        assert headers == {"username": "test_user", "hash_value": "test_token"}

    @patch("requests.get")
    def test_list_available_dates_success(self, mock_get, collector):
        """Test listing available dates with successful response"""
        mock_response = Mock()
        mock_response.json.return_value = {
            "data": [
                {"data_type": "availability", "as_of_date": "2024-06-30"},
                {"data_type": "challenge", "as_of_date": "2024-06-30"},
            ],
            "status": "successful",
        }
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        dates = collector.list_available_dates()

        assert len(dates) == 2
        assert dates[0]["data_type"] == "availability"
        mock_get.assert_called_once()

    @patch("requests.get")
    def test_list_available_dates_error(self, mock_get, collector):
        """Test listing available dates with API error"""
        mock_get.side_effect = requests.RequestException("API Error")

        dates = collector.list_available_dates()

        assert dates == []

    @patch("requests.get")
    def test_list_coverage_files_success(self, mock_get, collector):
        """Test listing coverage files with state filter"""
        mock_response = Mock()
        mock_response.json.return_value = {
            "data": [
                {
                    "file_id": "123",
                    "state_fips": "13",
                    "state_name": "Georgia",
                    "category": "State",
                    "subcategory": "Hexagon Coverage",
                },
                {
                    "file_id": "124",
                    "state_fips": "13",
                    "state_name": "Georgia",
                    "category": "State",
                    "subcategory": "Hexagon Coverage",
                },
                {
                    "file_id": "125",
                    "state_fips": "48",
                    "state_name": "Texas",
                    "category": "State",
                    "subcategory": "Hexagon Coverage",
                },
            ],
            "status": "successful",
        }
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        files = collector.list_coverage_files(state_fips="13")

        # Should only return Georgia files
        assert len(files) == 2
        assert all(f["state_fips"] == "13" for f in files)
        mock_get.assert_called_once()

    @patch("requests.get")
    def test_list_coverage_files_no_state_filter(self, mock_get, collector):
        """Test listing coverage files without state filter"""
        mock_response = Mock()
        mock_response.json.return_value = {
            "data": [
                {"file_id": "123", "state_fips": "13"},
                {"file_id": "124", "state_fips": "48"},
            ]
        }
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        files = collector.list_coverage_files(state_fips=None)

        assert len(files) == 2

    @patch("requests.get")
    def test_download_file_success(self, mock_get, collector):
        """Test successful file download"""
        mock_response = Mock()
        mock_response.iter_content = Mock(return_value=[b"test data"])
        mock_response.raise_for_status = Mock()
        mock_get.return_value = mock_response

        file_path = collector.download_file("123", file_type="2")

        assert file_path is not None
        assert file_path.name == "fcc_123.zip"
        assert file_path.exists()

        # Cleanup
        file_path.unlink(missing_ok=True)

    @patch("requests.get")
    def test_download_file_error(self, mock_get, collector):
        """Test file download with error"""
        mock_get.side_effect = requests.RequestException("Download failed")

        file_path = collector.download_file("123")

        assert file_path is None

    def test_extract_gis_file_success(self, collector):
        """Test successful GeoPackage extraction"""
        # Create a test zip file with a .gpkg file
        temp_dir = Path(tempfile.gettempdir())
        zip_path = temp_dir / "test_fcc.zip"
        gpkg_name = "test_coverage.gpkg"

        # Create a dummy .gpkg file inside zip
        with zipfile.ZipFile(zip_path, "w") as zf:
            zf.writestr(gpkg_name, b"dummy geopackage data")

        # Extract
        gpkg_path = collector.extract_gis_file(zip_path)

        assert gpkg_path is not None
        assert gpkg_path.name == gpkg_name
        assert gpkg_path.exists()

        # Cleanup
        import shutil

        shutil.rmtree(
            zip_path.parent / f"{zip_path.stem}_extracted", ignore_errors=True
        )
        zip_path.unlink(missing_ok=True)

    def test_extract_gis_file_no_gpkg(self, collector):
        """Test extraction when no .gpkg file exists"""
        temp_dir = Path(tempfile.gettempdir())
        zip_path = temp_dir / "test_no_gpkg.zip"

        # Create zip without .gpkg file
        with zipfile.ZipFile(zip_path, "w") as zf:
            zf.writestr("readme.txt", b"no geopackage here")

        gpkg_path = collector.extract_gis_file(zip_path)

        assert gpkg_path is None

        # Cleanup
        import shutil

        shutil.rmtree(
            zip_path.parent / f"{zip_path.stem}_extracted", ignore_errors=True
        )
        zip_path.unlink(missing_ok=True)


class TestDownloadFCCHexagonData:
    """Test download_fcc_hexagon_data function"""

    @patch("app.backend.agents.fcc_filter.FCCDataCollector")
    @patch("geopandas.read_file")
    def test_download_hexagon_data_success(self, mock_read_file, mock_collector_class):
        """Test successful hexagon data download"""
        # Mock collector
        mock_collector = Mock()
        mock_collector_class.return_value = mock_collector

        # Mock list_coverage_files
        mock_collector.list_coverage_files.return_value = [
            {"file_id": "123", "state_fips": "13"},
            {"file_id": "124", "state_fips": "13"},
        ]

        # Mock download_file
        mock_collector.download_file.return_value = Path("/tmp/test.zip")

        # Mock extract_gis_file
        mock_collector.extract_gis_file.return_value = Path("/tmp/test.gpkg")

        # Mock GeoDataFrame
        test_polygon = Polygon([(0, 0), (1, 0), (1, 1), (0, 1)])
        mock_gdf = gpd.GeoDataFrame(
            {
                "h3_id": ["abc123", "def456"],
                "coverage": [85, 60],
                "geometry": [test_polygon, test_polygon],
            },
            crs="EPSG:4326",
        )
        mock_read_file.return_value = mock_gdf

        # Run function
        result = download_fcc_hexagon_data("13")

        # Assertions
        assert isinstance(result, gpd.GeoDataFrame)
        assert len(result) > 0
        mock_collector.list_coverage_files.assert_called_once()

    @patch("app.backend.agents.fcc_filter.FCCDataCollector")
    def test_download_hexagon_data_no_files(self, mock_collector_class):
        """Test when no files are found"""
        mock_collector = Mock()
        mock_collector_class.return_value = mock_collector
        mock_collector.list_coverage_files.return_value = []

        result = download_fcc_hexagon_data("99")

        assert isinstance(result, gpd.GeoDataFrame)
        assert len(result) == 0


class TestGetFCCDataForLocation:
    """Test get_fcc_data_for_location function"""

    @patch("app.backend.agents.fcc_filter.download_fcc_hexagon_data")
    def test_get_fcc_data_with_valid_query(self, mock_download):
        """Test getting FCC data with valid parsed query"""
        mock_download.return_value = gpd.GeoDataFrame({"test": [1, 2, 3]})

        parsed_query = {
            "state_fips": "13",
            "geography": "Atlanta, Georgia",
            "coverage_threshold": 50,
        }

        result = get_fcc_data_for_location(parsed_query)

        assert isinstance(result, gpd.GeoDataFrame)
        assert len(result) == 3
        mock_download.assert_called_once_with("13")

    @patch("app.backend.agents.fcc_filter.download_fcc_hexagon_data")
    def test_get_fcc_data_missing_state_fips(self, mock_download):
        """Test getting FCC data without state_fips"""
        parsed_query = {"geography": "Atlanta, Georgia"}

        result = get_fcc_data_for_location(parsed_query)

        assert isinstance(result, gpd.GeoDataFrame)
        assert len(result) == 0
        mock_download.assert_not_called()

    @patch("app.backend.agents.fcc_filter.download_fcc_hexagon_data")
    def test_get_fcc_data_with_different_states(self, mock_download):
        """Test getting FCC data for different states"""
        mock_download.return_value = gpd.GeoDataFrame()

        test_cases = [
            {"state_fips": "48", "geography": "Austin, Texas"},
            {"state_fips": "06", "geography": "Los Angeles, California"},
            {"state_fips": "36", "geography": "New York, New York"},
        ]

        for query in test_cases:
            get_fcc_data_for_location(query)

        assert mock_download.call_count == 3


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
