const API_BASE = '/api';

export const api = {
  // Health check
  health: async () => {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Shipment tracking
  trackShipment: async (data) => {
    const res = await fetch(`${API_BASE}/track/shipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getShipmentStatus: async (shipmentId) => {
    const res = await fetch(`${API_BASE}/track/${shipmentId}`);
    return res.json();
  },

  // Geopolitical risks
  getGlobalRisks: async () => {
    const res = await fetch(`${API_BASE}/geopolitical/risks`);
    return res.json();
  },

  getRegionRisks: async (region) => {
    const res = await fetch(`${API_BASE}/geopolitical/region/${region}`);
    return res.json();
  },

  // Port operations
  getPortStatus: async () => {
    const res = await fetch(`${API_BASE}/ports/status`);
    return res.json();
  },

  getPortDetails: async (portCode) => {
    const res = await fetch(`${API_BASE}/ports/${portCode}`);
    return res.json();
  },

  // Disruption prediction
  predictDisruptions: async (data) => {
    const res = await fetch(`${API_BASE}/predict/disruptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Risk scoring
  scoreShipment: async (data) => {
    const res = await fetch(`${API_BASE}/risk/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Dashboard summary
  getDashboardSummary: async () => {
    const res = await fetch(`${API_BASE}/dashboard/summary`);
    return res.json();
  },

  // Phase 1: Real-time data endpoints
  getRealTimeVessels: async () => {
    const res = await fetch(`${API_BASE}/realtime/vessels`);
    return res.json();
  },

  getRealTimeWeather: async () => {
    const res = await fetch(`${API_BASE}/realtime/weather`);
    return res.json();
  },

  getRealTimeRisks: async () => {
    const res = await fetch(`${API_BASE}/realtime/risks`);
    return res.json();
  },

  getRealTimePorts: async () => {
    const res = await fetch(`${API_BASE}/realtime/ports`);
    return res.json();
  },

  getRealTimeUnified: async () => {
    const res = await fetch(`${API_BASE}/realtime/unified`);
    return res.json();
  }
};
