# ImsoATL Data Pipeline Flow

## Complete End-to-End Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         RAW DATA SOURCES                             │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  1. CALCULATE COVERAGE (calculate_coverage_from_csv.py)             │
│     Input:  data/florida_fcc_cable.csv                              │
│     Does:   - Aggregate FCC block-level data to census tracts       │
│             - Fetch tract geometries from Census TIGER              │
│             - Fetch OSM assets (schools, libraries, etc.)           │
│             - Fetch Census demographics (population, income, etc.)  │
│             - Calculate coverage % per tract                        │
│     Output: florida_tract_coverage.csv                              │
│             florida_tract_coverage.gpkg (with geometries)           │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. FILTER UNDERSERVED (filter_underserved_tracts.py)               │
│     Input:  florida_tract_coverage.csv                              │
│     Does:   - Filter coverage < 100%                                │
│             - Filter population > 500                               │
│             - Extract key columns for deployment ranking            │
│     Output: app/frontend/public/data/processed/                     │
│             underserved_tracts.json (65 tracts)                     │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. RANK DEPLOYMENT SITES (rank_deployment_sites.py)                │
│     Input:  underserved_tracts.json                                 │
│             florida_tract_coverage.csv (for demographics)           │
│     Does:   - Calculate impact scores:                              │
│               • 40% Population (more people = higher impact)        │
│               • 40% Poverty Rate (higher poverty = higher need)    │
│               • 20% Median Income (lower income = higher need)     │
│             - Rank tracts 1-65 by impact score                      │
│             - Assign deployment tiers (critical/high/medium/low)    │
│     Output: app/frontend/public/data/processed/                     │
│             ranked_deployment_sites.json                            │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│  4. FETCH GEOMETRIES (fetch_tract_geometry.py)                      │
│     Input:  underserved_tracts.json                                 │
│     Does:   - Fetch polygon geometries from Census TIGERweb API     │
│             - Cache geometries locally for each GEOID               │
│             - Merge tract data with polygon geometries              │
│     Output: app/frontend/public/data/processed/                     │
│             underserved_tracts_geo.json (GeoJSON with polygons)     │
│             app/frontend/public/data/tract-geometries/*.json        │
│             (individual cached tract geometries)                    │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND API LAYER                            │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
┌──────────────────────────────┐  ┌──────────────────────────────┐
│  API: /api/deployment-sites  │  │ API: /api/underserved-tracts │
│  Serves: ranked_deployment_  │  │ Serves: underserved_tracts_  │
│          sites.json          │  │         geo.json             │
└──────────────────────────────┘  └──────────────────────────────┘
                    │                         │
                    └────────────┬────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    INTERACTIVE MAP COMPONENT                         │
│  (app/frontend/components/InteractiveMap.tsx)                       │
│                                                                      │
│  Does:  - Fetches city boundary GeoJSON                             │
│         - Fetches underserved tracts GeoJSON                        │
│         - Fetches ranked deployment sites JSON                      │
│         - Filters tracts to city boundary using Turf.js             │
│         - Calculates tract centroids for site markers               │
│         - Renders on Mapbox:                                        │
│           • Red polygons (underserved tracts)                       │
│           • Color-coded circles (deployment sites by tier)          │
│                                                                      │
│  Display: - Tier 1 Critical: Red (#DC2626)                          │
│           - Tier 2 High: Orange (#F59E0B)                           │
│           - Tier 3 Medium: Blue (#3B82F6)                           │
│           - Tier 4 Low: Gray (#6B7280)                              │
└─────────────────────────────────────────────────────────────────────┘
```

## File Locations

### Backend Scripts
```
app/backend/data_pipeline/
├── calculate_coverage_from_csv.py    # Step 1: Process raw FCC data
├── filter_underserved_tracts.py      # Step 2: Filter by coverage & population
├── rank_deployment_sites.py          # Step 3: Rank by impact score
└── fetch_tract_geometry.py           # Step 4: Get polygon geometries
```

### Data Files
```
Project Root/
├── data/
│   └── florida_fcc_cable.csv                    # RAW INPUT
├── florida_tract_coverage.csv                   # STEP 1 OUTPUT
├── florida_tract_coverage.gpkg                  # STEP 1 OUTPUT (with geo)
└── app/frontend/public/data/
    ├── cities/
    │   ├── atlanta.json                         # City boundaries
    │   └── madison-county-fl.json
    ├── processed/
    │   ├── underserved_tracts.json              # STEP 2 OUTPUT
    │   ├── ranked_deployment_sites.json         # STEP 3 OUTPUT
    │   └── underserved_tracts_geo.json          # STEP 4 OUTPUT
    └── tract-geometries/
        ├── 12001000901.json                     # Cached geometries
        ├── 12001000902.json
        └── ... (65 cached tract geometries)
```

## Execution Order

To regenerate all data from scratch:

```bash
# Step 1: Calculate coverage from FCC data (run once to generate base data)
python app/backend/data_pipeline/calculate_coverage_from_csv.py

# Step 2: Filter underserved tracts (coverage < 100%, population > 500)
python app/backend/data_pipeline/filter_underserved_tracts.py

# Step 3: Rank deployment sites by impact score
python app/backend/data_pipeline/rank_deployment_sites.py

# Step 4: Fetch tract geometries from Census Bureau
python app/backend/data_pipeline/fetch_tract_geometry.py
```

## Key Filters Applied

### Step 1: Coverage Calculation
- Aggregates block-level FCC data to census tracts
- No filtering at this stage (processes all 5,160 FL tracts)

### Step 2: Underserved Filtering
- **Filter 1**: `coverage < 100%` → Removes fully covered tracts
- **Filter 2**: `population > 500` → Removes low-population tracts
- **Result**: 134 → 65 tracts

### Step 3: Impact Scoring
- Population score: Normalized 0-100 (higher = better)
- Poverty score: Direct percentage 0-100 (higher = more need)
- Income score: Inverted 0-100 (lower income = higher score)
- **Final Score** = (40% × pop) + (40% × poverty) + (20% × income)

### Step 4: Spatial Filtering (Frontend)
- Only shows tracts that intersect with selected city boundary
- Places deployment markers at tract centroids
- Uses Turf.js for spatial operations

## Data Schema

### underserved_tracts.json
```json
{
  "generated_at": "2025-11-15T...",
  "filters": {
    "max_coverage": 100.0,
    "min_population": 500
  },
  "total_tracts": 65,
  "tracts": [
    {
      "geoid": "12001000902",
      "coverage_percent": 0.0,
      "population": 8418,
      "median_income": 2499,
      "poverty_rate": 77.3,
      "schools": 2,
      "libraries": 0,
      "community_centers": 1,
      "transit_stops": 5,
      "total_assets": 8
    }
  ]
}
```

### ranked_deployment_sites.json
```json
{
  "generated_at": "2025-11-15T...",
  "methodology": {
    "weights": {
      "population": 40,
      "poverty": 40,
      "income": 20
    }
  },
  "tiers": {
    "tier_1_critical": "Top 10 sites (ranks 1-10)",
    "tier_2_high": "High priority (ranks 11-25)",
    "tier_3_medium": "Medium priority (ranks 26-40)",
    "tier_4_low": "Lower priority (ranks 41+)"
  },
  "sites": [
    {
      "geoid": "12001000902",
      "deployment_rank": 1,
      "deployment_tier": "tier_1_critical",
      "impact_score": 70.9,
      "population": 8418,
      "poverty_rate": 77.3,
      "median_income": 2499,
      "coverage_percent": 0.0
    }
  ]
}
```

### underserved_tracts_geo.json
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[-84.5, 33.7], ...]]
      },
      "properties": {
        "geoid": "12001000902",
        "coverage_percent": 0.0,
        "population": 8418,
        "schools": 2,
        "libraries": 0
      }
    }
  ]
}
```

## Summary

The pipeline transforms raw FCC broadband data through multiple processing stages:
1. **Aggregate** block-level coverage to census tracts
2. **Filter** to underserved areas with meaningful population
3. **Rank** by socioeconomic impact for deployment priority
4. **Enrich** with polygon geometries for map visualization
5. **Display** on interactive map with spatial filtering by city

All data flows through static JSON files served via Next.js API routes, with client-side spatial filtering using Turf.js for city boundary constraints.
