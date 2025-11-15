"""
Census Tract Centroid Extractor

Extracts lat/lng centroids from census tract boundary GeoJSON file
for point-in-polygon validation against city boundaries.

Supports any US state by FIPS code.
"""

import json
from pathlib import Path
from typing import Dict, Tuple, Optional
import logging

logger = logging.getLogger(__name__)


class TractCentroidClient:
    """Client for accessing census tract centroid coordinates."""

    # Map of state FIPS codes for common states
    STATE_FIPS = {
        'GA': '13',  # Georgia
        'MA': '25',  # Massachusetts
        'IL': '17',  # Illinois
        'WA': '53',  # Washington
        'OR': '41',  # Oregon
        'TX': '48',  # Texas
        'CO': '08',  # Colorado
        'PA': '42',  # Pennsylvania
        'CA': '06',  # California
        'NY': '36',  # New York
    }

    def __init__(self, state_fips: str = '13', census_boundary_file: Optional[str] = None):
        """
        Initialize tract centroid client.

        Args:
            state_fips: Two-digit state FIPS code (e.g., '13' for Georgia)
                       or two-letter state code (e.g., 'GA')
            census_boundary_file: Optional explicit path to census tract GeoJSON file.
                                 If None, uses default path based on state_fips.
        """
        # Convert state abbreviation to FIPS if needed
        if len(state_fips) == 2 and state_fips.isalpha():
            state_fips = self.STATE_FIPS.get(state_fips.upper(), state_fips)

        self.state_fips = state_fips

        if census_boundary_file is None:
            # Default: app/backend/data_sources -> app/data/tl_2024_{fips}_bg.json
            backend_dir = Path(__file__).parent.parent
            census_boundary_file = backend_dir.parent / "data" / f"tl_2024_{state_fips}_bg.json"

        self.census_file = Path(census_boundary_file)
        self.centroids: Dict[str, Tuple[float, float]] = {}

        self._load_centroids()

    def _load_centroids(self) -> None:
        """Load census tract centroids from GeoJSON file."""
        if not self.census_file.exists():
            raise FileNotFoundError(
                f"Census boundary file not found at {self.census_file}"
            )

        logger.info(f"📍 Loading census tract centroids from {self.census_file.name}...")

        with open(self.census_file, 'r') as f:
            geojson_data = json.load(f)

        features = geojson_data.get('features', [])

        # Track multiple centroids per tract for averaging
        tract_coords = {}

        for feature in features:
            props = feature.get('properties', {})

            # Extract block group GEOID
            bg_geoid = props.get('GEOID')
            if not bg_geoid or len(bg_geoid) < 11:
                continue

            # Derive tract ID from first 11 digits
            # Format: SSCCCTTTTTTB where SS=state, CCC=county, TTTTTT=tract, B=block group
            tract_id = bg_geoid[:11]

            # Extract internal point coordinates (centroid)
            intptlat = props.get('INTPTLAT')
            intptlon = props.get('INTPTLON')

            if intptlat and intptlon:
                try:
                    lat = float(intptlat)
                    lng = float(intptlon)

                    # Store for averaging (multiple block groups per tract)
                    if tract_id not in tract_coords:
                        tract_coords[tract_id] = []
                    tract_coords[tract_id].append((lat, lng))

                except (ValueError, TypeError):
                    continue

        # Average coordinates for each tract (from its block groups)
        for tract_id, coords_list in tract_coords.items():
            avg_lat = sum(c[0] for c in coords_list) / len(coords_list)
            avg_lng = sum(c[1] for c in coords_list) / len(coords_list)
            self.centroids[tract_id] = (avg_lat, avg_lng)

        print(f"   ✓ Loaded {len(self.centroids)} tract centroids (from {len(features)} block groups)")

    def get_centroid(self, tract_id: str) -> Optional[Tuple[float, float]]:
        """
        Get the centroid coordinates for a census tract.

        Args:
            tract_id: Census tract GEOID (e.g., "13121001500")

        Returns:
            (lat, lng) tuple or None if not found
        """
        return self.centroids.get(tract_id)

    def add_centroids_to_sites(self, sites: list[dict]) -> list[dict]:
        """
        Add lat/lng centroids to site dictionaries based on tract_id.

        Args:
            sites: List of site dicts with 'tract_id' key

        Returns:
            Updated sites with 'lat' and 'lng' added
        """
        updated_sites = []

        for site in sites:
            tract_id = site.get('tract_id')
            if not tract_id:
                print(f"⚠️  Site missing tract_id: {site}")
                continue

            centroid = self.get_centroid(tract_id)
            if centroid:
                site['lat'], site['lng'] = centroid
                updated_sites.append(site)
            else:
                print(f"⚠️  No centroid found for tract {tract_id}")

        return updated_sites

    def get_all_centroids(self) -> Dict[str, Tuple[float, float]]:
        """
        Get all tract centroids.

        Returns:
            Dictionary mapping tract_id -> (lat, lng)
        """
        return self.centroids.copy()


# Example usage
if __name__ == "__main__":
    client = TractCentroidClient()

    # Test with some known Fulton County tracts
    test_tracts = [
        "13121001500",  # Downtown Atlanta area
        "13121002300",  # West End area
        "13121003100",  # Mechanicsville area
    ]

    print("\n🧪 Testing tract centroid lookup:\n")
    for tract_id in test_tracts:
        centroid = client.get_centroid(tract_id)
        if centroid:
            print(f"✓ Tract {tract_id}: {centroid}")
        else:
            print(f"✗ Tract {tract_id}: NOT FOUND")

    print(f"\n📊 Total tracts loaded: {len(client.get_all_centroids())}")
