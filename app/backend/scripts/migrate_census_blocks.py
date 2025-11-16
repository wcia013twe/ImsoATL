"""
Census Block Data Migration Script

Loads Census block shapefiles into Snowflake for fast querying.

This script:
1. Reads Census block shapefiles (390K blocks for Florida)
2. Transforms geometries to WKT format
3. Batch loads data into Snowflake CENSUS_BLOCKS table

Usage:
    python scripts/migrate_census_blocks.py [--state STATE] [--batch-size SIZE]

Arguments:
    --state: State FIPS code or abbreviation (default: FL/12)
    --batch-size: Number of records per batch insert (default: 1000)
"""

import sys
import argparse
import logging
from pathlib import Path
from typing import List, Tuple
import shapefile  # pyshp library
from shapely.geometry import shape

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from config.snowflake_config import get_connection

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def load_blocks_from_shapefile(shapefile_path: str) -> List[Tuple]:
    """
    Load Census blocks from shapefile

    Args:
        shapefile_path: Path to Census block shapefile (.shp)

    Returns:
        List of tuples: (geoid, tract_geoid, geometry_wkt, land_area_m2, water_area_m2)
    """
    logger.info(f"Loading Census blocks from: {shapefile_path}")

    shapefile_path = Path(shapefile_path)
    if not shapefile_path.exists():
        raise FileNotFoundError(f"Shapefile not found: {shapefile_path}")

    # Remove .shp extension if present
    shp_path_str = str(shapefile_path).replace('.shp', '')

    blocks_data = []

    # Open shapefile using pyshp
    with shapefile.Reader(shp_path_str) as sf:
        # Get field names
        field_names = [field[0] for field in sf.fields[1:]]  # Skip deletion flag field
        logger.info(f"Shapefile fields: {field_names}")

        total_records = len(sf)
        logger.info(f"Total records in shapefile: {total_records:,}")

        # Process records with progress logging
        for idx, shape_record in enumerate(sf.shapeRecords()):
            # Log progress every 50,000 records
            if idx > 0 and idx % 50000 == 0:
                logger.info(
                    f"  Progress: {idx:,}/{total_records:,} records processed "
                    f"({(idx/total_records)*100:.1f}%)"
                )

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

            # Convert to WKT (Well-Known Text) for Snowflake GEOGRAPHY type
            geometry_wkt = geom.wkt

            # Get area attributes
            land_area_m2 = float(record.get('ALAND20', 0))
            water_area_m2 = float(record.get('AWATER20', 0))

            # Prepare tuple for batch insert
            blocks_data.append((
                geoid,
                tract_geoid,
                geometry_wkt,
                land_area_m2,
                water_area_m2
            ))

    logger.info(f"✓ Loaded {len(blocks_data):,} blocks from shapefile")
    return blocks_data


def create_table_if_not_exists(conn):
    """
    Create CENSUS_BLOCKS table if it doesn't exist

    Args:
        conn: Snowflake connection
    """
    logger.info("Ensuring CENSUS_BLOCKS table exists...")

    cursor = conn.cursor()

    create_table_sql = """
    CREATE TABLE IF NOT EXISTS CENSUS_BLOCKS (
        BLOCK_GEOID VARCHAR(15) PRIMARY KEY,
        TRACT_GEOID VARCHAR(11) NOT NULL,
        GEOMETRY_WKT TEXT,
        LAND_AREA_M2 FLOAT,
        WATER_AREA_M2 FLOAT,
        CREATED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
    )
    """

    cursor.execute(create_table_sql)
    conn.commit()
    cursor.close()

    logger.info("✓ CENSUS_BLOCKS table ready")


