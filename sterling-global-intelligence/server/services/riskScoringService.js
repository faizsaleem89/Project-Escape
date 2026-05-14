/**
 * Risk Scoring Service
 * Comprehensive risk assessment for shipments
 */

class RiskScoringService {
  constructor() {
    this.shipmentRisks = new Map();
  }

  /**
   * Score a shipment comprehensively
   */
  scoreShipment(shipmentData) {
    const {
      shipmentId,
      origin,
      destination,
      value,
      commodityType
    } = shipmentData;
    
    // Calculate individual risk components
    const geopoliticalRisk = this.calculateGeopoliticalRisk(origin, destination);
    const routeRisk = this.calculateRouteRisk(origin, destination);
    const commodityRisk = this.calculateCommodityRisk(commodityType);
    const valueRisk = this.calculateValueRisk(value);
    const timeRisk = this.calculateTimeRisk();
    
    // Calculate overall risk score (0-100)
    const overallRiskScore = this.calculateOverallRiskScore({
      geopoliticalRisk,
      routeRisk,
      commodityRisk,
      valueRisk,
      timeRisk
    });
    
    // Determine risk tier
    const riskTier = this.determineRiskTier(overallRiskScore);
    
    // Get recommendations
    const recommendations = this.getRiskRecommendations(riskTier, {
      geopoliticalRisk,
      routeRisk,
      commodityRisk,
      valueRisk
    });
    
    const riskScore = {
      shipmentId,
      origin,
      destination,
      value,
      commodityType,
      overallRiskScore,
      riskTier,
      componentRisks: {
        geopolitical: geopoliticalRisk,
        route: routeRisk,
        commodity: commodityRisk,
        value: valueRisk,
        time: timeRisk
      },
      recommendations,
      insuranceRecommendation: this.getInsuranceRecommendation(riskTier),
      scoredAt: new Date().toISOString()
    };
    
    this.shipmentRisks.set(shipmentId, riskScore);
    
    return riskScore;
  }

  /**
   * Calculate geopolitical risk
   */
  calculateGeopoliticalRisk(origin, destination) {
    const highRiskCountries = {
      'Iran': 9,
      'Syria': 8.5,
      'North Korea': 9.5,
      'Russia': 7.5,
      'Ukraine': 7.5,
      'Yemen': 8,
      'Iraq': 7
    };
    
    let riskScore = 2; // Base risk
    
    for (const [country, risk] of Object.entries(highRiskCountries)) {
      if (origin.includes(country) || destination.includes(country)) {
        riskScore = Math.max(riskScore, risk);
      }
    }
    
    return Math.min(10, riskScore);
  }

  /**
   * Calculate route risk
   */
  calculateRouteRisk(origin, destination) {
    const highRiskRoutes = {
      'Strait of Hormuz': 8,
      'Suez Canal': 7,
      'Strait of Malacca': 6,
      'Red Sea': 7.5,
      'South China Sea': 6.5,
      'Black Sea': 7,
      'Persian Gulf': 7.5
    };
    
    let riskScore = 2; // Base risk
    
    for (const [route, risk] of Object.entries(highRiskRoutes)) {
      // Simplified route matching
      if ((origin.includes('Middle East') || destination.includes('Middle East')) && 
          (route.includes('Strait') || route.includes('Gulf'))) {
        riskScore = Math.max(riskScore, risk);
      }
    }
    
    return Math.min(10, riskScore);
  }

  /**
   * Calculate commodity risk
   */
  calculateCommodityRisk(commodityType) {
    const commodityRisks = {
      'Electronics': 3,
      'Pharmaceuticals': 4,
      'Hazardous Materials': 8,
      'Perishables': 6,
      'Machinery': 3,
      'Textiles': 2,
      'Raw Materials': 2,
      'Luxury Goods': 7,
      'Semiconductors': 5,
      'Oil & Gas': 7
    };
    
    return commodityRisks[commodityType] || 3;
  }

  /**
   * Calculate value risk
   */
  calculateValueRisk(value) {
    // Higher value = higher risk (theft, loss, damage)
    if (value > 1000000) return 8;
    if (value > 500000) return 6;
    if (value > 100000) return 4;
    if (value > 50000) return 3;
    return 2;
  }

  /**
   * Calculate time risk
   */
  calculateTimeRisk() {
    const month = new Date().getMonth();
    
    // Typhoon season
    if (month >= 6 && month <= 10) return 5;
    
    // Hurricane season
    if (month >= 5 && month <= 10) return 4;
    
    // Winter storms
    if (month >= 11 || month <= 1) return 3;
    
    return 2;
  }

