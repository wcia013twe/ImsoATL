# Calculating Coverage % for Georgia Census Tracts

This guide explains two approaches to calculate broadband coverage percentages for every census tract in Georgia.

## Overview

You have granular FCC data with these fields:
- `provider_id` - Individual ISP identifier
- `brand_name` - Provider brand
- `location_id` / `block_geoid` / `h3_res8_id` - Geographic identifier
- `technology` - Technology type (Copper, Fiber, etc.)
- `max_advertised_download_speed` - Download speed (Mbps)
- `max_advertised_upload_speed` - Upload speed (Mbps)
- `business_residential_code` - B/R/X service type

**Goal**: Convert this to coverage percentages by census tract.

---

## Approach 1A: From Raw FCC Data via API (Requires Credentials)

**File**: [`calculate_georgia_coverage.py`](calculate_georgia_coverage.py)

**Prerequisites**: FCC API credentials (free registration)

### What it does:

1. **Downloads FCC H3 hexagon data** for Georgia from FCC API
2. **Loads census tract geometries** from US Census TIGER/Line
3. **Aggregates provider data** to hexagon-level (multiple providers → single coverage flag)
4. **Spatially intersects** hexagons with census tracts
5. **Calculates coverage %** = (covered area) / (total tract area)

### How to run:

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Set up FCC credentials in .env
FCC_USERNAME=your_username
FCC_API_TOKEN=your_token

# 3. Run
python calculate_georgia_coverage.py
```

---

## Approach 1B: From Raw FCC Data via Manual Download (NO API Needed!)

**File**: [`calculate_coverage_no_api.py`](calculate_coverage_no_api.py)

**Prerequisites**: None! Just pip install and manual download.

### What it does:

Same as 1A, but you manually download the data files once instead of using the API.

### How to run:

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Download FCC data files manually:
#    - Go to: https://broadbandmap.fcc.gov/data-download
#    - Select: Availability → Hexagon Coverage → Georgia → GeoPackage
#    - Download all files (there will be several)
#    - Extract the .gpkg files to: data/fcc_hexagons/

# 3. Run the script
python calculate_coverage_no_api.py
```

### What you get:

- `georgia_tract_coverage.gpkg` - GeoPackage with geometries and coverage %
- `georgia_tract_coverage.csv` - CSV with coverage data

### Output columns:

- `GEOID` - Census tract identifier (11-digit FIPS code)
- `NAME` - Tract name
- `coverage_percent_25_3` - % of tract with 25/3 Mbps service
- `coverage_percent_100_20` - % with 100/20 Mbps
- `coverage_percent_1000_100` - % with gigabit (1000/100)
- Plus other speed tiers

### Pros:
- Most accurate spatial calculation
- Can customize speed thresholds
- Can filter by technology type, business/residential, etc.

### Cons:
- Slower (downloads lots of data)
- Requires API credentials
- More complex processing

---

## Approach 2: From FCC Summary CSV (Faster)

**File**: [`process_fcc_summary_csv.py`](process_fcc_summary_csv.py)

### What it does:

If you already have FCC's pre-calculated summary CSV (like the one in your `data/` folder), this approach:

1. **Loads the summary CSV**
2. **Filters to Census Tract** geography (your current CSV has "Census Place")
3. **Joins with tract geometries**
4. **Outputs coverage data**

### How to get tract-level summary CSV:

1. Go to: https://broadbandmap.fcc.gov/data-download
2. Select:
   - **Data Type**: Summary
   - **Geography**: Census Tract
   - **State**: Georgia
   - **Technology**: Fixed Broadband
3. Download the CSV

### How to run:

```python
# Edit the csv_path in the script, then:
python process_fcc_summary_csv.py
```

### Pros:
- Much faster (no hexagon processing)
- Simpler code
- Official FCC calculations

