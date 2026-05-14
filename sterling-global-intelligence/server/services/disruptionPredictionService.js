/**
 * Disruption Prediction Service
 * Predict supply chain disruptions before they happen
 */

class DisruptionPredictionService {
  constructor() {
    this.predictedDisruptions = [];
  }

  /**
   * Predict disruptions for a shipment
   */
  predictDisruptions(shipmentData) {
    const disruptions = [];
    const riskFactors = [];
    
    // Check geopolitical risks
    const geoRisks = this.checkGeopoliticalRisks(shipmentData.origin, shipmentData.destination);
    if (geoRisks.length > 0) {
      disruptions.push(...geoRisks);
      riskFactors.push('Geopolitical');
    }
    
    // Check weather patterns
    const weatherRisks = this.checkWeatherRisks(shipmentData.route);
    if (weatherRisks.length > 0) {
      disruptions.push(...weatherRisks);
      riskFactors.push('Weather');
    }
    
    // Check port congestion
    const portRisks = this.checkPortCongestion(shipmentData.origin, shipmentData.destination);
    if (portRisks.length > 0) {
      disruptions.push(...portRisks);
      riskFactors.push('Port Congestion');
    }
    
    // Check seasonal factors
    const seasonalRisks = this.checkSeasonalFactors();
    if (seasonalRisks.length > 0) {
      disruptions.push(...seasonalRisks);
      riskFactors.push('Seasonal');
    }
    
    // Check labor issues
    const laborRisks = this.checkLaborIssues();
    if (laborRisks.length > 0) {
      disruptions.push(...laborRisks);
      riskFactors.push('Labor');
    }
    
    const prediction = {
      shipmentId: shipmentData.shipmentId,
      route: shipmentData.route,
      origin: shipmentData.origin,
      destination: shipmentData.destination,
      predictedDisruptions: disruptions,
      disruptionProbability: this.calculateDisruptionProbability(disruptions),
      riskFactors,
      estimatedImpact: this.calculateEstimatedImpact(disruptions),
      recommendations: this.getDisruptionRecommendations(disruptions),
      predictionDate: new Date().toISOString(),
      confidence: this.calculateConfidence(disruptions)
    };
    
    this.predictedDisruptions.push(prediction);
    
    return prediction;
  }

  /**
   * Check geopolitical risks
   */
  checkGeopoliticalRisks(origin, destination) {
    const risks = [];
    
    const highRiskRegions = {
      'Middle East': ['Iran', 'Yemen', 'Syria'],
      'Eastern Europe': ['Ukraine', 'Russia'],
      'South China Sea': ['Taiwan', 'China']
    };
    
    for (const [region, countries] of Object.entries(highRiskRegions)) {
      if (countries.some(c => origin.includes(c) || destination.includes(c))) {
        risks.push({
          type: 'Geopolitical Risk',
          severity: 'High',
          description: `Route passes through ${region} - heightened geopolitical tensions`,
          probability: 0.65,
          potentialDelay: '5-15 days',
          mitigation: 'Consider alternative route or increase insurance'
        });
      }
    }
    
    return risks;
  }

  /**
   * Check weather risks
   */
  checkWeatherRisks(route) {
    const risks = [];
    
    const currentMonth = new Date().getMonth();
    
    // Typhoon season (July-November)
    if (currentMonth >= 6 && currentMonth <= 10) {
      if (route && route.includes('Pacific')) {
        risks.push({
          type: 'Weather Risk',
          severity: 'High',
          description: 'Typhoon season in Pacific - increased storm risk',
          probability: 0.45,
          potentialDelay: '3-10 days',
          mitigation: 'Monitor weather forecasts, prepare for delays'
        });
      }
    }
    
    // Hurricane season (June-November)
    if (currentMonth >= 5 && currentMonth <= 10) {
      if (route && (route.includes('Atlantic') || route.includes('Caribbean'))) {
        risks.push({
          type: 'Weather Risk',
          severity: 'Medium-High',
          description: 'Hurricane season in Atlantic - storm risk',
          probability: 0.35,
          potentialDelay: '2-7 days',
          mitigation: 'Monitor weather, consider alternative routes'
        });
      }
    }
    
    // Winter storms (December-February)
    if (currentMonth >= 11 || currentMonth <= 1) {
      if (route && route.includes('North Atlantic')) {
        risks.push({
          type: 'Weather Risk',
          severity: 'Medium',
          description: 'Winter storm season - rough seas expected',
          probability: 0.40,
          potentialDelay: '2-5 days',
          mitigation: 'Prepare for heavy weather, monitor conditions'
        });
      }
    }
    
    return risks;
  }

