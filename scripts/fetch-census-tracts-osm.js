/**
 * Fetch Census Tracts from OpenStreetMap using Overpass API
 *
 * This script:
 * 1. Queries Overpass API for census tracts in a specific area
 * 2. Converts OSM data to GeoJSON FeatureCollection
 * 3. Saves to /app/frontend/public/data/census-tracts/{city-slug}.json
 *
 * Usage:
 *   node fetch-census-tracts-osm.js [CityName] [State]
 *
 * Examples:
 *   node fetch-census-tracts-osm.js Atlanta Georgia
 *   node fetch-census-tracts-osm.js Boston Massachusetts
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Parse command line arguments
const cityName = process.argv[2] || 'Atlanta';
const stateName = process.argv[3] || 'Georgia';

// Generate city slug for filename
const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');

// Overpass API endpoint
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// Overpass QL query for census tracts
// This searches for census boundaries within a city
const OVERPASS_QUERY = `
[out:json][timeout:60];
// First, get the city boundary
area["name"="${cityName}"]["admin_level"="8"]->.city;
// Then get all census tracts within that city
(
  relation["boundary"="census"](area.city);
  way["boundary"="census"](area.city);
);
out geom;
`;

// Alternative query if city boundary doesn't work - use bounding box
function getBboxQuery(south, west, north, east) {
  return `
[out:json][timeout:60];
(
  relation["boundary"="census"](${south},${west},${north},${east});
  way["boundary"="census"](${south},${west},${north},${east});
);
out geom;
`;
}

// Output paths
const OUTPUT_DIR = path.join(__dirname, '../app/frontend/public/data/census-tracts');
const OUTPUT_FILE = path.join(OUTPUT_DIR, `${citySlug}.json`);

console.log(`🚀 Fetching census tracts for ${cityName}, ${stateName} from OpenStreetMap...\n`);

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
 * Convert OSM element to GeoJSON feature
 */
function osmElementToFeature(element) {
  let geometry;

  if (element.type === 'way') {
    // Way with geometry
    const coords = element.geometry.map(node => [node.lon, node.lat]);
    // Close the ring if not already closed
    if (coords[0][0] !== coords[coords.length - 1][0] ||
        coords[0][1] !== coords[coords.length - 1][1]) {
      coords.push(coords[0]);
    }
    geometry = {
      type: 'Polygon',
      coordinates: [coords]
    };
  } else if (element.type === 'relation') {
    // Relation with outer members
    const outerMembers = element.members.filter(m => m.role === 'outer');

    if (outerMembers.length === 0) {
      return null;
    }

    // Extract coordinate segments
    const segments = [];
    for (const member of outerMembers) {
      if (member.geometry && member.geometry.length > 0) {
        const coords = member.geometry.map(node => [node.lon, node.lat]);
        segments.push(coords);
      }
    }

    if (segments.length === 0) {
      return null;
    }

    // Stitch segments together
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

    // Close the ring if not already closed
    if (stitchedRing[0][0] !== stitchedRing[stitchedRing.length - 1][0] ||
        stitchedRing[0][1] !== stitchedRing[stitchedRing.length - 1][1]) {
      stitchedRing.push(stitchedRing[0]);
    }

    geometry = {
      type: 'Polygon',
      coordinates: [stitchedRing]
    };
  } else {
    return null;
  }

  // Extract properties from tags
  const properties = {
    osmId: element.id,
    osmType: element.type,
    ...element.tags
  };

  return {
    type: 'Feature',
    properties,
    geometry
  };
}

/**
 * Convert OSM data to GeoJSON FeatureCollection
 */
function osmToGeoJSON(osmData, cityName, stateName) {
  console.log('🔄 Converting OSM data to GeoJSON...');

  if (!osmData.elements || osmData.elements.length === 0) {
    throw new Error(`No census tract data found for ${cityName}, ${stateName}`);
  }

  console.log(`   ✓ Found ${osmData.elements.length} census tract elements\n`);

  // Convert each element to a feature
  const features = osmData.elements
    .map(element => osmElementToFeature(element))
    .filter(feature => feature !== null);

  console.log(`   ✓ Converted ${features.length} valid census tracts\n`);

  return {
    type: 'FeatureCollection',
    features,
    properties: {
      city: cityName,
      state: stateName,
      slug: citySlug,
      generatedAt: new Date().toISOString(),
      source: 'OpenStreetMap via Overpass API',
      count: features.length
    }
  };
}

/**
 * Main execution
 */
async function main() {
  try {
    // Fetch data from Overpass API
    const osmData = await fetchFromOverpass(OVERPASS_QUERY);

    // Convert to GeoJSON
    const featureCollection = osmToGeoJSON(osmData, cityName, stateName);

    if (featureCollection.features.length === 0) {
      console.log('⚠️  Warning: No census tracts found.');
      console.log('\n💡 Tips:');
      console.log('- Census tract data may not be available in OSM for this area');
      console.log('- Consider using US Census Bureau TIGER/Line shapefiles instead');
      console.log('- Try a different city or area\n');
      return;
    }

    // Create output directory if needed
    if (!fs.existsSync(OUTPUT_DIR)) {
      console.log('📁 Creating output directory...');
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`   ✓ Created ${OUTPUT_DIR}\n`);
    }

    // Write to file
    console.log('💾 Writing census tracts to file...');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(featureCollection, null, 2));

    const fileSize = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2);
    console.log(`   ✓ Saved to: ${OUTPUT_FILE}`);
    console.log(`   ✓ File size: ${fileSize} KB\n`);

    console.log(`✅ Census tracts fetch complete!`);
    console.log(`   Found ${featureCollection.features.length} census tracts\n`);
    console.log('Next steps:');
    console.log(`1. Data available at: /data/census-tracts/${citySlug}.json`);
    console.log('2. Use this data to overlay census tracts on your map');
    console.log('3. Join with census demographic data for visualization\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Tips:');
    console.log('- Census tract data in OSM is limited in many areas');
    console.log('- Consider using US Census Bureau TIGER/Line shapefiles:');
    console.log('  https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html');
    console.log('- Or use Census API with tract geometries');
    console.log('- Verify city name spelling matches OpenStreetMap\n');
    process.exit(1);
  }
}

main();
