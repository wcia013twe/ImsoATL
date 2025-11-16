# Snowflake Census Block Cache - Implementation Plan

  1. Subagent-Driven (this session) - I dispatch fresh subagent per task, review between
   tasks, fast iteration with quality gates

**Date:** 2025-11-16
**Scope:** Option A - Cache Layer Only
**Estimated Time:** 4-6 hours
**Goal:** Replace slow shapefile loading (5 min/request) with fast Snowflake queries (<1 sec)

---

## Overview

Migrate Census block geometry and population data from local shapefiles to Snowflake for persistent, fast access. This eliminates the 5-minute shapefile load on every API request and provides foundation for multi-state expansion.

**What We're Building:**
- Snowflake database with Census block geometries + population
- Python backend queries Snowflake instead of reading shapefiles
- One-time bulk load of all Florida blocks (390K blocks)
- Support for density-based WiFi zone placement using Snowflake spatial queries

**What We're NOT Building (Out of Scope):**
- Historical pipeline run storage
- Analytics/dashboards
- Multi-state data (Florida only for now)
- Snowflake-based pipeline logic

---

## Phase 1: Snowflake Account Setup (30 min)

### Task 1.1: Create Snowflake Trial Account
**File:** None (web signup)
**Action:**
1. Go to https://signup.snowflake.com/
2. Select AWS (recommended for US-based app)
3. Choose region: US East (Ohio) or US West (Oregon)
4. Complete email verification
5. Set up username/password

**Verification:**
- Can log into Snowflake web UI
- See default database/warehouse created

---

### Task 1.2: Create ImsoATL Database Schema
**File:** None (Snowflake UI)
**Action:**
Execute in Snowflake worksheet:

```sql
-- Create database
CREATE DATABASE IMSOATL;
USE DATABASE IMSOATL;

-- Create schemas
CREATE SCHEMA CENSUS_DATA;
CREATE SCHEMA CACHE;

-- Create warehouse for data loading
CREATE WAREHOUSE LOADING_WH
  WITH WAREHOUSE_SIZE = 'MEDIUM'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE;

-- Create warehouse for queries (smaller, cheaper)
CREATE WAREHOUSE QUERY_WH
  WITH WAREHOUSE_SIZE = 'X-SMALL'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE;
```

**Verification:**
- Run `SHOW DATABASES;` - see IMSOATL
- Run `SHOW SCHEMAS;` - see CENSUS_DATA, CACHE
- Run `SHOW WAREHOUSES;` - see both warehouses

---

### Task 1.3: Create Census Block Tables
**File:** None (Snowflake UI)
**Action:**
Execute in Snowflake worksheet:

```sql
USE SCHEMA IMSOATL.CENSUS_DATA;

-- Census block geometries with spatial data
CREATE TABLE census_blocks (
    geoid VARCHAR(15) PRIMARY KEY,
    state_fips VARCHAR(2),
    county_fips VARCHAR(3),
    tract_code VARCHAR(6),
    block_code VARCHAR(4),

    -- Geometry stored as GEOGRAPHY (native Snowflake spatial type)
    geometry GEOGRAPHY,

    -- Centroid for quick WiFi placement
    centroid_lng FLOAT,
    centroid_lat FLOAT,

    -- Area in square meters
    land_area_m2 BIGINT,
    water_area_m2 BIGINT,

    -- Metadata
    loaded_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- Census block population (from Decennial Census API)
CREATE TABLE census_block_population (
    geoid VARCHAR(15) PRIMARY KEY,
    population INT,
    housing_units INT,

    -- Source tracking
    census_year INT DEFAULT 2020,
    fetched_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),

    FOREIGN KEY (geoid) REFERENCES census_blocks(geoid)
);

-- Index for spatial queries
CREATE INDEX idx_blocks_tract ON census_blocks(state_fips, county_fips, tract_code);
```

