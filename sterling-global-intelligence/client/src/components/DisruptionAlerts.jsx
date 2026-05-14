import React, { useState } from 'react';
import { api } from '../lib/api';
import { AlertTriangle, Loader, Zap } from 'lucide-react';

export default function DisruptionAlerts() {
  const [formData, setFormData] = useState({
    shipmentId: 'SHIP001',
    route: 'Shanghai-Rotterdam',
    origin: 'Shanghai',
    destination: 'Rotterdam'
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const data = await api.predictDisruptions(formData);
      setPrediction(data.prediction);
    } catch (err) {
      setError('Failed to predict disruptions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" /> Predict Disruptions
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
            name="route"
            placeholder="Route"
            value={formData.route}
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
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading ? 'Analyzing...' : 'Predict Disruptions'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Prediction Result */}
      {prediction && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Disruption Analysis</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-700/30 rounded p-4">
              <p className="text-slate-400 text-sm">Disruption Probability</p>
              <p className="text-2xl font-bold text-amber-300">
                {(prediction.disruptionProbability * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-slate-700/30 rounded p-4">
              <p className="text-slate-400 text-sm">Estimated Impact</p>
              <p className="text-2xl font-bold text-red-300">{prediction.estimatedImpact}</p>
            </div>
            <div className="bg-slate-700/30 rounded p-4">
              <p className="text-slate-400 text-sm">Confidence Level</p>
              <p className="text-2xl font-bold text-blue-300">
                {(prediction.confidence * 100).toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Predicted Disruptions */}
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-3">Predicted Disruptions</h4>
            <div className="space-y-3">
              {prediction.predictedDisruptions?.map((disruption, idx) => (
                <div 
                  key={idx}
                  className={`border rounded-lg p-4 ${getSeverityColor(disruption.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h5 className="font-bold">{disruption.type}</h5>
                      <p className="text-sm opacity-75 mb-2">{disruption.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                        <div>
                          <p className="opacity-75">Probability</p>
                          <p className="font-semibold">{(disruption.probability * 100).toFixed(0)}%</p>
                        </div>
                        <div>
                          <p className="opacity-75">Potential Delay</p>
                          <p className="font-semibold">{disruption.potentialDelay}</p>
                        </div>
                      </div>
                      <p className="text-sm bg-black/20 px-3 py-2 rounded">
                        <span className="opacity-75">Mitigation: </span>
                        {disruption.mitigation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {prediction.recommendations && prediction.recommendations.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {prediction.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-2 text-slate-200 text-sm">
                    <span className="text-green-400">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
