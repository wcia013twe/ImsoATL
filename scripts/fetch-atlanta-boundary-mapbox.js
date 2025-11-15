/**
 * Fetch Atlanta boundary from Mapbox Geocoding API
 *
 * This script uses Mapbox's Geocoding API to get the official city boundary
 * for Atlanta, GA. Much cleaner and more accurate than dissolving census tracts.
 *
 * API Docs: https://docs.mapbox.com/api/search/geocoding/
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.MAPBOX_TOKEN;
const OUTPUT_DIR = path.join(__dirname, '../app/frontend/public/data/cities');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'atlanta.json');

// Mapbox Geocoding API endpoint
const CITY_QUERY = 'Atlanta, Georgia';
const API_URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(CITY_QUERY)}.json?types=place&limit=1&access_token=${MAPBOX_TOKEN}`;

console.log('🗺️  Fetching Atlanta boundary from Mapbox API...\n');

if (!MAPBOX_TOKEN) {
  console.error('❌ Error: MAPBOX_TOKEN not found!');
  console.error('   Set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local or export MAPBOX_TOKEN');
  process.exit(1);
}

// Fetch data from Mapbox
https.get(API_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (!response.features || response.features.length === 0) {
        console.error('❌ Error: No results found for Atlanta, Georgia');
        process.exit(1);
      }

      const atlanta = response.features[0];

      console.log('✓ Found:', atlanta.place_name);
      console.log('✓ Place type:', atlanta.place_type.join(', '));
      console.log('✓ Center:', atlanta.center);
      console.log('✓ Bounding box:', atlanta.bbox);

      // Check if geometry is available
      if (!atlanta.geometry) {
        console.error('❌ Error: No geometry data in response');
        console.error('   Mapbox may not have polygon boundary for this location');
        process.exit(1);
      }

      // Calculate bounds from bbox
      const bounds = atlanta.bbox ? [
        [atlanta.bbox[0], atlanta.bbox[1]], // Southwest [lng, lat]
        [atlanta.bbox[2], atlanta.bbox[3]]  // Northeast [lng, lat]
      ] : null;

      // Create final GeoJSON feature with metadata
      const atlantaBoundary = {
        type: 'Feature',
        properties: {
          name: 'Atlanta',
          full_name: atlanta.place_name,
          state: 'Georgia',
          place_type: atlanta.place_type,
          center: atlanta.center,
          bounds: bounds,
          bbox: atlanta.bbox,
          source: 'Mapbox Geocoding API',
          fetchedAt: new Date().toISOString()
        },
        geometry: atlanta.geometry
      };

      // Create output directory if needed
      if (!fs.existsSync(OUTPUT_DIR)) {
        console.log('\n📁 Creating output directory...');
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`   ✓ Created ${OUTPUT_DIR}`);
      }

      // Write to file
      console.log('\n💾 Writing Atlanta boundary to file...');
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(atlantaBoundary, null, 2));

      const fileSize = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2);
      console.log(`   ✓ Saved to: ${OUTPUT_FILE}`);
      console.log(`   ✓ File size: ${fileSize} KB`);

      console.log(`   ✓ Geometry type: ${atlanta.geometry.type}`);

      console.log('\n✅ Atlanta boundary fetched successfully from Mapbox!\n');
      console.log('Next steps:');
      console.log('1. InteractiveMap.tsx already configured to load /data/cities/atlanta.json');
      console.log('2. The map will auto-zoom using the bounds property');
      console.log('3. Open the dashboard to see the official Atlanta boundary\n');

    } catch (error) {
      console.error('❌ Error parsing Mapbox response:', error.message);
      console.error('Response data:', data);
      process.exit(1);
    }
  });

}).on('error', (error) => {
  console.error('❌ Error fetching from Mapbox API:', error.message);
  process.exit(1);
});
