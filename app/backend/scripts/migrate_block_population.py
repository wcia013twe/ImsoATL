"""
Census Block Population Data Migration Script

Fetches block-level population from Census Decennial 2020 API and loads into Snowflake.

This script:
1. Queries existing Census blocks from Snowflake (by tract)
2. Fetches population data from Census API for each tract
3. Updates CENSUS_BLOCKS table with population counts

Usage:
    python scripts/migrate_block_population.py [--state STATE] [--batch-size SIZE]

Arguments:
    --state: State FIPS code (default: 12 for Florida)
    --batch-size: Number of tracts to process per batch (default: 100)
"""

import sys
import argparse
import logging
from pathlib import Path
from typing import Dict, List, Set
import requests
from time import sleep

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.snowflake_config import get_connection

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Census API endpoint
CENSUS_BLOCK_API = "https://api.census.gov/data/2020/dec/pl"


def get_unique_tracts_from_snowflake(state_fips: str) -> List[str]:
    """
    Get list of unique tract GEOIDs from Snowflake

    Args:
        state_fips: State FIPS code (2 digits)

    Returns:
        List of tract GEOIDs (11 digits)
    """
    logger.info(f"Fetching unique tracts for state {state_fips} from Snowflake...")

    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        # Get unique tract GEOIDs for the state
        query = """
            SELECT DISTINCT TRACT_GEOID
            FROM CENSUS_BLOCKS
            WHERE SUBSTRING(TRACT_GEOID, 1, 2) = %s
            ORDER BY TRACT_GEOID
        """

        cursor.execute(query, (state_fips,))
        results = cursor.fetchall()

        tract_geoids = [row[0] for row in results]

        cursor.close()
        logger.info(f"✓ Found {len(tract_geoids):,} unique tracts")

        return tract_geoids

    finally:
        if conn:
            conn.close()


