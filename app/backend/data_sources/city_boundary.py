"""
City Boundary Validation Client

Provides geospatial validation to ensure recommended WiFi deployment sites
are within city limits using point-in-polygon checks.

Supports any US city with dynamic boundary loading.
"""

import json
from pathlib import Path
from shapely.geometry import Point, Polygon, MultiPolygon, shape
from typing import Optional, Tuple, Dict
import logging

logger = logging.getLogger(__name__)


class CityBoundaryClient:
    """Client for validating coordinates against any city's boundary."""

    # Map of common city slugs to their proper names and states
    CITY_MAPPINGS = {
        'atlanta': {'name': 'Atlanta', 'state': 'Georgia'},
        'boston': {'name': 'Boston', 'state': 'Massachusetts'},
        'chicago': {'name': 'Chicago', 'state': 'Illinois'},
        'seattle': {'name': 'Seattle', 'state': 'Washington'},
        'portland': {'name': 'Portland', 'state': 'Oregon'},
        'austin': {'name': 'Austin', 'state': 'Texas'},
        'denver': {'name': 'Denver', 'state': 'Colorado'},
        'philadelphia': {'name': 'Philadelphia', 'state': 'Pennsylvania'},
    }

    def __init__(self, city_slug: str = 'atlanta', boundary_file_path: Optional[str] = None):
        """
        Initialize the city boundary client.

        Args:
            city_slug: City identifier (e.g., 'atlanta', 'boston', 'chicago')
            boundary_file_path: Optional explicit path to boundary GeoJSON file.
                               If None, uses default path based on city_slug.
        """
        self.city_slug = city_slug.lower()
        self.city_info = self.CITY_MAPPINGS.get(self.city_slug, {
            'name': city_slug.title(),
            'state': 'Unknown'
        })

        if boundary_file_path is None:
            # Default path: app/backend/data_sources -> app/frontend/public/data/cities
            backend_dir = Path(__file__).parent.parent
            boundary_file_path = (
                backend_dir.parent / "frontend" / "public" / "data" / "cities" / f"{self.city_slug}.json"
            )

        self.boundary_file = Path(boundary_file_path)
        self.boundary_polygon: Optional[Polygon | MultiPolygon] = None
        self.bounds: Optional[Tuple[Tuple[float, float], Tuple[float, float]]] = None
        self.center: Optional[Tuple[float, float]] = None

        self._load_boundary()

    def _load_boundary(self) -> None:
        """Load city boundary GeoJSON and create Shapely polygon."""
        if not self.boundary_file.exists():
            error_msg = (
                f"{self.city_info['name']} boundary file not found at {self.boundary_file}. "
                f"Run 'node scripts/fetch-city-boundary-osm.js {self.city_info['name']} {self.city_info['state']}' "
                "to generate it."
            )
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)

        with open(self.boundary_file, 'r') as f:
            geojson_data = json.load(f)

        # Extract geometry and convert to Shapely object
        geometry = geojson_data.get('geometry')
        if not geometry:
            raise ValueError("Invalid GeoJSON: missing 'geometry' field")

        self.boundary_polygon = shape(geometry)

        # Extract bounds and center from properties
        properties = geojson_data.get('properties', {})
        self.bounds = tuple(map(tuple, properties.get('bounds', []))) if properties.get('bounds') else None
        self.center = tuple(properties.get('center', [])) if properties.get('center') else None

        logger.info(f"✓ Loaded {self.city_info['name']} boundary from {self.boundary_file}")
        if self.bounds:
            logger.info(f"  Bounds: SW {self.bounds[0]}, NE {self.bounds[1]}")
        if self.center:
            logger.info(f"  Center: {self.center}")

    def is_point_in_city(self, lat: float, lng: float) -> bool:
        """
        Check if a coordinate point is within city limits.

        Args:
            lat: Latitude (e.g., 33.7490)
            lng: Longitude (e.g., -84.3880)

        Returns:
            True if point is within city boundary, False otherwise
        """
        if not self.boundary_polygon:
            raise RuntimeError("Boundary polygon not loaded")

        point = Point(lng, lat)  # Shapely uses (x, y) = (lon, lat)
        return self.boundary_polygon.contains(point)

    def filter_sites_in_city(self, sites: list[dict]) -> list[dict]:
        """
        Filter a list of sites to only those within city limits.

        Args:
            sites: List of site dictionaries with 'lat' and 'lng' keys

        Returns:
            Filtered list containing only sites within city
        """
        city_sites = []

        for site in sites:
            lat = site.get('lat')
            lng = site.get('lng')

            if lat is None or lng is None:
                logger.warning(f"Skipping site {site.get('tract_id', 'unknown')}: missing lat/lng")
                continue

            if self.is_point_in_city(lat, lng):
                city_sites.append(site)

        return city_sites

    def get_bounds(self) -> Optional[Tuple[Tuple[float, float], Tuple[float, float]]]:
        """
        Get city boundary bounding box.

        Returns:
            ((min_lng, min_lat), (max_lng, max_lat)) or None
        """
        return self.bounds

    def get_center(self) -> Optional[Tuple[float, float]]:
        """
        Get city boundary center point.

        Returns:
            (lng, lat) or None
        """
        return self.center

    def get_boundary_geojson(self) -> dict:
        """
        Get the raw GeoJSON boundary data.

        Returns:
            GeoJSON Feature dictionary
        """
        with open(self.boundary_file, 'r') as f:
            return json.load(f)

    def get_city_info(self) -> Dict[str, str]:
        """
        Get city information.

        Returns:
            Dictionary with 'name' and 'state' keys
        """
        return self.city_info.copy()


# Example usage
if __name__ == "__main__":
    import sys

    # Allow testing different cities via command line
    test_city = sys.argv[1] if len(sys.argv) > 1 else 'atlanta'

    print(f"\n🏙️  Testing {test_city.title()} boundary validation:\n")

    try:
        client = CityBoundaryClient(test_city)

        # City-specific test points
        if test_city == 'atlanta':
            test_points = [
                {"name": "Downtown Atlanta", "lat": 33.7490, "lng": -84.3880, "expected": True},
                {"name": "Hartsfield-Jackson Airport", "lat": 33.6407, "lng": -84.4277, "expected": False},
                {"name": "Sandy Springs (outside)", "lat": 33.9304, "lng": -84.3733, "expected": False},
            ]
        else:
            # Generic test with city center
            center = client.get_center()
            if center:
                test_points = [
                    {"name": f"{test_city.title()} Center", "lat": center[1], "lng": center[0], "expected": True},
                ]
            else:
                test_points = []

        for point in test_points:
            result = client.is_point_in_city(point["lat"], point["lng"])
            status = "✓" if result == point["expected"] else "✗"
            print(f"{status} {point['name']}: {result} (expected {point['expected']})")

        print(f"\n📍 {client.city_info['name']} bounds: {client.get_bounds()}")
        print(f"📍 {client.city_info['name']} center: {client.get_center()}")

    except FileNotFoundError as e:
        print(f"❌ {e}")
        print(f"\n💡 To generate boundary for {test_city}:")
        print(f"   node scripts/fetch-city-boundary-osm.js {test_city.title()} [State]")
