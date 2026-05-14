import axios from 'axios';
import { Pool } from 'pg';

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'sterling_estate_intelligence',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

/**
 * Planning Data Service - Fetches from planning.data.gov.uk
 */
export const planningDataService = {
  async fetchBrownfieldLand(location) {
    try {
      const response = await axios.get(
        `${process.env.PLANNING_DATA_API_URL}/entity.json`,
        {
          params: {
            dataset: 'brownfield-land',
            q: location,
            limit: 100,
          },
          headers: {
            'Authorization': `Bearer ${process.env.PLANNING_DATA_API_KEY}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Planning Data API error:', error.message);
      return null;
    }
  },

  async fetchPlanningConstraints(latitude, longitude) {
    try {
      const response = await axios.get(
        `${process.env.PLANNING_DATA_API_URL}/entity.json`,
        {
          params: {
            latitude,
            longitude,
            dataset: 'conservation-area',
            dataset: 'listed-building',
            dataset: 'flood-risk-zone',
            dataset: 'green-belt',
            limit: 100,
          },
          headers: {
            'Authorization': `Bearer ${process.env.PLANNING_DATA_API_KEY}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Planning constraints API error:', error.message);
      return null;
    }
  },
};

/**
 * PlanAPI Service - Fetches from planapi.co.uk
 */
export const planApiService = {
  async searchPlanningApplications(postcode, radius = 1) {
    try {
      const response = await axios.get('https://api.planapi.co.uk/search', {
        params: {
          postcode,
          radius,
          limit: 100,
        },
        headers: {
          'Authorization': `Bearer ${process.env.PLANAPI_KEY}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('PlanAPI error:', error.message);
      return null;
    }
  },

  async getApplicationDetails(applicationId) {
    try {
      const response = await axios.get(
        `https://api.planapi.co.uk/applications/${applicationId}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.PLANAPI_KEY}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('PlanAPI details error:', error.message);
      return null;
    }
  },
};

/**
 * PropertyData Service - Fetches from propertydata.co.uk
 */
export const propertyDataService = {
  async analyzeProperty(uprn) {
    try {
      const response = await axios.get(
        `https://api.propertydata.co.uk/uprn`,
        {
          params: { uprn },
          headers: {
            'Authorization': `Bearer ${process.env.PROPERTYDATA_KEY}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('PropertyData API error:', error.message);
      return null;
    }
  },

  async calculateDevelopmentValue(propertyData) {
    try {
      const response = await axios.post(
        'https://api.propertydata.co.uk/development-calculator',
        propertyData,
        {
          headers: {
            'Authorization': `Bearer ${process.env.PROPERTYDATA_KEY}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Development calculator error:', error.message);
      return null;
    }
  },

  async getPlanningApplications(postcode) {
    try {
      const response = await axios.get(
        'https://api.propertydata.co.uk/planning-applications',
        {
          params: { postcode },
          headers: {
            'Authorization': `Bearer ${process.env.PROPERTYDATA_KEY}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Planning applications error:', error.message);
      return null;
    }
  },
};

/**
 * Database Service - Property operations
 */
export const databaseService = {
  async addProperty(propertyData) {
    const query = `
      INSERT INTO properties (
        address, postcode, county, region, land_size_acres, price,
        location, description, source, source_id, planning_status
      ) VALUES ($1, $2, $3, $4, $5, $6, ST_GeogFromText($7), $8, $9, $10, $11)
      RETURNING id;
    `;

    const values = [
      propertyData.address,
      propertyData.postcode,
      propertyData.county,
      propertyData.region,
      propertyData.landSizeAcres,
      propertyData.price,
      `POINT(${propertyData.longitude} ${propertyData.latitude})`,
      propertyData.description,
      propertyData.source,
      propertyData.sourceId,
      propertyData.planningStatus || 'available',
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Database insert error:', error.message);
      throw error;
    }
  },

  async addDevelopmentAnalysis(propertyId, analysis) {
    const query = `
      INSERT INTO development_analysis (
        property_id, residential_units, commercial_space_sqft,
        gdv, build_cost, profit_potential, timeline_months, development_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;

    const values = [
      propertyId,
      analysis.residentialUnits,
      analysis.commercialSpaceSqft,
      analysis.gdv,
      analysis.buildCost,
      analysis.profitPotential,
      analysis.timelineMonths,
      analysis.developmentType,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Analysis insert error:', error.message);
      throw error;
    }
  },

  async addRiskAssessment(propertyId, risks) {
    const query = `
      INSERT INTO risk_assessment (
        property_id, flood_risk, conservation_area, listed_buildings,
        green_belt, article_4_direction, environmental_designation,
        planning_history, risk_score
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id;
    `;

    const values = [
      propertyId,
      risks.floodRisk,
      risks.conservationArea,
      risks.listedBuildings,
      risks.greenBelt,
      risks.article4Direction,
      risks.environmentalDesignation,
      risks.planningHistory,
      risks.riskScore,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Risk assessment insert error:', error.message);
      throw error;
    }
  },

  async searchProperties(filters) {
    let query = `
      SELECT 
        p.id, p.address, p.postcode, p.county, p.land_size_acres, p.price,
        da.residential_units, da.gdv, da.profit_potential,
        ra.risk_score, md.demand_score,
        ST_AsText(p.location) as coordinates
      FROM properties p
      LEFT JOIN development_analysis da ON p.id = da.property_id
      LEFT JOIN risk_assessment ra ON p.id = ra.property_id
      LEFT JOIN market_data md ON p.postcode = md.postcode
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (filters.county) {
      query += ` AND p.county = $${paramCount}`;
      values.push(filters.county);
      paramCount++;
    }

    if (filters.minSize) {
      query += ` AND p.land_size_acres >= $${paramCount}`;
      values.push(filters.minSize);
      paramCount++;
    }

    if (filters.maxSize) {
      query += ` AND p.land_size_acres <= $${paramCount}`;
      values.push(filters.maxSize);
      paramCount++;
    }

    if (filters.minPrice) {
      query += ` AND p.price >= $${paramCount}`;
      values.push(filters.minPrice);
      paramCount++;
    }

    if (filters.maxPrice) {
      query += ` AND p.price <= $${paramCount}`;
      values.push(filters.maxPrice);
      paramCount++;
    }

    if (filters.developmentType) {
      query += ` AND da.development_type = $${paramCount}`;
      values.push(filters.developmentType);
      paramCount++;
    }

    query += ` ORDER BY da.profit_potential DESC NULLS LAST LIMIT 100`;

    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Search error:', error.message);
      throw error;
    }
  },

  async getPropertyById(id) {
    const query = `
      SELECT 
        p.*,
        da.*,
        ra.*,
        md.*,
        ST_AsText(p.location) as coordinates
      FROM properties p
      LEFT JOIN development_analysis da ON p.id = da.property_id
      LEFT JOIN risk_assessment ra ON p.id = ra.property_id
      LEFT JOIN market_data md ON p.postcode = md.postcode
      WHERE p.id = $1;
    `;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Get property error:', error.message);
      throw error;
    }
  },

  async logDataSync(syncData) {
    const query = `
      INSERT INTO data_sync_log (
        source, sync_type, records_processed, records_added,
        records_updated, errors, started_at, completed_at, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id;
    `;

    const values = [
      syncData.source,
      syncData.syncType,
      syncData.recordsProcessed,
      syncData.recordsAdded,
      syncData.recordsUpdated,
      syncData.errors,
      syncData.startedAt,
      syncData.completedAt,
      syncData.status,
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Sync log error:', error.message);
      throw error;
    }
  },
};

export default {
  planningDataService,
  planApiService,
  propertyDataService,
  databaseService,
};
