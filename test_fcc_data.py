"""
Test script to explore FCC data structure
"""

import sys
import os

# Add app directory to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.backend.agents.fcc_filter import FCCDataCollector, download_fcc_hexagon_data
from app.backend.config import FCC_DATA_DIR

def test_fcc_api():
    """Test FCC API and explore data structure"""
    print("=" * 60)
    print("Testing FCC Broadband Map API")
    print("=" * 60)

    collector = FCCDataCollector()

    # Test 1: List available dates
    print("\n1. Available data snapshot dates:")
    print("-" * 60)
    dates = collector.list_available_dates()
    if dates:
        for date_info in dates[:5]:  # Show first 5
            print(f"  - {date_info.get('data_type')}: {date_info.get('as_of_date')}")
    else:
        print("  No dates found (API credentials may be needed)")

    # Test 2: List coverage files for Georgia (FIPS: 13)
    print("\n2. Coverage files for Georgia (state FIPS: 13):")
    print("-" * 60)
    state_fips = "13"
    files = collector.list_coverage_files(state_fips=state_fips)

    if files:
        print(f"  Found {len(files)} files for Georgia")
        # Show first file details
        if len(files) > 0:
            first_file = files[0]
            print(f"\n  Sample file metadata:")
            for key, value in first_file.items():
                print(f"    {key}: {value}")
    else:
        print("  No files found (API credentials may be needed)")

    # Test 3: Download a small sample and inspect data
    print("\n3. Downloading sample FCC hexagon data (limited to 1 file):")
    print("-" * 60)

    if files and len(files) > 0:
        # Download just the first file to inspect structure
        file_id = files[0].get("file_id")
        print(f"  Downloading file ID: {file_id}")

        zip_path = collector.download_file(file_id, file_type="2")

        if zip_path:
            print(f"  Downloaded to: {zip_path}")

            # Extract
            gpkg_path = collector.extract_gis_file(zip_path)

            if gpkg_path:
                print(f"  Extracted to: {gpkg_path}")

                # Load and inspect
                import geopandas as gpd
                gdf = gpd.read_file(gpkg_path)

                print(f"\n  Data Structure:")
                print(f"    Total hexagons: {len(gdf)}")
                print(f"    CRS: {gdf.crs}")
                print(f"\n  Available columns:")
                for col in gdf.columns:
                    print(f"    - {col} ({gdf[col].dtype})")

                print(f"\n  Sample data (first 3 rows):")
                print(gdf.head(3).to_string())

                print(f"\n  Column statistics:")
                # Show value counts for key columns
                if 'technology_code' in gdf.columns:
                    print(f"\n  Technology codes:")
                    print(gdf['technology_code'].value_counts().head())

                if 'max_advertised_download_speed' in gdf.columns:
                    print(f"\n  Download speed stats:")
                    print(gdf['max_advertised_download_speed'].describe())

                if 'provider_count' in gdf.columns:
                    print(f"\n  Provider count stats:")
                    print(gdf['provider_count'].describe())
            else:
                print("  Failed to extract GeoPackage")
        else:
            print("  Download failed")
    else:
        print("  No files available to download")

    print("\n" + "=" * 60)
    print("Test complete!")
    print("=" * 60)


if __name__ == "__main__":
    test_fcc_api()
