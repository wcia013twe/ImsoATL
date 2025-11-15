/**
 * Generate pre-processed Atlanta boundary GeoJSON
 *
 * This script:
 * 1. Reads the full Georgia census block groups GeoJSON
 * 2. Filters for Fulton County (GEOID starts with 13121)
 * 3. Dissolves all polygons into a single Atlanta boundary
 * 4. Calculates bounding box for fitBounds
 * 5. Saves to /app/frontend/public/data/cities/atlanta.json
 */

const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

// Paths
const INPUT_FILE = path.join(__dirname, '../app/frontend/public/data/tl_2024_13_bg.json');
const OUTPUT_DIR = path.join(__dirname, '../app/frontend/public/data/cities');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'atlanta.json');

console.log('🚀 Starting Atlanta boundary generation...\n');

// Read Georgia census data
console.log('📖 Reading Georgia census block groups...');
const georgiaData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
console.log(`   ✓ Loaded ${georgiaData.features.length} features\n`);

// Filter for Fulton County (Atlanta's primary county)
console.log('🔍 Filtering for Fulton County (GEOID 13121)...');
const atlantaPolygons = georgiaData.features.filter((feature) => {
  const geoid = feature.properties?.GEOID || '';
  return geoid.startsWith('13121'); // State 13 (GA), County 121 (Fulton)
});
console.log(`   ✓ Found ${atlantaPolygons.length} Fulton County block groups\n`);

if (atlantaPolygons.length === 0) {
  console.error('❌ Error: No Fulton County features found!');
  process.exit(1);
}

// Dissolve all polygons into a single boundary
console.log('🔄 Dissolving polygons into single Atlanta boundary...');
let dissolved = atlantaPolygons[0];

for (let i = 1; i < atlantaPolygons.length; i++) {
  try {
    const union = turf.union(dissolved, atlantaPolygons[i]);
    if (union) {
      dissolved = union;
    }
  } catch (error) {
    console.warn(`   ⚠️  Warning: Failed to union polygon ${i}, skipping...`);
  }

  // Progress indicator
  if (i % 50 === 0) {
    console.log(`   Processing... ${i}/${atlantaPolygons.length}`);
  }
}
console.log(`   ✓ Successfully dissolved ${atlantaPolygons.length} polygons\n`);

// Calculate bounding box for fitBounds
console.log('📐 Calculating bounding box...');
const bbox = turf.bbox(dissolved);
const bounds = [
  [bbox[0], bbox[1]], // Southwest [lng, lat]
  [bbox[2], bbox[3]]  // Northeast [lng, lat]
];
console.log(`   ✓ Bounds: SW ${bounds[0]}, NE ${bounds[1]}\n`);

// Calculate centroid
const centroid = turf.centroid(dissolved);
const center = centroid.geometry.coordinates;
console.log(`   ✓ Center: [${center[0].toFixed(4)}, ${center[1].toFixed(4)}]\n`);

// Create final GeoJSON with metadata
const atlantaBoundary = {
  type: 'Feature',
  properties: {
    name: 'Atlanta',
    state: 'Georgia',
    stateFips: '13',
    countyFips: ['121'], // Fulton County
    bounds: bounds,
    center: center,
    generatedAt: new Date().toISOString()
  },
  geometry: dissolved.geometry
};

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  console.log('📁 Creating output directory...');
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`   ✓ Created ${OUTPUT_DIR}\n`);
}

// Write to file
console.log('💾 Writing Atlanta boundary to file...');
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(atlantaBoundary, null, 2));
const fileSize = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2);
console.log(`   ✓ Saved to: ${OUTPUT_FILE}`);
console.log(`   ✓ File size: ${fileSize} KB\n`);

console.log('✅ Atlanta boundary generation complete!');
console.log('\nNext steps:');
console.log('1. Update InteractiveMap.tsx to load /data/cities/atlanta.json');
console.log('2. Implement map.fitBounds() with the bounds property');
console.log('3. Remove the 58MB state file loading logic\n');
