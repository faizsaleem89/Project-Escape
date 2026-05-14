import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { AlertTriangle, Bell, CheckCircle, Clock, Loader, X } from 'lucide-react';

export default function AlertsNotifications() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const [risks, disruptions] = await Promise.all([
          api.getGlobalRisks(),
          api.predictDisruptions({ shipmentId: 'SHIP001', route: 'Shanghai-Rotterdam', origin: 'Shanghai', destination: 'Rotterdam' })
        ]);

        const alertList = [];

        // Add risk alerts
        (risks.risks || []).forEach(risk => {
          if (risk.riskScore > 6) {
            alertList.push({
              id: `risk-${risk.region}`,
              type: 'risk',
              severity: risk.riskLevel,
              title: `High Risk: ${risk.region}`,
              message: `Risk score: ${risk.riskScore}/10. ${risk.impact}`,
              timestamp: new Date(risk.lastUpdate),
              action: 'View Details'
            });
          }
        });

        // Add disruption alerts
        (disruptions.prediction?.predictedDisruptions || []).forEach((disruption, idx) => {
          if (disruption.probability > 0.5) {
            alertList.push({
              id: `disruption-${idx}`,
              type: 'disruption',
              severity: disruption.severity,
              title: `Potential Disruption: ${disruption.type}`,
              message: `Probability: ${(disruption.probability * 100).toFixed(0)}%. ${disruption.description}`,
              timestamp: new Date(),
              action: 'Mitigate'
            });
          }
        });

        setAlerts(alertList.sort((a, b) => b.timestamp - a.timestamp));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const dismissAlert = (id) => {
    setDismissedAlerts(prev => new Set([...prev, id]));
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
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

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (dismissedAlerts.has(alert.id)) return false;
    if (filterType === 'all') return true;
    return alert.type === filterType;
  });

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
        <Bell className="w-5 h-5" /> Alerts & Notifications
      </h2>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-700">
        {['all', 'risk', 'disruption'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              filterType === type
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
            {type === 'all' && ` (${filteredAlerts.length})`}
            {type === 'risk' && ` (${alerts.filter(a => a.type === 'risk' && !dismissedAlerts.has(a.id)).length})`}
            {type === 'disruption' && ` (${alerts.filter(a => a.type === 'disruption' && !dismissedAlerts.has(a.id)).length})`}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <div 
              key={alert.id}
              className={`border rounded-lg p-4 flex gap-4 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex-shrink-0 mt-1">
                {getSeverityIcon(alert.severity)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-1">{alert.title}</h3>
                <p className="text-sm opacity-75 mb-2">{alert.message}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs opacity-75">
                    <Clock className="w-3 h-3" />
                    {alert.timestamp.toLocaleTimeString()}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs px-3 py-1 bg-black/20 hover:bg-black/30 rounded transition-colors">
                      {alert.action}
                    </button>
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="text-xs px-3 py-1 bg-black/20 hover:bg-black/30 rounded transition-colors flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-slate-400">No alerts at this time</p>
          </div>
        )}
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Total Alerts</p>
          <p className="text-3xl font-bold text-blue-300">{alerts.length}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Critical</p>
          <p className="text-3xl font-bold text-red-300">
            {alerts.filter(a => a.severity?.toLowerCase() === 'critical').length}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Dismissed</p>
          <p className="text-3xl font-bold text-slate-300">{dismissedAlerts.size}</p>
        </div>
      </div>
    </div>
  );
}
