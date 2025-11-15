"""
Asset Locator Agent
Identifies and analyzes civic asset locations (libraries, community centers, schools, transit)
"""
from typing import Dict, List
import sys
import os

# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from data_sources.civic_assets import CivicAssetsClient


class AssetLocatorAgent:
    """Agent for locating and analyzing civic assets"""

    def __init__(self, assets_client: CivicAssetsClient):
        self.assets_client = assets_client

    async def find_candidate_anchor_sites(
        self,
        asset_types: List[str] = None,
        min_facility_score: float = 0.0
    ) -> List[Dict]:
        """
        Identify civic assets that could serve as WiFi anchor sites

        Args:
            asset_types: List of asset types to consider (None = all types)
            min_facility_score: Minimum facility suitability score

        Returns:
            List of candidate anchor sites
        """
        if asset_types is None:
            assets = await self.assets_client.get_all_assets()
        else:
            assets = []
            for asset_type in asset_types:
                type_assets = await self.assets_client.get_assets_by_type(asset_type)
                assets.extend(type_assets)

        # Score each asset as potential anchor site
        candidates = []
        for asset in assets:
            facility_score = self._calculate_facility_score(asset)

            if facility_score >= min_facility_score:
                candidate = {
                    **asset,
                    'facility_score': facility_score,
                    'anchor_potential': self._categorize_anchor_potential(facility_score)
                }
                candidates.append(candidate)

        # Sort by facility score
        candidates.sort(key=lambda x: x['facility_score'], reverse=True)

        return candidates

    def _calculate_facility_score(self, asset: Dict) -> float:
        """
        Calculate suitability score for an asset as WiFi anchor site

        Scoring criteria:
        - Libraries: High score (public space, existing infrastructure)
        - Community Centers: High score (public gathering place)
        - Schools: Medium-high score (serves students but limited public hours)
        - Transit Stops: Medium score (high foot traffic but limited space)

        Args:
            asset: Asset data dict

        Returns:
            Facility score (0-100)
        """
        asset_type = asset.get('type', '')

        base_scores = {
            'library': 95,
            'community_center': 90,
            'school': 75,
            'transit_stop': 65
        }

        return base_scores.get(asset_type, 50)

    def _categorize_anchor_potential(self, facility_score: float) -> str:
        """Categorize anchor site potential"""
        if facility_score >= 90:
            return "excellent"
        elif facility_score >= 75:
            return "good"
        elif facility_score >= 60:
            return "fair"
        else:
            return "limited"

    async def map_assets_to_census_tracts(
        self,
        census_tracts: List[Dict]
    ) -> List[Dict]:
        """
        Map civic assets to their corresponding census tracts

        Args:
            census_tracts: List of census tract data

        Returns:
            List of assets with tract assignment
        """
        # Note: This is simplified. In production, use spatial joins
        # with actual census tract geometries
        assets = await self.assets_client.get_all_assets()

        # For now, use county matching as approximation
        assets_with_tracts = []
        for asset in assets:
            asset_county = asset.get('county')

            # Find matching census tracts in same county
            matching_tracts = [
                t for t in census_tracts
                if t.get('county') == asset_county
            ]

            asset_data = {
                **asset,
                'matching_tracts_count': len(matching_tracts),
                'county': asset_county
            }

            assets_with_tracts.append(asset_data)

        return assets_with_tracts

    async def find_assets_near_high_need_areas(
        self,
        high_need_tracts: List[Dict],
        radius_miles: float = 2.0
    ) -> List[Dict]:
        """
        Find civic assets near high-need census tracts

        Args:
            high_need_tracts: List of high-need census tracts
            radius_miles: Search radius in miles

        Returns:
            List of assets near high-need areas with proximity data
        """
        all_assets = await self.assets_client.get_all_assets()

        assets_near_need = []

        for asset in all_assets:
            nearby_high_need_tracts = []

            for tract in high_need_tracts:
                # Simplified: Check if same county (in production, use actual distance)
                if tract.get('county') == asset.get('county'):
                    nearby_high_need_tracts.append({
                        'tract_id': f"{tract.get('state')}{tract.get('county')}{tract.get('tract')}",
                        'name': tract.get('name'),
                        'need_score': tract.get('need_score', 0)
                    })

            if nearby_high_need_tracts:
                asset_data = {
                    **asset,
                    'nearby_high_need_count': len(nearby_high_need_tracts),
                    'nearby_high_need_tracts': nearby_high_need_tracts,
                    'avg_nearby_need_score': sum(t.get('need_score', 0) for t in nearby_high_need_tracts) / len(nearby_high_need_tracts)
                }
                assets_near_need.append(asset_data)

        # Sort by number of nearby high-need tracts
        assets_near_need.sort(key=lambda x: x['nearby_high_need_count'], reverse=True)

        return assets_near_need

    async def get_asset_coverage_summary(self) -> Dict:
        """
        Generate summary of civic asset availability

        Returns:
            Summary statistics dict
        """
        all_assets = await self.assets_client.get_all_assets()
        county_counts = await self.assets_client.get_asset_counts_by_county()

        asset_type_totals = {
            'library': 0,
            'community_center': 0,
            'school': 0,
            'transit_stop': 0
        }

        for asset in all_assets:
            asset_type = asset.get('type')
            if asset_type in asset_type_totals:
                asset_type_totals[asset_type] += 1

        return {
            'total_assets': len(all_assets),
            'asset_type_breakdown': asset_type_totals,
            'counties_covered': len(county_counts),
            'county_breakdown': county_counts
        }
