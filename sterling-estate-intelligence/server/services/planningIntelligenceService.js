/**
 * Planning Permission Intelligence Engine
 * Predicts planning approval odds and provides timeline estimates
 */

class PlanningIntelligenceService {
  constructor() {
    this.planningData = {
      'Greater London': {
        approvalRate: 0.68,
        avgTimelineDays: 120,
        complexityFactor: 1.3,
        preAppAdviceRecommended: true
      },
      'Greater Manchester': {
        approvalRate: 0.72,
        avgTimelineDays: 105,
        complexityFactor: 1.1,
        preAppAdviceRecommended: true
      },
      'West Midlands': {
        approvalRate: 0.75,
        avgTimelineDays: 95,
        complexityFactor: 1.0,
        preAppAdviceRecommended: false
      },
      'West Yorkshire': {
        approvalRate: 0.73,
        avgTimelineDays: 100,
        complexityFactor: 1.05,
        preAppAdviceRecommended: false
      },
      'Bristol': {
        approvalRate: 0.70,
        avgTimelineDays: 110,
        complexityFactor: 1.2,
        preAppAdviceRecommended: true
      },
      'Merseyside': {
        approvalRate: 0.74,
        avgTimelineDays: 98,
        complexityFactor: 0.95,
        preAppAdviceRecommended: false
      },
      'Tyne and Wear': {
        approvalRate: 0.76,
        avgTimelineDays: 90,
        complexityFactor: 0.9,
        preAppAdviceRecommended: false
      },
      'South Yorkshire': {
        approvalRate: 0.75,
        avgTimelineDays: 95,
        complexityFactor: 0.95,
        preAppAdviceRecommended: false
      }
    };
  }

  /**
   * Predict planning approval likelihood (0-100%)
   */
  predictApprovalLikelihood(property) {
    const planningData = this.planningData[property.county] || this.getDefaultPlanningData();
    
    let likelihood = planningData.approvalRate * 100;
    
    // Adjust based on property characteristics
    // Smaller sites are easier to approve
    if (property.size < 1) {
      likelihood += 5;
    } else if (property.size > 5) {
      likelihood -= 3;
    }
    
    // Residential development is more likely
    if (property.developmentType === 'residential') {
      likelihood += 3;
    } else if (property.developmentType === 'commercial') {
      likelihood -= 2;
    }
    
    // Cap at 95% (nothing is 100% certain)
    return Math.min(95, Math.max(20, likelihood));
  }

  /**
   * Estimate planning timeline
   */
  estimatePlanningTimeline(property) {
    const planningData = this.planningData[property.county] || this.getDefaultPlanningData();
    
    let baseTimeline = planningData.avgTimelineDays;
    
    // Adjust based on complexity
    let complexity = 1.0;
    
    // Larger sites take longer
    if (property.size > 5) {
      complexity += 0.2;
    }
    
    // Mixed-use developments are more complex
    if (property.developmentType === 'mixed-use') {
      complexity += 0.3;
    }
    
    // Environmental constraints add time
    if (property.environmentalConstraints) {
      complexity += 0.2;
    }
    
    const estimatedDays = Math.round(baseTimeline * complexity);
    
    return {
      estimatedDays,
      estimatedWeeks: Math.round(estimatedDays / 7),
      estimatedMonths: Math.round(estimatedDays / 30),
      bestCaseScenario: Math.round(estimatedDays * 0.7),
      worstCaseScenario: Math.round(estimatedDays * 1.4),
      complexity: (complexity * 100).toFixed(0)
    };
  }

  /**
   * Get planning risk factors
   */
  getPlanningRiskFactors(property) {
    const risks = [];
    let riskScore = 0;
    
    // Environmental risks
    if (property.floodRisk === 'High') {
      risks.push({
        factor: 'Flood Risk',
        severity: 'High',
        impact: 'May require flood mitigation, delays approval',
        mitigation: 'Conduct flood risk assessment, propose mitigation'
      });
      riskScore += 15;
    }
    
    // Conservation area risks
    if (property.conservationArea) {
      risks.push({
        factor: 'Conservation Area',
        severity: 'Medium',
        impact: 'Design scrutiny, longer approval process',
        mitigation: 'Engage conservation officer early, design to local character'
      });
      riskScore += 10;
    }
    
    // Green belt risks
    if (property.greenBelt) {
      risks.push({
        factor: 'Green Belt',
        severity: 'High',
        impact: 'Very difficult to get approval, requires exceptional circumstances',
        mitigation: 'Demonstrate very special circumstances, consider alternative sites'
      });
      riskScore += 20;
    }
    
    // Listed building risks
    if (property.listedBuildings) {
      risks.push({
        factor: 'Listed Buildings',
        severity: 'High',
        impact: 'Heritage approval required, significant constraints',
        mitigation: 'Engage heritage consultant, propose sensitive conversion'
      });
      riskScore += 15;
    }
    
    // Size/scale risks
    if (property.size > 10) {
      risks.push({
        factor: 'Large Scale Development',
        severity: 'Medium',
        impact: 'More scrutiny, infrastructure requirements',
        mitigation: 'Prepare comprehensive impact assessment, engage early'
      });
      riskScore += 8;
    }
    
    return {
      risks,
      riskScore: Math.min(100, riskScore),
      riskLevel: riskScore > 50 ? 'High' : riskScore > 25 ? 'Medium' : 'Low'
    };
  }

