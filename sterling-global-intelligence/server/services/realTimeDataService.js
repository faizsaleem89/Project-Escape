/**
 * Real-Time Data Service
 * Integrates Phase 1 free APIs: MarineTraffic (AIS), OpenWeatherMap, ACLED, Port data
 */

import fetch from 'node-fetch';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'demo'; // Free tier key
const ACLED_API_BASE = 'https://api.acleddata.com/api/v1';

// Cache for reducing API calls
const cache = {
  vessels: { data: [], timestamp: 0, ttl: 300000 }, // 5 minutes
  weather: { data: {}, timestamp: 0, ttl: 600000 }, // 10 minutes
  risks: { data: [], timestamp: 0, ttl: 900000 }, // 15 minutes
  ports: { data: [], timestamp: 0, ttl: 1800000 } // 30 minutes
};

const isCacheValid = (key) => {
  const now = Date.now();
  return cache[key].timestamp + cache[key].ttl > now;
};

/**
 * Get real vessel data from AIS
 * Using mock data that simulates real AIS responses
 * In production, integrate with MarineTraffic or VesselFinder API
 */
export const getVesselData = async () => {
  if (isCacheValid('vessels')) {
    return cache.vessels.data;
  }

  try {
    // Mock AIS data - in production, call MarineTraffic API
    // MarineTraffic free tier: https://www.marinetraffic.com/en/ais-api-services
    const vessels = [
      {
        mmsi: '235092217',
        name: 'EVERGREEN EVER',
        imo: '9811000',
        callsign: 'PANP',
        type: 'Container Ship',
        length: 400,
        width: 59,
        draft: 15.5,
        status: 'Under way using engine',
        speed: 18.5,
        course: 245,
        heading: 246,
        latitude: 22.3193,
        longitude: 114.1694,
        destination: 'NLRTM',
        eta: '2026-05-18',
        lastUpdate: new Date().toISOString()
      },
      {
        mmsi: '215769000',
        name: 'MAERSK SEALAND',
        imo: '9432941',
        callsign: 'OXUT',
        type: 'Container Ship',
        length: 399,
        width: 59,
        draft: 15.2,
        status: 'Under way using engine',
        speed: 19.2,
        course: 180,
        heading: 181,
        latitude: 25.2854,
        longitude: 55.3639,
        destination: 'SGSIN',
        eta: '2026-05-15',
        lastUpdate: new Date().toISOString()
      },
      {
        mmsi: '351759000',
        name: 'CMA CGM ANTOINE',
        imo: '9332823',
        callsign: 'FMJL',
        type: 'Container Ship',
        length: 398,
        width: 54,
        draft: 14.8,
        status: 'Under way using engine',
        speed: 17.8,
        course: 90,
        heading: 91,
        latitude: 1.3521,
        longitude: 103.8198,
        destination: 'USLA',
        eta: '2026-05-25',
        lastUpdate: new Date().toISOString()
      }
    ];

    cache.vessels.data = vessels;
    cache.vessels.timestamp = Date.now();
    return vessels;
  } catch (error) {
    console.error('Error fetching vessel data:', error);
    return cache.vessels.data;
  }
};

/**
 * Get weather data for major ports
 */
export const getWeatherData = async (ports = []) => {
  const portCoords = {
    CNSHA: { lat: 30.9, lon: 121.6, name: 'Shanghai' },
    NLRTM: { lat: 51.9, lon: 4.3, name: 'Rotterdam' },
    SGSIN: { lat: 1.3, lon: 103.8, name: 'Singapore' },
    AEDXB: { lat: 25.2, lon: 55.3, name: 'Dubai' },
    USLA: { lat: 33.7, lon: -118.3, name: 'Los Angeles' }
  };

  try {
    const weatherData = {};

    for (const [code, coords] of Object.entries(portCoords)) {
      // Mock weather data - in production, call OpenWeatherMap API
      // Free tier: https://openweathermap.org/api
      weatherData[code] = {
        port: coords.name,
        code: code,
        temperature: Math.floor(Math.random() * 15 + 15),
        humidity: Math.floor(Math.random() * 30 + 60),
        windSpeed: Math.floor(Math.random() * 15 + 5),
        windDirection: Math.floor(Math.random() * 360),
        condition: ['Clear', 'Partly Cloudy', 'Overcast', 'Light Rain'][Math.floor(Math.random() * 4)],
        visibility: Math.floor(Math.random() * 5 + 8),
        seaState: ['Calm', 'Slight', 'Moderate', 'Rough'][Math.floor(Math.random() * 4)],
        lastUpdate: new Date().toISOString()
      };
    }

    cache.weather.data = weatherData;
    cache.weather.timestamp = Date.now();
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return cache.weather.data;
  }
};

/**
 * Get geopolitical risks from ACLED
 */
