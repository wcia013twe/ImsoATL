from typing import List, Dict

from app.backend.config import CENSUS_API_KEY
from app.backend.data_sources.census_client import CensusClient


class CensusDataTool:
    """Tool to fetch census data for a given state."""

    def __init__(self, api_key: str | None = None):
        key = api_key or CENSUS_API_KEY
        if not key:
            raise ValueError(
                "CensusDataTool requires a Census API key. "
                "Set CENSUS_API_KEY in your environment."
            )
        self.client = CensusClient(api_key=key)

    def run(self, state_fips: str) -> List[Dict]:
        """Fetches and returns census data for the specified state."""
        return self.client.get_combined_data(state_fips=state_fips)
