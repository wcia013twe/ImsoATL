"""
Census Block Data Loader

Loads Census block shapefiles and provides utilities for:
- Filtering blocks within a tract
- Calculating block centroids
- Indexing blocks by tract GEOID
"""

import logging
from pathlib import Path
from typing import Dict, List, Optional
import shapefile  # pyshp library
from shapely.geometry import shape, Point, Polygon
from functools import lru_cache

logger = logging.getLogger(__name__)


class CensusBlockLoader:
    """Loads and indexes Census block shapefiles for efficient lookup"""

    def __init__(self, shapefile_path: str):
        """
        Initialize block loader with path to shapefile

        Args:
            shapefile_path: Path to Census block shapefile (.shp)
        """
        self.shapefile_path = Path(shapefile_path)
        if not self.shapefile_path.exists():
            raise FileNotFoundError(f"Shapefile not found: {shapefile_path}")

        logger.info(f"Initializing Census block loader from {shapefile_path}")
        self._blocks_by_tract = None  # Lazy load

    @lru_cache(maxsize=1)
    def _load_blocks(self) -> Dict[str, List[Dict]]:
        """
        Load all blocks from shapefile and index by tract GEOID

        Returns:
            Dict mapping tract GEOID (11 digits) -> List of block features
        """
        logger.info("Loading Census blocks from shapefile...")
        blocks_by_tract = {}
        total_blocks = 0

        # Remove .shp extension if present
        shp_path_str = str(self.shapefile_path).replace('.shp', '')

        logger.info(f"Opening shapefile: {shp_path_str}")

        # Open shapefile using pyshp
        with shapefile.Reader(shp_path_str) as sf:
            # Get field names
            field_names = [field[0] for field in sf.fields[1:]]  # Skip deletion flag field
            logger.info(f"Shapefile fields: {field_names}")

            total_records = len(sf)
            logger.info(f"Total records in shapefile: {total_records}")

            # Process records with progress logging
            for idx, shape_record in enumerate(sf.shapeRecords()):
                # Log progress every 50,000 records
                if idx > 0 and idx % 50000 == 0:
                    logger.info(f"  Progress: {idx}/{total_records} records processed ({(idx/total_records)*100:.1f}%)")

                # Get attributes
                record = dict(zip(field_names, shape_record.record))
                geoid = record.get('GEOID20')

                if not geoid or len(geoid) < 11:
                    continue

                # Extract tract GEOID (first 11 digits of block GEOID)
                # Format: SSCCCTTTTTTBBBB (State+County+Tract+Block)
                tract_geoid = geoid[:11]

                # Convert shapefile geometry to shapely geometry
                geom_dict = shape_record.shape.__geo_interface__
                geom = shape(geom_dict)

                # Store block data
                block_data = {
                    'geoid': geoid,
                    'geometry': geom,
                    'land_area_m2': record.get('ALAND20', 0),
                    'water_area_m2': record.get('AWATER20', 0),
                }

                if tract_geoid not in blocks_by_tract:
                    blocks_by_tract[tract_geoid] = []

                blocks_by_tract[tract_geoid].append(block_data)
                total_blocks += 1

        logger.info(f"✓ Loaded {total_blocks} blocks across {len(blocks_by_tract)} tracts")
        return blocks_by_tract

    def get_blocks_for_tract(self, tract_geoid: str) -> List[Dict]:
        """
        Get all Census blocks within a tract

        Args:
            tract_geoid: 11-digit tract GEOID

        Returns:
            List of block dictionaries with geometry and attributes
        """
        if self._blocks_by_tract is None:
            self._blocks_by_tract = self._load_blocks()

        return self._blocks_by_tract.get(tract_geoid, [])

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
            if tract_geometry.intersects(block['geometry']):
                # Add centroid for convenience
                centroid = block['geometry'].centroid
                block['centroid'] = {
                    'lng': centroid.x,
                    'lat': centroid.y
                }
                filtered_blocks.append(block)

        return filtered_blocks


# Global singleton instance (lazy-loaded)
_block_loader: Optional[CensusBlockLoader] = None


def get_block_loader(shapefile_path: Optional[str] = None) -> CensusBlockLoader:
    """
    Get or create the global Census block loader instance

    Args:
        shapefile_path: Path to shapefile (required on first call)

    Returns:
        CensusBlockLoader instance
    """
    global _block_loader

    if _block_loader is None:
        if shapefile_path is None:
            # Default path
            project_root = Path(__file__).parent.parent.parent.parent
            shapefile_path = str(project_root / "data/tl_2024_12_tabblock20/tl_2024_12_tabblock20.shp")

        _block_loader = CensusBlockLoader(shapefile_path)

    return _block_loader
