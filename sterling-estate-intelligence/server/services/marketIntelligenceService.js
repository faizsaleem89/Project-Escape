/**
 * Market Intelligence Service
 * Provides real-time market trends, forecasts, and regional analysis
 */

class MarketIntelligenceService {
  constructor() {
    this.regionMarketData = {
      'Greater London': {
        marketTrend: 'Strong Growth',
        priceAppreciation: 7.2,
        demandLevel: 'Very High',
        developmentActivity: 'Intense',
        avgPricePerAcre: 1200000,
        yearOverYearGrowth: 5.8,
        forecastedGrowth5Year: 42,
        hotspots: ['Central London', 'East London', 'South London'],
        competitorActivity: 'High',
        investorInterest: 'Exceptional'
      },
      'Greater Manchester': {
        marketTrend: 'Rapid Growth',
        priceAppreciation: 5.4,
        demandLevel: 'High',
        developmentActivity: 'Strong',
        avgPricePerAcre: 450000,
        yearOverYearGrowth: 4.2,
        forecastedGrowth5Year: 28,
        hotspots: ['City Centre', 'Salford Quays', 'Stockport'],
        competitorActivity: 'Moderate',
        investorInterest: 'Very High'
      },
      'West Midlands': {
        marketTrend: 'Steady Growth',
        priceAppreciation: 3.8,
        demandLevel: 'Moderate-High',
        developmentActivity: 'Moderate',
        avgPricePerAcre: 380000,
        yearOverYearGrowth: 3.1,
        forecastedGrowth5Year: 22,
        hotspots: ['Birmingham City Centre', 'Coventry Tech Hub'],
        competitorActivity: 'Moderate',
        investorInterest: 'High'
      },
      'West Yorkshire': {
        marketTrend: 'Growth',
        priceAppreciation: 4.1,
        demandLevel: 'Moderate-High',
        developmentActivity: 'Moderate',
        avgPricePerAcre: 420000,
        yearOverYearGrowth: 3.5,
        forecastedGrowth5Year: 25,
        hotspots: ['Leeds City Centre', 'Bradford'],
        competitorActivity: 'Low-Moderate',
        investorInterest: 'High'
      },
      'Bristol': {
        marketTrend: 'Strong Growth',
        priceAppreciation: 6.2,
        demandLevel: 'High',
        developmentActivity: 'Strong',
        avgPricePerAcre: 650000,
        yearOverYearGrowth: 4.8,
        forecastedGrowth5Year: 35,
        hotspots: ['Harbourside', 'South Bristol'],
        competitorActivity: 'Moderate',
        investorInterest: 'Very High'
      },
      'Merseyside': {
        marketTrend: 'Growth',
        priceAppreciation: 3.5,
        demandLevel: 'Moderate',
        developmentActivity: 'Moderate',
        avgPricePerAcre: 380000,
        yearOverYearGrowth: 2.9,
        forecastedGrowth5Year: 20,
        hotspots: ['Liverpool Waterfront', 'Wirral'],
        competitorActivity: 'Low',
        investorInterest: 'Moderate'
      },
      'Tyne and Wear': {
        marketTrend: 'Emerging Growth',
        priceAppreciation: 3.2,
        demandLevel: 'Moderate',
        developmentActivity: 'Emerging',
        avgPricePerAcre: 320000,
        yearOverYearGrowth: 2.5,
        forecastedGrowth5Year: 18,
        hotspots: ['Newcastle City Centre', 'Gateshead Quays'],
        competitorActivity: 'Low',
        investorInterest: 'Moderate'
      },
      'South Yorkshire': {
        marketTrend: 'Growth',
        priceAppreciation: 3.0,
        demandLevel: 'Moderate',
        developmentActivity: 'Moderate',
        avgPricePerAcre: 340000,
        yearOverYearGrowth: 2.3,
        forecastedGrowth5Year: 16,
        hotspots: ['Sheffield City Centre'],
        competitorActivity: 'Low',
        investorInterest: 'Moderate'
      }
    };
  }

  /**
   * Get market intelligence for a specific county
   */
  getMarketIntelligence(county) {
    return this.regionMarketData[county] || this.getDefaultMarketData();
  }

