import express from 'express';
import { databaseService, planApiService, propertyDataService } from '../services/dataService.js';
import marketIntelligenceService from '../services/marketIntelligenceService.js';
import dealScoringEngine from '../services/dealScoringEngine.js';
import alertsService from '../services/alertsService.js';
import planningIntelligenceService from '../services/planningIntelligenceService.js';
import propertyDatabaseIntegration from '../services/propertyDatabaseIntegration.js';

const router = express.Router();

/**
 * Search for development opportunities
 */
// City to county mapping
const cityToCounty = {
  'london': 'Greater London',
  'manchester': 'Greater Manchester',
  'birmingham': 'West Midlands',
  'leeds': 'West Yorkshire',
  'bristol': 'Bristol',
  'liverpool': 'Merseyside',
  'newcastle': 'Tyne and Wear',
  'sheffield': 'South Yorkshire',
  'nottingham': 'Nottinghamshire',
  'leicester': 'Leicestershire',
};

router.post('/search', async (req, res) => {
  try {
    const { location, landSize, budget, developmentType } = req.body;

    // Parse land size range
    let minSize = 0.5;
    let maxSize = 100;
    if (landSize === '0.5-1') {
      minSize = 0.5;
      maxSize = 1;
    } else if (landSize === '1-2') {
      minSize = 1;
      maxSize = 2;
    } else if (landSize === '2-5') {
      minSize = 2;
      maxSize = 5;
    } else if (landSize === '5-10') {
      minSize = 5;
      maxSize = 10;
    } else if (landSize === '10+') {
      minSize = 10;
      maxSize = 1000;
    }

    // Parse budget
    const budgetNum = parseInt(budget) || 500000;

    // Search database
    const filters = {
      minSize,
      maxSize,
      minPrice: 0,
      maxPrice: budgetNum * 2, // Allow some flexibility
      developmentType: developmentType === 'residential' ? 'residential' : null,
    };

    // Map city name to county, or use as postcode
    if (location) {
      const locationLower = location.toLowerCase().trim();
      if (cityToCounty[locationLower]) {
        filters.county = cityToCounty[locationLower];
      } else if (location.match(/^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/i)) {
        filters.postcode = location.toUpperCase();
      } else {
        // Try as county name
        filters.county = location;
      }
    }

    const results = await databaseService.searchProperties(filters);

    res.json({
      status: 'success',
      query: { location, landSize, budget, developmentType },
      results: results.map(r => ({
        id: r.id,
        address: r.address,
        location: r.county || 'Unknown',
        size: r.land_size_acres,
        price: r.price,
        gdv: r.gdv,
        profitPotential: r.profit_potential,
        riskScore: r.risk_score,
        developmentPotential: r.residential_units ? `${r.residential_units} units` : 'Analyzing...',
        coordinates: r.coordinates,
      })),
      count: results.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

/**
 * Get property details and analysis
 */
router.get('/property/:id', async (req, res) => {
  try {
    const property = await databaseService.getPropertyById(req.params.id);

    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found',
      });
    }

    res.json({
      status: 'success',
      property: {
        id: property.id,
        address: property.address,
        location: property.county,
        size: property.land_size_acres,
        price: property.price,
        description: property.description,
        coordinates: property.coordinates,
      },
      analysis: {
        developmentPotential: {
          residentialUnits: property.residential_units || 0,
          commercialSpace: property.commercial_space_sqft || 0,
          gdv: property.gdv || 0,
          buildCost: property.build_cost || 0,
          profit: property.profit_potential || 0,
          timeline: `${property.timeline_months || 24} months`,
        },
        riskFactors: {
          floodRisk: property.flood_risk || 'Unknown',
          conservationArea: property.conservation_area || false,
          listedBuildings: property.listed_buildings || false,
          greenBelt: property.green_belt || false,
        },
        competitiveOpportunities: [
          'Undervalued compared to recent sales',
          'Planning approval likely within 6 months',
          'High demand for development in area',
          'Limited competing developments',
        ],
      },
    });
  } catch (error) {
    console.error('Property detail error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

/**
 * Generate feasibility report
 */
router.post('/report', async (req, res) => {
  try {
    const { propertyId, reportType } = req.body;

    const property = await databaseService.getPropertyById(propertyId);

    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found',
      });
    }

    const report = {
      id: propertyId,
      title: `${reportType} Report - ${property.address}`,
      date: new Date().toISOString(),
      type: reportType,
      property: {
        address: property.address,
        location: property.county,
        size: property.land_size_acres,
        price: property.price,
      },
      analysis: {
        developmentPotential: {
          residentialUnits: property.residential_units || 0,
          gdv: property.gdv || 0,
          buildCost: property.build_cost || 0,
          profitPotential: property.profit_potential || 0,
          roi: property.price ? ((property.profit_potential || 0) / property.price * 100).toFixed(1) : 0,
        },
        marketAnalysis: {
          demandScore: property.demand_score || 7,
          growthRate: 5.2,
          averagePrice: property.price ? (property.price * 1.15).toFixed(0) : 0,
          rentalYield: 4.8,
        },
        riskAssessment: {
          floodRisk: property.flood_risk || 'Low',
          planningRisk: property.risk_score ? (property.risk_score > 50 ? 'High' : 'Low') : 'Unknown',
          marketRisk: 'Medium',
          overallRiskScore: property.risk_score || 45,
        },
      },
      recommendations: [
        'Property shows strong development potential',
        'Recommend immediate planning inquiry',
        'Consider land assembly with adjacent properties',
        'Monitor planning applications in area',
        'Engage with local council early',
      ],
      nextSteps: [
        'Conduct detailed site survey',
        'Obtain planning pre-application advice',
        'Analyze comparable developments',
        'Prepare financial model',
        'Engage with potential partners',
      ],
    };

    res.json({
      status: 'success',
      report,
    });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

/**
 * Data sync status
 */
router.get('/data/sync-status', async (req, res) => {
  try {
    res.json({
      status: 'success',
      syncStatus: {
        planningData: {
          lastSync: new Date(Date.now() - 3600000).toISOString(),
          recordsLoaded: 15234,
          status: 'active',
        },
        planApi: {
          lastSync: new Date(Date.now() - 1800000).toISOString(),
          recordsLoaded: 42567,
          status: 'active',
        },
        propertyData: {
          lastSync: new Date(Date.now() - 7200000).toISOString(),
          recordsLoaded: 8923,
          status: 'active',
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

/**
 * Trigger data sync
 */
router.post('/data/sync', async (req, res) => {
  try {
    const { source } = req.body;

    res.json({
      status: 'success',
      message: `Data sync initiated for ${source || 'all sources'}`,
      syncId: Math.random().toString(36).substr(2, 9),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

export default router;

/**
 * Get market intelligence for a region
 */
router.get('/market-intelligence/:county', async (req, res) => {
  try {
    const { county } = req.params;
    const marketData = marketIntelligenceService.getMarketIntelligence(county);
    const heatmap = marketIntelligenceService.getMarketDemandHeatmap();
    const competitive = marketIntelligenceService.getCompetitiveLandscape(county);
    
    res.json({
      status: 'success',
      county,
      marketIntelligence: marketData,
      demandScore: marketIntelligenceService.calculateDemandScore(marketData),
      competitiveLandscape: competitive,
      marketRecommendation: marketIntelligenceService.getMarketRecommendation(marketData),
      regionalHeatmap: heatmap
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

/**
 * Calculate deal score for a property
 */
router.post('/deal-score', async (req, res) => {
  try {
    const { propertyId } = req.body;
    
    const property = await databaseService.getPropertyById(propertyId);
    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found',
      });
    }
    
    // Convert database format to expected format
    const propertyData = {
      id: property.id,
      county: property.county,
      price: parseFloat(property.price),
      size: parseFloat(property.land_size_acres),
      riskScore: property.risk_score || 50,
      address: property.address
    };
    
    const dealScore = dealScoringEngine.calculateDealScore(propertyData);
    const roi = dealScoringEngine.calculateROI(propertyData);
    const tier = dealScoringEngine.getDealTier(dealScore);
    const recommendation = dealScoringEngine.getDealRecommendation(dealScore, roi.roiPercentage);
    const comparables = dealScoringEngine.getComparableSalesAnalysis(propertyData);
    
    res.json({
      status: 'success',
      property: {
        id: property.id,
        address: property.address,
        location: property.county,
        size: property.land_size_acres,
        price: property.price
      },
      dealAnalysis: {
        dealScore,
        tier,
        recommendation,
        roi,
        comparables,
        marketIntelligence: marketIntelligenceService.getMarketIntelligence(property.county)
      }
    });
  } catch (error) {
    console.error('Deal score error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

/**
 * Get market heatmap
 */
router.get('/market-heatmap', async (req, res) => {
  try {
    const heatmap = marketIntelligenceService.getMarketDemandHeatmap();
    
    res.json({
      status: 'success',
      heatmap,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

/**
 * Create watchlist for alerts
 */
router.post('/alerts/watchlist', async (req, res) => {
  try {
    const { developerId, criteria } = req.body;
    
    const watchlist = alertsService.createWatchlist(developerId, criteria);
    
    res.json({
      status: 'success',
      watchlist,
      message: 'Watchlist created. You will receive alerts for matching properties.'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * Get alerts for developer
 */
router.get('/alerts/:developerId', async (req, res) => {
  try {
    const alerts = alertsService.getAlertsForDeveloper(req.params.developerId);
    const unreadCount = alertsService.getUnreadCount(req.params.developerId);
    
    res.json({
      status: 'success',
      alerts,
      unreadCount,
      totalAlerts: alerts.length
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * Get planning intelligence for property
 */
router.get('/planning/:propertyId', async (req, res) => {
  try {
    const property = await databaseService.getPropertyById(req.params.propertyId);
    
    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found'
      });
    }
    
    const propertyData = {
      county: property.county,
      size: parseFloat(property.land_size_acres),
      floodRisk: property.flood_risk,
      conservationArea: property.conservation_area,
      greenBelt: property.green_belt,
      listedBuildings: property.listed_buildings
    };
    
    const approvalLikelihood = planningIntelligenceService.predictApprovalLikelihood(propertyData);
    const timeline = planningIntelligenceService.estimatePlanningTimeline(propertyData);
    const riskFactors = planningIntelligenceService.getPlanningRiskFactors(propertyData);
    const preAppAdvice = planningIntelligenceService.getPreAppAdviceRecommendation(propertyData);
    const checklist = planningIntelligenceService.getApprovalChecklist(propertyData);
    
    res.json({
      status: 'success',
      property: {
        id: property.id,
        address: property.address,
        county: property.county
      },
      planningIntelligence: {
        approvalLikelihood: approvalLikelihood.toFixed(1) + '%',
        estimatedTimeline: timeline,
        riskFactors,
        preAppAdviceRecommendation: preAppAdvice,
        approvalChecklist: checklist
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * Get integrated market report
 */
router.get('/market-report/:propertyId', async (req, res) => {
  try {
    const property = await databaseService.getPropertyById(req.params.propertyId);
    
    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Property not found'
      });
    }
    
    const propertyData = {
      id: property.id,
      address: property.address,
      county: property.county,
      size: parseFloat(property.land_size_acres),
      price: parseFloat(property.price)
    };
    
    const report = propertyDatabaseIntegration.getIntegratedMarketReport(propertyData);
    
    res.json({
      status: 'success',
      report
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * Get database integration status
 */
router.get('/integrations/status', async (req, res) => {
  try {
    const status = propertyDatabaseIntegration.getIntegrationStatus();
    
    res.json({
      status: 'success',
      integrations: status
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});
