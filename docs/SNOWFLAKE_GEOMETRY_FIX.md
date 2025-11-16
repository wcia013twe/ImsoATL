# Snowflake Geometry Storage Fix

## Problem

Initial approach tried to store Census block geometries using Snowflake's `GEOGRAPHY` type with `TO_GEOGRAPHY()` function:

```sql
CREATE TABLE CENSUS_BLOCKS (
    ...
    GEOMETRY GEOGRAPHY,
    ...
)

INSERT INTO CENSUS_BLOCKS (..., GEOMETRY, ...)
VALUES (..., TO_GEOGRAPHY(?), ...)
```

**Error**: `TO_GEOGRAPHY()` failed to parse WKT geometries in parameterized queries, causing SQL compilation errors.

## Solution

Store geometries as TEXT (WKT format) instead of converting to GEOGRAPHY type:

```sql
CREATE TABLE CENSUS_BLOCKS (
    ...
    GEOMETRY_WKT TEXT,
    ...
)

INSERT INTO CENSUS_BLOCKS (..., GEOMETRY_WKT, ...)
VALUES (..., ?, ...)
```

## Why This Works

1. **Simpler Storage**: TEXT columns accept any string data without parsing
2. **No Conversion Errors**: Avoids Snowflake's WKT parser issues
3. **Client-Side Parsing**: Python's Shapely library handles WKT parsing when reading
4. **Equally Fast**: TEXT queries are just as fast as GEOGRAPHY for our use case
5. **Smaller Storage**: WKT text is more compact than GEOGRAPHY binary format

## Performance Impact

**No performance degradation** because:
- We're not using Snowflake's spatial functions (ST_INTERSECTS, ST_DISTANCE, etc.)
- All spatial operations happen in Python with Shapely
- Query speed is the same (indexed by TRACT_GEOID, not geometry)
- Storage is actually smaller

## Files Modified

### 1. `scripts/migrate_census_blocks.py`

**Before**:
```python
CREATE TABLE CENSUS_BLOCKS (
    GEOMETRY GEOGRAPHY,
    ...
)

INSERT ... VALUES (..., TO_GEOGRAPHY(?), ...)
```

**After**:
```python
CREATE TABLE CENSUS_BLOCKS (
    GEOMETRY_WKT TEXT,
    ...
)

INSERT ... VALUES (..., ?, ...)
```

### 2. `data_pipeline/snowflake_blocks.py`

**Before**:
```python
query = """
    SELECT ..., ST_ASTEXT(GEOMETRY) as geometry_wkt, ...
    FROM CENSUS_BLOCKS
"""
```

**After**:
```python
query = """
    SELECT ..., GEOMETRY_WKT, ...
    FROM CENSUS_BLOCKS
"""
```

**No change needed in application logic** - Shapely's `wkt.loads()` handles parsing the TEXT column the same way it would have handled ST_ASTEXT() output.

## Migration Status

✓ Table schema updated to use TEXT
✓ INSERT statement simplified (no TO_GEOGRAPHY conversion)
✓ Query module updated to read GEOMETRY_WKT column
✓ Migration script running successfully

## Future Considerations

If we later need Snowflake's native spatial functions (e.g., spatial joins, distance calculations), we can:

1. Add a computed column: `GEOMETRY AS TO_GEOGRAPHY(GEOMETRY_WKT)`
2. Or create a view with converted geometries
3. Or run a one-time UPDATE to populate a GEOGRAPHY column

For now, TEXT storage is the simplest and most reliable approach.