### Cons:
- Less flexible (can't customize calculations)
- Need to download correct summary file
- Black box (don't know how FCC calculated it)

---

## Understanding the Data

### From Provider-Level to Coverage %

Your raw data has **multiple rows per location**:

```
location_123, Provider A, Fiber, 1000 Mbps
location_123, Provider B, Cable, 300 Mbps
location_123, Provider C, DSL, 10 Mbps
```

**Step 1: Aggregate to location-level**
- Check if ANY provider offers 25/3 Mbps
- Result: location_123 has broadband ✓

**Step 2: Map locations to census tracts**
- Spatially intersect H3 hexagons with tract boundaries
- Calculate what portion of tract area has coverage

**Step 3: Calculate percentage**
- Coverage % = (covered area) / (total tract area) × 100

### Speed Tiers

The FCC summary CSV uses these speed tiers:

| Column | Speed | Description |
|--------|-------|-------------|
| `speed_02_02` | 2/0.2 Mbps | Minimum internet |
| `speed_10_1` | 10/1 Mbps | Basic broadband |
| `speed_25_3` | 25/3 Mbps | **FCC broadband definition** |
| `speed_100_20` | 100/20 Mbps | High-speed |
| `speed_250_25` | 250/25 Mbps | Very high-speed |
| `speed_1000_100` | 1000/100 Mbps | Gigabit |

Values are **percentages** (0.0 to 1.0 in CSV, multiply by 100 for %)

### Technology Types

Common values in the FCC data:

- **Any Technology** - At least one technology available
- **All Wired** - Cable + Fiber + Copper combined
- **Any Terrestrial** - Excludes satellite
- **Copper** - DSL
- **Cable** - Coaxial cable
- **Fiber** - Fiber to the premises
- **All Satellite** - Satellite providers
- **Licensed Fixed Wireless** - Wireless ISPs

---

## Next Steps

### ⭐ RECOMMENDED: Use Approach 1B (No API needed!)

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Download FCC hexagon files:
#    - Go to: https://broadbandmap.fcc.gov/data-download
#    - Select: Availability → Hexagon Coverage → Georgia → GeoPackage
#    - Download and extract to: data/fcc_hexagons/

# 3. Run the script
python calculate_coverage_no_api.py
```

### Alternative: Use Approach 1A (if you have API credentials)

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Set up FCC credentials in .env
FCC_USERNAME=your_username
FCC_API_TOKEN=your_token

# 3. Run the script
python calculate_georgia_coverage.py
```

---

## Integration with Existing Code

Your existing [`proximity_ranker.py`](app/backend/agents/proximity_ranker.py) uses a simpler centroid-based approach. The scripts here improve on that by:

1. **Area-based calculation** instead of centroid-only
2. **Multiple speed tiers** instead of single coverage value
3. **Technology breakdown** (fiber vs cable vs DSL)

To integrate with your backend:

```python
# In your API endpoint:
from calculate_georgia_coverage import calculate_tract_coverage

tracts = load_georgia_census_tracts()
hexagons = load_fcc_data()  # From cache or API
tracts_with_coverage = calculate_tract_coverage(tracts, hexagons)

# Filter low-coverage tracts
underserved = tracts_with_coverage[
    tracts_with_coverage['coverage_percent_25_3'] < 50
]
```

---

## Troubleshooting

**Problem**: "No FCC files found"
- Check your FCC API credentials in `.env`
- Verify the `as_of_date` is valid (check https://broadbandmap.fcc.gov/data-download)

**Problem**: "Projection errors"
- Ensure all GeoDataFrames use consistent CRS
- Script auto-converts to EPSG:4326 (WGS84) and EPSG:5070 (Albers Equal Area) as needed

**Problem**: "Coverage > 100%"
- This can happen with overlapping hexagons
- The script clips values to 0-100 range
- If persistent, check for duplicate hexagon geometries

**Problem**: "Script runs out of memory"
- Reduce `limit_files` parameter when downloading
- Process data in batches
- Use a machine with more RAM (hexagon data can be large)

---

## Questions?

See the main [TESTING.md](TESTING.md) for FCC data structure info.
