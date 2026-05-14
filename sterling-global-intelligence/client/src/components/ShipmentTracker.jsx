import React, { useState } from 'react';
import { api } from '../lib/api';
import { MapPin, Calendar, Package, Loader } from 'lucide-react';

export default function ShipmentTracker() {
  const [formData, setFormData] = useState({
    shipmentId: 'SHIP001',
    containerNumber: 'CONT123456',
    origin: 'Shanghai',
    destination: 'Rotterdam'
  });
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const data = await api.trackShipment(formData);
      setTracking(data.shipment);
    } catch (err) {
      setError('Failed to track shipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Track Shipment</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="shipmentId"
            placeholder="Shipment ID"
            value={formData.shipmentId}
            onChange={handleChange}
            className="bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="containerNumber"
            placeholder="Container Number"
            value={formData.containerNumber}
            onChange={handleChange}
            className="bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="origin"
            placeholder="Origin"
            value={formData.origin}
            onChange={handleChange}
            className="bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
            className="bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-2 rounded transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
            {loading ? 'Tracking...' : 'Track Shipment'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Tracking Result */}
      {tracking && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Shipment Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-slate-400 text-sm">Status</p>
              <p className="text-white font-semibold text-lg">{tracking.status}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Current Location</p>
              <p className="text-white font-semibold text-lg flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {tracking.currentLocation}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Progress</p>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${tracking.progress}%` }}
                />
              </div>
              <p className="text-slate-300 text-xs mt-1">{tracking.progress}% complete</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Estimated Arrival</p>
              <p className="text-white font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(tracking.estimatedArrival).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Route */}
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-3">Route</h4>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {tracking.route?.map((stop, idx) => (
                <React.Fragment key={idx}>
                  <div className="bg-slate-700 rounded-lg px-3 py-2 whitespace-nowrap text-sm text-slate-200">
                    {stop.location}
                  </div>
                  {idx < tracking.route.length - 1 && (
                    <div className="text-slate-500">→</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h4 className="text-white font-semibold mb-3">Milestones</h4>
            <div className="space-y-2">
              {tracking.milestones?.map((milestone, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-lg text-sm ${
                    milestone.status === 'completed'
                      ? 'bg-green-900/20 border border-green-500/30 text-green-200'
                      : 'bg-slate-700/30 border border-slate-600 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{milestone.event}</span>
                    <span className="text-xs">{new Date(milestone.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs opacity-75">{milestone.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