**Verification:**
- Run `SHOW TABLES;` - see both tables
- Run `DESCRIBE TABLE census_blocks;` - verify columns

---

## Phase 2: Data Migration (2-3 hours)

### Task 2.1: Install Snowflake Python Connector
**File:** `app/backend/requirements.txt`
**Action:**
Add dependency:
```
snowflake-connector-python==3.6.0
```

Then install:
```bash
cd app/backend
pip install snowflake-connector-python==3.6.0
```

**Verification:**
```bash
python -c "import snowflake.connector; print('Snowflake connector installed')"
```

---

### Task 2.2: Create Snowflake Configuration Module
**File:** `app/backend/config/snowflake_config.py` (NEW)
**Action:**
Create configuration file with connection settings:

```python
"""
Snowflake connection configuration
"""
import os
from typing import Dict

def get_snowflake_config() -> Dict[str, str]:
    """
    Get Snowflake connection parameters from environment variables

    Required environment variables:
    - SNOWFLAKE_ACCOUNT: Account identifier (e.g., abc12345.us-east-1)
    - SNOWFLAKE_USER: Username
    - SNOWFLAKE_PASSWORD: Password
    - SNOWFLAKE_DATABASE: Database name (default: IMSOATL)
    - SNOWFLAKE_SCHEMA: Schema name (default: CENSUS_DATA)
    - SNOWFLAKE_WAREHOUSE: Warehouse name (default: QUERY_WH)

    Returns:
        Dictionary of connection parameters
    """
    return {
        'account': os.getenv('SNOWFLAKE_ACCOUNT'),
        'user': os.getenv('SNOWFLAKE_USER'),
        'password': os.getenv('SNOWFLAKE_PASSWORD'),
        'database': os.getenv('SNOWFLAKE_DATABASE', 'IMSOATL'),
        'schema': os.getenv('SNOWFLAKE_SCHEMA', 'CENSUS_DATA'),
        'warehouse': os.getenv('SNOWFLAKE_WAREHOUSE', 'QUERY_WH'),
    }

def validate_config() -> bool:
    """
    Validate that all required Snowflake config is present

    Returns:
        True if valid, raises ValueError if missing required vars
    """
    config = get_snowflake_config()

    required = ['account', 'user', 'password']
    missing = [k for k in required if not config.get(k)]

    if missing:
        raise ValueError(
            f"Missing required Snowflake environment variables: {', '.join(missing)}"
        )

    return True
```

**Verification:**
Set environment variables in `.env` file:
```bash
SNOWFLAKE_ACCOUNT=your_account.us-east-1
SNOWFLAKE_USER=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_DATABASE=IMSOATL
SNOWFLAKE_SCHEMA=CENSUS_DATA
SNOWFLAKE_WAREHOUSE=QUERY_WH
```

Test:
```bash
python -c "from config.snowflake_config import validate_config; validate_config(); print('Config valid')"
```

---

### Task 2.3: Create Data Migration Script
**File:** `app/backend/data_pipeline/migrate_blocks_to_snowflake.py` (NEW)
**Action:**
Create script to load Census blocks from shapefile to Snowflake:

