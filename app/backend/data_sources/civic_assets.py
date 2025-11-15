"""
Civic Assets Data Source
Provides location data for libraries, community centers, schools, and transit stops
"""
from typing import Dict, List, Literal


AssetType = Literal["library", "community_center", "school", "transit_stop"]


class CivicAssetsClient:
    """Client for civic asset location data"""

    def __init__(self):
        self.assets = self._initialize_mock_assets()

    def _initialize_mock_assets(self) -> List[Dict]:
        """
        Initialize mock civic asset data
        In production, integrate with city open data APIs or databases
        """
        return [
            # Libraries
            {
                'id': 'lib_001',
                'name': 'Auburn Avenue Research Library',
                'type': 'library',
                'lat': 33.7571,
                'lng': -84.3733,
                'address': '101 Auburn Ave NE, Atlanta, GA 30303',
                'county': '121',  # Fulton
            },
            {
                'id': 'lib_002',
                'name': 'Central Library',
                'type': 'library',
                'lat': 33.7490,
                'lng': -84.3880,
                'address': '1 Margaret Mitchell Square, Atlanta, GA 30303',
                'county': '121',
            },
            {
                'id': 'lib_003',
                'name': 'Southwest Regional Library',
                'type': 'library',
                'lat': 33.7380,
                'lng': -84.4280,
                'address': '3665 Cascade Rd SW, Atlanta, GA 30331',
                'county': '121',
            },

            # Community Centers
            {
                'id': 'cc_001',
                'name': 'East Lake Community Center',
                'type': 'community_center',
                'lat': 33.7505,
                'lng': -84.3256,
                'address': '2490 Alston Dr SE, Atlanta, GA 30317',
                'county': '089',  # DeKalb
            },
            {
                'id': 'cc_002',
                'name': 'Adamsville Recreation Center',
                'type': 'community_center',
                'lat': 33.7200,
                'lng': -84.4800,
                'address': '3404 Delmar Ln NW, Atlanta, GA 30331',
                'county': '121',
            },

            # Schools
            {
                'id': 'school_001',
                'name': 'Grady High School',
                'type': 'school',
                'lat': 33.7730,
                'lng': -84.3760,
                'address': '929 Charles Allen Dr NE, Atlanta, GA 30308',
                'county': '121',
            },
            {
                'id': 'school_002',
                'name': 'Benjamin E. Mays High School',
                'type': 'school',
                'lat': 33.7100,
                'lng': -84.4400,
                'address': '3450 Benjamin E Mays Dr SW, Atlanta, GA 30331',
                'county': '121',
            },

            # Transit Stops (MARTA stations)
            {
                'id': 'transit_001',
                'name': 'Five Points Station',
                'type': 'transit_stop',
                'lat': 33.7537,
                'lng': -84.3916,
                'address': '30 Alabama St SW, Atlanta, GA 30303',
                'county': '121',
            },
            {
                'id': 'transit_002',
                'name': 'West End Station',
                'type': 'transit_stop',
                'lat': 33.7357,
                'lng': -84.4129,
                'address': '680 Lee St SW, Atlanta, GA 30310',
                'county': '121',
            },
            {
                'id': 'transit_003',
                'name': 'Decatur Station',
                'type': 'transit_stop',
                'lat': 33.7746,
                'lng': -84.2969,
                'address': '400 Church St, Decatur, GA 30030',
                'county': '089',
            },
        ]

    async def get_all_assets(self) -> List[Dict]:
        """Get all civic assets"""
        return self.assets

    async def get_assets_by_type(self, asset_type: AssetType) -> List[Dict]:
        """
        Get civic assets filtered by type

        Args:
            asset_type: Type of asset to retrieve

        Returns:
            List of assets matching the type
        """
        return [asset for asset in self.assets if asset['type'] == asset_type]

    async def get_assets_in_area(
        self,
        center_lat: float,
        center_lng: float,
        radius_miles: float = 5.0
    ) -> List[Dict]:
        """
        Get civic assets within a radius of a point

        Args:
            center_lat: Latitude of center point
            center_lng: Longitude of center point
            radius_miles: Radius in miles

        Returns:
            List of assets within the radius
        """
        nearby_assets = []

        for asset in self.assets:
            distance = self._calculate_distance(
                center_lat, center_lng,
                asset['lat'], asset['lng']
            )

            if distance <= radius_miles:
                asset_with_distance = asset.copy()
                asset_with_distance['distance_miles'] = round(distance, 2)
                nearby_assets.append(asset_with_distance)

        # Sort by distance
        nearby_assets.sort(key=lambda x: x['distance_miles'])

        return nearby_assets

    def _calculate_distance(
        self,
        lat1: float,
        lng1: float,
        lat2: float,
        lng2: float
    ) -> float:
        """
        Calculate distance between two points using Haversine formula

        Args:
            lat1, lng1: Coordinates of first point
            lat2, lng2: Coordinates of second point

        Returns:
            Distance in miles
        """
        import math

        # Convert to radians
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        lng1_rad = math.radians(lng1)
        lng2_rad = math.radians(lng2)

        # Haversine formula
        dlat = lat2_rad - lat1_rad
        dlng = lng2_rad - lng1_rad

        a = (math.sin(dlat / 2) ** 2 +
             math.cos(lat1_rad) * math.cos(lat2_rad) *
             math.sin(dlng / 2) ** 2)

        c = 2 * math.asin(math.sqrt(a))

        # Earth's radius in miles
        radius_earth_miles = 3959.0

        return c * radius_earth_miles

    async def get_asset_counts_by_county(self) -> Dict[str, Dict[str, int]]:
        """
        Get counts of assets by county and type

        Returns:
            Dict mapping county FIPS to asset type counts
        """
        county_counts = {}

        for asset in self.assets:
            county = asset.get('county', 'unknown')

            if county not in county_counts:
                county_counts[county] = {
                    'library': 0,
                    'community_center': 0,
                    'school': 0,
                    'transit_stop': 0
                }

            asset_type = asset['type']
            county_counts[county][asset_type] += 1

        return county_counts
