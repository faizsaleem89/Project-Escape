import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import shipmentTrackingService from './services/shipmentTrackingService.js';
import geopoliticalIntelligenceService from './services/geopoliticalIntelligenceService.js';
import portOperationsService from './services/portOperationsService.js';
import disruptionPredictionService from './services/disruptionPredictionService.js';
import riskScoringService from './services/riskScoringService.js';
import realTimeDataService from './services/realTimeDataService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../dist')));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Sterling Global Intelligence',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      health: '/api/health',
      tracking: '/api/track/shipment',
      geopolitical: '/api/geopolitical/risks',
      ports: '/api/ports/status',
      disruptions: '/api/predict/disruptions',
      riskScoring: '/api/risk/score',
      dashboard: '/api/dashboard/summary'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    system: 'Sterling Global Intelligence',
    version: '1.0.0'
  });
});

// Shipment tracking endpoints
app.post('/api/track/shipment', (req, res) => {
  try {
    const { shipmentId, containerNumber, origin, destination } = req.body;
    
    const tracking = shipmentTrackingService.trackShipment({
      shipmentId,
      containerNumber,
      origin,
      destination
    });
    
    res.json({
      status: 'success',
      shipment: tracking
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/track/:shipmentId', (req, res) => {
  try {
    const tracking = shipmentTrackingService.getShipmentStatus(req.params.shipmentId);
    
    if (!tracking) {
      return res.status(404).json({ status: 'error', message: 'Shipment not found' });
    }
    
    res.json({
      status: 'success',
      tracking
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Geopolitical intelligence endpoints
app.get('/api/geopolitical/risks', (req, res) => {
  try {
    const risks = geopoliticalIntelligenceService.getGlobalRisks();
    
    res.json({
      status: 'success',
      risks
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/geopolitical/region/:region', (req, res) => {
  try {
    const regionRisks = geopoliticalIntelligenceService.getRegionRisks(req.params.region);
    
    res.json({
      status: 'success',
      region: req.params.region,
      risks: regionRisks
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Port operations endpoints
app.get('/api/ports/status', (req, res) => {
  try {
    const portStatus = portOperationsService.getPortStatus();
    
    res.json({
      status: 'success',
      ports: portStatus
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/ports/:portCode', (req, res) => {
  try {
    const port = portOperationsService.getPortDetails(req.params.portCode);
    
    if (!port) {
      return res.status(404).json({ status: 'error', message: 'Port not found' });
    }
    
    res.json({
      status: 'success',
      port
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Disruption prediction endpoints
app.post('/api/predict/disruptions', (req, res) => {
  try {
    const { shipmentId, route, origin, destination } = req.body;
    
    const prediction = disruptionPredictionService.predictDisruptions({
      shipmentId,
      route,
      origin,
      destination
    });
    
    res.json({
      status: 'success',
      prediction
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Risk scoring endpoints
app.post('/api/risk/score', (req, res) => {
  try {
    const { shipmentId, origin, destination, value, commodityType } = req.body;
    
    const riskScore = riskScoringService.scoreShipment({
      shipmentId,
      origin,
      destination,
      value,
      commodityType
    });
    
    res.json({
      status: 'success',
      riskScore
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Real-time data endpoints (Phase 1)
app.get('/api/realtime/vessels', async (req, res) => {
  try {
    const vessels = await realTimeDataService.getVesselData();
    res.json({
      status: 'success',
      vessels,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/realtime/weather', async (req, res) => {
  try {
    const weather = await realTimeDataService.getWeatherData();
    res.json({
      status: 'success',
      weather,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/realtime/risks', async (req, res) => {
  try {
    const risks = await realTimeDataService.getGeopoliticalRisks();
    res.json({
      status: 'success',
      risks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/realtime/ports', async (req, res) => {
  try {
    const ports = await realTimeDataService.getPortData();
    res.json({
      status: 'success',
      ports,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/api/realtime/unified', async (req, res) => {
  try {
    const data = await realTimeDataService.getUnifiedRealTimeData();
    res.json({
      status: 'success',
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Dashboard summary endpoint
app.get('/api/dashboard/summary', (req, res) => {
  try {
    const summary = {
      activeShipments: shipmentTrackingService.getActiveShipmentCount(),
      globalRisks: geopoliticalIntelligenceService.getGlobalRisks(),
      portStatus: portOperationsService.getPortStatus(),
      avgRiskScore: riskScoringService.getAverageRiskScore(),
      predictedDisruptions: disruptionPredictionService.getPredictedDisruptionCount()
    };
    
    res.json({
      status: 'success',
      summary
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  Sterling Global Intelligence - Live System Ready          ║
║  Server running on port ${PORT}                               ║
║  Environment: ${process.env.NODE_ENV || 'development'}                            ║
║  Access: http://localhost:${PORT}                                  ║
╚════════════════════════════════════════════════════════════╝
  `);
});