```python
"""
Migrate Census block data from shapefiles to Snowflake

Reads Florida Census blocks shapefile and loads into Snowflake tables.
"""

import logging
import shapefile
from pathlib import Path
from typing import List, Dict
from shapely.geometry import shape
import snowflake.connector
from config.snowflake_config import get_snowflake_config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def connect_to_snowflake():
    """Establish Snowflake connection"""
    config = get_snowflake_config()
    return snowflake.connector.connect(**config)


def load_blocks_from_shapefile(shapefile_path: str, batch_size: int = 1000):
    """
    Load Census blocks from shapefile and upload to Snowflake in batches

    Args:
        shapefile_path: Path to Census block shapefile
        batch_size: Number of records to insert per batch
    """
    logger.info(f"Loading blocks from {shapefile_path}")

    # Remove .shp extension if present
    shp_path_str = str(shapefile_path).replace('.shp', '')

    conn = connect_to_snowflake()
    cursor = conn.cursor()

    # Switch to loading warehouse for better performance
    cursor.execute("USE WAREHOUSE LOADING_WH")

    try:
        with shapefile.Reader(shp_path_str) as sf:
            field_names = [field[0] for field in sf.fields[1:]]
            total_records = len(sf)
            logger.info(f"Total records to migrate: {total_records}")

            batch = []
            processed = 0

            for idx, shape_record in enumerate(sf.shapeRecords()):
                # Get attributes
                record = dict(zip(field_names, shape_record.record))
                geoid = record.get('GEOID20')

                if not geoid or len(geoid) != 15:
                    continue

                # Parse GEOID components
                state_fips = geoid[:2]
                county_fips = geoid[2:5]
                tract_code = geoid[5:11]
                block_code = geoid[11:15]

                # Convert geometry to WKT for Snowflake
                geom_dict = shape_record.shape.__geo_interface__
                geom = shape(geom_dict)
                geom_wkt = geom.wkt

                # Calculate centroid
                centroid = geom.centroid

                # Prepare row
                row = (
                    geoid,
                    state_fips,
                    county_fips,
                    tract_code,
                    block_code,
                    geom_wkt,  # Snowflake will convert WKT to GEOGRAPHY
                    centroid.x,
                    centroid.y,
                    record.get('ALAND20', 0),
                    record.get('AWATER20', 0)
                )

                batch.append(row)

                # Insert batch when full
                if len(batch) >= batch_size:
                    insert_batch(cursor, batch)
                    processed += len(batch)
                    logger.info(f"Progress: {processed}/{total_records} ({(processed/total_records)*100:.1f}%)")
                    batch = []

            # Insert remaining records
            if batch:
                insert_batch(cursor, batch)
                processed += len(batch)
                logger.info(f"Progress: {processed}/{total_records} (100%)")

            conn.commit()
            logger.info(f"✓ Migrated {processed} blocks to Snowflake")

    finally:
        cursor.close()
        conn.close()


def insert_batch(cursor, batch: List[tuple]):
    """Insert a batch of census block records"""
    insert_sql = """
    INSERT INTO census_blocks (
        geoid, state_fips, county_fips, tract_code, block_code,
        geometry, centroid_lng, centroid_lat, land_area_m2, water_area_m2
    ) VALUES (%s, %s, %s, %s, %s, TO_GEOGRAPHY(%s), %s, %s, %s, %s)
    """
    cursor.executemany(insert_sql, batch)


if __name__ == "__main__":
    # Path to Florida Census blocks shapefile
    project_root = Path(__file__).parent.parent.parent.parent
    shapefile_path = project_root / "data/tl_2024_12_tabblock20/tl_2024_12_tabblock20.shp"

    if not shapefile_path.exists():
        logger.error(f"Shapefile not found: {shapefile_path}")
        exit(1)

    load_blocks_from_shapefile(str(shapefile_path))
```

**Run Migration:**
```bash
cd app/backend
python data_pipeline/migrate_blocks_to_snowflake.py
```

**Expected Output:**
```
INFO: Total records to migrate: 390066
INFO: Progress: 1000/390066 (0.3%)
INFO: Progress: 2000/390066 (0.5%)
...
INFO: Progress: 390066/390066 (100%)
INFO: ✓ Migrated 390066 blocks to Snowflake
```

**Verification:**
In Snowflake UI:
```sql
SELECT COUNT(*) FROM census_blocks;
-- Should return 390066

SELECT * FROM census_blocks LIMIT 5;
-- Should show sample block data
```

---

### Task 2.4: Load Population Data from Census API
**File:** `app/backend/data_pipeline/load_population_to_snowflake.py` (NEW)
**Action:**
Create script to fetch and load population data:

