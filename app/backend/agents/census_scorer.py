"""
Census Scorer Agent
Analyzes and scores census tracts based on demographic need
"""
from typing import Dict, List
import sys
import os

# Add parent directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from data_sources.census_client import CensusDataClient


class CensusScorerAgent:
    """Agent for scoring census tracts based on demographic indicators"""

    def __init__(self, census_client: CensusDataClient):
        self.census_client = census_client

    async def score_tracts_by_need(
        self,
        state_fips: str = "13",
        weights: Dict[str, float] = None
    ) -> List[Dict]:
        """
        Score census tracts based on demographic need

        Args:
            state_fips: State FIPS code
            weights: Dict of weights for scoring criteria
                     {poverty_rate, no_internet_pct, student_pct}

        Returns:
            List of scored tracts
        """
        # Default weights emphasize equity
        if weights is None:
            weights = {
                'poverty_rate': 0.4,  # 40% weight
                'no_internet_pct': 0.4,  # 40% weight
                'student_pct': 0.2  # 20% weight
            }

        # Fetch combined census data
        census_data = await self.census_client.get_combined_data(state_fips)

        scored_tracts = []

        for tract in census_data:
            # Normalize scores to 0-100 scale
            poverty_score = self._normalize_score(
                tract.get('poverty_rate', 0),
                max_value=50  # 50% poverty rate = max score
            )

            internet_score = self._normalize_score(
                tract.get('no_internet_pct', 0),
                max_value=40  # 40% without internet = max score
            )

            student_score = self._normalize_score(
                tract.get('student_pct', 0),
                max_value=30  # 30% students = max score
            )

            # Calculate weighted need score
            need_score = (
                poverty_score * weights['poverty_rate'] +
                internet_score * weights['no_internet_pct'] +
                student_score * weights['student_pct']
            )

            scored_tract = {
                **tract,
                'poverty_score': round(poverty_score, 2),
                'internet_score': round(internet_score, 2),
                'student_score': round(student_score, 2),
                'need_score': round(need_score, 2),
                'need_category': self._categorize_need(need_score)
            }

            scored_tracts.append(scored_tract)

        # Sort by need score (highest first)
        scored_tracts.sort(key=lambda x: x['need_score'], reverse=True)

        return scored_tracts

    def _normalize_score(self, value: float, max_value: float) -> float:
        """
        Normalize a value to 0-100 scale

        Args:
            value: Raw value
            max_value: Value that represents score of 100

        Returns:
            Normalized score (0-100)
        """
        if value >= max_value:
            return 100.0

        return (value / max_value) * 100.0

    def _categorize_need(self, need_score: float) -> str:
        """
        Categorize need level based on score

        Args:
            need_score: Calculated need score (0-100)

        Returns:
            Need category string
        """
        if need_score >= 75:
            return "critical"
        elif need_score >= 50:
            return "high"
        elif need_score >= 25:
            return "moderate"
        else:
            return "low"

    async def filter_high_need_tracts(
        self,
        state_fips: str = "13",
        min_poverty_rate: float = None,
        min_no_internet_pct: float = None
    ) -> List[Dict]:
        """
        Filter tracts that meet minimum thresholds for high need

        Args:
            state_fips: State FIPS code
            min_poverty_rate: Minimum poverty rate threshold
            min_no_internet_pct: Minimum percent without internet threshold

        Returns:
            List of high-need tracts
        """
        # Default thresholds
        min_poverty_rate = min_poverty_rate or 20.0
        min_no_internet_pct = min_no_internet_pct or 15.0

        census_data = await self.census_client.get_combined_data(state_fips)

        high_need_tracts = []

        for tract in census_data:
            poverty_rate = tract.get('poverty_rate', 0)
            no_internet_pct = tract.get('no_internet_pct', 0)

            if (poverty_rate >= min_poverty_rate or
                no_internet_pct >= min_no_internet_pct):

                high_need_tracts.append(tract)

        return high_need_tracts

    async def get_summary_statistics(
        self,
        scored_tracts: List[Dict]
    ) -> Dict:
        """
        Generate summary statistics for scored tracts

        Args:
            scored_tracts: List of scored tract data

        Returns:
            Dict with summary statistics
        """
        if not scored_tracts:
            return {}

        total_tracts = len(scored_tracts)
        critical_need = len([t for t in scored_tracts if t['need_category'] == 'critical'])
        high_need = len([t for t in scored_tracts if t['need_category'] == 'high'])

        avg_poverty_rate = sum(t.get('poverty_rate', 0) for t in scored_tracts) / total_tracts
        avg_no_internet = sum(t.get('no_internet_pct', 0) for t in scored_tracts) / total_tracts

        total_population = sum(t.get('total_population', 0) for t in scored_tracts)
        total_below_poverty = sum(t.get('below_poverty_count', 0) for t in scored_tracts)

        return {
            'total_tracts_analyzed': total_tracts,
            'critical_need_tracts': critical_need,
            'high_need_tracts': high_need,
            'avg_poverty_rate': round(avg_poverty_rate, 2),
            'avg_no_internet_pct': round(avg_no_internet, 2),
            'total_population': total_population,
            'total_below_poverty': total_below_poverty,
            'top_10_tracts': scored_tracts[:10]
        }
