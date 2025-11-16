"""
Snowflake Census Block Query Module

Replaces shapefile-based block loading with fast Snowflake queries.

This module provides:
- Fast block queries by tract GEOID (<1 second vs 5+ minutes)
- Population data included (no separate Census API calls needed)
- Spatial filtering with Shapely geometries
- Connection pooling and caching
"""

import logging
from typing import Dict, List, Optional
from functools import lru_cache
from shapely.geometry import shape
from shapely import wkt
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.snowflake_config import get_connection

logger = logging.getLogger(__name__)


class SnowflakeBlockLoader:
    """Queries Census blocks from Snowflake for efficient lookup"""

    def __init__(self):
        """Initialize Snowflake block loader"""
        logger.info("Initializing Snowflake Census block loader")
        self._test_connection()

    def _test_connection(self):
        """Test Snowflake connection on initialization"""
        try:
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM CENSUS_BLOCKS")
            total_blocks = cursor.fetchone()[0]
            cursor.close()
            conn.close()
            logger.info(f"✓ Connected to Snowflake: {total_blocks:,} blocks available")
        except Exception as e:
            logger.error(f"Failed to connect to Snowflake: {e}")
            raise

    @lru_cache(maxsize=500)
    def get_blocks_for_tract(self, tract_geoid: str) -> List[Dict]:
        """
        Get all Census blocks within a tract from Snowflake

        Args:
            tract_geoid: 11-digit tract GEOID

        Returns:
            List of block dictionaries with geometry, population, and attributes
        """
        logger.info(f"Querying Snowflake for blocks in tract {tract_geoid}")

        conn = None
        try:
            conn = get_connection()
            cursor = conn.cursor()

            query = """
                SELECT
                    BLOCK_GEOID,
                    TRACT_GEOID,
                    GEOMETRY_WKT,
                    LAND_AREA_M2,
                    WATER_AREA_M2,
                    COALESCE(POPULATION, 0) as population
                FROM CENSUS_BLOCKS
                WHERE TRACT_GEOID = %s
            """

            cursor.execute(query, (tract_geoid,))
            results = cursor.fetchall()

            blocks = []
            for row in results:
                block_geoid, tract_geoid, geometry_wkt, land_area_m2, water_area_m2, population = row

                # Convert WKT to Shapely geometry
                try:
                    geom = wkt.loads(geometry_wkt)
                except Exception as e:
                    logger.warning(f"Failed to parse geometry for block {block_geoid}: {e}")
                    continue

                # Calculate centroid
                centroid = geom.centroid

                block_data = {
                    'geoid': block_geoid,
                    'geometry': geom,
                    'land_area_m2': float(land_area_m2) if land_area_m2 else 0,
                    'water_area_m2': float(water_area_m2) if water_area_m2 else 0,
                    'population': int(population) if population else 0,
                    'centroid': {
                        'lng': centroid.x,
                        'lat': centroid.y
                    }
                }

                blocks.append(block_data)

            cursor.close()

            logger.info(f"✓ Retrieved {len(blocks)} blocks for tract {tract_geoid}")
            return blocks

        except Exception as e:
            logger.error(f"Failed to query blocks for tract {tract_geoid}: {e}")
            return []

        finally:
            if conn:
                conn.close()

    def get_blocks_within_geometry(self, tract_geoid: str, tract_geometry) -> List[Dict]:
        """
        Get blocks within a tract that intersect with tract geometry

        Args:
            tract_geoid: 11-digit tract GEOID
            tract_geometry: Shapely geometry for spatial filtering

        Returns:
            List of blocks that intersect with the tract boundary
        """
        blocks = self.get_blocks_for_tract(tract_geoid)

        # Filter by spatial intersection
        filtered_blocks = []
        for block in blocks:
            try:
                if tract_geometry.intersects(block['geometry']):
                    filtered_blocks.append(block)
            except Exception as e:
                logger.warning(f"Spatial intersection failed for block {block['geoid']}: {e}")
                continue

        logger.info(
            f"Filtered to {len(filtered_blocks)}/{len(blocks)} blocks within geometry"
        )

        return filtered_blocks

    def get_blocks_with_population_for_tracts(self, tract_geoids: List[str]) -> Dict[str, int]:
        """
        Batch query to get population for all blocks in multiple tracts

        Args:
            tract_geoids: List of 11-digit tract GEOIDs

        Returns:
            Dictionary mapping block GEOID -> population count
        """
        if not tract_geoids:
            return {}

        logger.info(f"Batch querying population for {len(tract_geoids)} tracts")

        conn = None
        try:
            conn = get_connection()
            cursor = conn.cursor()

            # Build parameterized query for multiple tracts
            placeholders = ','.join(['%s'] * len(tract_geoids))
            query = f"""
                SELECT
                    BLOCK_GEOID,
                    COALESCE(POPULATION, 0) as population
                FROM CENSUS_BLOCKS
                WHERE TRACT_GEOID IN ({placeholders})
            """

            cursor.execute(query, tract_geoids)
            results = cursor.fetchall()

            block_population = {}
            for block_geoid, population in results:
                block_population[block_geoid] = int(population) if population else 0

            cursor.close()

            logger.info(f"✓ Retrieved population for {len(block_population):,} blocks")
            return block_population

        except Exception as e:
            logger.error(f"Failed to batch query block population: {e}")
            return {}

        finally:
            if conn:
                conn.close()

    def clear_cache(self):
        """Clear the LRU cache for fresh queries"""
        self.get_blocks_for_tract.cache_clear()
        logger.info("Cache cleared")


# Global singleton instance (lazy-loaded)
_snowflake_loader: Optional[SnowflakeBlockLoader] = None


def get_snowflake_block_loader() -> SnowflakeBlockLoader:
    """
    Get or create the global Snowflake block loader instance

    Returns:
        SnowflakeBlockLoader instance
    """
    global _snowflake_loader

    if _snowflake_loader is None:
        _snowflake_loader = SnowflakeBlockLoader()

    return _snowflake_loader


def fetch_block_population_for_tracts(tract_geoids: List[str]) -> Dict[str, int]:
    """
    Convenience function to fetch population data for multiple tracts

    This replaces the Census API calls with a fast Snowflake query.

    Args:
        tract_geoids: List of 11-digit tract GEOIDs

    Returns:
        Dictionary mapping block GEOID -> population count
    """
    loader = get_snowflake_block_loader()
    return loader.get_blocks_with_population_for_tracts(tract_geoids)
