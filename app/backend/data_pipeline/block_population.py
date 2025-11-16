"""
Census Block Population Data Fetcher

Fetches population counts for Census blocks from the Decennial Census API
"""

import logging
import requests
from typing import Dict, List, Optional
from functools import lru_cache

logger = logging.getLogger(__name__)

# Census Decennial 2020 API endpoint for block-level population
CENSUS_BLOCK_API = "https://api.census.gov/data/2020/dec/pl"


@lru_cache(maxsize=100)
def fetch_block_population_for_tract(tract_geoid: str) -> Dict[str, int]:
    """
    Fetch population counts for all Census blocks within a tract

    Args:
        tract_geoid: 11-digit tract GEOID (SSCCCTTTTTT format)
                    Example: "12047960202" (State 12, County 047, Tract 960202)

    Returns:
        Dictionary mapping full block GEOID (15 digits) -> population count

    Example:
        {
            "120479602021001": 250,
            "120479602021002": 180,
            ...
        }
    """
    if len(tract_geoid) != 11:
        logger.error(f"Invalid tract GEOID length: {tract_geoid} (expected 11 digits)")
        return {}

    # Parse tract GEOID components
    state_fips = tract_geoid[:2]
    county_fips = tract_geoid[2:5]
    tract_code = tract_geoid[5:11]

    logger.info(f"Fetching block population for tract {tract_geoid}...")

    try:
        # Query parameters for Census API
        # P1_001N = Total Population (2020 Decennial Census)
        params = {
            'get': 'P1_001N',  # Total population variable
            'for': 'block:*',  # All blocks
            'in': f'state:{state_fips}+county:{county_fips}+tract:{tract_code}'
        }

        response = requests.get(CENSUS_BLOCK_API, params=params, timeout=30)
        response.raise_for_status()

        data = response.json()

        # Parse response
        # Format: [["P1_001N", "state", "county", "tract", "block"], ["250", "12", "047", "960202", "1001"], ...]
        if len(data) < 2:
            logger.warning(f"No block data returned for tract {tract_geoid}")
            return {}

        headers = data[0]
        rows = data[1:]

        # Find column indices
        try:
            pop_idx = headers.index('P1_001N')
            state_idx = headers.index('state')
            county_idx = headers.index('county')
            tract_idx = headers.index('tract')
            block_idx = headers.index('block')
        except ValueError as e:
            logger.error(f"Missing expected column in Census API response: {e}")
            return {}

        # Build GEOID -> population map
        block_population = {}
        for row in rows:
            try:
                population = int(row[pop_idx])
                state = row[state_idx]
                county = row[county_idx]
                tract = row[tract_idx]
                block = row[block_idx]

                # Construct full 15-digit block GEOID
                # Format: SSCCCTTTTTTBBBB
                full_geoid = f"{state}{county}{tract}{block}"

                block_population[full_geoid] = population

            except (ValueError, IndexError) as e:
                logger.warning(f"Skipping invalid row: {row} - {e}")
                continue

        logger.info(f"✓ Fetched population for {len(block_population)} blocks in tract {tract_geoid}")
        return block_population

    except requests.RequestException as e:
        logger.error(f"Failed to fetch block population from Census API: {e}")
        return {}
    except Exception as e:
        logger.error(f"Unexpected error fetching block population: {e}")
        return {}


def fetch_block_population_for_tracts(tract_geoids: List[str]) -> Dict[str, int]:
    """
    Fetch population for blocks across multiple tracts

    Args:
        tract_geoids: List of 11-digit tract GEOIDs

    Returns:
        Dictionary mapping block GEOID -> population for all tracts
    """
    all_block_population = {}

    for tract_geoid in tract_geoids:
        tract_blocks = fetch_block_population_for_tract(tract_geoid)
        all_block_population.update(tract_blocks)

    logger.info(f"✓ Fetched population for {len(all_block_population)} total blocks across {len(tract_geoids)} tracts")
    return all_block_population
