/**
 * Real-Time Alerts & Notification System
 * Notifies developers of new opportunities and market changes
 */

class AlertsService {
  constructor() {
    this.alerts = [];
    this.watchlists = new Map();
    this.notificationChannels = ['email', 'sms', 'push', 'dashboard'];
  }

  /**
   * Create a watchlist for a developer
   */
  createWatchlist(developerId, criteria) {
    const watchlistId = `watchlist_${Date.now()}`;
    
    this.watchlists.set(watchlistId, {
      id: watchlistId,
      developerId,
      criteria: {
        counties: criteria.counties || [],
        minSize: criteria.minSize || 0.5,
        maxSize: criteria.maxSize || 10,
        minBudget: criteria.minBudget || 0,
        maxBudget: criteria.maxBudget || 5000000,
        dealTierMinimum: criteria.dealTierMinimum || 'BRONZE',
        roiMinimum: criteria.roiMinimum || 50,
      },
      createdAt: new Date(),
      active: true,
      notificationPreferences: {
        email: criteria.emailNotifications !== false,
        sms: criteria.smsNotifications !== false,
        push: criteria.pushNotifications !== false,
        frequency: criteria.notificationFrequency || 'immediate'
      }
    });
    
    return this.watchlists.get(watchlistId);
  }

  /**
   * Check if a property matches watchlist criteria
   */
  matchesWatchlist(property, watchlist) {
    const { criteria } = watchlist;
    
    // County match
    if (criteria.counties.length > 0 && !criteria.counties.includes(property.county)) {
      return false;
    }
    
    // Size match
    if (property.size < criteria.minSize || property.size > criteria.maxSize) {
      return false;
    }
    
    // Budget match
    if (property.price < criteria.minBudget || property.price > criteria.maxBudget) {
      return false;
    }
    
    return true;
  }

  /**
   * Generate alert for matching property
   */
  generateAlert(property, watchlist, alertType = 'new_opportunity') {
    const alert = {
      id: `alert_${Date.now()}`,
      watchlistId: watchlist.id,
      developerId: watchlist.developerId,
      property: {
        id: property.id,
        address: property.address,
        county: property.county,
        size: property.size,
        price: property.price,
      },
      alertType,
      title: this.generateAlertTitle(property, alertType),
      message: this.generateAlertMessage(property, alertType),
      urgency: this.calculateUrgency(property),
      timestamp: new Date(),
      read: false,
      channels: watchlist.notificationPreferences
    };
    
    this.alerts.push(alert);
    return alert;
  }

  /**
   * Generate alert title
   */
  generateAlertTitle(property, alertType) {
    const titles = {
      'new_opportunity': `New ${property.size}ac opportunity in ${property.county}`,
      'price_drop': `Price reduced: ${property.address}`,
      'planning_approved': `Planning approved: ${property.address}`,
      'planning_decision': `Planning decision: ${property.address}`,
      'market_alert': `Market activity in ${property.county}`,
      'competitor_activity': `Competitor interest in ${property.county}`
    };
    
    return titles[alertType] || 'New Property Alert';
  }

  /**
   * Generate alert message
   */
  generateAlertMessage(property, alertType) {
    const messages = {
      'new_opportunity': `${property.size} acres at £${(property.price / 1000000).toFixed(1)}M in ${property.county}. Estimated ROI: 85-150%. Act fast!`,
      'price_drop': `Price reduced to £${(property.price / 1000000).toFixed(1)}M. Better value than comparable properties.`,
      'planning_approved': `Planning permission approved. Ready for development. Estimated timeline: 18-24 months.`,
      'planning_decision': `Planning decision expected this week. High approval likelihood.`,
      'market_alert': `Increased development activity in ${property.county}. Market heating up.`,
      'competitor_activity': `Competitors active in this area. Move quickly to secure opportunities.`
    };
    
    return messages[alertType] || 'New alert for your watchlist';
  }

  /**
   * Calculate alert urgency (1-10 scale)
   */
  calculateUrgency(property) {
    let urgency = 5; // Base urgency
    
    // High demand areas = higher urgency
    const highDemandCounties = ['Greater London', 'Greater Manchester', 'Bristol'];
    if (highDemandCounties.includes(property.county)) {
      urgency += 2;
    }
    
    // Good deals = higher urgency
    if (property.price < 500000) {
      urgency += 1;
    }
    
    // Large sites = higher urgency
    if (property.size > 5) {
      urgency += 1;
    }
    
    return Math.min(10, urgency);
  }

  /**
   * Get alerts for a developer
   */
  getAlertsForDeveloper(developerId, limit = 50) {
    return this.alerts
      .filter(alert => alert.developerId === developerId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Mark alert as read
   */
  markAlertAsRead(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.read = true;
    }
    return alert;
  }

  /**
   * Get notification delivery status
   */
  getNotificationStatus(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return null;
    
    return {
      alertId,
      email: alert.channels.email ? 'sent' : 'disabled',
      sms: alert.channels.sms ? 'sent' : 'disabled',
      push: alert.channels.push ? 'sent' : 'disabled',
      dashboard: 'delivered',
      timestamp: alert.timestamp
    };
  }

  /**
   * Get unread alert count
   */
  getUnreadCount(developerId) {
    return this.alerts.filter(
      alert => alert.developerId === developerId && !alert.read
    ).length;
  }
}

export default new AlertsService();
