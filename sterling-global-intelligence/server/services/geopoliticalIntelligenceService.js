/**
 * Geopolitical Intelligence Service
 * Real-time geopolitical risk analysis and conflict tracking
 */

class GeopoliticalIntelligenceService {
  constructor() {
    this.globalRisks = this.initializeGlobalRisks();
    this.sanctions = this.initializeSanctions();
    this.tradeRestrictions = this.initializeTradeRestrictions();
  }

  /**
   * Initialize global risk data
   */
  initializeGlobalRisks() {
    return [
      {
        region: 'Middle East',
        riskLevel: 'High',
        riskScore: 8.5,
        affectedCountries: ['Iran', 'Yemen', 'Syria', 'Iraq'],
        impact: 'Shipping disruptions, port closures, insurance premiums increase',
        routes: ['Strait of Hormuz', 'Red Sea', 'Persian Gulf'],
        lastUpdate: new Date().toISOString(),
        trend: 'Increasing'
      },
      {
        region: 'Eastern Europe',
        riskLevel: 'High',
        riskScore: 8.2,
        affectedCountries: ['Ukraine', 'Russia', 'Belarus'],
        impact: 'Supply chain disruptions, sanctions enforcement, route changes',
        routes: ['Black Sea', 'Baltic Sea', 'Danube River'],
        lastUpdate: new Date().toISOString(),
        trend: 'Stable'
      },
      {
        region: 'South China Sea',
        riskLevel: 'Medium-High',
        riskScore: 7.1,
        affectedCountries: ['China', 'Taiwan', 'Vietnam', 'Philippines'],
        impact: 'Geopolitical tensions, potential shipping delays',
        routes: ['Taiwan Strait', 'Luzon Strait'],
        lastUpdate: new Date().toISOString(),
        trend: 'Increasing'
      },
      {
        region: 'North Africa',
        riskLevel: 'Medium',
        riskScore: 6.3,
        affectedCountries: ['Libya', 'Tunisia', 'Morocco'],
        impact: 'Port security concerns, piracy risk',
        routes: ['Suez Canal', 'Mediterranean'],
        lastUpdate: new Date().toISOString(),
        trend: 'Stable'
      },
      {
        region: 'Southeast Asia',
        riskLevel: 'Low-Medium',
        riskScore: 4.5,
        affectedCountries: ['Myanmar', 'Thailand'],
        impact: 'Minor disruptions, political instability',
        routes: ['Andaman Sea', 'Gulf of Thailand'],
        lastUpdate: new Date().toISOString(),
        trend: 'Decreasing'
      }
    ];
  }

  /**
   * Initialize sanctions data
   */
  initializeSanctions() {
    return [
      {
        country: 'Iran',
        sanctioningCountries: ['USA', 'EU'],
        type: 'Comprehensive',
        affectedSectors: ['Oil', 'Banking', 'Shipping', 'Aviation'],
        impact: 'Severe shipping restrictions, port access denied',
        effectiveDate: '2018-11-05',
        status: 'Active'
      },
      {
        country: 'Russia',
        sanctioningCountries: ['USA', 'EU', 'UK', 'Canada'],
        type: 'Sectoral',
        affectedSectors: ['Energy', 'Finance', 'Technology'],
        impact: 'Port access restrictions, insurance complications',
        effectiveDate: '2022-02-24',
        status: 'Active'
      },
      {
        country: 'North Korea',
        sanctioningCountries: ['USA', 'UN'],
        type: 'Comprehensive',
        affectedSectors: ['All'],
        impact: 'Complete trade embargo',
        effectiveDate: '2006-10-09',
        status: 'Active'
      },
      {
        country: 'Syria',
        sanctioningCountries: ['USA', 'EU'],
        type: 'Comprehensive',
        affectedSectors: ['Oil', 'Banking', 'Trade'],
        impact: 'Severe shipping restrictions',
        effectiveDate: '2011-05-02',
        status: 'Active'
      }
    ];
  }

  /**
   * Initialize trade restrictions
   */
  initializeTradeRestrictions() {
    return [
      {
        type: 'Export Control',
        affectedCountries: ['China'],
        restrictedItems: ['Semiconductors', 'Advanced Technology'],
        source: 'USA',
        impact: 'Delayed shipments, customs holds',
        effectiveDate: '2022-10-07'
      },
      {
        type: 'Import Tariff',
        affectedCountries: ['USA'],
        restrictedItems: ['Steel', 'Aluminum'],
        source: 'Multiple',
        impact: 'Increased shipping costs',
        effectiveDate: '2018-03-23'
      },
      {
        type: 'Quota Restriction',
        affectedCountries: ['EU'],
        restrictedItems: ['Agricultural Products'],
        source: 'EU',
        impact: 'Limited shipment volumes',
        effectiveDate: '2020-01-01'
      }
    ];
  }