  /**
   * Get default market data for unknown regions
   */
  getDefaultMarketData() {
    return {
      marketTrend: 'Stable',
      priceAppreciation: 2.5,
      demandLevel: 'Moderate',
      developmentActivity: 'Moderate',
      avgPricePerAcre: 350000,
      yearOverYearGrowth: 2.0,
      forecastedGrowth5Year: 15,
      hotspots: [],
      competitorActivity: 'Moderate',
      investorInterest: 'Moderate'
    };
  }

  /**
   * Calculate 5-year price appreciation forecast
   */
  calculatePriceAppreciation(currentPrice, county) {
    const marketData = this.getMarketIntelligence(county);
    const annualGrowthRate = marketData.forecastedGrowth5Year / 5 / 100;
    let projectedPrice = currentPrice;
    
    for (let year = 0; year < 5; year++) {
      projectedPrice *= (1 + annualGrowthRate);
    }
    
    return {
      currentPrice: currentPrice,
      projectedPrice5Year: projectedPrice,
      totalAppreciation: projectedPrice - currentPrice,
      percentageGain: ((projectedPrice - currentPrice) / currentPrice * 100).toFixed(2),
      annualGrowthRate: (annualGrowthRate * 100).toFixed(2)
    };
  }

  /**
   * Get market demand heat map data
   */
  getMarketDemandHeatmap() {
    const heatmap = {};
    
    for (const [county, data] of Object.entries(this.regionMarketData)) {
      heatmap[county] = {
        demandScore: this.calculateDemandScore(data),
        trend: data.marketTrend,
        developmentActivity: data.developmentActivity,
        investorInterest: data.investorInterest,
        hotspots: data.hotspots
      };
    }
    
    return heatmap;
  }

  /**
   * Calculate demand score (0-100)
   */
  calculateDemandScore(marketData) {
    let score = 0;
    
    // Demand level (0-30 points)
    const demandMap = {
      'Very High': 30,
      'High': 25,
      'Moderate-High': 20,
      'Moderate': 15,
      'Low-Moderate': 10,
      'Low': 5
    };
    score += demandMap[marketData.demandLevel] || 15;
    
    // Development activity (0-25 points)
    const activityMap = {
      'Intense': 25,
      'Strong': 20,
      'Moderate': 15,
      'Emerging': 10,
      'Low': 5
    };
    score += activityMap[marketData.developmentActivity] || 15;
    
    // Price appreciation (0-25 points)
    score += Math.min(25, (marketData.priceAppreciation / 10) * 25);
    
    // Investor interest (0-20 points)
    const investorMap = {
      'Exceptional': 20,
      'Very High': 18,
      'High': 15,
      'Moderate': 10,
      'Low': 5
    };
    score += investorMap[marketData.investorInterest] || 10;
    
    return Math.round(score);
  }

  /**
   * Get competitive landscape analysis
   */
  getCompetitiveLandscape(county) {
    const marketData = this.getMarketIntelligence(county);
    
    return {
      competitorDensity: marketData.competitorActivity,
      marketSaturation: this.calculateMarketSaturation(marketData),
      opportunityGap: this.calculateOpportunityGap(marketData),
      recommendation: this.getMarketRecommendation(marketData)
    };
  }

  /**
   * Calculate market saturation level
   */
  calculateMarketSaturation(marketData) {
    const competitorMap = {
      'High': 75,
      'Moderate': 50,
      'Low-Moderate': 35,
      'Low': 20
    };
    
    return competitorMap[marketData.competitorActivity] || 50;
  }

  /**
   * Calculate opportunity gap (higher = better opportunity)
   */
  calculateOpportunityGap(marketData) {
    const demandScore = this.calculateDemandScore(marketData);
    const saturation = this.calculateMarketSaturation(marketData);
    
    // Opportunity gap = high demand + low saturation
    return Math.round((demandScore * (100 - saturation)) / 100);
  }

  /**
   * Get strategic market recommendation
   */
  getMarketRecommendation(marketData) {
    const demandScore = this.calculateDemandScore(marketData);
    const saturation = this.calculateMarketSaturation(marketData);
    
    if (demandScore > 70 && saturation < 40) {
      return 'HIGHLY RECOMMENDED - High demand, low saturation, excellent opportunity';
    } else if (demandScore > 60 && saturation < 60) {
      return 'RECOMMENDED - Good market conditions with growth potential';
    } else if (demandScore > 50) {
      return 'VIABLE - Moderate opportunity, monitor market trends';
    } else {
      return 'CAUTION - Limited opportunity, consider alternative markets';
    }
  }
}

export default new MarketIntelligenceService();
