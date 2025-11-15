/**
 * Fetch Census Tracts from US Census Bureau TIGER/Line Web Services
 *
 * This script:
 * 1. Queries Census Bureau's TIGERweb REST API for census tracts
 * 2. Converts to GeoJSON FeatureCollection
 * 3. Saves to /app/frontend/public/data/census-tracts/{state-county}.json
 *
 * Usage:
 *   node fetch-census-tracts-tiger.js [StateCode] [CountyCode]
 *
 * Examples:
 *   node fetch-census-tracts-tiger.js 13 121  # Fulton County, GA (Atlanta)
 *   node fetch-census-tracts-tiger.js 25 025  # Suffolk County, MA (Boston)
 *
 * To find your state and county FIPS codes:
 * https://www.census.gov/library/reference/code-lists/ansi.html
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Parse command line arguments
const stateCode = process.argv[2] || '13'; // Georgia
const countyCode = process.argv[3] || '121'; // Fulton County

// TIGERweb REST API endpoint for census tracts
// Using 2020 census tracts (most recent)
const TIGER_BASE_URL = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer/8/query';

// Build query parameters
const params = new URLSearchParams({
  where: `STATE='${stateCode}' AND COUNTY='${countyCode}'`,
  outFields: '*',
  f: 'geojson',
  returnGeometry: 'true',
  spatialRel: 'esriSpatialRelIntersects'
});

const API_URL = `${TIGER_BASE_URL}?${params.toString()}`;

// Output paths
const OUTPUT_DIR = path.join(__dirname, '../app/frontend/public/data/census-tracts');
const OUTPUT_FILE = path.join(OUTPUT_DIR, `${stateCode}-${countyCode}.json`);

console.log(`🚀 Fetching census tracts for State ${stateCode}, County ${countyCode} from Census Bureau...\n`);

/**
 * Make HTTPS GET request
 */
function fetchFromAPI(url) {
  return new Promise((resolve, reject) => {
    console.log('📡 Querying Census Bureau TIGERweb API...');

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('   ✓ Data received successfully\n');
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${e.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Process and enhance GeoJSON data
 */
function processGeoJSON(geoJSON, stateCode, countyCode) {
  console.log('🔄 Processing census tract data...');

  if (!geoJSON.features || geoJSON.features.length === 0) {
    throw new Error(`No census tracts found for State ${stateCode}, County ${countyCode}`);
  }

  console.log(`   ✓ Found ${geoJSON.features.length} census tracts\n`);

  // Enhance properties
  geoJSON.features = geoJSON.features.map(feature => {
    const props = feature.properties;

    return {
      type: 'Feature',
      geometry: feature.geometry,
      properties: {
        // Core identifiers
        tractId: props.TRACT || props.TRACTCE,
        geoid: props.GEOID,
        name: props.NAME,

        // Administrative codes
        state: props.STATE || props.STATEFP,
        county: props.COUNTY || props.COUNTYFP,

        // Area metrics
        areaLand: props.AREALAND,
        areaWater: props.AREAWATER,

        // Full original properties (for reference)
        _original: props
      }
    };
  });

  // Add metadata
  geoJSON.properties = {
    state: stateCode,
    county: countyCode,
    generatedAt: new Date().toISOString(),
    source: 'US Census Bureau TIGERweb',
    vintage: '2020',
    count: geoJSON.features.length
  };

  return geoJSON;
}

/**
 * Main execution
 */
async function main() {
  try {
    // Fetch data from Census API
    const geoJSON = await fetchFromAPI(API_URL);

    // Process and enhance the data
    const processedData = processGeoJSON(geoJSON, stateCode, countyCode);

    // Create output directory if needed
    if (!fs.existsSync(OUTPUT_DIR)) {
      console.log('📁 Creating output directory...');
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`   ✓ Created ${OUTPUT_DIR}\n`);
    }

    // Write to file
    console.log('💾 Writing census tracts to file...');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(processedData, null, 2));

    const fileSize = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2);
    console.log(`   ✓ Saved to: ${OUTPUT_FILE}`);
    console.log(`   ✓ File size: ${fileSize} KB\n`);

    console.log(`✅ Census tracts fetch complete!`);
    console.log(`   Found ${processedData.features.length} census tracts\n`);

    console.log('Next steps:');
    console.log(`1. Data available at: /data/census-tracts/${stateCode}-${countyCode}.json`);
    console.log('2. Load this data in your map component');
    console.log('3. Join with demographic data from Census API\n');

    console.log('💡 Sample tract IDs:');
    processedData.features.slice(0, 3).forEach(f => {
      console.log(`   - Tract ${f.properties.tractId}: ${f.properties.name}`);
    });
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Tips:');
    console.log('- Verify state and county FIPS codes are correct');
    console.log('- Find FIPS codes at: https://www.census.gov/library/reference/code-lists/ansi.html');
    console.log('- Common codes:');
    console.log('  - 13 121 = Fulton County, GA (Atlanta)');
    console.log('  - 25 025 = Suffolk County, MA (Boston)');
    console.log('  - 17 031 = Cook County, IL (Chicago)');
    console.log('  - 36 061 = New York County, NY (Manhattan)\n');
    process.exit(1);
  }
}

main();