```python
"""
Load Census block population data from Census API to Snowflake
"""

import logging
import snowflake.connector
from config.snowflake_config import get_snowflake_config
from block_population import fetch_block_population_for_tract

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def load_population_for_state(state_fips: str = "12"):
    """
    Fetch population for all blocks in a state and load to Snowflake

    Args:
        state_fips: State FIPS code (12 = Florida)
    """
    conn = connect_to_snowflake()
    cursor = conn.cursor()

    try:
        # Get all unique tracts from Snowflake
        cursor.execute(f"""
            SELECT DISTINCT state_fips || county_fips || tract_code AS tract_geoid
            FROM census_blocks
            WHERE state_fips = '{state_fips}'
            ORDER BY tract_geoid
        """)

        tract_geoids = [row[0] for row in cursor.fetchall()]
        logger.info(f"Found {len(tract_geoids)} tracts to fetch population for")

        # Fetch population for each tract
        total_blocks = 0
        for idx, tract_geoid in enumerate(tract_geoids):
            logger.info(f"Fetching tract {idx+1}/{len(tract_geoids)}: {tract_geoid}")

            block_population = fetch_block_population_for_tract(tract_geoid)

            if block_population:
                # Insert population data
                batch = [
                    (geoid, pop, 0)  # geoid, population, housing_units (0 for now)
                    for geoid, pop in block_population.items()
                ]

                cursor.executemany("""
                    MERGE INTO census_block_population AS target
                    USING (SELECT %s AS geoid, %s AS population, %s AS housing_units) AS source
                    ON target.geoid = source.geoid
                    WHEN MATCHED THEN UPDATE SET
                        population = source.population,
                        fetched_at = CURRENT_TIMESTAMP()
                    WHEN NOT MATCHED THEN INSERT (geoid, population, housing_units)
                        VALUES (source.geoid, source.population, source.housing_units)
                """, batch)

                total_blocks += len(batch)
                logger.info(f"  Loaded {len(batch)} blocks (total: {total_blocks})")

        conn.commit()
        logger.info(f"✓ Loaded population for {total_blocks} blocks")

    finally:
        cursor.close()
        conn.close()


def connect_to_snowflake():
    """Establish Snowflake connection"""
    config = get_snowflake_config()
    return snowflake.connector.connect(**config)


if __name__ == "__main__":
    load_population_for_state("12")  # Florida
```

**Run Population Load:**
```bash
cd app/backend
python data_pipeline/load_population_to_snowflake.py
```

**Verification:**
```sql
SELECT COUNT(*) FROM census_block_population;
-- Should return ~390000 (blocks with population data)

SELECT b.geoid, b.centroid_lng, b.centroid_lat, p.population
FROM census_blocks b
JOIN census_block_population p ON b.geoid = p.geoid
WHERE p.population > 0
LIMIT 10;
```

---

## Phase 3: Backend Integration (1.5-2 hours)

### Task 3.1: Create Snowflake Query Module
**File:** `app/backend/data_pipeline/snowflake_census_blocks.py` (NEW)
**Action:**
Replace file-based census_blocks.py with Snowflake queries:

