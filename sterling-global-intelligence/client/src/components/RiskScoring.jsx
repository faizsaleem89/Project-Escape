import React, { useState } from 'react';
import { api } from '../lib/api';
import { TrendingUp, Loader, Shield } from 'lucide-react';

export default function RiskScoring() {
  const [formData, setFormData] = useState({
    shipmentId: 'SHIP001',
    origin: 'Shanghai',
    destination: 'Rotterdam',
    value: '500000',
    commodityType: 'Electronics'
  });
  const [riskScore, setRiskScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const data = await api.scoreShipment({
        ...formData,
        value: parseInt(formData.value)
      });
      setRiskScore(data.riskScore);
    } catch (err) {
      setError('Failed to score shipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getRiskTierColor = (tier) => {
    switch (tier?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-900/20 border-red-500/30 text-red-200';
      case 'HIGH':
        return 'bg-orange-900/20 border-orange-500/30 text-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-900/20 border-yellow-500/30 text-yellow-200';
      case 'LOW':
        return 'bg-green-900/20 border-green-500/30 text-green-200';
      default:
        return 'bg-slate-700/30 border-slate-600 text-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" /> Risk Scoring
        </h2>
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
          <input
            type="number"
            name="value"
            placeholder="Shipment Value (USD)"
            value={formData.value}
            onChange={handleChange}
            className="bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <select
            name="commodityType"
            value={formData.commodityType}
            onChange={handleChange}
            className="bg-slate-700/50 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500 md:col-span-2"
          >
            <option>Electronics</option>
            <option>Chemicals</option>
            <option>Pharmaceuticals</option>
            <option>Food & Beverage</option>
            <option>Machinery</option>
            <option>Textiles</option>
            <option>Metals</option>
            <option>Other</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-2 rounded transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
            {loading ? 'Scoring...' : 'Score Shipment'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Risk Score Result */}
      {riskScore && (
        <div className={`border rounded-lg p-6 ${getRiskTierColor(riskScore.riskTier)}`}>
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Risk Assessment</h3>
            <p className="text-sm opacity-75 mb-4">{riskScore.shipmentId} • {riskScore.origin} → {riskScore.destination}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-black/20 rounded p-4">
                <p className="text-xs opacity-75 mb-1">Overall Risk Score</p>
                <p className="text-3xl font-bold">{riskScore.overallRiskScore}/10</p>
              </div>
              <div className="bg-black/20 rounded p-4">
                <p className="text-xs opacity-75 mb-1">Risk Tier</p>
                <p className="text-2xl font-bold">{riskScore.riskTier}</p>
              </div>
              <div className="bg-black/20 rounded p-4">
                <p className="text-xs opacity-75 mb-1">Shipment Value</p>
                <p className="text-2xl font-bold">${(riskScore.value / 1000).toFixed(0)}K</p>
              </div>
            </div>

            {/* Component Risks */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Risk Components</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(riskScore.componentRisks || {}).map(([key, value]) => (
                  <div key={key} className="bg-black/20 rounded p-3 text-center">
                    <p className="text-xs opacity-75 capitalize mb-1">{key}</p>
                    <p className="text-lg font-bold">{value}/10</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Insurance Recommendation */}
            {riskScore.insuranceRecommendation && (
              <div className="bg-black/20 rounded p-4 mb-4">
                <h4 className="font-semibold mb-2">Insurance Recommendation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="opacity-75">Coverage Type</p>
                    <p className="font-semibold">{riskScore.insuranceRecommendation.type}</p>
                  </div>
                  <div>
                    <p className="opacity-75">Premium</p>
                    <p className="font-semibold">{riskScore.insuranceRecommendation.premium}</p>
                  </div>
                  <div>
                    <p className="opacity-75">Coverage Amount</p>
                    <p className="font-semibold">{riskScore.insuranceRecommendation.coverage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {riskScore.recommendations && riskScore.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {riskScore.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex gap-2 text-sm">
                      <span className="text-green-400">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
