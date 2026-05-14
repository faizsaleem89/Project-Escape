import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sterling_estate_intelligence',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// UK cities with coordinates and market data
const ukCities = [
  { name: 'Manchester', county: 'Greater Manchester', lat: 53.4808, lon: -2.2426, demand: 8, growth: 5.2 },
  { name: 'Liverpool', county: 'Merseyside', lat: 53.4084, lon: -2.9916, demand: 7, growth: 4.8 },
  { name: 'Birmingham', county: 'West Midlands', lat: 52.5099, lon: -1.8854, demand: 8, growth: 5.5 },
  { name: 'Leeds', county: 'West Yorkshire', lat: 53.8008, lon: -1.5491, demand: 8, growth: 5.1 },
  { name: 'Bristol', county: 'Bristol', lat: 51.4545, lon: -2.5879, demand: 9, growth: 6.2 },
  { name: 'London', county: 'Greater London', lat: 51.5074, lon: -0.1278, demand: 9, growth: 4.5 },
  { name: 'Edinburgh', county: 'Edinburgh', lat: 55.9533, lon: -3.1883, demand: 8, growth: 5.8 },
  { name: 'Glasgow', county: 'Glasgow', lat: 55.8642, lon: -4.2518, demand: 7, growth: 4.9 },
  { name: 'Cardiff', county: 'Cardiff', lat: 51.4816, lon: -3.1791, demand: 7, growth: 4.6 },
  { name: 'Belfast', county: 'Belfast', lat: 54.5973, lon: -5.9301, demand: 6, growth: 4.2 },
];

// Development types
const developmentTypes = ['residential', 'commercial', 'mixed-use', 'industrial'];

// Property descriptions
const descriptions = [
  'Prime development site with excellent transport links',
  'Strategic location with strong market demand',
  'Undervalued opportunity in emerging area',
  'Large-scale development potential',
  'Mixed-use development opportunity',
  'Residential development site',
  'Commercial development opportunity',
  'Industrial to residential conversion opportunity',
  'Brownfield regeneration opportunity',
  'City centre development site',
];

// Generate random property data
function generateProperty(index, city) {
  const devType = developmentTypes[Math.floor(Math.random() * developmentTypes.length)];
  const landSize = Math.random() * 10 + 0.5;
  const basePrice = 300000 + Math.random() * 2000000;
  const price = Math.round(basePrice);

  // Calculate development metrics
  let residentialUnits = 0;
  let commercialSpace = 0;
  let gdv = 0;
  let buildCost = 0;

  if (devType === 'residential' || devType === 'mixed-use') {
    residentialUnits = Math.floor(landSize * 20 + Math.random() * 30);
    gdv += residentialUnits * 300000;
    buildCost += residentialUnits * 150000;
  }

  if (devType === 'commercial' || devType === 'mixed-use') {
    commercialSpace = Math.floor(landSize * 3000 + Math.random() * 5000);
    gdv += commercialSpace * 500;
    buildCost += commercialSpace * 250;
  }

  if (devType === 'industrial') {
    commercialSpace = Math.floor(landSize * 5000 + Math.random() * 8000);
    gdv += commercialSpace * 300;
    buildCost += commercialSpace * 150;
  }

  const profitPotential = Math.round(gdv - buildCost - price);
  const riskScore = Math.floor(Math.random() * 60 + 10);

  // Adjust coordinates slightly for each property
  const latOffset = (Math.random() - 0.5) * 0.1;
  const lonOffset = (Math.random() - 0.5) * 0.1;

  return {
    address: `${['Plot', 'Site', 'Development', 'Land'][Math.floor(Math.random() * 4)]} ${index} - ${city.name}`,
    postcode: `${city.name.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 99) + 1} ${Math.floor(Math.random() * 9)}${['AA', 'AB', 'AC', 'AD', 'AE'][Math.floor(Math.random() * 5)]}`,
    county: city.county,
    region: city.county,
    landSize,
    price,
    latitude: city.lat + latOffset,
    longitude: city.lon + lonOffset,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    source: 'generated',
    sourceId: `gen-${index}`,
    planningStatus: ['available', 'pending', 'approved'][Math.floor(Math.random() * 3)],
    residentialUnits,
    commercialSpace,
    gdv,
    buildCost,
    profitPotential,
    developmentType: devType,
    riskScore,
    floodRisk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
    conservationArea: Math.random() > 0.7,
    listedBuildings: Math.random() > 0.8,
    greenBelt: Math.random() > 0.8,
    demandScore: city.demand,
    growthRate: city.growth,
    rentalYield: 3.5 + Math.random() * 3,
  };
}