```python
"""
Snowflake-backed Census Block Loader

Queries Census block data from Snowflake instead of shapefiles.
"""

import logging
from typing import List, Dict
import snowflake.connector
from shapely.geometry import shape
from shapely import wkt
from config.snowflake_config import get_snowflake_config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SnowflakeCensusBlockLoader:
    """Loads Census blocks from Snowflake"""

    def __init__(self):
        """Initialize Snowflake connection"""
        self.config = get_snowflake_config()
        logger.info("Initialized Snowflake Census block loader")

    def get_blocks_for_tract(self, tract_geoid: str) -> List[Dict]:
        """
        Get all Census blocks for a tract from Snowflake

        Args:
            tract_geoid: 11-digit tract GEOID

        Returns:
            List of block dictionaries with geometry and attributes
        """
        if len(tract_geoid) != 11:
            logger.error(f"Invalid tract GEOID: {tract_geoid}")
            return []

        state_fips = tract_geoid[:2]
        county_fips = tract_geoid[2:5]
        tract_code = tract_geoid[5:11]

        conn = snowflake.connector.connect(**self.config)
        cursor = conn.cursor()

        try:
            # Query blocks for this tract
            cursor.execute("""
                SELECT
                    b.geoid,
                    ST_ASWKT(b.geometry) as geometry_wkt,
                    b.centroid_lng,
                    b.centroid_lat,
                    b.land_area_m2,
                    b.water_area_m2,
                    COALESCE(p.population, 0) as population
                FROM census_blocks b
                LEFT JOIN census_block_population p ON b.geoid = p.geoid
                WHERE b.state_fips = %s
                  AND b.county_fips = %s
                  AND b.tract_code = %s
            """, (state_fips, county_fips, tract_code))

            blocks = []
            for row in cursor.fetchall():
                geoid, geometry_wkt, centroid_lng, centroid_lat, land_area, water_area, population = row

                # Convert WKT to shapely geometry
                geom = wkt.loads(geometry_wkt)

                blocks.append({
                    'geoid': geoid,
                    'geometry': geom,
                    'centroid': {
                        'lng': centroid_lng,
                        'lat': centroid_lat
                    },
                    'land_area_m2': land_area,
                    'water_area_m2': water_area,
                    'population': population
                })

            logger.info(f"Retrieved {len(blocks)} blocks for tract {tract_geoid}")
            return blocks

        finally:
            cursor.close()
            conn.close()

    def get_blocks_within_geometry(self, tract_geoid: str, tract_geometry) -> List[Dict]:
        """
        Get blocks within a tract (already filtered by tract_geoid, no spatial filter needed)

        Args:
            tract_geoid: 11-digit tract GEOID
            tract_geometry: Shapely geometry (not used, kept for API compatibility)

        Returns:
            List of blocks with centroids
        """
        return self.get_blocks_for_tract(tract_geoid)


# Global singleton
_snowflake_loader = None


def get_snowflake_block_loader():
    """Get or create Snowflake block loader singleton"""
    global _snowflake_loader
    if _snowflake_loader is None:
        _snowflake_loader = SnowflakeCensusBlockLoader()
    return _snowflake_loader
```

**Verification:**
```python
from snowflake_census_blocks import get_snowflake_block_loader

loader = get_snowflake_block_loader()
blocks = loader.get_blocks_for_tract("12047960202")
print(f"Found {len(blocks)} blocks")
```

---

### Task 3.2: Update Pipeline to Use Snowflake
**File:** `app/backend/data_pipeline/run_pipeline.py`
**Action:**
Replace census_blocks import with snowflake version:

**OLD:**
```python
from census_blocks import get_block_loader
```

**NEW:**
```python
from snowflake_census_blocks import get_snowflake_block_loader
```

**OLD:**
```python
try:
    block_loader = get_block_loader()
    logger.info("  Loading Census block geometries...")
except Exception as e:
    logger.error(f"Failed to load Census blocks: {e}")
    block_loader = None
```

**NEW:**
```python
try:
    block_loader = get_snowflake_block_loader()
    logger.info("  Connected to Snowflake for Census blocks")
except Exception as e:
    logger.error(f"Failed to connect to Snowflake: {e}")
    block_loader = None
```

**OLD:**
```python
# Fetch block population data for all tracts
block_population = {}
if block_loader:
    try:
        block_population = fetch_block_population_for_tracts(tract_geoids)
        logger.info(f"  ✓ Fetched population for {len(block_population)} Census blocks")
    except Exception as e:
        logger.error(f"Failed to fetch block population: {e}")
```

