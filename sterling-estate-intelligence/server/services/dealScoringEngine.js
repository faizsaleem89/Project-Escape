/**
 * Deal Scoring Engine
 * Automated opportunity ranking and ROI calculations
 */

import marketIntelligenceService from './marketIntelligenceService.js';

class DealScoringEngine {
  /**
   * Calculate comprehensive deal score (0-100)
   */
  calculateDealScore(property) {
    let score = 0;
    
    // Financial metrics (0-40 points)
    const financialScore = this.calculateFinancialScore(property);
    score += financialScore;
    
    // Market metrics (0-30 points)
    const marketScore = this.calculateMarketScore(property);
    score += marketScore;
    
    // Risk assessment (0-20 points)
    const riskScore = this.calculateRiskScore(property);
    score += riskScore;
    
    // Strategic fit (0-10 points)
    const strategicScore = this.calculateStrategicScore(property);
    score += strategicScore;
    
    return Math.round(score);
  }

  /**
   * Calculate financial score based on ROI and profit potential
   */
  calculateFinancialScore(property) {
    let score = 0;
    
    // Profit margin calculation
    const estimatedGDV = property.price * (2.5 + Math.random()); // Estimated GDV
    const estimatedCosts = property.price * 0.25; // 25% development costs
    const estimatedProfit = estimatedGDV - property.price - estimatedCosts;
    const profitMargin = (estimatedProfit / estimatedGDV) * 100;
    
    // Profit margin scoring (0-20 points)
    if (profitMargin > 40) score += 20;
    else if (profitMargin > 35) score += 18;
    else if (profitMargin > 30) score += 16;
    else if (profitMargin > 25) score += 14;
    else if (profitMargin > 20) score += 12;
    else score += 8;
    
    // ROI scoring (0-20 points)
    const roi = (estimatedProfit / property.price) * 100;
    if (roi > 200) score += 20;
    else if (roi > 150) score += 18;
    else if (roi > 100) score += 16;
    else if (roi > 75) score += 14;
    else if (roi > 50) score += 12;
    else score += 8;
    
    return score;
  }

  /**
   * Calculate market score based on regional demand
   */
  calculateMarketScore(property) {
    let score = 0;
    
    const marketData = marketIntelligenceService.getMarketIntelligence(property.county);
    
    // Market demand (0-15 points)
    const demandMap = {
      'Very High': 15,
      'High': 13,
      'Moderate-High': 11,
      'Moderate': 9,
      'Low-Moderate': 6,
      'Low': 3
    };
    score += demandMap[marketData.demandLevel] || 9;
    
    // Growth forecast (0-15 points)
    const growthScore = Math.min(15, (marketData.forecastedGrowth5Year / 50) * 15);
    score += growthScore;
    
    return Math.round(score);
  }

  /**
   * Calculate risk score (lower risk = higher score)
   */
  calculateRiskScore(property) {
    let score = 20; // Start with full points
    
    // Risk deductions based on property risk score
    if (property.riskScore) {
      const riskDeduction = (property.riskScore / 100) * 20;
      score -= riskDeduction;
    }
    
    // Land size risk (very small or very large can be risky)
    if (property.size < 0.75 || property.size > 8) {
      score -= 3;
    }
    
    // Price risk (extreme prices can indicate issues)
    if (property.price < 200000 || property.price > 2000000) {
      score -= 2;
    }
    
    return Math.max(0, Math.round(score));
  }

  /**
   * Calculate strategic score based on portfolio fit
   */
  calculateStrategicScore(property) {
    let score = 0;
    
    // Land size diversity (0-5 points)
    if (property.size >= 1 && property.size <= 3) {
      score += 5; // Sweet spot for development
    } else if (property.size >= 0.5 && property.size < 1) {
      score += 3; // Smaller infill sites
    } else if (property.size > 3 && property.size <= 10) {
      score += 4; // Larger development sites
    }
    
    // Location tier (0-5 points)
    const tier1Cities = ['Greater London', 'Greater Manchester', 'Bristol'];
    const tier2Cities = ['West Midlands', 'West Yorkshire', 'Merseyside'];
    
    if (tier1Cities.includes(property.county)) {
      score += 5;
    } else if (tier2Cities.includes(property.county)) {
      score += 3;
    } else {
      score += 1;
    }
    
    return score;
  }