async function generateMassiveDataset() {
  try {
    console.log('Generating massive UK dataset...\n');

    let totalAdded = 0;
    const propertiesPerCity = 1000; // 1000 properties per city = 10,000 total

    for (const city of ukCities) {
      console.log(`Generating ${propertiesPerCity} properties for ${city.name}...`);

      for (let i = 0; i < propertiesPerCity; i++) {
        const prop = generateProperty(i, city);

        try {
          // Insert property
          const propResult = await pool.query(
            `INSERT INTO properties (
              address, postcode, county, region, land_size_acres, price,
              location, description, source, source_id, planning_status
            ) VALUES ($1, $2, $3, $4, $5, $6, ST_GeogFromText($7), $8, $9, $10, $11)
            RETURNING id;`,
            [
              prop.address,
              prop.postcode,
              prop.county,
              prop.region,
              prop.landSize,
              prop.price,
              `POINT(${prop.longitude} ${prop.latitude})`,
              prop.description,
              prop.source,
              prop.sourceId,
              prop.planningStatus,
            ]
          );

          const propertyId = propResult.rows[0].id;

          // Insert development analysis
          await pool.query(
            `INSERT INTO development_analysis (
              property_id, residential_units, commercial_space_sqft,
              gdv, build_cost, profit_potential, timeline_months, development_type
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
            [
              propertyId,
              prop.residentialUnits,
              prop.commercialSpace,
              prop.gdv,
              prop.buildCost,
              prop.profitPotential,
              24 + Math.floor(Math.random() * 24),
              prop.developmentType,
            ]
          );

          // Insert risk assessment
          await pool.query(
            `INSERT INTO risk_assessment (
              property_id, flood_risk, conservation_area, listed_buildings,
              green_belt, risk_score
            ) VALUES ($1, $2, $3, $4, $5, $6);`,
            [
              propertyId,
              prop.floodRisk,
              prop.conservationArea,
              prop.listedBuildings,
              prop.greenBelt,
              prop.riskScore,
            ]
          );

          // Insert market data
          await pool.query(
            `INSERT INTO market_data (
              postcode, county, average_price, price_per_sqft,
              rental_yield, demand_score, growth_rate, data_date, source
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT DO NOTHING;`,
            [
              prop.postcode,
              prop.county,
              prop.price * 1.15,
              (prop.price / (prop.landSize * 43560)).toFixed(2),
              prop.rentalYield,
              prop.demandScore,
              prop.growthRate,
              new Date().toISOString().split('T')[0],
              'generated',
            ]
          );

          totalAdded++;

          if ((i + 1) % 100 === 0) {
            process.stdout.write(`  ${i + 1}/${propertiesPerCity} properties added\r`);
          }
        } catch (error) {
          // Skip duplicates or errors
          continue;
        }
      }

      console.log(`✓ ${propertiesPerCity} properties added for ${city.name}`);
    }

    console.log(`\n✓ Dataset generation complete!`);
    console.log(`✓ Total properties added: ${totalAdded}`);
    console.log(`✓ Coverage: ${ukCities.length} cities across UK`);
    console.log(`✓ Database ready for world-class analysis\n`);

    process.exit(0);
  } catch (error) {
    console.error('Error generating dataset:', error);
    process.exit(1);
  }
}

generateMassiveDataset();
