import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { MapPin, Loader } from 'lucide-react';

export default function GlobalMap() {
  const [shipments, setShipments] = useState([]);
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [shipmentRes, portsRes] = await Promise.all([
          api.trackShipment({ shipmentId: 'SHIP001', containerNumber: 'CONT123456', origin: 'Shanghai', destination: 'Rotterdam' }),
          api.getPortStatus()
        ]);
        setShipments([shipmentRes.shipment]);
        setPorts(portsRes.ports || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-slate-800/50 border border-slate-700 rounded-lg">
        <Loader className="w-6 h-6 animate-spin text-blue-400" />
      </div>
    );
  }

  // Port coordinates for visualization
  const portCoords = {
    'Shanghai': [31.2304, 121.4737],
    'Rotterdam': [51.9225, 4.4792],
    'Singapore': [1.3521, 103.8198],
    'Dubai': [25.2048, 55.2708],
    'Los Angeles': [33.7425, -118.2673],
    'Hong Kong': [22.3193, 114.1694],
    'Hamburg': [53.5511, 9.9769],
    'Port Said': [31.2571, 32.3022],
    'Busan': [35.0395, 129.0626],
    'Kaohsiung': [22.6151, 120.2807]
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5" /> Global Supply Chain Map
      </h2>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        {/* SVG Map */}
        <div className="mb-6 bg-slate-900/50 rounded-lg p-4 overflow-x-auto">
          <svg viewBox="0 0 1000 600" className="w-full h-auto min-h-96 bg-gradient-to-b from-slate-800 to-slate-900 rounded">
            {/* World background */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="1000" height="600" fill="url(#grid)" />

            {/* Port markers */}
            {ports.map((port, idx) => {
              const coords = portCoords[port.name];
              if (!coords) return null;
              const [lat, lng] = coords;
              const x = ((lng + 180) / 360) * 1000;
              const y = ((90 - lat) / 180) * 600;

              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="8" fill="#3b82f6" opacity="0.7" />
                  <circle cx={x} cy={y} r="12" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.4" />
                  <text x={x + 15} y={y} fill="#e2e8f0" fontSize="10" fontWeight="bold">
                    {port.code}
                  </text>
                </g>
              );
            })}

            {/* Shipment route */}
            {shipments.map((shipment, idx) => {
              const route = shipment.route || [];
              return (
                <g key={idx}>
                  {/* Route line */}
                  {route.length > 1 && (
                    <polyline
                      points={route.map(stop => {
                        const coords = portCoords[stop.location];
                        if (!coords) return null;
                        const [lat, lng] = coords;
                        const x = ((lng + 180) / 360) * 1000;
                        const y = ((90 - lat) / 180) * 600;
                        return `${x},${y}`;
                      }).filter(Boolean).join(' ')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      opacity="0.6"
                      strokeDasharray="5,5"
                    />
                  )}

                  {/* Current location */}
                  {shipment.currentCoordinates && (
                    <g>
                      <circle cx={((shipment.currentCoordinates[1] + 180) / 360) * 1000} cy={((90 - shipment.currentCoordinates[0]) / 180) * 600} r="10" fill="#f59e0b" />
                      <circle cx={((shipment.currentCoordinates[1] + 180) / 360) * 1000} cy={((90 - shipment.currentCoordinates[0]) / 180) * 600} r="16" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.3" />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <span className="text-slate-300">Ports</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500" />
            <span className="text-slate-300">Current Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-green-500" style={{ borderTop: '2px dashed #10b981' }} />
            <span className="text-slate-300">Route</span>
          </div>
        </div>

        {/* Shipment Details */}
        {shipments.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Active Shipments</h3>
            <div className="space-y-3">
              {shipments.map((shipment, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedShipment(selectedShipment?.id === shipment.id ? null : shipment)}
                  className="bg-slate-700/30 border border-slate-600 rounded p-4 cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-white">{shipment.id}</p>
                      <p className="text-sm text-slate-400">{shipment.origin} → {shipment.destination}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-900/30 border border-green-500/30 text-green-200 text-xs rounded">
                      {shipment.status}
                    </span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${shipment.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{shipment.progress}% complete • ETA: {new Date(shipment.estimatedArrival).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