  /**
   * Check port congestion
   */
  checkPortCongestion(origin, destination) {
    const risks = [];
    
    const congestedPorts = {
      'Shanghai': { utilization: 87, waitTime: 3.5 },
      'Singapore': { utilization: 91, waitTime: 4.2 },
      'Los Angeles': { utilization: 85, waitTime: 3.1 },
      'Rotterdam': { utilization: 72, waitTime: 2.1 }
    };
    
    for (const [port, data] of Object.entries(congestedPorts)) {
      if (origin.includes(port) || destination.includes(port)) {
        if (data.utilization > 85) {
          risks.push({
            type: 'Port Congestion',
            severity: 'High',
            description: `${port} port is highly congested (${data.utilization}% capacity)`,
            probability: 0.85,
            potentialDelay: `${data.waitTime} days`,
            mitigation: 'Plan for extended port delays, consider alternative ports'
          });
        }
      }
    }
    
    return risks;
  }

  /**
   * Check seasonal factors
   */
  checkSeasonalFactors() {
    const risks = [];
    const month = new Date().getMonth();
    
    // Chinese New Year (January-February)
    if (month === 0 || month === 1) {
      risks.push({
        type: 'Seasonal Factor',
        severity: 'Medium',
        description: 'Chinese New Year - reduced port operations, labor shortages',
        probability: 0.70,
        potentialDelay: '3-7 days',
        mitigation: 'Plan ahead, book early, expect delays'
      });
    }
    
    // Summer holidays (July-August)
    if (month === 6 || month === 7) {
      risks.push({
        type: 'Seasonal Factor',
        severity: 'Low-Medium',
        description: 'Summer holidays - reduced workforce availability',
        probability: 0.40,
        potentialDelay: '1-3 days',
        mitigation: 'Plan for reduced operations'
      });
    }
    
    return risks;
  }

  /**
   * Check labor issues
   */
  checkLaborIssues() {
    const risks = [];
    
    const laborProblems = [
      {
        port: 'Los Angeles',
        issue: 'Ongoing labor negotiations',
        severity: 'Medium',
        probability: 0.55
      },
      {
        port: 'Rotterdam',
        issue: 'Potential strike action',
        severity: 'Medium-High',
        probability: 0.35
      }
    ];
    
    laborProblems.forEach(problem => {
      risks.push({
        type: 'Labor Issue',
        severity: problem.severity,
        description: `${problem.port}: ${problem.issue}`,
        probability: problem.probability,
        potentialDelay: '2-5 days',
        mitigation: 'Monitor labor situation, prepare contingency plans'
      });
    });
    
    return risks;
  }

  /**
   * Calculate disruption probability
   */
  calculateDisruptionProbability(disruptions) {
    if (disruptions.length === 0) return 0.05;
    
    const avgProbability = disruptions.reduce((sum, d) => sum + d.probability, 0) / disruptions.length;
    return Math.min(0.99, avgProbability);
  }

  /**
   * Calculate estimated impact
   */
  calculateEstimatedImpact(disruptions) {
    if (disruptions.length === 0) return 'Minimal';
    
    const severities = disruptions.map(d => {
      if (d.severity === 'High') return 3;
      if (d.severity === 'Medium-High') return 2.5;
      if (d.severity === 'Medium') return 2;
      if (d.severity === 'Low-Medium') return 1.5;
      return 1;
    });
    
    const avgSeverity = severities.reduce((a, b) => a + b, 0) / severities.length;
    
    if (avgSeverity >= 2.5) return 'High';
    if (avgSeverity >= 1.8) return 'Medium-High';
    if (avgSeverity >= 1.2) return 'Medium';
    return 'Low';
  }

  /**
   * Calculate confidence level
   */
  calculateConfidence(disruptions) {
    if (disruptions.length === 0) return 0.95;
    if (disruptions.length === 1) return 0.75;
    if (disruptions.length === 2) return 0.80;
    return 0.85;
  }

  /**
   * Get disruption recommendations
   */
  getDisruptionRecommendations(disruptions) {
    const recommendations = [];
    
    disruptions.forEach(d => {
      recommendations.push(d.mitigation);
    });
    
    if (recommendations.length === 0) {
      recommendations.push('No significant disruptions predicted. Proceed normally.');
    }
    
    return recommendations;
  }

  /**
   * Get predicted disruption count
   */
  getPredictedDisruptionCount() {
    return this.predictedDisruptions.filter(p => 
      p.disruptionProbability > 0.5
    ).length;
  }

  /**
   * Get all predictions
   */
  getAllPredictions() {
    return this.predictedDisruptions;
  }

  /**
   * Get high-risk predictions
   */
  getHighRiskPredictions() {
    return this.predictedDisruptions.filter(p => 
      p.estimatedImpact === 'High' || p.disruptionProbability > 0.75
    );
  }
}

export default new DisruptionPredictionService();
