"""
Atlanta City Boundary Validation Client

Provides geospatial validation to ensure recommended WiFi deployment sites
are within Atlanta city limits using point-in-polygon checks.
"""

import json
from pathlib import Path
from shapely.geometry import Point, Polygon, MultiPolygon, shape
from typing import Optional, Tuple


class AtlantaBoundaryClient:
    """Client for validating coordinates against Atlanta city boundary."""

    def __init__(self, boundary_file_path: Optional[str] = None):
        """
        Initialize the Atlanta boundary client.

        Args:
            boundary_file_path: Path to atlanta.json GeoJSON file.
                               If None, uses default path relative to backend.
        """
        if boundary_file_path is None:
            # Default path: app/backend/data_sources -> app/frontend/public/data/cities
            backend_dir = Path(__file__).parent.parent
            boundary_file_path = backend_dir.parent / "frontend" / "public" / "data" / "cities" / "atlanta.json"

        self.boundary_file = Path(boundary_file_path)
        self.boundary_polygon: Optional[Polygon | MultiPolygon] = None
        self.bounds: Optional[Tuple[Tuple[float, float], Tuple[float, float]]] = None
        self.center: Optional[Tuple[float, float]] = None

        self._load_boundary()

    def _load_boundary(self) -> None:
        """Load Atlanta boundary GeoJSON and create Shapely polygon."""
        if not self.boundary_file.exists():
            raise FileNotFoundError(
                f"Atlanta boundary file not found at {self.boundary_file}. "
                "Run 'node scripts/fetch-atlanta-boundary-osm.js' to generate it."
            )

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

        print(f"✓ Loaded Atlanta boundary from {self.boundary_file}")
        if self.bounds:
            print(f"  Bounds: SW {self.bounds[0]}, NE {self.bounds[1]}")
        if self.center:
            print(f"  Center: {self.center}")

    def is_point_in_atlanta(self, lat: float, lng: float) -> bool:
        """
        Check if a coordinate point is within Atlanta city limits.

        Args:
            lat: Latitude (e.g., 33.7490)
            lng: Longitude (e.g., -84.3880)

        Returns:
            True if point is within Atlanta boundary, False otherwise
        """
        if not self.boundary_polygon:
            raise RuntimeError("Boundary polygon not loaded")

        point = Point(lng, lat)  # Shapely uses (x, y) = (lon, lat)
        return self.boundary_polygon.contains(point)

    def filter_sites_in_atlanta(self, sites: list[dict]) -> list[dict]:
        """
        Filter a list of sites to only those within Atlanta city limits.

        Args:
            sites: List of site dictionaries with 'lat' and 'lng' keys

        Returns:
            Filtered list containing only sites within Atlanta
        """
        atlanta_sites = []

        for site in sites:
            lat = site.get('lat')
            lng = site.get('lng')

            if lat is None or lng is None:
                print(f"⚠️  Skipping site {site.get('tract_id', 'unknown')}: missing lat/lng")
                continue

            if self.is_point_in_atlanta(lat, lng):
                atlanta_sites.append(site)

        return atlanta_sites

    def get_bounds(self) -> Optional[Tuple[Tuple[float, float], Tuple[float, float]]]:
        """
        Get Atlanta boundary bounding box.

        Returns:
            ((min_lng, min_lat), (max_lng, max_lat)) or None
        """
        return self.bounds

    def get_center(self) -> Optional[Tuple[float, float]]:
        """
        Get Atlanta boundary center point.

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


# Example usage
if __name__ == "__main__":
    # Test the boundary client
    client = AtlantaBoundaryClient()

    # Test some known Atlanta locations
    test_points = [
        {"name": "Downtown Atlanta", "lat": 33.7490, "lng": -84.3880, "expected": True},
        {"name": "Hartsfield-Jackson Airport", "lat": 33.6407, "lng": -84.4277, "expected": True},
        {"name": "Sandy Springs (outside)", "lat": 33.9304, "lng": -84.3733, "expected": False},
        {"name": "Decatur (outside)", "lat": 33.7748, "lng": -84.2963, "expected": False},
    ]

    print("\n🧪 Testing Atlanta boundary validation:\n")
    for point in test_points:
        result = client.is_point_in_atlanta(point["lat"], point["lng"])
        status = "✓" if result == point["expected"] else "✗"
        print(f"{status} {point['name']}: {result} (expected {point['expected']})")

    print(f"\n📍 Atlanta bounds: {client.get_bounds()}")
    print(f"📍 Atlanta center: {client.get_center()}")
