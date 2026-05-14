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

// Sample UK development opportunities
const sampleProperties = [
  {
    address: 'Manchester City Centre Development Site',
    postcode: 'M1 1AA',
    county: 'Greater Manchester',
    region: 'North West',
    landSizeAcres: 1.5,
    price: 750000,
    latitude: 53.4808,
    longitude: -2.2426,
    description: 'Prime development site in Manchester city centre with excellent transport links and planning potential.',
    source: 'sample',
    sourceId: 'sample-001',
    planningStatus: 'available',
  },
  {
    address: 'Liverpool Waterfront Opportunity',
    postcode: 'L1 1AA',
    county: 'Merseyside',
    region: 'North West',
    landSizeAcres: 2.0,
    price: 650000,
    latitude: 53.4084,
    longitude: -2.9916,
    description: 'Waterfront development opportunity with mixed-use potential and strong market demand.',
    source: 'sample',
    sourceId: 'sample-002',
    planningStatus: 'available',
  },
  {
    address: 'Birmingham City Centre Mixed Use',
    postcode: 'B1 1AA',
    county: 'West Midlands',
    region: 'Midlands',
    landSizeAcres: 3.0,
    price: 1200000,
    latitude: 52.5099,
    longitude: -1.8854,
    description: 'Large mixed-use development site with residential and commercial potential.',
    source: 'sample',
    sourceId: 'sample-003',
    planningStatus: 'available',
  },
  {
    address: 'Leeds City Centre Residential',
    postcode: 'LS1 1AA',
    county: 'West Yorkshire',
    region: 'Yorkshire',
    landSizeAcres: 1.2,
    price: 580000,
    latitude: 53.8008,
    longitude: -1.5491,
    description: 'Residential development opportunity in high-demand Leeds city centre location.',
    source: 'sample',
    sourceId: 'sample-004',
    planningStatus: 'available',
  },
  {
    address: 'Bristol Harbourside Development',
    postcode: 'BS1 6AA',
    county: 'Bristol',
    region: 'South West',
    landSizeAcres: 2.5,
    price: 950000,
    latitude: 51.4545,
    longitude: -2.5879,
    description: 'Premium harbourside location with strong development potential and high market demand.',
    source: 'sample',
    sourceId: 'sample-005',
    planningStatus: 'available',
  },
];

// Sample development analysis data
const sampleAnalysis = [
  {
    residentialUnits: 45,
    commercialSpaceSqft: 5000,
    gdv: 12500000,
    buildCost: 7500000,
    profitPotential: 5000000,
    timelineMonths: 24,
    developmentType: 'residential',
  },
  {
    residentialUnits: 60,
    commercialSpaceSqft: 8000,
    gdv: 15000000,
    buildCost: 8500000,
    profitPotential: 6500000,
    timelineMonths: 28,
    developmentType: 'mixed-use',
  },
  {
    residentialUnits: 120,
    commercialSpaceSqft: 15000,
    gdv: 28000000,
    buildCost: 16000000,
    profitPotential: 12000000,
    timelineMonths: 36,
    developmentType: 'mixed-use',
  },
  {
    residentialUnits: 35,
    commercialSpaceSqft: 4000,
    gdv: 10000000,
    buildCost: 6000000,
    profitPotential: 4000000,
    timelineMonths: 20,
    developmentType: 'residential',
  },
  {
    residentialUnits: 80,
    commercialSpaceSqft: 12000,
    gdv: 20000000,
    buildCost: 11000000,
    profitPotential: 9000000,
    timelineMonths: 30,
    developmentType: 'mixed-use',
  },
];

// Sample risk assessment data
const sampleRisks = [
  {
    floodRisk: 'Low',
    conservationArea: false,
    listedBuildings: false,
    greenBelt: false,
    article4Direction: false,
    environmentalDesignation: null,
    planningHistory: 'Recent approvals for similar developments',
    riskScore: 25,
  },
  {
    floodRisk: 'Medium',
    conservationArea: true,
    listedBuildings: false,
    greenBelt: false,
    article4Direction: false,
    environmentalDesignation: 'Conservation Area',
    planningHistory: 'Some planning constraints',
    riskScore: 45,
  },
  {
    floodRisk: 'Low',
    conservationArea: false,
    listedBuildings: false,
    greenBelt: false,
    article4Direction: false,
    environmentalDesignation: null,
    planningHistory: 'Strong planning history',
    riskScore: 20,
  },
  {
    floodRisk: 'Low',
    conservationArea: false,
    listedBuildings: true,
    greenBelt: false,
    article4Direction: false,
    environmentalDesignation: 'Listed Building Adjacent',
    planningHistory: 'Requires careful design',
    riskScore: 35,
  },
  {
    floodRisk: 'Low',
    conservationArea: false,
    listedBuildings: false,
    greenBelt: false,
    article4Direction: false,
    environmentalDesignation: null,
    planningHistory: 'Excellent planning prospects',
    riskScore: 15,
  },
];

async function loadSampleData() {
  try {
    console.log('Loading sample data into Sterling Estate Intelligence...\n');

    for (let i = 0; i < sampleProperties.length; i++) {
      const prop = sampleProperties[i];
      const analysis = sampleAnalysis[i];
      const risks = sampleRisks[i];

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
          prop.landSizeAcres,
          prop.price,
          `POINT(${prop.longitude} ${prop.latitude})`,
          prop.description,
          prop.source,
          prop.sourceId,
          prop.planningStatus,
        ]
      );

      const propertyId = propResult.rows[0].id;
      console.log(`✓ Added property: ${prop.address}`);

      // Insert development analysis
      await pool.query(
        `INSERT INTO development_analysis (
          property_id, residential_units, commercial_space_sqft,
          gdv, build_cost, profit_potential, timeline_months, development_type
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [
          propertyId,
          analysis.residentialUnits,
          analysis.commercialSpaceSqft,
          analysis.gdv,
          analysis.buildCost,
          analysis.profitPotential,
          analysis.timelineMonths,
          analysis.developmentType,
        ]
      );
      console.log(`  └─ Development analysis: £${(analysis.gdv / 1000000).toFixed(1)}m GDV`);

      // Insert risk assessment
      await pool.query(
        `INSERT INTO risk_assessment (
          property_id, flood_risk, conservation_area, listed_buildings,
          green_belt, article_4_direction, environmental_designation,
          planning_history, risk_score
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        [
          propertyId,
          risks.floodRisk,
          risks.conservationArea,
          risks.listedBuildings,
          risks.greenBelt,
          risks.article4Direction,
          risks.environmentalDesignation,
          risks.planningHistory,
          risks.riskScore,
        ]
      );
      console.log(`  └─ Risk assessment: Score ${risks.riskScore}/100\n`);
    }

    console.log('✓ Sample data loaded successfully!');
    console.log(`✓ Loaded ${sampleProperties.length} properties with analysis and risk assessments\n`);

    process.exit(0);
  } catch (error) {
    console.error('Error loading sample data:', error);
    process.exit(1);
  }
}

loadSampleData();
