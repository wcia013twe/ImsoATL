# Testing the FCC Data Collector

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your FCC API credentials:
   ```
   FCC_USERNAME=your_username
   FCC_API_TOKEN=your_api_token
   ```

   Get credentials at: https://broadbandmap.fcc.gov/login

## Run the Test

```bash
python test_fcc_data.py
```

## Expected FCC Data Structure

Based on the FCC Broadband Map API documentation, the hexagon GeoPackage files should contain:

### Geometry
- **H3 hexagons** - Uber's H3 hierarchical hexagonal grid system
- **CRS**: Typically EPSG:4326 (WGS84)

### Coverage Columns (Expected)

| Column Name | Type | Description |
|------------|------|-------------|
| `h3_res8_id` | string | H3 hexagon ID (resolution 8) |
| `location_id` | string | FCC location identifier |
| `technology_code` | int | Technology type code |
| `max_advertised_download_speed` | float | Maximum download speed (Mbps) |
| `max_advertised_upload_speed` | float | Maximum upload speed (Mbps) |
| `low_latency` | bool | Low latency indicator |
| `business_residential_code` | string | Service type (B/R/X) |
| `provider_id` | string | Provider identifier |
| `brand_name` | string | Provider brand name |
| `geometry` | polygon | H3 hexagon geometry |

### Technology Codes

Common values:
- `10` - Copper (DSL)
- `40` - Coaxial Cable
- `50` - Fiber to the Premises
- `60` - Licensed Terrestrial Fixed Wireless
- `71` - Unlicensed Terrestrial Fixed Wireless

### How Coverage is Calculated

The FCC data provides **raw availability data**, not a coverage percentage. To calculate coverage:

1. **Provider Count** - Count unique providers per hexagon
2. **Speed Threshold** - Check if speeds meet broadband definition (25/3 Mbps)
3. **Coverage Assignment** - When mapping to census tracts via `proximity_ranker.py`:
   - If hexagon has service at 25/3 Mbps or better → 100% coverage
   - If hexagon has service below threshold → Partial coverage based on speed
   - If no service → 0% coverage

## Alternative: Manual Data Exploration

If you want to explore the data manually:

1. Download a file from: https://broadbandmap.fcc.gov/data-download
2. Select "State-level" → "Hexagon Coverage" → Choose a state
3. Download the GeoPackage (.gpkg) file
4. Open in QGIS or load with GeoPandas:
   ```python
   import geopandas as gpd
   gdf = gpd.read_file("path/to/file.gpkg")
   print(gdf.columns)
   print(gdf.head())
   ```

## Next Steps After Testing

Once you've confirmed the data structure:

1. Update `proximity_ranker.py` if needed to handle the actual column names
2. Implement coverage calculation logic based on actual FCC fields
3. Test the full pipeline with real data