  /**
   * Calculate overall risk score
   */
  calculateOverallRiskScore(componentRisks) {
    const weights = {
      geopoliticalRisk: 0.30,
      routeRisk: 0.25,
      commodityRisk: 0.20,
      valueRisk: 0.15,
      timeRisk: 0.10
    };
    
    let score = 0;
    for (const [component, weight] of Object.entries(weights)) {
      score += (componentRisks[component] || 0) * weight;
    }
    
    return Math.round(score * 10) / 10;
  }

  /**
   * Determine risk tier
   */
  determineRiskTier(score) {
    if (score >= 8) return 'CRITICAL';
    if (score >= 6) return 'HIGH';
    if (score >= 4) return 'MEDIUM';
    if (score >= 2) return 'LOW';
    return 'MINIMAL';
  }

  /**
   * Get risk recommendations
   */
  getRiskRecommendations(riskTier, componentRisks) {
    const recommendations = [];
    
    if (riskTier === 'CRITICAL') {
      recommendations.push('URGENT: Consider postponing shipment or using alternative route');
      recommendations.push('Increase insurance coverage to maximum');
      recommendations.push('Implement enhanced security measures');
      recommendations.push('Daily monitoring required');
    } else if (riskTier === 'HIGH') {
      recommendations.push('Review route options');
      recommendations.push('Increase insurance coverage');
      recommendations.push('Implement standard security measures');
      recommendations.push('Regular monitoring recommended');
    } else if (riskTier === 'MEDIUM') {
      recommendations.push('Standard precautions recommended');
      recommendations.push('Standard insurance coverage');
      recommendations.push('Regular monitoring');
    } else {
      recommendations.push('Proceed normally');
      recommendations.push('Standard insurance sufficient');
    }
    
    // Add specific recommendations based on component risks
    if (componentRisks.geopoliticalRisk >= 7) {
      recommendations.push('Geopolitical risk is high - monitor situation closely');
    }
    
    if (componentRisks.routeRisk >= 7) {
      recommendations.push('Route risk is high - consider alternative routing');
    }
    
    if (componentRisks.valueRisk >= 7) {
      recommendations.push('High-value shipment - implement enhanced security');
    }
    
    return recommendations;
  }

  /**
   * Get insurance recommendation
   */
  getInsuranceRecommendation(riskTier) {
    const recommendations = {
      'CRITICAL': {
        coverage: 'Maximum coverage (100%)',
        type: 'All-risk with enhanced protection',
        premium: 'High (2.5-5%)',
        additionalCoverage: ['War risk', 'Strikes/riots', 'Terrorism', 'Piracy']
      },
      'HIGH': {
        coverage: 'Comprehensive coverage (95%)',
        type: 'All-risk standard',
        premium: 'Medium-High (1.5-2.5%)',
        additionalCoverage: ['War risk', 'Strikes/riots']
      },
      'MEDIUM': {
        coverage: 'Standard coverage (80-90%)',
        type: 'Standard all-risk',
        premium: 'Medium (0.8-1.5%)',
        additionalCoverage: ['Strikes/riots']
      },
      'LOW': {
        coverage: 'Basic coverage (70-80%)',
        type: 'Basic all-risk',
        premium: 'Low (0.3-0.8%)',
        additionalCoverage: []
      },
      'MINIMAL': {
        coverage: 'Minimal coverage (50-70%)',
        type: 'Basic coverage',
        premium: 'Very Low (0.1-0.3%)',
        additionalCoverage: []
      }
    };
    
    return recommendations[riskTier] || recommendations['MEDIUM'];
  }

  /**
   * Get shipment risk score
   */
  getShipmentRiskScore(shipmentId) {
    return this.shipmentRisks.get(shipmentId);
  }

  /**
   * Get average risk score
   */
  getAverageRiskScore() {
    if (this.shipmentRisks.size === 0) return 0;
    
    const scores = Array.from(this.shipmentRisks.values()).map(s => s.overallRiskScore);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    return Math.round(avg * 10) / 10;
  }

  /**
   * Get shipments by risk tier
   */
  getShipmentsByRiskTier(tier) {
    return Array.from(this.shipmentRisks.values()).filter(s => s.riskTier === tier);
  }

  /**
   * Get high-risk shipments
   */
  getHighRiskShipments() {
    return Array.from(this.shipmentRisks.values()).filter(s => 
      s.riskTier === 'CRITICAL' || s.riskTier === 'HIGH'
    );
  }

  /**
   * Get risk distribution
   */
  getRiskDistribution() {
    const distribution = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
      MINIMAL: 0
    };
    
    this.shipmentRisks.forEach(score => {
      distribution[score.riskTier]++;
    });
    
    return distribution;
  }
}

export default new RiskScoringService();
