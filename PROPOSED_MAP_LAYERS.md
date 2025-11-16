# Proposed Map Layers for ImsoATL

## Layer Organization

### Base Layers (Always Visible)
- ✅ **Location Boundary** - Outline of selected state/city/county
- ✅ **Deployment Sites** - Priority-ranked deployment locations (color-coded circles)

### Data Layers (Toggleable)

#### Coverage & Need
1. **Underserved Tract Boundaries**
   - Source: `geometries` from pipeline response
   - Visual: Polygon outlines for all 65 underserved tracts
   - Color: Based on coverage gap (100% - coverage_percent)
   - Opacity: 0.6

2. **Coverage Heat Map**
   - Source: Tract polygons with coverage_percent
   - Visual: Filled polygons
   - Color scale: Red (0%) → Yellow (50%) → Green (100%)
   - Shows broadband coverage distribution

3. **Poverty Rate Heat Map**
   - Source: Tract polygons with poverty_rate
   - Visual: Filled polygons
   - Color scale: Light blue (low) → Dark blue → Red (high)
   - Shows socioeconomic need

4. **Population Density**
   - Source: Tract polygons with population
   - Visual: Filled polygons
   - Color scale: Light → Dark (by population count)
   - Shows impact potential

#### Community Assets
5. **Schools** 📚
   - Source: Extract from asset_count_schools
   - Visual: Purple circles
   - Size: 8px radius
   - Shows educational anchor institutions

6. **Libraries** 📖
   - Source: Extract from asset_count_libraries
   - Visual: Blue circles
   - Size: 8px radius
   - Shows public WiFi anchor points

7. **Community Centers** 🏛️
   - Source: Extract from asset_count_community_centers
   - Visual: Green circles
   - Size: 8px radius
   - Shows community gathering places

8. **Transit Stops** 🚇
   - Source: Extract from asset_count_transit_stops
   - Visual: Orange circles
   - Size: 6px radius
   - Shows transit accessibility

## Layer Control Groups

```
📊 Coverage Analysis
  ☐ Underserved Tracts
  ☐ Coverage Heat Map
  ☐ Poverty Rate
  ☐ Population Density

🏛️ Community Assets
  ☐ Schools
  ☐ Libraries
  ☐ Community Centers
  ☐ Transit Stops

📍 Deployment Sites
  ☑ Priority Sites (always on)
```

## Data Requirements

### What You Have:
✅ Tract geometries (from underserved_tracts_geo.json)
✅ Coverage percentages
✅ Poverty rates
✅ Population counts
✅ Asset counts per tract
✅ Centroids for deployment markers

### What You Need to Add:
- Individual asset locations (lat/lng) - if you want to show exact locations
  - Currently you only have counts per tract
  - Options:
    1. Show asset count as labels on tracts
    2. Fetch actual locations from OpenStreetMap/Census
    3. Use tract centroid with offset for multiple assets

## Implementation Priority

### Phase 1 (Essential)
1. ✅ Deployment site markers (DONE)
2. 🔨 Underserved tract polygons
3. 🔨 Coverage heat map

### Phase 2 (Enhanced)
4. Poverty rate heat map
5. Population density map

### Phase 3 (Advanced)
6. Individual asset markers (if location data available)
7. Custom data overlays

## Recommended Default View

**On Page Load:**
- ✅ Location boundary (visible)
- ✅ Deployment sites (visible)
- ☐ Underserved tracts (visible)
- ☐ All other layers (hidden, user can toggle)

**After Running Pipeline:**
- Auto-enable deployment sites layer
- Auto-fit map to show all sites
- Show coverage heat map (optional)