export const getGeopoliticalRisks = async () => {
  if (isCacheValid('risks')) {
    return cache.risks.data;
  }

  try {
    // Mock geopolitical risk data - in production, call ACLED API
    // ACLED free tier: https://acleddata.com/
    const risks = [
      {
        region: 'Middle East',
        countries: ['Iran', 'Iraq', 'Syria', 'Yemen'],
        riskScore: 8.5,
        riskLevel: 'High',
        impact: 'Shipping disruptions, insurance premiums increase',
        affectedRoutes: ['Strait of Hormuz', 'Red Sea'],
        lastUpdate: new Date(Date.now() - 3600000).toISOString(),
        events: [
          { date: '2026-05-08', type: 'Tension', description: 'Regional tensions escalate' },
          { date: '2026-05-07', type: 'Incident', description: 'Vessel detained' }
        ]
      },
      {
        region: 'Eastern Europe',
        countries: ['Ukraine', 'Russia', 'Poland'],
        riskScore: 7.2,
        riskLevel: 'High',
        impact: 'Supply chain disruptions, sanctions enforcement',
        affectedRoutes: ['Baltic Sea', 'Black Sea'],
        lastUpdate: new Date(Date.now() - 7200000).toISOString(),
        events: [
          { date: '2026-05-06', type: 'Sanction', description: 'New trade restrictions' }
        ]
      },
      {
        region: 'South China Sea',
        countries: ['China', 'Vietnam', 'Philippines', 'Taiwan'],
        riskScore: 6.8,
        riskLevel: 'Medium-High',
        impact: 'Geopolitical tensions, potential shipping delays',
        affectedRoutes: ['Strait of Malacca', 'Taiwan Strait'],
        lastUpdate: new Date(Date.now() - 10800000).toISOString(),
        events: [
          { date: '2026-05-05', type: 'Dispute', description: 'Territorial claims dispute' }
        ]
      },
      {
        region: 'North Africa',
        countries: ['Egypt', 'Libya', 'Tunisia'],
        riskScore: 5.5,
        riskLevel: 'Medium',
        impact: 'Port security concerns, piracy risk',
        affectedRoutes: ['Suez Canal', 'Mediterranean'],
        lastUpdate: new Date(Date.now() - 14400000).toISOString(),
        events: []
      },
      {
        region: 'Southeast Asia',
        countries: ['Thailand', 'Myanmar', 'Malaysia'],
        riskScore: 4.2,
        riskLevel: 'Low-Medium',
        impact: 'Minor disruptions possible',
        affectedRoutes: ['Strait of Malacca'],
        lastUpdate: new Date(Date.now() - 18000000).toISOString(),
        events: []
      }
    ];

    cache.risks.data = risks;
    cache.risks.timestamp = Date.now();
    return risks;
  } catch (error) {
    console.error('Error fetching geopolitical risks:', error);
    return cache.risks.data;
  }
};

/**
 * Get real port data
 */
export const getPortData = async () => {
  if (isCacheValid('ports')) {
    return cache.ports.data;
  }

  try {
    // Mock port data - in production, integrate with port authority APIs
    const ports = [
      {
        code: 'CNSHA',
        name: 'Shanghai',
        country: 'China',
        region: 'East Asia',
        status: 'Operational',
        utilization: 87,
        congestion: 'High',
        avgWaitTime: '3.5 days',
        vessels: 42,
        containers: 15420,
        lastUpdate: new Date().toISOString()
      },
      {
        code: 'NLRTM',
        name: 'Rotterdam',
        country: 'Netherlands',
        region: 'Europe',
        status: 'Operational',
        utilization: 72,
        congestion: 'Medium',
        avgWaitTime: '2.1 days',
        vessels: 28,
        containers: 9850,
        lastUpdate: new Date().toISOString()
      },
      {
        code: 'SGSIN',
        name: 'Singapore',
        country: 'Singapore',
        region: 'Southeast Asia',
        status: 'Operational',
        utilization: 91,
        congestion: 'Very High',
        avgWaitTime: '4.2 days',
        vessels: 51,
        containers: 18900,
        lastUpdate: new Date().toISOString()
      },
      {
        code: 'AEDXB',
        name: 'Dubai',
        country: 'UAE',
        region: 'Middle East',
        status: 'Operational',
        utilization: 78,
        congestion: 'Medium-High',
        avgWaitTime: '2.8 days',
        vessels: 35,
        containers: 12100,
        lastUpdate: new Date().toISOString()
      },
      {
        code: 'USLA',
        name: 'Los Angeles',
        country: 'USA',
        region: 'North America',
        status: 'Operational',
        utilization: 85,
        congestion: 'High',
        avgWaitTime: '3.1 days',
        vessels: 39,
        containers: 14200,
        lastUpdate: new Date().toISOString()
      }
    ];

    cache.ports.data = ports;
    cache.ports.timestamp = Date.now();
    return ports;
  } catch (error) {
    console.error('Error fetching port data:', error);
    return cache.ports.data;
  }
};

/**
 * Combine all real-time data into a unified dashboard view
 */
export const getUnifiedRealTimeData = async () => {
  const [vessels, weather, risks, ports] = await Promise.all([
    getVesselData(),
    getWeatherData(),
    getGeopoliticalRisks(),
    getPortData()
  ]);

  return {
    vessels,
    weather,
    risks,
    ports,
    timestamp: new Date().toISOString(),
    cacheStatus: {
      vessels: isCacheValid('vessels'),
      weather: isCacheValid('weather'),
      risks: isCacheValid('risks'),
      ports: isCacheValid('ports')
    }
  };
};

export default {
  getVesselData,
  getWeatherData,
  getGeopoliticalRisks,
  getPortData,
  getUnifiedRealTimeData
};
