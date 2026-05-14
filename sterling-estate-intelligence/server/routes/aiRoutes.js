import express from 'express';
import {
  opportunityScoring,
  predictiveModeling,
  competitiveIntelligence,
  riskMitigation,
  marketIntelligence,
} from '../services/aiAnalysisEngine.js';
import { databaseService } from '../services/dataService.js';

const router = express.Router();

/**
 * Advanced opportunity analysis
 */
router.post('/analyze/opportunity', async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await databaseService.getPropertyById(propertyId);
    if (!property) {
      return res.status(404).json({ status: 'error', message: 'Property not found' });
    }

    // Calculate opportunity score
    const score = opportunityScoring.calculateScore(
      property,
      {
        gdv: property.gdv,
        profitPotential: property.profit_potential,
      },
      {
        riskScore: property.risk_score,
      },
      {
        demandScore: property.demand_score,
        growthRate: 5.2,
      }
    );

    const tier = opportunityScoring.classifyTier(score);
    const insights = opportunityScoring.generateInsights(
      property,
      {
        gdv: property.gdv,
        profitPotential: property.profit_potential,
      },
      {
        riskScore: property.risk_score,
      },
      {
        demandScore: property.demand_score,
        growthRate: 5.2,
      },
      score
    );

    res.json({
      status: 'success',
      analysis: {
        property: {
          address: property.address,
          location: property.county,
          size: property.land_size_acres,
          price: property.price,
        },
        opportunityScore: score,
        tier,
        insights,
        recommendation: score >= 75 ? 'STRONG BUY' : score >= 60 ? 'BUY' : 'HOLD',
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * Predictive analysis
 */
router.post('/predict/appreciation', async (req, res) => {
  try {
    const { propertyId, years = 5 } = req.body;

    const property = await databaseService.getPropertyById(propertyId);
    if (!property) {
      return res.status(404).json({ status: 'error', message: 'Property not found' });
    }

    const forecast = predictiveModeling.forecastAppreciation(
      property,
      {
        growthRate: property.growth_rate || 5.2,
      },
      years
    );

    res.json({
      status: 'success',
      forecast: {
        property: property.address,
        currentValue: property.price,
        forecast,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * Development timeline estimation
 */
router.post('/predict/timeline', async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await databaseService.getPropertyById(propertyId);
    if (!property) {
      return res.status(404).json({ status: 'error', message: 'Property not found' });
    }

    const timeline = predictiveModeling.estimateTimeline(
      property,
      {
        timelineMonths: property.timeline_months || 24,
      },
      {
        conservationArea: property.conservation_area,
        listedBuildings: property.listed_buildings,
        greenBelt: property.green_belt,
        floodRisk: property.flood_risk,
      }
    );

    res.json({
      status: 'success',
      timeline: {
        property: property.address,
        ...timeline,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * Rental income forecast
 */
router.post('/predict/rental-income', async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await databaseService.getPropertyById(propertyId);
    if (!property) {
      return res.status(404).json({ status: 'error', message: 'Property not found' });
    }

    const forecast = predictiveModeling.forecastRentalIncome(
      {
        residentialUnits: property.residential_units,
        gdv: property.gdv,
      },
      {
        rentalYield: property.rental_yield || 4.8,
      }
    );

    res.json({
      status: 'success',
      forecast: {
        property: property.address,
        ...forecast,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * Competitive intelligence
 */
router.post('/intelligence/competitive', async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await databaseService.getPropertyById(propertyId);
    if (!property) {
      return res.status(404).json({ status: 'error', message: 'Property not found' });
    }

    const advantages = competitiveIntelligence.identifyAdvantages(
      property,
      {
        residentialUnits: property.residential_units,
        gdv: property.gdv,
      },
      {
        riskScore: property.risk_score,
      },
      {
        demandScore: property.demand_score,
        growthRate: 5.2,
      }
    );

    const positioning = competitiveIntelligence.analyzePositioning(
      property,
      {
        demandScore: property.demand_score,
        growthRate: 5.2,
      }
    );

    const gaps = competitiveIntelligence.identifyMarketGaps(
      property,
      {
        residentialUnits: property.residential_units,
        commercialSpaceSqft: property.commercial_space_sqft,
        developmentType: property.development_type,
      },
      {
        demandScore: property.demand_score,
      }
    );

    res.json({
      status: 'success',
      intelligence: {
        property: property.address,
        competitiveAdvantages: advantages,
        marketPositioning: positioning,
        marketGaps: gaps,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * Risk mitigation strategies
 */
router.post('/risk/mitigation-strategies', async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await databaseService.getPropertyById(propertyId);
    if (!property) {
      return res.status(404).json({ status: 'error', message: 'Property not found' });
    }

    const strategies = riskMitigation.generateStrategies(
      property,
      {
        conservationArea: property.conservation_area,
        listedBuildings: property.listed_buildings,
        greenBelt: property.green_belt,
        floodRisk: property.flood_risk,
      }
    );

    const adjustedReturns = riskMitigation.calculateRiskAdjustedReturns(
      {
        profitPotential: property.profit_potential,
      },
      {
        riskScore: property.risk_score,
      }
    );

    res.json({
      status: 'success',
      riskAnalysis: {
        property: property.address,
        mitigationStrategies: strategies,
        riskAdjustedReturns: adjustedReturns,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * Market intelligence report
 */
router.post('/intelligence/market', async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await databaseService.getPropertyById(propertyId);
    if (!property) {
      return res.status(404).json({ status: 'error', message: 'Property not found' });
    }

    const report = marketIntelligence.generateMarketReport(
      property,
      {
        demandScore: property.demand_score,
        growthRate: 5.2,
        averagePrice: property.price * 1.15,
        rentalYield: 4.8,
      },
      {
        residentialUnits: property.residential_units,
        gdv: property.gdv,
      }
    );

    res.json({
      status: 'success',
      marketReport: {
        property: property.address,
        ...report,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

/**
 * Comprehensive investment analysis
 */
router.post('/analysis/comprehensive', async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await databaseService.getPropertyById(propertyId);
    if (!property) {
      return res.status(404).json({ status: 'error', message: 'Property not found' });
    }

    // Opportunity score
    const score = opportunityScoring.calculateScore(
      property,
      { gdv: property.gdv, profitPotential: property.profit_potential },
      { riskScore: property.risk_score },
      { demandScore: property.demand_score, growthRate: 5.2 }
    );

    // Appreciation forecast
    const appreciation = predictiveModeling.forecastAppreciation(
      property,
      { growthRate: 5.2 },
      5
    );

    // Timeline
    const timeline = predictiveModeling.estimateTimeline(
      property,
      { timelineMonths: property.timeline_months || 24 },
      {
        conservationArea: property.conservation_area,
        listedBuildings: property.listed_buildings,
        greenBelt: property.green_belt,
        floodRisk: property.flood_risk,
      }
    );

    // Rental forecast
    const rental = predictiveModeling.forecastRentalIncome(
      { residentialUnits: property.residential_units, gdv: property.gdv },
      { rentalYield: 4.8 }
    );

    // Competitive advantages
    const advantages = competitiveIntelligence.identifyAdvantages(
      property,
      { residentialUnits: property.residential_units, gdv: property.gdv },
      { riskScore: property.risk_score },
      { demandScore: property.demand_score, growthRate: 5.2 }
    );

    // Risk mitigation
    const strategies = riskMitigation.generateStrategies(
      property,
      {
        conservationArea: property.conservation_area,
        listedBuildings: property.listed_buildings,
        greenBelt: property.green_belt,
        floodRisk: property.flood_risk,
      }
    );

    res.json({
      status: 'success',
      comprehensiveAnalysis: {
        property: {
          address: property.address,
          location: property.county,
          size: property.land_size_acres,
          price: property.price,
        },
        opportunityScore: {
          score,
          tier: opportunityScoring.classifyTier(score),
          recommendation: score >= 75 ? 'STRONG BUY' : score >= 60 ? 'BUY' : 'HOLD',
        },
        financialProjections: {
          appreciation,
          rental,
          timeline,
        },
        competitiveAnalysis: {
          advantages,
          marketGaps: competitiveIntelligence.identifyMarketGaps(
            property,
            {
              residentialUnits: property.residential_units,
              commercialSpaceSqft: property.commercial_space_sqft,
              developmentType: property.development_type,
            },
            { demandScore: property.demand_score }
          ),
        },
        riskAnalysis: {
          strategies,
          adjustedReturns: riskMitigation.calculateRiskAdjustedReturns(
            { profitPotential: property.profit_potential },
            { riskScore: property.risk_score }
          ),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
