import pkg from 'pg';
const { Client } = pkg;

const UK_CITIES = [
  { name: 'London', county: 'Greater London', lat: 51.5074, lon: -0.1278 },
  { name: 'Manchester', county: 'Greater Manchester', lat: 53.4808, lon: -2.2426 },
  { name: 'Birmingham', county: 'West Midlands', lat: 52.5086, lon: -1.8755 },
  { name: 'Leeds', county: 'West Yorkshire', lat: 53.8008, lon: -1.5491 },
  { name: 'Bristol', county: 'Bristol', lat: 51.4545, lon: -2.5879 },
  { name: 'Liverpool', county: 'Merseyside', lat: 53.4084, lon: -2.9916 },
  { name: 'Newcastle', county: 'Tyne and Wear', lat: 54.9783, lon: -1.6178 },
  { name: 'Sheffield', county: 'South Yorkshire', lat: 53.3811, lon: -1.4701 },
  { name: 'Nottingham', county: 'Nottinghamshire', lat: 52.9549, lon: -1.1581 },
  { name: 'Leicester', county: 'Leicestershire', lat: 52.6369, lon: -1.1398 },
  { name: 'Edinburgh', county: 'Midlothian', lat: 55.9533, lon: -3.1883 },
  { name: 'Glasgow', county: 'Lanarkshire', lat: 55.8642, lon: -4.2518 },
  { name: 'Cardiff', county: 'Cardiff', lat: 51.4816, lon: -3.1791 },
  { name: 'Belfast', county: 'Antrim', lat: 54.5973, lon: -5.9301 },
  { name: 'Coventry', county: 'West Midlands', lat: 52.4062, lon: -1.4945 },
  { name: 'Wolverhampton', county: 'West Midlands', lat: 52.5895, lon: -2.1298 },
  { name: 'Reading', county: 'Berkshire', lat: 51.4545, lon: -0.9718 },
  { name: 'Milton Keynes', county: 'Buckinghamshire', lat: 52.0406, lon: -0.7594 },
  { name: 'Southampton', county: 'Hampshire', lat: 50.9097, lon: -1.4044 },
  { name: 'Portsmouth', county: 'Hampshire', lat: 50.8158, lon: -1.0880 },
  { name: 'Stoke-on-Trent', county: 'Staffordshire', lat: 53.0249, lon: -2.1849 },
  { name: 'Sunderland', county: 'Tyne and Wear', lat: 54.9045, lon: -1.3851 },
  { name: 'Swansea', county: 'Swansea', lat: 51.6214, lon: -3.9436 },
  { name: 'Derry', county: 'Londonderry', lat: 55.0073, lon: -7.3089 },
  { name: 'Plymouth', county: 'Devon', lat: 50.3755, lon: -4.1427 },
  { name: 'Peterborough', county: 'Cambridgeshire', lat: 52.5700, lon: -0.2419 },
  { name: 'Northampton', county: 'Northamptonshire', lat: 52.2411, lon: -0.8811 },
  { name: 'Luton', county: 'Bedfordshire', lat: 51.8785, lon: -0.4201 },
  { name: 'Swindon', county: 'Wiltshire', lat: 51.5637, lon: -1.7684 },
  { name: 'Bournemouth', county: 'Dorset', lat: 50.7352, lon: -1.8344 },
];

async function generateFullUKDataset() {
  const client = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'sterling_estate_intelligence',
  });

  try {
    await client.connect();
    console.log('Connected to database');

    let totalInserted = 0;

    for (const city of UK_CITIES) {
      console.log(`\nGenerating properties for ${city.name}...`);
      
      // Generate 300-400 properties per city
      const propertiesPerCity = Math.floor(Math.random() * 100) + 300;
      
      for (let i = 0; i < propertiesPerCity; i++) {
        // Randomize coordinates around city center
        const lat = city.lat + (Math.random() - 0.5) * 0.5;
        const lon = city.lon + (Math.random() - 0.5) * 0.5;
        
        // Random land size (0.5 to 10 acres)
        const landSizeAcres = Math.random() * 9.5 + 0.5;
        
        // Random price based on size and location
        const basePrice = city.name === 'London' ? 800000 : 300000;
        const price = basePrice + (Math.random() * 500000);
        
        const query = `
          INSERT INTO properties (
            address, county, land_size_acres, price, location
          ) VALUES (
            $1, $2, $3, $4, ST_GeomFromText($5, 4326)
          )
        `;
        
        const values = [
          `${['Plot', 'Site', 'Land', 'Development'][Math.floor(Math.random() * 4)]} ${i + 1} - ${city.name}`,
          city.county,
          landSizeAcres.toFixed(2),
          price.toFixed(2),
          `POINT(${lon} ${lat})`
        ];
        
        await client.query(query, values);
        
        if ((i + 1) % 50 === 0) {
          console.log(`  Generated ${i + 1}/${propertiesPerCity} properties`);
        }
      }
      
      totalInserted += propertiesPerCity;
      console.log(`✓ ${city.name}: ${propertiesPerCity} properties added`);
    }

    // Verify total count
    const result = await client.query('SELECT COUNT(*) FROM properties');
    console.log(`\n✓ Total properties in database: ${result.rows[0].count}`);
    console.log(`✓ Coverage: All 30 major UK cities and towns`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

generateFullUKDataset();
