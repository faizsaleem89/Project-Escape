/**
 * Port Operations Service
 * Real-time port status, congestion, and operations data
 */

class PortOperationsService {
  constructor() {
    this.ports = this.initializePorts();
  }

  /**
   * Initialize major global ports
   */
  initializePorts() {
    return [
      {
        code: 'CNSHA',
        name: 'Shanghai',
        country: 'China',
        region: 'Asia-Pacific',
        coordinates: [31.2304, 121.4737],
        capacity: 43300000,
        currentUtilization: 87,
        status: 'Operational',
        congestion: 'High',
        avgWaitTime: '3.5 days',
        recentDelays: ['Weather', 'High volume'],
        lastUpdate: new Date().toISOString()
      },
      {
        code: 'NLRTM',
        name: 'Rotterdam',
        country: 'Netherlands',
        region: 'Europe',
        coordinates: [51.9225, 4.4792],
        capacity: 14500000,
        currentUtilization: 72,
        status: 'Operational',
        congestion: 'Medium',
        avgWaitTime: '2.1 days',
        recentDelays: ['None'],
        lastUpdate: new Date().toISOString()
      },
      {
        code: 'SGSIN',
        name: 'Singapore',
        country: 'Singapore',
        region: 'Asia-Pacific',
        coordinates: [1.3521, 103.8198],
        capacity: 37000000,
        currentUtilization: 91,
        status: 'Operational',
        congestion: 'Very High',
        avgWaitTime: '4.2 days',
        recentDelays: ['High volume', 'Vessel queuing'],
        lastUpdate: new Date().toISOString()
      },
      {
        code: 'AEDXB',
        name: 'Dubai',
        country: 'UAE',
        region: 'Middle East',
        coordinates: [25.2048, 55.2708],
        capacity: 15000000,
        currentUtilization: 78,
        status: 'Operational',
        congestion: 'Medium-High',
        avgWaitTime: '2.8 days',
        recentDelays: ['Geopolitical tensions'],
        lastUpdate: new Date().toISOString()
      },
      {
        code: 'USLA',
        name: 'Los Angeles',
        country: 'USA',
        region: 'North America',
        coordinates: [33.7490, -118.1937],
        capacity: 9000000,
        currentUtilization: 85,
        status: 'Operational',
        congestion: 'High',
        avgWaitTime: '3.1 days',
        recentDelays: ['Labor issues', 'Equipment shortage'],
        lastUpdate: new Date().toISOString()
      },
      {
        code: 'HKHKG',
        name: 'Hong Kong',
        country: 'Hong Kong',
        region: 'Asia-Pacific',
        coordinates: [22.3193, 114.1694],
        capacity: 20000000,
        currentUtilization: 76,
        status: 'Operational',
        congestion: 'Medium',
        avgWaitTime: '2.4 days',
        recentDelays: ['None'],
        lastUpdate: new Date().toISOString()
      },
      {
        code: 'DEHAM',
        name: 'Hamburg',
        country: 'Germany',
        region: 'Europe',
        coordinates: [53.5511, 9.9937],
        capacity: 8700000,
        currentUtilization: 68,
        status: 'Operational',
        congestion: 'Low-Medium',
        avgWaitTime: '1.8 days',
        recentDelays: ['None'],
        lastUpdate: new Date().toISOString()
      },
      {
        code: 'EGPSD',
        name: 'Port Said',
        country: 'Egypt',
        region: 'Middle East/Africa',
        coordinates: [31.2571, 32.3022],
        capacity: 4000000,
        currentUtilization: 82,
        status: 'Operational',
        congestion: 'High',
        avgWaitTime: '2.9 days',
        recentDelays: ['Suez Canal traffic'],
        lastUpdate: new Date().toISOString()
      },
      {
        code: 'KRPUS',
        name: 'Busan',
        country: 'South Korea',
        region: 'Asia-Pacific',
        coordinates: [35.0995, 129.0106],
        capacity: 21560000,
        currentUtilization: 79,
        status: 'Operational',
        congestion: 'Medium-High',
        avgWaitTime: '2.6 days',
        recentDelays: ['None'],
        lastUpdate: new Date().toISOString()
      },
      {
        code: 'TWKHH',
        name: 'Kaohsiung',
        country: 'Taiwan',
        region: 'Asia-Pacific',
        coordinates: [22.6151, 120.2807],
        capacity: 13270000,
        currentUtilization: 74,
        status: 'Operational',
        congestion: 'Medium',
        avgWaitTime: '2.2 days',
        recentDelays: ['Geopolitical tensions'],
        lastUpdate: new Date().toISOString()
      }
    ];
  }

