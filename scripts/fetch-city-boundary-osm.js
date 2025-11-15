/**
 * Fetch City Boundary from OpenStreetMap using Overpass API
 *
 * This script:
 * 1. Queries Overpass API for any city's boundary
 * 2. Converts OSM data to GeoJSON
 * 3. Calculates bounding box and center
 * 4. Saves to /app/frontend/public/data/cities/{city-slug}.json
 *
 * Usage:
 *   node fetch-city-boundary-osm.js [CityName] [State] [CountryCode]
 *
 * Examples:
 *   node fetch-city-boundary-osm.js Atlanta Georgia
 *   node fetch-city-boundary-osm.js Boston Massachusetts
 *   node fetch-city-boundary-osm.js Chicago Illinois US
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Parse command line arguments
const cityName = process.argv[2] || 'Atlanta';
const stateName = process.argv[3] || 'Georgia';
const countryCode = process.argv[4] || 'US';

// Generate city slug for filename
const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');

// Overpass API endpoint
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// Overpass QL query for city boundary
// Searches for the relation tagged as the specified city
const OVERPASS_QUERY = `
[out:json][timeout:25];
(
  relation["boundary"="administrative"]["name"="${cityName}"]["admin_level"="8"];
);
out geom;
`;

// Output paths
const OUTPUT_DIR = path.join(__dirname, '../app/frontend/public/data/cities');
const OUTPUT_FILE = path.join(OUTPUT_DIR, `${citySlug}.json`);

console.log(`🚀 Fetching ${cityName}, ${stateName} boundary from OpenStreetMap...\n`);

/**
 * Make HTTPS POST request to Overpass API
 */
function fetchFromOverpass(query) {
  return new Promise((resolve, reject) => {
    const postData = `data=${encodeURIComponent(query)}`;

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log('📡 Querying Overpass API...');
    const req = https.request(OVERPASS_API, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('   ✓ Data received successfully\n');
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Convert OSM way/relation coordinates to GeoJSON polygon
 */
function osmToGeoJSON(osmData, cityName, stateName) {
  console.log('🔄 Converting OSM data to GeoJSON...');

  if (!osmData.elements || osmData.elements.length === 0) {
    throw new Error(`No boundary data found for ${cityName}, ${stateName}`);
  }

  // Find the relation (city boundary)
  const relation = osmData.elements.find(el => el.type === 'relation');

  if (!relation) {
    throw new Error('No relation found in OSM data');
  }

  console.log(`   ✓ Found relation: ${relation.tags?.name || cityName}\n`);

  // Extract outer boundary coordinates from members
  const outerMembers = relation.members.filter(m => m.role === 'outer');

  if (outerMembers.length === 0) {
    throw new Error('No outer members found in relation');
  }

  // Extract all coordinate segments
  const segments = [];
  for (const member of outerMembers) {
    if (member.geometry && member.geometry.length > 0) {
      const coords = member.geometry.map(node => [node.lon, node.lat]);
      segments.push(coords);
    }
  }

  if (segments.length === 0) {
    throw new Error('No coordinates found in relation members');
  }

  // Stitch segments together into a single ring
  // This is a simple approach - assumes segments are ordered
  const stitchedRing = segments[0];
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    // Remove duplicate point at join
    if (stitchedRing[stitchedRing.length - 1][0] === segment[0][0] &&
        stitchedRing[stitchedRing.length - 1][1] === segment[0][1]) {
      stitchedRing.push(...segment.slice(1));
    } else {
      stitchedRing.push(...segment);
    }
  }

  // Create simple Polygon geometry (treating all outer members as single ring)
  const geometry = {
    type: 'Polygon',
    coordinates: [stitchedRing]
  };

  return {
    type: 'Feature',
    properties: {
      name: cityName,
      state: stateName,
      country: countryCode,
      osmId: relation.id,
      osmType: 'relation',
      slug: citySlug
    },
    geometry: geometry
  };
}

/**
 * Calculate bounding box from GeoJSON geometry
 */
function calculateBounds(geometry) {
  console.log('📐 Calculating bounding box...');

  let minLon = Infinity, minLat = Infinity;
  let maxLon = -Infinity, maxLat = -Infinity;

  function processCoords(coords) {
    if (typeof coords[0] === 'number') {
      // Single coordinate pair [lon, lat]
      minLon = Math.min(minLon, coords[0]);
      maxLon = Math.max(maxLon, coords[0]);
      minLat = Math.min(minLat, coords[1]);
      maxLat = Math.max(maxLat, coords[1]);
    } else {
      // Array of coordinates
      coords.forEach(processCoords);
    }
  }

  processCoords(geometry.coordinates);

  const bounds = [
    [minLon, minLat], // Southwest
    [maxLon, maxLat]  // Northeast
  ];

  console.log(`   ✓ Bounds: SW [${bounds[0][0].toFixed(4)}, ${bounds[0][1].toFixed(4)}], NE [${bounds[1][0].toFixed(4)}, ${bounds[1][1].toFixed(4)}]\n`);

  return bounds;
}

/**
 * Calculate center point from bounds
 */
function calculateCenter(bounds) {
  const center = [
    (bounds[0][0] + bounds[1][0]) / 2,
    (bounds[0][1] + bounds[1][1]) / 2
  ];

  console.log(`   ✓ Center: [${center[0].toFixed(4)}, ${center[1].toFixed(4)}]\n`);

  return center;
}

/**
 * Main execution
 */
async function main() {
  try {
    // Fetch data from Overpass API
    const osmData = await fetchFromOverpass(OVERPASS_QUERY);

    // Convert to GeoJSON
    const feature = osmToGeoJSON(osmData, cityName, stateName);

    // Calculate bounds and center
    const bounds = calculateBounds(feature.geometry);
    const center = calculateCenter(bounds);

    // Add metadata to properties
    feature.properties.bounds = bounds;
    feature.properties.center = center;
    feature.properties.generatedAt = new Date().toISOString();
    feature.properties.source = 'OpenStreetMap via Overpass API';

    // Create output directory if needed
    if (!fs.existsSync(OUTPUT_DIR)) {
      console.log('📁 Creating output directory...');
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`   ✓ Created ${OUTPUT_DIR}\n`);
    }

    // Write to file
    console.log('💾 Writing city boundary to file...');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(feature, null, 2));

    const fileSize = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2);
    console.log(`   ✓ Saved to: ${OUTPUT_FILE}`);
    console.log(`   ✓ File size: ${fileSize} KB\n`);

    console.log(`✅ ${cityName} boundary fetch complete!`);
    console.log('\nNext steps:');
    console.log(`1. Boundary available at: /data/cities/${citySlug}.json`);
    console.log(`2. Use CityBoundaryClient('${citySlug}') in backend`);
    console.log('3. The boundary is ready to use!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Tips:');
    console.log('- Verify city name spelling matches OpenStreetMap');
    console.log('- Try adding state name for disambiguation');
    console.log(`- Example: node fetch-city-boundary-osm.js "${cityName}" "${stateName}"`);
    console.log('- Check https://www.openstreetmap.org/ for correct city name\n');
    process.exit(1);
  }
}

main();
