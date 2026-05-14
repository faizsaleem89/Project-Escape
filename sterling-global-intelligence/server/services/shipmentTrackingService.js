/**
 * Shipment Tracking Service
 * Real-time tracking of containers and shipments globally
 */

class ShipmentTrackingService {
  constructor() {
    this.activeShipments = new Map();
    this.trackingHistory = new Map();
  }

  /**
   * Track a shipment in real-time
   */
  trackShipment(shipmentData) {
    const shipmentId = shipmentData.shipmentId || `SHIP_${Date.now()}`;
    
    const shipment = {
      id: shipmentId,
      containerNumber: shipmentData.containerNumber,
      origin: shipmentData.origin,
      destination: shipmentData.destination,
      status: 'In Transit',
      currentLocation: shipmentData.origin,
      currentCoordinates: this.getCoordinates(shipmentData.origin),
      departureDate: new Date().toISOString(),
      estimatedArrival: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 5,
      route: this.generateRoute(shipmentData.origin, shipmentData.destination),
      milestones: [
        {
          location: shipmentData.origin,
          event: 'Picked up',
          timestamp: new Date().toISOString(),
          status: 'completed'
        },
        {
          location: 'Port of Loading',
          event: 'Arrived at port',
          timestamp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        },
        {
          location: 'At Sea',
          event: 'In transit',
          timestamp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        },
        {
          location: 'Port of Discharge',
          event: 'Arrived at destination port',
          timestamp: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        },
        {
          location: shipmentData.destination,
          event: 'Delivered',
          timestamp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        }
      ],
      visibility: 'Complete',
      lastUpdate: new Date().toISOString()
    };
    
    this.activeShipments.set(shipmentId, shipment);
    this.trackingHistory.set(shipmentId, [shipment]);
    
    return shipment;
  }

  /**
   * Get shipment status
   */
  getShipmentStatus(shipmentId) {
    return this.activeShipments.get(shipmentId);
  }

  /**
   * Update shipment location
   */
  updateShipmentLocation(shipmentId, newLocation, coordinates) {
    const shipment = this.activeShipments.get(shipmentId);
    
    if (!shipment) return null;
    
    shipment.currentLocation = newLocation;
    shipment.currentCoordinates = coordinates;
    shipment.lastUpdate = new Date().toISOString();
    shipment.progress = Math.min(95, shipment.progress + 10);
    
    // Add to history
    const history = this.trackingHistory.get(shipmentId) || [];
    history.push({ ...shipment });
    this.trackingHistory.set(shipmentId, history);
    
    return shipment;
  }

  /**
   * Get route between two locations
   */
  generateRoute(origin, destination) {
    const routes = {
      'Shanghai-Rotterdam': [
        { location: 'Shanghai', coordinates: [31.2304, 121.4737] },
        { location: 'Singapore', coordinates: [1.3521, 103.8198] },
        { location: 'Suez Canal', coordinates: [29.9575, 32.5898] },
        { location: 'Port Said', coordinates: [31.2571, 32.3022] },
        { location: 'Rotterdam', coordinates: [51.9225, 4.4792] }
      ],
      'Los Angeles-Shanghai': [
        { location: 'Los Angeles', coordinates: [33.7490, -118.1937] },
        { location: 'Pacific Ocean', coordinates: [20.0, -140.0] },
        { location: 'Shanghai', coordinates: [31.2304, 121.4737] }
      ],
      'Singapore-Dubai': [
        { location: 'Singapore', coordinates: [1.3521, 103.8198] },
        { location: 'Strait of Malacca', coordinates: [3.5, 101.0] },
        { location: 'Arabian Sea', coordinates: [15.0, 60.0] },
        { location: 'Dubai', coordinates: [25.2048, 55.2708] }
      ]
    };
    
    const routeKey = `${origin}-${destination}`;
    return routes[routeKey] || this.generateDefaultRoute(origin, destination);
  }

  /**
   * Generate default route
   */
  generateDefaultRoute(origin, destination) {
    return [
      { location: origin, coordinates: this.getCoordinates(origin) },
      { location: 'En Route', coordinates: [20, 50] },
      { location: destination, coordinates: this.getCoordinates(destination) }
    ];
  }

  /**
   * Get coordinates for major ports
   */
  getCoordinates(location) {
    const coordinates = {
      'Shanghai': [31.2304, 121.4737],
      'Rotterdam': [51.9225, 4.4792],
      'Singapore': [1.3521, 103.8198],
      'Dubai': [25.2048, 55.2708],
      'Los Angeles': [33.7490, -118.1937],
      'Hong Kong': [22.3193, 114.1694],
      'Hamburg': [53.5511, 9.9937],
      'Port Said': [31.2571, 32.3022],
      'Busan': [35.0995, 129.0106],
      'Kaohsiung': [22.6151, 120.2807]
    };
    
    return coordinates[location] || [Math.random() * 180 - 90, Math.random() * 360 - 180];
  }

  /**
   * Get all active shipments
   */
  getActiveShipments() {
    return Array.from(this.activeShipments.values());
  }

  /**
   * Get active shipment count
   */
  getActiveShipmentCount() {
    return this.activeShipments.size;
  }

  /**
   * Get shipment history
   */
  getShipmentHistory(shipmentId) {
    return this.trackingHistory.get(shipmentId) || [];
  }

  /**
   * Get shipments by status
   */
  getShipmentsByStatus(status) {
    return Array.from(this.activeShipments.values()).filter(s => s.status === status);
  }

  /**
   * Get shipments by region
   */
  getShipmentsByRegion(region) {
    return Array.from(this.activeShipments.values()).filter(s => 
      s.origin.includes(region) || s.destination.includes(region)
    );
  }
}

export default new ShipmentTrackingService();