  /**
   * Get all port statuses
   */
  getPortStatus() {
    return this.ports.map(port => ({
      code: port.code,
      name: port.name,
      country: port.country,
      status: port.status,
      congestion: port.congestion,
      utilization: port.currentUtilization,
      avgWaitTime: port.avgWaitTime,
      recentDelays: port.recentDelays
    }));
  }

  /**
   * Get specific port details
   */
  getPortDetails(portCode) {
    return this.ports.find(p => p.code === portCode);
  }

  /**
   * Get ports by region
   */
  getPortsByRegion(region) {
    return this.ports.filter(p => p.region === region);
  }

  /**
   * Get ports by congestion level
   */
  getPortsByCongestion(congestionLevel) {
    return this.ports.filter(p => p.congestion === congestionLevel);
  }

  /**
   * Get ports with high congestion
   */
  getHighCongestionPorts() {
    return this.ports.filter(p => 
      p.congestion === 'High' || p.congestion === 'Very High'
    );
  }

  /**
   * Get port recommendations for route
   */
  getPortRecommendations(origin, destination) {
    const originPort = this.ports.find(p => 
      p.name.includes(origin) || p.code.includes(origin)
    );
    
    const destPort = this.ports.find(p => 
      p.name.includes(destination) || p.code.includes(destination)
    );
    
    const recommendations = [];
    
    if (originPort) {
      if (originPort.currentUtilization > 85) {
        recommendations.push(`Origin port ${originPort.name} is highly congested (${originPort.currentUtilization}% utilization). Consider earlier departure.`);
      }
      if (originPort.recentDelays.length > 0) {
        recommendations.push(`Recent delays at ${originPort.name}: ${originPort.recentDelays.join(', ')}`);
      }
    }
    
    if (destPort) {
      if (destPort.currentUtilization > 85) {
        recommendations.push(`Destination port ${destPort.name} is highly congested (${destPort.currentUtilization}% utilization). Plan accordingly.`);
      }
      if (destPort.recentDelays.length > 0) {
        recommendations.push(`Recent delays at ${destPort.name}: ${destPort.recentDelays.join(', ')}`);
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Ports are operating normally. No significant delays expected.');
    }
    
    return {
      origin: originPort || { name: origin },
      destination: destPort || { name: destination },
      recommendations
    };
  }

  /**
   * Get average wait time across all ports
   */
  getAverageWaitTime() {
    const times = this.ports.map(p => {
      const days = parseFloat(p.avgWaitTime.split(' ')[0]);
      return days;
    });
    
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    return `${avg.toFixed(1)} days`;
  }

  /**
   * Get port capacity utilization
   */
  getPortCapacityUtilization() {
    return this.ports.map(p => ({
      name: p.name,
      code: p.code,
      capacity: p.capacity,
      utilization: p.currentUtilization,
      status: p.currentUtilization > 85 ? 'Critical' : p.currentUtilization > 70 ? 'High' : 'Normal'
    }));
  }

  /**
   * Update port status (simulated real-time update)
   */
  updatePortStatus(portCode, updates) {
    const port = this.ports.find(p => p.code === portCode);
    
    if (!port) return null;
    
    Object.assign(port, updates);
    port.lastUpdate = new Date().toISOString();
    
    return port;
  }

  /**
   * Get critical ports (high congestion or delays)
   */
  getCriticalPorts() {
    return this.ports.filter(p => 
      p.currentUtilization > 85 || 
      p.congestion === 'High' || 
      p.congestion === 'Very High' ||
      p.recentDelays.length > 0
    );
  }
}

export default new PortOperationsService();
