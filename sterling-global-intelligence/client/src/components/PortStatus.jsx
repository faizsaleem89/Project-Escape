import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Anchor, Loader } from 'lucide-react';

export default function PortStatus() {
  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPorts = async () => {
      try {
        setLoading(true);
        const data = await api.getPortStatus();
        setPorts(data.ports || []);
        setError(null);
      } catch (err) {
        setError('Failed to load port data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPorts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="w-6 h-6 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
        {error}
      </div>
    );
  }

  const getCongestionColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'very high':
        return 'bg-red-900/20 border-red-500/30 text-red-200';
      case 'high':
        return 'bg-orange-900/20 border-orange-500/30 text-orange-200';
      case 'medium-high':
        return 'bg-yellow-900/20 border-yellow-500/30 text-yellow-200';
      case 'medium':
        return 'bg-blue-900/20 border-blue-500/30 text-blue-200';
      default:
        return 'bg-green-900/20 border-green-500/30 text-green-200';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Port Operations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ports.map((port, idx) => (
          <div 
            key={idx}
            className={`border rounded-lg p-4 ${getCongestionColor(port.congestion)}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <Anchor className="w-5 h-5 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold">{port.name}</h3>
                <p className="text-xs opacity-75">{port.code} • {port.country}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold">{port.status}</p>
                <p className="text-xs opacity-75">{port.congestion}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs opacity-75">Utilization</p>
                  <p className="text-xs font-semibold">{port.utilization}%</p>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      port.utilization > 80 ? 'bg-red-500' :
                      port.utilization > 60 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${port.utilization}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="opacity-75">Avg Wait Time</p>
                  <p className="font-semibold">{port.avgWaitTime}</p>
                </div>
                <div>
                  <p className="opacity-75">Status</p>
                  <p className="font-semibold">{port.status}</p>
                </div>
              </div>

              {port.recentDelays && port.recentDelays.length > 0 && (
                <div>
                  <p className="text-xs opacity-75 mb-1">Recent Issues:</p>
                  <div className="flex flex-wrap gap-1">
                    {port.recentDelays.map((delay, i) => (
                      <span key={i} className="text-xs bg-black/30 px-2 py-1 rounded">
                        {delay}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
