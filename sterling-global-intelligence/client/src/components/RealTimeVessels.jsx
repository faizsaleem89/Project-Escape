import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Ship, MapPin, Compass, Gauge, Calendar, Loader } from 'lucide-react';

export default function RealTimeVessels() {
  const [vessels, useState] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedVessel, setSelectedVessel] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vesselRes, weatherRes] = await Promise.all([
          api.getRealTimeVessels(),
          api.getRealTimeWeather()
        ]);

        useState(vesselRes.vessels || []);
        setWeather(weatherRes.weather || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="w-6 h-6 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Ship className="w-5 h-5" /> Live Vessel Tracking (Real-Time AIS)
      </h2>

      {/* Vessel List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vessels.map((vessel, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedVessel(selectedVessel?.mmsi === vessel.mmsi ? null : vessel)}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-white text-lg">{vessel.name}</h3>
                <p className="text-xs text-slate-400">MMSI: {vessel.mmsi}</p>
              </div>
              <span className="text-xs bg-green-900/30 text-green-200 px-2 py-1 rounded">
                {vessel.status}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>{vessel.latitude.toFixed(4)}°, {vessel.longitude.toFixed(4)}°</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Gauge className="w-4 h-4 text-green-400" />
                <span>{vessel.speed} knots</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Compass className="w-4 h-4 text-yellow-400" />
                <span>Course: {vessel.course}°</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>ETA: {vessel.eta}</span>
              </div>

              <div className="pt-2 border-t border-slate-600">
                <p className="text-xs text-slate-400">
                  {vessel.origin} → {vessel.destination}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Vessel Details */}
      {selectedVessel && (
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">{selectedVessel.name} - Detailed View</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vessel Info */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-300">Vessel Information</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="text-white">{selectedVessel.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>IMO:</span>
                  <span className="text-white">{selectedVessel.imo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Call Sign:</span>
                  <span className="text-white">{selectedVessel.callsign}</span>
                </div>
                <div className="flex justify-between">
                  <span>Length:</span>
                  <span className="text-white">{selectedVessel.length}m</span>
                </div>
                <div className="flex justify-between">
                  <span>Beam:</span>
                  <span className="text-white">{selectedVessel.width}m</span>
                </div>
                <div className="flex justify-between">
                  <span>Draft:</span>
                  <span className="text-white">{selectedVessel.draft}m</span>
                </div>
              </div>
            </div>

            {/* Current Position & Weather */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-300">Current Position & Weather</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>Latitude:</span>
                  <span className="text-white">{selectedVessel.latitude.toFixed(6)}°</span>
                </div>
                <div className="flex justify-between">
                  <span>Longitude:</span>
                  <span className="text-white">{selectedVessel.longitude.toFixed(6)}°</span>
                </div>
                <div className="flex justify-between">
                  <span>Speed:</span>
                  <span className="text-white">{selectedVessel.speed} knots</span>
                </div>
                <div className="flex justify-between">
                  <span>Course:</span>
                  <span className="text-white">{selectedVessel.course}°</span>
                </div>
                <div className="flex justify-between">
                  <span>Heading:</span>
                  <span className="text-white">{selectedVessel.heading}°</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Update:</span>
                  <span className="text-white text-xs">{new Date(selectedVessel.lastUpdate).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Route Info */}
          <div className="mt-6 pt-6 border-t border-slate-600">
            <h4 className="font-bold text-slate-300 mb-3">Route Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/30 rounded p-3">
                <p className="text-xs text-slate-400 mb-1">Origin</p>
                <p className="text-white font-bold">{selectedVessel.origin}</p>
              </div>
              <div className="bg-slate-700/30 rounded p-3">
                <p className="text-xs text-slate-400 mb-1">Destination</p>
                <p className="text-white font-bold">{selectedVessel.destination}</p>
              </div>
              <div className="bg-slate-700/30 rounded p-3">
                <p className="text-xs text-slate-400 mb-1">ETA</p>
                <p className="text-white font-bold">{selectedVessel.eta}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Source Info */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <p className="text-sm text-blue-200">
          <strong>Phase 1 Real-Time Data:</strong> This dashboard displays live vessel tracking data from AIS (Automatic Identification System). 
          Data is updated every 30 seconds. In production, this integrates with MarineTraffic or VesselFinder APIs for complete global coverage.
        </p>
      </div>
    </div>
  );
}