def fetch_block_population_for_tract(tract_geoid: str) -> Dict[str, int]:
    """
    Fetch population counts for all Census blocks within a tract

    Args:
        tract_geoid: 11-digit tract GEOID (SSCCCTTTTTT format)

    Returns:
        Dictionary mapping full block GEOID (15 digits) -> population count
    """
    if len(tract_geoid) != 11:
        logger.error(f"Invalid tract GEOID length: {tract_geoid}")
        return {}

    state_fips = tract_geoid[:2]
    county_fips = tract_geoid[2:5]
    tract_code = tract_geoid[5:11]

    try:
        params = {
            'get': 'P1_001N',  # Total population variable
            'for': 'block:*',
            'in': f'state:{state_fips}+county:{county_fips}+tract:{tract_code}'
        }

        response = requests.get(CENSUS_BLOCK_API, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()

        if not data or len(data) < 2:
            logger.warning(f"No data returned for tract {tract_geoid}")
            return {}

        # Parse response
        # First row is headers: ['P1_001N', 'state', 'county', 'tract', 'block']
        # Subsequent rows are data values
        headers = data[0]
        pop_idx = headers.index('P1_001N')
        state_idx = headers.index('state')
        county_idx = headers.index('county')
        tract_idx = headers.index('tract')
        block_idx = headers.index('block')

        block_population = {}

        for row in data[1:]:
            try:
                population = int(row[pop_idx]) if row[pop_idx] else 0
                state = row[state_idx]
                county = row[county_idx]
                tract = row[tract_idx]
                block = row[block_idx]

                # Build full 15-digit GEOID: SSCCCTTTTTTBBBB
                block_geoid = f"{state}{county}{tract}{block}"

                block_population[block_geoid] = population

            except (ValueError, IndexError) as e:
                logger.warning(f"Skipping invalid row: {row}, error: {e}")
                continue

        return block_population

    except requests.RequestException as e:
        logger.error(f"Failed to fetch block population for tract {tract_geoid}: {e}")
        return {}


def add_population_column_if_needed(conn):
    """
    Add POPULATION column to CENSUS_BLOCKS table if it doesn't exist

    Args:
        conn: Snowflake connection
    """
    logger.info("Ensuring POPULATION column exists...")

    cursor = conn.cursor()

    # Check if column exists
    cursor.execute("""
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'FLORIDA'
          AND TABLE_NAME = 'CENSUS_BLOCKS'
          AND COLUMN_NAME = 'POPULATION'
    """)

    result = cursor.fetchone()
    column_exists = result[0] > 0

    if not column_exists:
        logger.info("Adding POPULATION column...")
        cursor.execute("""
            ALTER TABLE CENSUS_BLOCKS
            ADD COLUMN POPULATION INT DEFAULT 0
        """)
        conn.commit()
        logger.info("✓ POPULATION column added")
    else:
        logger.info("✓ POPULATION column already exists")

    cursor.close()


def update_block_population_batch(conn, block_population: Dict[str, int]):
    """
    Update population for a batch of blocks

    Args:
        conn: Snowflake connection
        block_population: Dictionary mapping block GEOID -> population
    """
    if not block_population:
        return

    cursor = conn.cursor()

    update_sql = """
        UPDATE CENSUS_BLOCKS
        SET POPULATION = %s
        WHERE BLOCK_GEOID = %s
    """

    # Prepare data as list of tuples (population, geoid)
    update_data = [(pop, geoid) for geoid, pop in block_population.items()]

    try:
        cursor.executemany(update_sql, update_data)
        conn.commit()

        logger.info(f"  ✓ Updated {len(update_data):,} blocks with population data")

    except Exception as e:
        logger.error(f"  ✗ Batch update failed: {e}")
        conn.rollback()
        raise

    finally:
        cursor.close()


def verify_population_data(conn, state_fips: str):
    """
    Verify population data was loaded correctly

    Args:
        conn: Snowflake connection
        state_fips: State FIPS code
    """
    logger.info("Verifying population data...")

    cursor = conn.cursor()

    # Count blocks with population data
    cursor.execute(f"""
        SELECT COUNT(*) as total_blocks,
               SUM(CASE WHEN POPULATION > 0 THEN 1 ELSE 0 END) as populated_blocks,
               SUM(POPULATION) as total_population,
               AVG(POPULATION) as avg_population
        FROM CENSUS_BLOCKS
        WHERE SUBSTRING(TRACT_GEOID, 1, 2) = '{state_fips}'
    """)

    row = cursor.fetchone()
    total_blocks, populated_blocks, total_pop, avg_pop = row

    logger.info(f"  Total blocks: {total_blocks:,}")
    logger.info(f"  Blocks with population > 0: {populated_blocks:,} ({(populated_blocks/total_blocks)*100:.1f}%)")
    logger.info(f"  Total population: {total_pop:,}")
    logger.info(f"  Average population per block: {avg_pop:.1f}")

    # Sample some populated blocks
    cursor.execute(f"""
        SELECT BLOCK_GEOID, TRACT_GEOID, POPULATION, LAND_AREA_M2
        FROM CENSUS_BLOCKS
        WHERE SUBSTRING(TRACT_GEOID, 1, 2) = '{state_fips}'
          AND POPULATION > 0
        ORDER BY POPULATION DESC
        LIMIT 5
    """)

    logger.info("  Top 5 most populated blocks:")
    for row in cursor:
        block_geoid, tract_geoid, population, land_area = row
        logger.info(f"    Block {block_geoid}: {population:,} people, {land_area:,.0f} m² land")

    cursor.close()
    logger.info("✓ Population data verification complete")


def main():
    """Main migration script"""
    parser = argparse.ArgumentParser(
        description='Migrate Census block population data to Snowflake'
    )
    parser.add_argument(
        '--state',
        default='12',
        help='State FIPS code (default: 12 for Florida)'
    )
    parser.add_argument(
        '--batch-size',
        type=int,
        default=100,
        help='Number of tracts to process per batch (default: 100)'
    )

    args = parser.parse_args()

    logger.info("=" * 80)
    logger.info("Census Block Population Migration to Snowflake")
    logger.info("=" * 80)
    logger.info(f"State FIPS: {args.state}")
    logger.info(f"Batch size: {args.batch_size:,} tracts")
    logger.info("=" * 80)

    try:
        # Step 1: Get unique tracts from Snowflake
        logger.info("\n[1/4] Fetching unique tracts from Snowflake...")
        tract_geoids = get_unique_tracts_from_snowflake(args.state)

        if not tract_geoids:
            logger.error("No tracts found in Snowflake. Run migrate_census_blocks.py first.")
            return

        # Step 2: Add population column
        logger.info("\n[2/4] Preparing database schema...")
        conn = get_connection()
        add_population_column_if_needed(conn)
        conn.close()

        # Step 3: Fetch and load population data
        logger.info(f"\n[3/4] Fetching population data for {len(tract_geoids):,} tracts...")

        total_tracts = len(tract_geoids)
        processed_tracts = 0
        failed_tracts = []

        conn = get_connection()

        for i, tract_geoid in enumerate(tract_geoids, 1):
            try:
                # Fetch population data from Census API
                block_population = fetch_block_population_for_tract(tract_geoid)

                if block_population:
                    # Update Snowflake
                    update_block_population_batch(conn, block_population)
                    processed_tracts += 1

                    # Log progress
                    if i % 10 == 0:
                        logger.info(f"  Progress: {i:,}/{total_tracts:,} tracts ({(i/total_tracts)*100:.1f}%)")

                    # Rate limiting: Sleep briefly to avoid hitting API limits
                    if i % 50 == 0:
                        logger.info("  Pausing briefly to respect API rate limits...")
                        sleep(2)

                else:
                    logger.warning(f"  No population data for tract {tract_geoid}")
                    failed_tracts.append(tract_geoid)

            except Exception as e:
                logger.error(f"  Failed to process tract {tract_geoid}: {e}")
                failed_tracts.append(tract_geoid)
                continue

        conn.close()

        logger.info(f"\n  ✓ Successfully processed {processed_tracts:,}/{total_tracts:,} tracts")
        if failed_tracts:
            logger.warning(f"  Failed tracts: {len(failed_tracts)}")

        # Step 4: Verify data
        logger.info("\n[4/4] Verifying population data...")
        conn = get_connection()
        verify_population_data(conn, args.state)
        conn.close()

        logger.info("\n" + "=" * 80)
        logger.info("✓ Population data migration completed successfully!")
        logger.info("=" * 80)

    except Exception as e:
        logger.error(f"\n✗ Migration failed: {e}")
        raise


if __name__ == "__main__":
    main()
