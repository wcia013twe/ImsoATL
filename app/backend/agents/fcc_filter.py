"""
FCC Filter Agent
Analyzes broadband coverage gaps and identifies underserved areas
"""
from typing import Dict, List
import sys
import os

# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from data_sources.fcc_client import FCCBroadbandClient


class FCCFilterAgent:
    """Agent for analyzing FCC broadband coverage data"""

    def __init__(self, fcc_client: FCCBroadbandClient):
        self.fcc_client = fcc_client

    async def identify_coverage_gaps(
        self,
        state_fips: str = "13",
        min_download: float = 25.0,
        min_upload: float = 3.0
    ) -> List[Dict]:
        """
        Identify census tracts with broadband coverage gaps

        Args:
            state_fips: State FIPS code
            min_download: Minimum acceptable download speed (Mbps)
            min_upload: Minimum acceptable upload speed (Mbps)

        Returns:
            List of tracts with coverage gaps
        """
        gaps = await self.fcc_client.identify_coverage_gaps(
            state_fips=state_fips,
            min_download=min_download,
            min_upload=min_upload
        )

        # Add additional analysis
        for gap in gaps:
            gap['gap_type'] = self._classify_gap_type(
                gap.get('max_download_mbps', 0),
                gap.get('max_upload_mbps', 0)
            )

        return gaps

    def _classify_gap_type(
        self,
        download_mbps: float,
        upload_mbps: float
    ) -> str:
        """
        Classify the type of broadband gap

        Args:
            download_mbps: Current download speed
            upload_mbps: Current upload speed

        Returns:
            Gap classification string
        """
        if download_mbps < 10 and upload_mbps < 1:
            return "no_broadband"  # Below basic broadband threshold
        elif download_mbps < 25 and upload_mbps < 3:
            return "below_standard"  # Below FCC standard
        elif download_mbps < 100:
            return "limited_speed"  # Has broadband but limited speed
        else:
            return "adequate"

    async def merge_with_census_data(
        self,
        coverage_gaps: List[Dict],
        census_tracts: List[Dict]
    ) -> List[Dict]:
        """
        Merge FCC coverage gap data with census demographic data

        Args:
            coverage_gaps: List of tracts with coverage gaps
            census_tracts: List of census tract data

        Returns:
            Merged data with both coverage and demographic info
        """
        # Create lookup dict for census data
        census_lookup = {}
        for tract in census_tracts:
            tract_id = f"{tract.get('state')}{tract.get('county')}{tract.get('tract')}"
            census_lookup[tract_id] = tract

        # Merge data
        merged_data = []
        for gap in coverage_gaps:
            tract_id = f"{gap.get('state')}{gap.get('county')}{gap.get('tract')}"

            if tract_id in census_lookup:
                merged_tract = {
                    **census_lookup[tract_id],
                    **gap
                }
                merged_data.append(merged_tract)
            else:
                # Add gap data even if census data not found
                merged_data.append(gap)

        return merged_data

    async def prioritize_by_impact(
        self,
        merged_tracts: List[Dict]
    ) -> List[Dict]:
        """
        Prioritize tracts by potential impact

        Impact considers:
        - Severity of coverage gap
        - Population size
        - Poverty rate
        - Lack of internet access

        Args:
            merged_tracts: Tracts with coverage and demographic data

        Returns:
            Prioritized list of tracts
        """
        prioritized = []

        for tract in merged_tracts:
            impact_score = self._calculate_impact_score(tract)

            prioritized_tract = {
                **tract,
                'impact_score': impact_score,
                'priority_level': self._categorize_priority(impact_score)
            }

            prioritized.append(prioritized_tract)

        # Sort by impact score (highest first)
        prioritized.sort(key=lambda x: x['impact_score'], reverse=True)

        return prioritized

    def _calculate_impact_score(self, tract: Dict) -> float:
        """
        Calculate impact score for a tract

        Args:
            tract: Tract data with coverage and demographics

        Returns:
            Impact score (0-100)
        """
        # Gap severity score (0-40 points)
        gap_severity = tract.get('gap_severity', 'low')
        severity_points = {
            'critical': 40,
            'high': 30,
            'moderate': 20,
            'low': 10
        }.get(gap_severity, 0)

        # Population impact (0-20 points)
        population = tract.get('total_population', 0)
        pop_score = min((population / 10000) * 20, 20)  # Max at 10k population

        # Poverty rate impact (0-20 points)
        poverty_rate = tract.get('poverty_rate', 0)
        poverty_score = min((poverty_rate / 50) * 20, 20)  # Max at 50% poverty

        # Internet access gap impact (0-20 points)
        no_internet_pct = tract.get('no_internet_pct', 0)
        internet_score = min((no_internet_pct / 40) * 20, 20)  # Max at 40% without

        total_score = severity_points + pop_score + poverty_score + internet_score

        return round(total_score, 2)

    def _categorize_priority(self, impact_score: float) -> str:
        """Categorize priority level based on impact score"""
        if impact_score >= 70:
            return "critical"
        elif impact_score >= 50:
            return "high"
        elif impact_score >= 30:
            return "medium"
        else:
            return "low"

    async def get_coverage_summary(
        self,
        state_fips: str = "13"
    ) -> Dict:
        """
        Generate summary statistics for broadband coverage

        Args:
            state_fips: State FIPS code

        Returns:
            Summary statistics dict
        """
        coverage_data = await self.fcc_client.get_broadband_coverage(state_fips)
        gaps = await self.fcc_client.identify_coverage_gaps(state_fips)

        total_tracts = len(coverage_data)
        tracts_with_gaps = len(gaps)
        coverage_rate = ((total_tracts - tracts_with_gaps) / total_tracts * 100) if total_tracts > 0 else 0

        gap_severity_counts = {}
        for gap in gaps:
            severity = gap.get('gap_severity', 'unknown')
            gap_severity_counts[severity] = gap_severity_counts.get(severity, 0) + 1

        return {
            'total_tracts': total_tracts,
            'tracts_with_adequate_coverage': total_tracts - tracts_with_gaps,
            'tracts_with_gaps': tracts_with_gaps,
            'coverage_rate_pct': round(coverage_rate, 2),
            'gap_severity_breakdown': gap_severity_counts
        }
