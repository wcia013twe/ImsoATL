from typing import List, Dict
import os

from data_sources.census_client import CensusDataClient


class CensusDataTool:
    """Tool to fetch census data for a given state."""

    def __init__(self, api_key: str | None = None):
        key = api_key or os.getenv("CENSUS_API_KEY")
        if not key:
            raise ValueError(
                "CensusDataTool requires a Census API key. "
                "Set CENSUS_API_KEY in your environment."
            )
        self.client = CensusDataClient(api_key=key)

    async def run(self, state_fips: str) -> List[Dict]:
        """Fetches and returns census data for the specified state."""
        return await self.client.get_combined_data(state_fips=state_fips)
