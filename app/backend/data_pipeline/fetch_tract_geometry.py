"""
Fetch Census Tract Geometry by GEOID

This module fetches individual census tract geometries from the Census Bureau
TIGERweb API using GEOID as the lookup key.
"""

import requests
import json
from typing import Optional, Dict
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TractGeometryFetcher:
    """Fetch census tract geometries from Census Bureau TIGERweb API"""

    def __init__(self, cache_dir: Optional[Path] = None):
        self.api_base = "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer/8/query"

        # Cache directory for storing geometries
        if cache_dir is None:
            cache_dir = Path(__file__).parent.parent.parent / "frontend/public/data/tract-geometries"
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)

    def fetch_geometry_by_geoid(self, geoid: str, use_cache: bool = True) -> Optional[Dict]:
        """
        Fetch geometry for a single census tract by GEOID

        Args:
            geoid: 11-digit census tract GEOID (e.g., "12079001100")
            use_cache: Whether to use cached geometry if available

        Returns:
            GeoJSON feature with tract geometry, or None if not found
        """
        # Check cache first
        if use_cache:
            cached = self._load_from_cache(geoid)
            if cached:
                logger.info(f"Loaded {geoid} from cache")
                return cached

        # Fetch from API
        logger.info(f"Fetching geometry for tract {geoid} from Census Bureau...")

        params = {
            "where": f"GEOID='{geoid}'",
            "outFields": "*",
            "f": "geojson",
            "returnGeometry": "true",
            "spatialRel": "esriSpatialRelIntersects"
        }

        try:
            response = requests.get(self.api_base, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()

            if not data.get("features") or len(data["features"]) == 0:
                logger.warning(f"No geometry found for GEOID {geoid}")
                return None

            # Extract first feature
            feature = data["features"][0]

            # Enhance properties
            feature["properties"]["geoid"] = geoid
            feature["properties"]["fetched_at"] = pd.Timestamp.now().isoformat()

            # Cache it
            self._save_to_cache(geoid, feature)

            logger.info(f"✓ Fetched geometry for {geoid}")
            return feature

        except requests.RequestException as e:
            logger.error(f"Error fetching geometry for {geoid}: {e}")
            return None

    def fetch_multiple_geometries(self, geoids: list, use_cache: bool = True) -> Dict[str, Dict]:
        """
        Fetch geometries for multiple tracts

        Args:
            geoids: List of GEOIDs to fetch
            use_cache: Whether to use cached geometries

        Returns:
            Dictionary mapping GEOID to GeoJSON feature
        """
        logger.info(f"Fetching geometries for {len(geoids)} tracts...")

        results = {}
        for geoid in geoids:
            feature = self.fetch_geometry_by_geoid(geoid, use_cache=use_cache)
            if feature:
                results[geoid] = feature

        logger.info(f"Successfully fetched {len(results)}/{len(geoids)} geometries")
        return results

    def create_feature_collection(self, geoids: list) -> Dict:
        """
        Create a GeoJSON FeatureCollection from multiple GEOIDs

        Args:
            geoids: List of GEOIDs to fetch

        Returns:
            GeoJSON FeatureCollection
        """
        geometries = self.fetch_multiple_geometries(geoids)

        return {
            "type": "FeatureCollection",
            "features": list(geometries.values()),
            "properties": {
                "count": len(geometries),
                "generated_at": pd.Timestamp.now().isoformat(),
                "source": "US Census Bureau TIGERweb"
            }
        }

    def _get_cache_path(self, geoid: str) -> Path:
        """Get cache file path for a GEOID"""
        return self.cache_dir / f"{geoid}.json"

    def _load_from_cache(self, geoid: str) -> Optional[Dict]:
        """Load geometry from cache"""
        cache_file = self._get_cache_path(geoid)
        if cache_file.exists():
            with open(cache_file, 'r') as f:
                return json.load(f)
        return None

    def _save_to_cache(self, geoid: str, feature: Dict):
        """Save geometry to cache"""
        cache_file = self._get_cache_path(geoid)
        with open(cache_file, 'w') as f:
            json.dump(feature, f, indent=2)


def fetch_geometries_for_underserved_tracts(
    underserved_json_path: str,
    output_path: Optional[str] = None
) -> Dict:
    """
    Fetch geometries for all underserved tracts

    Args:
        underserved_json_path: Path to underserved_tracts.json from pipeline
        output_path: Optional path to save GeoJSON FeatureCollection

    Returns:
        GeoJSON FeatureCollection with tract geometries
    """
    # Load underserved tracts
    with open(underserved_json_path, 'r') as f:
        underserved_data = json.load(f)

    geoids = [str(int(tract['geoid'])) for tract in underserved_data['tracts']]

    logger.info(f"Found {len(geoids)} underserved tracts to fetch")

    # Fetch geometries
    fetcher = TractGeometryFetcher()
    feature_collection = fetcher.create_feature_collection(geoids)

    # Merge with underserved tract data
    underserved_by_geoid = {
        str(int(tract['geoid'])): tract
        for tract in underserved_data['tracts']
    }

    for feature in feature_collection['features']:
        geoid = feature['properties']['GEOID']
        if geoid in underserved_by_geoid:
            # Add coverage data to properties
            feature['properties'].update(underserved_by_geoid[geoid])

    # Save if output path provided
    if output_path:
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)

        with open(output_file, 'w') as f:
            json.dump(feature_collection, f, indent=2)

        logger.info(f"Saved to {output_file}")

    return feature_collection


def main():
    """Main execution - fetch geometries for underserved tracts"""
    import sys

    # Add pandas import here for timestamp
    import pandas as pd
    globals()['pd'] = pd

    project_root = Path(__file__).parent.parent.parent.parent
    underserved_file = project_root / "app/frontend/public/data/processed/underserved_tracts.json"
    output_file = project_root / "app/frontend/public/data/processed/underserved_tracts_geo.json"

    if not underserved_file.exists():
        logger.error(f"Underserved tracts file not found: {underserved_file}")
        logger.error("Run process_coverage.py first to generate underserved tracts")
        sys.exit(1)

    logger.info("=" * 70)
    logger.info("Fetching Census Tract Geometries")
    logger.info("=" * 70)

    feature_collection = fetch_geometries_for_underserved_tracts(
        str(underserved_file),
        str(output_file)
    )

    logger.info("=" * 70)
    logger.info(f"✅ Complete! Fetched {len(feature_collection['features'])} tract geometries")
    logger.info(f"Output: {output_file}")
    logger.info("=" * 70)


if __name__ == "__main__":
    main()