  /**
   * Get pre-application advice recommendation
   */
  getPreAppAdviceRecommendation(property) {
    const planningData = this.planningData[property.county] || this.getDefaultPlanningData();
    const riskFactors = this.getPlanningRiskFactors(property);
    
    const recommendation = {
      recommended: planningData.preAppAdviceRecommended || riskFactors.riskScore > 25,
      reason: '',
      expectedCost: '£2,000-£5,000',
      expectedTimeline: '4-6 weeks',
      benefits: [
        'Identify issues early',
        'Reduce formal application risk',
        'Faster formal approval process',
        'Better understanding of council requirements'
      ]
    };
    
    if (riskFactors.riskScore > 50) {
      recommendation.reason = 'High risk factors present - pre-app advice strongly recommended';
      recommendation.expectedCost = '£5,000-£10,000';
    } else if (planningData.preAppAdviceRecommended) {
      recommendation.reason = 'Complex planning environment - pre-app advice recommended';
    } else {
      recommendation.reason = 'Straightforward development - pre-app advice optional';
    }
    
    return recommendation;
  }

  /**
   * Get planning application status tracking
   */
  getPlanningApplicationStatus(applicationId) {
    // Simulated status - in production would query planning portal
    const statuses = [
      'Received',
      'Under Review',
      'Consultation Period',
      'Officer Assessment',
      'Committee Review',
      'Decision Issued'
    ];
    
    const currentStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const daysElapsed = Math.floor(Math.random() * 120);
    
    return {
      applicationId,
      currentStatus,
      daysElapsed,
      estimatedDecisionDate: new Date(Date.now() + (120 - daysElapsed) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progressPercentage: (daysElapsed / 120) * 100,
      lastUpdate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      nextStep: this.getNextStep(currentStatus)
    };
  }

  /**
   * Get next step in planning process
   */
  getNextStep(currentStatus) {
    const steps = {
      'Received': 'Application being validated and registered',
      'Under Review': 'Officer conducting detailed assessment',
      'Consultation Period': 'Public consultation underway - submit representations',
      'Officer Assessment': 'Officer preparing recommendation report',
      'Committee Review': 'Application going to planning committee',
      'Decision Issued': 'Decision notice being prepared'
    };
    
    return steps[currentStatus] || 'Unknown status';
  }

  /**
   * Get planning approval checklist
   */
  getApprovalChecklist(property) {
    return [
      {
        item: 'Site location plan',
        status: 'required',
        priority: 'critical'
      },
      {
        item: 'Proposed site layout',
        status: 'required',
        priority: 'critical'
      },
      {
        item: 'Design and access statement',
        status: 'required',
        priority: 'critical'
      },
      {
        item: 'Environmental impact assessment',
        status: property.size > 2 ? 'required' : 'optional',
        priority: 'high'
      },
      {
        item: 'Transport assessment',
        status: property.size > 5 ? 'required' : 'optional',
        priority: 'high'
      },
      {
        item: 'Flood risk assessment',
        status: property.floodRisk ? 'required' : 'optional',
        priority: 'high'
      },
      {
        item: 'Heritage assessment',
        status: property.listedBuildings ? 'required' : 'optional',
        priority: 'high'
      },
      {
        item: 'Arboricultural survey',
        status: 'optional',
        priority: 'medium'
      },
      {
        item: 'Contaminated land assessment',
        status: 'optional',
        priority: 'medium'
      }
    ];
  }

  /**
   * Get default planning data for unknown regions
   */
  getDefaultPlanningData() {
    return {
      approvalRate: 0.72,
      avgTimelineDays: 100,
      complexityFactor: 1.0,
      preAppAdviceRecommended: false
    };
  }
}

export default new PlanningIntelligenceService();