**NEW:**
```python
# Population data is already joined in Snowflake query - no separate fetch needed
# Block population is included in the blocks returned from get_blocks_within_geometry()
```

**OLD:**
```python
# Get Census blocks for this tract
census_blocks = block_loader.get_blocks_within_geometry(str(geoid), tract_geom)

# Calculate density-based WiFi zones
wifi_zones = calculate_wifi_zones_within_tract(
    tract_geoid=str(geoid),
    tract_geometry=tract_geom,
    tract_poverty_rate=site_data['poverty_rate'],
    census_blocks=census_blocks,
    block_population=block_population,  # Separate dict
    num_zones=5
)
```

**NEW:**
```python
# Get Census blocks for this tract (includes population)
census_blocks = block_loader.get_blocks_within_geometry(str(geoid), tract_geom)

# Extract population from blocks (already included)
block_population = {block['geoid']: block['population'] for block in census_blocks}

# Calculate density-based WiFi zones
wifi_zones = calculate_wifi_zones_within_tract(
    tract_geoid=str(geoid),
    tract_geometry=tract_geom,
    tract_poverty_rate=site_data['poverty_rate'],
    census_blocks=census_blocks,
    block_population=block_population,
    num_zones=5
)
```

**Verification:**
```bash
cd app/backend
python data_pipeline/run_pipeline.py madison-county-fl
```

Expected output should complete in **<5 seconds** instead of 5 minutes!

---

## Phase 4: Testing & Verification (30 min)

### Task 4.1: Test Pipeline End-to-End
**File:** None
**Action:**
Run full pipeline and verify results:

```bash
# Start backend server
cd app/backend
uvicorn main:app --reload --port 8000

# In another terminal, test API
curl -X POST http://localhost:8000/api/deployment/run-pipeline \
  -H "Content-Type: application/json" \
  -d '{"name":"Madison County","type":"city","state":"Florida","slug":"madison-county-fl"}'
```

**Expected Result:**
- Response in <10 seconds (vs 5+ minutes before)
- Returns WiFi zones based on density
- Frontend displays zones correctly

---

### Task 4.2: Verify Data Quality
**File:** None (SQL queries)
**Action:**
Run data quality checks in Snowflake:

```sql
-- Check block count
SELECT COUNT(*) as total_blocks FROM census_blocks;
-- Expected: 390066

-- Check population coverage
SELECT
    COUNT(*) as blocks_with_population,
    SUM(population) as total_population
FROM census_block_population
WHERE population > 0;
-- Expected: ~300K blocks with pop, ~21M total population (FL 2020)

-- Check spatial data integrity
SELECT COUNT(*)
FROM census_blocks
WHERE geometry IS NULL
   OR centroid_lng IS NULL
   OR centroid_lat IS NULL;
-- Expected: 0

-- Sample query: Get blocks for Madison County
SELECT
    b.geoid,
    b.centroid_lng,
    b.centroid_lat,
    p.population
FROM census_blocks b
LEFT JOIN census_block_population p ON b.geoid = p.geoid
WHERE b.state_fips = '12'
  AND b.county_fips = '047'
LIMIT 10;
```

---

### Task 4.3: Performance Benchmarking
**File:** `app/backend/tests/benchmark_snowflake.py` (NEW)
**Action:**
Create benchmark script:

```python
"""
Benchmark Snowflake query performance
"""

import time
from snowflake_census_blocks import get_snowflake_block_loader

def benchmark_tract_query():
    """Time a single tract query"""
    loader = get_snowflake_block_loader()

    # Test with Madison County tract
    tract_geoid = "12047960202"

    start = time.time()
    blocks = loader.get_blocks_for_tract(tract_geoid)
    elapsed = time.time() - start

    print(f"Query time: {elapsed:.3f}s")
    print(f"Blocks returned: {len(blocks)}")
    print(f"Performance: {len(blocks)/elapsed:.0f} blocks/sec")

if __name__ == "__main__":
    benchmark_tract_query()
```