  /**
   * Get global risks
   */
  getGlobalRisks() {
    return this.globalRisks.map(risk => ({
      ...risk,
      recommendations: this.getRiskRecommendations(risk.riskLevel)
    }));
  }

  /**
   * Get risks for specific region
   */
  getRegionRisks(region) {
    const regionRisk = this.globalRisks.find(r => r.region === region);
    
    if (!regionRisk) {
      return {
        region,
        riskLevel: 'Low',
        riskScore: 2.0,
        affectedCountries: [],
        impact: 'No significant risks identified',
        routes: [],
        lastUpdate: new Date().toISOString()
      };
    }
    
    return {
      ...regionRisk,
      sanctions: this.getSanctionsForRegion(region),
      tradeRestrictions: this.getTradeRestrictionsForRegion(region),
      recommendations: this.getRiskRecommendations(regionRisk.riskLevel)
    };
  }

  /**
   * Get sanctions for region
   */
  getSanctionsForRegion(region) {
    const regionCountries = {
      'Middle East': ['Iran', 'Syria'],
      'Eastern Europe': ['Russia'],
      'Asia-Pacific': ['North Korea']
    };
    
    const countries = regionCountries[region] || [];
    return this.sanctions.filter(s => countries.includes(s.country));
  }

  /**
   * Get trade restrictions for region
   */
  getTradeRestrictionsForRegion(region) {
    return this.tradeRestrictions;
  }

  /**
   * Get risk recommendations
   */
  getRiskRecommendations(riskLevel) {
    const recommendations = {
      'High': [
        'Avoid region if possible',
        'Use alternative routes',
        'Increase insurance coverage',
        'Monitor situation daily',
        'Prepare contingency plans'
      ],
      'Medium-High': [
        'Use established routes',
        'Increase monitoring',
        'Consider alternative routes',
        'Review insurance coverage',
        'Maintain flexibility'
      ],
      'Medium': [
        'Standard precautions',
        'Regular monitoring',
        'Have backup routes',
        'Standard insurance'
      ],
      'Low-Medium': [
        'Monitor situation',
        'Standard procedures'
      ],
      'Low': [
        'Proceed normally'
      ]
    };
    
    return recommendations[riskLevel] || ['Monitor situation'];
  }

  /**
   * Check if shipment route is affected by sanctions
   */
  isRouteAffectedBySanctions(origin, destination) {
    const sanctionedCountries = this.sanctions
      .filter(s => s.status === 'Active')
      .map(s => s.country);
    
    return sanctionedCountries.includes(origin) || sanctionedCountries.includes(destination);
  }

  /**
   * Get shipping route risk assessment
   */
  getRouteRiskAssessment(origin, destination) {
    const affectedRisks = this.globalRisks.filter(risk => 
      risk.routes.some(route => 
        origin.includes(route) || destination.includes(route)
      )
    );
    
    const sanctionRisk = this.isRouteAffectedBySanctions(origin, destination);
    
    const avgRiskScore = affectedRisks.length > 0 
      ? affectedRisks.reduce((sum, r) => sum + r.riskScore, 0) / affectedRisks.length
      : 2.0;
    
    return {
      origin,
      destination,
      affectedRisks,
      sanctionRisk,
      overallRiskScore: Math.min(10, avgRiskScore + (sanctionRisk ? 2 : 0)),
      riskLevel: this.calculateRiskLevel(avgRiskScore),
      recommendations: this.getRouteRecommendations(affectedRisks, sanctionRisk)
    };
  }

  /**
   * Calculate risk level from score
   */
  calculateRiskLevel(score) {
    if (score >= 8) return 'High';
    if (score >= 6) return 'Medium-High';
    if (score >= 4) return 'Medium';
    if (score >= 2) return 'Low-Medium';
    return 'Low';
  }

  /**
   * Get route recommendations
   */
  getRouteRecommendations(affectedRisks, sanctionRisk) {
    const recommendations = [];
    
    if (sanctionRisk) {
      recommendations.push('Route passes through sanctioned territory - consider alternative');
    }
    
    if (affectedRisks.length > 0) {
      affectedRisks.forEach(risk => {
        recommendations.push(`${risk.region}: ${risk.impact}`);
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Route is clear - proceed normally');
    }
    
    return recommendations;
  }

  /**
   * Get all active sanctions
   */
  getActiveSanctions() {
    return this.sanctions.filter(s => s.status === 'Active');
  }

  /**
   * Get all active trade restrictions
   */
  getActiveTradeRestrictions() {
    return this.tradeRestrictions;
  }
}

export default new GeopoliticalIntelligenceService();