def batch_insert_blocks(conn, blocks_data: List[Tuple], batch_size: int = 1000):
    """
    Batch insert Census blocks into Snowflake

    Args:
        conn: Snowflake connection
        blocks_data: List of block tuples
        batch_size: Number of records per batch
    """
    logger.info(f"Inserting {len(blocks_data):,} blocks in batches of {batch_size:,}...")

    cursor = conn.cursor()

    insert_sql = """
    INSERT INTO CENSUS_BLOCKS (
        BLOCK_GEOID,
        TRACT_GEOID,
        GEOMETRY_WKT,
        LAND_AREA_M2,
        WATER_AREA_M2
    ) VALUES (?, ?, ?, ?, ?)
    """

    total_batches = (len(blocks_data) + batch_size - 1) // batch_size
    total_inserted = 0

    for batch_idx in range(0, len(blocks_data), batch_size):
        batch = blocks_data[batch_idx:batch_idx + batch_size]
        batch_num = (batch_idx // batch_size) + 1

        try:
            # Use execute with binding for each row instead of executemany
            for row in batch:
                cursor.execute(insert_sql, row)
            conn.commit()

            total_inserted += len(batch)

            logger.info(
                f"  ✓ Batch {batch_num}/{total_batches} complete "
                f"({total_inserted:,}/{len(blocks_data):,} records - "
                f"{(total_inserted/len(blocks_data))*100:.1f}%)"
            )

        except Exception as e:
            logger.error(f"  ✗ Batch {batch_num} failed: {e}")
            conn.rollback()
            raise

    cursor.close()
    logger.info(f"✓ Successfully inserted {total_inserted:,} blocks")


def create_indexes(conn):
    """
    Create indexes for faster querying

    Args:
        conn: Snowflake connection
    """
    logger.info("Creating indexes...")

    cursor = conn.cursor()

    # Index on TRACT_GEOID for fast tract-based lookups
    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_tract_geoid
        ON CENSUS_BLOCKS(TRACT_GEOID)
    """)

    conn.commit()
    cursor.close()

    logger.info("✓ Indexes created")


def verify_data(conn):
    """
    Verify data was loaded correctly

    Args:
        conn: Snowflake connection
    """
    logger.info("Verifying data...")

    cursor = conn.cursor()

    # Count total records
    cursor.execute("SELECT COUNT(*) FROM CENSUS_BLOCKS")
    total_blocks = cursor.fetchone()[0]
    logger.info(f"  Total blocks in Snowflake: {total_blocks:,}")

    # Count unique tracts
    cursor.execute("SELECT COUNT(DISTINCT TRACT_GEOID) FROM CENSUS_BLOCKS")
    total_tracts = cursor.fetchone()[0]
    logger.info(f"  Unique tracts: {total_tracts:,}")

    # Sample a few records
    cursor.execute("""
        SELECT BLOCK_GEOID, TRACT_GEOID, LAND_AREA_M2
        FROM CENSUS_BLOCKS
        LIMIT 5
    """)

    logger.info("  Sample records:")
    for row in cursor:
        logger.info(f"    Block {row[0]}: Tract {row[1]}, Area {row[2]:,.0f} m²")

    cursor.close()
    logger.info("✓ Data verification complete")


def main():
    """Main migration script"""
    parser = argparse.ArgumentParser(
        description='Migrate Census block data to Snowflake'
    )
    parser.add_argument(
        '--state',
        default='12',
        help='State FIPS code (default: 12 for Florida)'
    )
    parser.add_argument(
        '--batch-size',
        type=int,
        default=1000,
        help='Batch size for inserts (default: 1000)'
    )
    parser.add_argument(
        '--shapefile',
        help='Path to shapefile (overrides default path)'
    )

    args = parser.parse_args()

    # Determine shapefile path
    if args.shapefile:
        shapefile_path = args.shapefile
    else:
        # Default path for Florida
        project_root = Path(__file__).parent.parent.parent.parent
        shapefile_path = str(
            project_root / f"data/tl_2024_{args.state}_tabblock20/tl_2024_{args.state}_tabblock20.shp"
        )

    logger.info("=" * 80)
    logger.info("Census Block Migration to Snowflake")
    logger.info("=" * 80)
    logger.info(f"State FIPS: {args.state}")
    logger.info(f"Shapefile: {shapefile_path}")
    logger.info(f"Batch size: {args.batch_size:,}")
    logger.info("=" * 80)

    try:
        # Step 1: Load blocks from shapefile
        logger.info("\n[1/5] Loading blocks from shapefile...")
        blocks_data = load_blocks_from_shapefile(shapefile_path)

        # Step 2: Connect to Snowflake
        logger.info("\n[2/5] Connecting to Snowflake...")
        conn = get_connection()

        # Step 3: Create table
        logger.info("\n[3/5] Creating table...")
        create_table_if_not_exists(conn)

        # Step 4: Insert data
        logger.info("\n[4/5] Inserting data...")
        batch_insert_blocks(conn, blocks_data, batch_size=args.batch_size)

        # Step 5: Create indexes and verify
        logger.info("\n[5/5] Creating indexes and verifying...")
        create_indexes(conn)
        verify_data(conn)

        conn.close()

        logger.info("\n" + "=" * 80)
        logger.info("✓ Migration completed successfully!")
        logger.info("=" * 80)

    except Exception as e:
        logger.error(f"\n✗ Migration failed: {e}")
        raise


if __name__ == "__main__":
    main()