  /**
   * Calculate detailed ROI analysis
   */
  calculateROI(property) {
    const marketData = marketIntelligenceService.getMarketIntelligence(property.county);
    
    // Estimate GDV based on market data and property characteristics
    const estimatedGDV = property.price * (2 + (marketData.priceAppreciation / 10));
    
    // Estimate development costs (20-30% of purchase price)
    const developmentCosts = property.price * (0.20 + Math.random() * 0.10);
    
    // Financing costs (assume 5% interest on 70% loan)
    const loanAmount = property.price * 0.7;
    const financingCosts = loanAmount * 0.05 * 2; // 2-year development
    
    // Total investment
    const totalInvestment = property.price + developmentCosts + financingCosts;
    
    // Profit
    const profit = estimatedGDV - totalInvestment;
    
    // ROI percentage
    const roiPercentage = (profit / totalInvestment) * 100;
    
    // Timeline estimate (years)
    const timeline = 1.5 + (property.size / 10); // Larger sites take longer
    
    // Annualized return
    const annualizedReturn = roiPercentage / timeline;
    
    return {
      purchasePrice: property.price,
      estimatedGDV: Math.round(estimatedGDV),
      developmentCosts: Math.round(developmentCosts),
      financingCosts: Math.round(financingCosts),
      totalInvestment: Math.round(totalInvestment),
      estimatedProfit: Math.round(profit),
      roiPercentage: roiPercentage.toFixed(2),
      annualizedReturn: annualizedReturn.toFixed(2),
      estimatedTimeline: timeline.toFixed(1),
      breakEvenPoint: (property.price / estimatedGDV * timeline).toFixed(1)
    };
  }

  /**
   * Generate deal tier classification
   */
  getDealTier(score) {
    if (score >= 85) return 'PLATINUM';
    if (score >= 75) return 'GOLD';
    if (score >= 65) return 'SILVER';
    if (score >= 50) return 'BRONZE';
    return 'PASS';
  }

  /**
   * Get deal recommendation
   */
  getDealRecommendation(score, roi) {
    const roiValue = parseFloat(roi);
    
    if (score >= 85 && roiValue > 150) {
      return 'HIGHLY RECOMMENDED - Exceptional opportunity with strong returns';
    } else if (score >= 75 && roiValue > 100) {
      return 'RECOMMENDED - Strong deal with good profit potential';
    } else if (score >= 65 && roiValue > 75) {
      return 'CONSIDER - Viable opportunity, review market conditions';
    } else if (score >= 50) {
      return 'REVIEW - Moderate opportunity, conduct detailed analysis';
    } else {
      return 'PASS - Limited opportunity, continue searching';
    }
  }

  /**
   * Calculate comparable sales analysis
   */
  getComparableSalesAnalysis(property) {
    const marketData = marketIntelligenceService.getMarketIntelligence(property.county);
    
    return {
      avgPricePerAcre: marketData.avgPricePerAcre,
      propertyPricePerAcre: Math.round(property.price / property.size),
      priceComparison: this.comparePriceToMarket(property, marketData),
      marketPosition: this.getMarketPosition(property, marketData),
      valuationAssessment: this.assessValuation(property, marketData)
    };
  }

  /**
   * Compare property price to market average
   */
  comparePriceToMarket(property, marketData) {
    const propertyPricePerAcre = property.price / property.size;
    const marketPricePerAcre = marketData.avgPricePerAcre;
    const variance = ((propertyPricePerAcre - marketPricePerAcre) / marketPricePerAcre) * 100;
    
    return {
      variance: variance.toFixed(2),
      status: variance < -10 ? 'UNDERVALUED' : variance > 10 ? 'OVERVALUED' : 'MARKET RATE',
      opportunity: variance < -10 ? 'Strong buy opportunity' : variance > 10 ? 'Consider negotiation' : 'Fair market price'
    };
  }

  /**
   * Determine market position
   */
  getMarketPosition(property, marketData) {
    const demandScore = marketIntelligenceService.calculateDemandScore(marketData);
    
    if (demandScore > 70) {
      return 'Premium Market - High demand, limited supply';
    } else if (demandScore > 50) {
      return 'Strong Market - Good demand, moderate supply';
    } else {
      return 'Balanced Market - Moderate demand and supply';
    }
  }

  /**
   * Assess property valuation
   */
  assessValuation(property, marketData) {
    const propertyPricePerAcre = property.price / property.size;
    const marketPricePerAcre = marketData.avgPricePerAcre;
    
    if (propertyPricePerAcre < marketPricePerAcre * 0.9) {
      return 'EXCELLENT - Significant discount to market';
    } else if (propertyPricePerAcre < marketPricePerAcre) {
      return 'GOOD - Slight discount to market';
    } else if (propertyPricePerAcre < marketPricePerAcre * 1.1) {
      return 'FAIR - At market rate';
    } else {
      return 'REVIEW - Above market rate, negotiate or pass';
    }
  }
}

export default new DealScoringEngine();
