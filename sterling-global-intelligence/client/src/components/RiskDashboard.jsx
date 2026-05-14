import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { AlertTriangle, Loader } from 'lucide-react';

export default function RiskDashboard() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRisks = async () => {
      try {
        setLoading(true);
        const data = await api.getGlobalRisks();
        setRisks(data.risks || []);
        setError(null);
      } catch (err) {
        setError('Failed to load risk data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRisks();
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

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical':
        return 'bg-red-900/20 border-red-500/30 text-red-200';
      case 'high':
        return 'bg-orange-900/20 border-orange-500/30 text-orange-200';
      case 'medium':
        return 'bg-yellow-900/20 border-yellow-500/30 text-yellow-200';
      case 'low':
        return 'bg-green-900/20 border-green-500/30 text-green-200';
      default:
        return 'bg-slate-700/30 border-slate-600 text-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Global Geopolitical Risks</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {risks.map((risk, idx) => (
          <div 
            key={idx}
            className={`border rounded-lg p-4 ${getRiskColor(risk.riskLevel)}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{risk.region}</h3>
                <p className="text-sm opacity-75">{risk.riskLevel} Risk • Score: {risk.riskScore}/10</p>
              </div>
            </div>

            <p className="text-sm mb-3">{risk.impact}</p>

            {risk.affectedCountries && risk.affectedCountries.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold opacity-75 mb-1">Affected Countries:</p>
                <div className="flex flex-wrap gap-1">
                  {risk.affectedCountries.map((country, i) => (
                    <span key={i} className="text-xs bg-black/20 px-2 py-1 rounded">
                      {country}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {risk.routes && risk.routes.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold opacity-75 mb-1">Affected Routes:</p>
                <div className="flex flex-wrap gap-1">
                  {risk.routes.map((route, i) => (
                    <span key={i} className="text-xs bg-black/20 px-2 py-1 rounded">
                      {route}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {risk.recommendations && risk.recommendations.length > 0 && (
              <div>
                <p className="text-xs font-semibold opacity-75 mb-1">Recommendations:</p>
                <ul className="text-xs space-y-1">
                  {risk.recommendations.slice(0, 3).map((rec, i) => (
                    <li key={i} className="flex gap-2">
                      <span>•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs opacity-50 mt-3">
              Trend: {risk.trend} • Last updated: {new Date(risk.lastUpdate).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