**Run Benchmark:**
```bash
python tests/benchmark_snowflake.py
```

**Target Performance:**
- Query time: <1 second
- Blocks returned: ~170 (for Madison County tract)
- Performance: >100 blocks/sec

---

## Deployment Checklist

### Pre-Deployment
- [ ] Snowflake account created and configured
- [ ] All 390K blocks loaded to Snowflake
- [ ] Population data loaded for all blocks
- [ ] Environment variables set in production (.env)
- [ ] Snowflake connection tested from backend
- [ ] Pipeline runs successfully with Snowflake

### Production Environment Variables
Add to production `.env`:
```bash
SNOWFLAKE_ACCOUNT=your_account.region
SNOWFLAKE_USER=imsoatl_prod
SNOWFLAKE_PASSWORD=<secure-password>
SNOWFLAKE_DATABASE=IMSOATL
SNOWFLAKE_SCHEMA=CENSUS_DATA
SNOWFLAKE_WAREHOUSE=QUERY_WH
```

### Post-Deployment
- [ ] Monitor Snowflake credits usage (should be <$5/month)
- [ ] Verify query performance (<1sec per tract)
- [ ] Test with multiple locations (Madison County, Miami, etc.)
- [ ] Monitor backend logs for Snowflake errors

---

## Rollback Plan

If Snowflake integration fails, rollback by:

1. **Revert code changes:**
   ```bash
   git revert HEAD  # Revert Snowflake integration commit
   ```

2. **Restore old census_blocks.py:**
   - Re-enable file-based loader
   - Keep shapefile in place

3. **Comment out Snowflake config:**
   - Remove SNOWFLAKE_* environment variables
   - Backend will fall back to file-based loading

---

## Future Enhancements (Out of Scope for Now)

### Phase 2: Multi-State Support
- Load Census blocks for Georgia, Alabama, etc.
- Update queries to filter by state

### Phase 3: Historical Pipeline Runs
- Store pipeline results in Snowflake
- Track WiFi zone recommendations over time
- Compare results across pipeline runs

### Phase 4: Analytics & Dashboards
- Snowflake → Tableau/Looker integration
- Tract-level analytics (coverage trends, population shifts)
- WiFi deployment impact tracking

### Phase 5: Real-Time Data Updates
- Scheduled jobs to refresh Census data
- Webhook to trigger pipeline on data updates
- Automated quality checks

---

## Cost Estimates

### Development (First Month)
- **Storage:** 5 GB @ $40/TB/month = **$0.20/month**
- **Compute (loading):** 1 hour MEDIUM warehouse = **$2**
- **Compute (queries):** 100 queries @ X-SMALL = **$0.50**
- **Total:** ~**$2.70/month**

### Production (Ongoing)
- **Storage:** $0.20/month (grows slowly)
- **Compute:** $5-10/month (depends on query volume)
- **Total:** ~**$5-10/month**

Snowflake free trial provides **$400 credit** (covers ~40-80 months at this rate).

---

## Success Criteria

This implementation is successful when:
- ✅ Pipeline runs in <10 seconds (vs 5+ minutes)
- ✅ All 390K Florida blocks loaded to Snowflake
- ✅ WiFi zones displayed correctly on frontend
- ✅ No shapefile loading delays
- ✅ Data quality checks pass (100% blocks have geometry + population)
- ✅ Production costs <$10/month

---

## Questions & Troubleshooting

### Q: Snowflake connection fails
**A:** Check environment variables, verify account ID format, ensure warehouse is running

### Q: Queries are slow (>5 seconds)
**A:** Create spatial index, use smaller warehouse, check network latency

### Q: Population data missing for some blocks
**A:** Re-run population load script, check Census API key, verify tract GEOIDs

### Q: Migration script times out
**A:** Increase batch size, use LOADING_WH (MEDIUM), run during off-peak hours

---

**End of Plan**
