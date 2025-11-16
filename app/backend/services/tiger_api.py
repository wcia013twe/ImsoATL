"""
Census TIGER API Functions

Fetch state and census tract boundaries from US Census Bureau TIGER/Line API
"""

import requests
import logging
from typing import Optional, Dict, Any
import json
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TIGERAPIService:
    """Service for fetching boundaries from Census TIGER API"""

    # State FIPS codes mapping
    STATE_FIPS = {
        'Alabama': '01', 'Alaska': '02', 'Arizona': '04', 'Arkansas': '05',
        'California': '06', 'Colorado': '08', 'Connecticut': '09', 'Delaware': '10',
        'Florida': '12', 'Georgia': '13', 'Hawaii': '15', 'Idaho': '16',
        'Illinois': '17', 'Indiana': '18', 'Iowa': '19', 'Kansas': '20',
        'Kentucky': '21', 'Louisiana': '22', 'Maine': '23', 'Maryland': '24',
        'Massachusetts': '25', 'Michigan': '26', 'Minnesota': '27', 'Mississippi': '28',
        'Missouri': '29', 'Montana': '30', 'Nebraska': '31', 'Nevada': '32',
        'New Hampshire': '33', 'New Jersey': '34', 'New Mexico': '35', 'New York': '36',
        'North Carolina': '37', 'North Dakota': '38', 'Ohio': '39', 'Oklahoma': '40',
        'Oregon': '41', 'Pennsylvania': '42', 'Rhode Island': '44', 'South Carolina': '45',
        'South Dakota': '46', 'Tennessee': '47', 'Texas': '48', 'Utah': '49',
        'Vermont': '50', 'Virginia': '51', 'Washington': '53', 'West Virginia': '54',
        'Wisconsin': '55', 'Wyoming': '56'
    }

    # TIGER API endpoints
    STATE_LAYER_URL = "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/0/query"
    TRACT_LAYER_URL = "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer/8/query"

    def __init__(self, cache_dir: Optional[Path] = None):
        """
        Initialize TIGER API service

        Args:
            cache_dir: Optional cache directory path
        """
        if cache_dir is None:
            cache_dir = Path(__file__).parent.parent.parent.parent / 'cache' / 'tiger'
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)

    def fetch_state_boundary(self, state_name: str) -> Optional[Dict[str, Any]]:
        """
        Fetch state boundary from Census TIGER API

        Args:
            state_name: Full state name (e.g., "Florida", "Georgia")

        Returns:
            GeoJSON feature with state boundary, or None if not found
        """
        # Check cache first
        cache_file = self.cache_dir / f"state_{state_name.lower().replace(' ', '_')}.json"
        if cache_file.exists():
            try:
                with open(cache_file, 'r') as f:
                    logger.info(f"✓ Loaded {state_name} boundary from cache")
                    return json.load(f)
            except Exception:
                pass

        # Get state FIPS code
        state_fips = self.STATE_FIPS.get(state_name)
        if not state_fips:
            logger.error(f"Unknown state: {state_name}")
            return None

        logger.info(f"Fetching {state_name} boundary from Census TIGER API...")

        try:
            params = {
                'where': f"STATE='{state_fips}'",
                'outFields': '*',
                'outSR': '4326',  # WGS84 lat/lon
                'f': 'geojson'
            }

            response = requests.get(self.STATE_LAYER_URL, params=params, timeout=60)
            response.raise_for_status()
            data = response.json()

            if not data.get('features') or len(data['features']) == 0:
                logger.warning(f"No boundary found for {state_name}")
                return None

            boundary = data['features'][0]

            # Cache the result
            try:
                with open(cache_file, 'w') as f:
                    json.dump(boundary, f, indent=2)
                logger.info(f"✓ Cached {state_name} boundary")
            except Exception as e:
                logger.warning(f"Failed to cache: {e}")

            logger.info(f"✓ Fetched {state_name} boundary ({boundary['geometry']['type']})")
            return boundary

        except requests.RequestException as e:
            logger.error(f"Error fetching state boundary: {e}")
            return None

    def fetch_tract_boundary(self, geoid: str) -> Optional[Dict[str, Any]]:
        """
        Fetch census tract boundary from Census TIGER API

        Args:
            geoid: 11-digit census tract GEOID (e.g., "12079110200")

        Returns:
            GeoJSON feature with tract boundary, or None if not found
        """
        # Check cache first
        cache_file = self.cache_dir / f"tract_{geoid}.json"
        if cache_file.exists():
            try:
                with open(cache_file, 'r') as f:
                    logger.info(f"✓ Loaded tract {geoid} from cache")
                    return json.load(f)
            except Exception:
                pass

        logger.info(f"Fetching census tract {geoid} from Census TIGER API...")

        try:
            params = {
                'where': f"GEOID='{geoid}'",
                'outFields': '*',
                'outSR': '4326',  # WGS84 lat/lon
                'f': 'geojson'
            }

            response = requests.get(self.TRACT_LAYER_URL, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()

            if not data.get('features') or len(data['features']) == 0:
                logger.warning(f"No boundary found for tract {geoid}")
                return None

            boundary = data['features'][0]

            # Cache the result
            try:
                with open(cache_file, 'w') as f:
                    json.dump(boundary, f, indent=2)
                logger.info(f"✓ Cached tract {geoid} boundary")
            except Exception as e:
                logger.warning(f"Failed to cache: {e}")

            logger.info(f"✓ Fetched tract {geoid} boundary ({boundary['geometry']['type']})")
            return boundary

        except requests.RequestException as e:
            logger.error(f"Error fetching tract boundary: {e}")
            return None

    def fetch_tracts_in_state(self, state_name: str, limit: int = 100) -> Optional[list]:
        """
        Fetch all census tracts in a state

        Args:
            state_name: Full state name (e.g., "Florida")
            limit: Maximum number of tracts to return (default 100)

        Returns:
            List of GeoJSON features with tract boundaries
        """
        state_fips = self.STATE_FIPS.get(state_name)
        if not state_fips:
            logger.error(f"Unknown state: {state_name}")
            return None

        logger.info(f"Fetching census tracts in {state_name}...")

        try:
            params = {
                'where': f"STATE='{state_fips}'",
                'outFields': 'GEOID,NAME,BASENAME,CENTLAT,CENTLON',
                'outSR': '4326',
                'returnGeometry': 'false',  # Just get metadata first
                'resultRecordCount': limit,
                'f': 'json'
            }

            response = requests.get(self.TRACT_LAYER_URL, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()

            if not data.get('features'):
                logger.warning(f"No tracts found in {state_name}")
                return None

            features = data['features']
            logger.info(f"✓ Found {len(features)} tracts in {state_name}")

            return features

        except requests.RequestException as e:
            logger.error(f"Error fetching tracts: {e}")
            return None


if __name__ == "__main__":
    # Test the service
    service = TIGERAPIService()

    # Test state boundary
    print("\n=== Testing State Boundary ===")
    florida = service.fetch_state_boundary("Florida")
    if florida:
        print(f"✓ Florida boundary: {florida['geometry']['type']}")

    # Test tract boundary
    print("\n=== Testing Census Tract Boundary ===")
    tract = service.fetch_tract_boundary("12079110200")  # Madison County tract
    if tract:
        print(f"✓ Tract 12079110200: {tract['geometry']['type']}")
        print(f"  Properties: {list(tract['properties'].keys())}")

    # Test fetching tract list
    print("\n=== Testing Tract List ===")
    tracts = service.fetch_tracts_in_state("Florida", limit=10)
    if tracts:
        print(f"✓ Found {len(tracts)} tracts")
        print(f"  First tract: {tracts[0]['attributes'].get('GEOID')}")
