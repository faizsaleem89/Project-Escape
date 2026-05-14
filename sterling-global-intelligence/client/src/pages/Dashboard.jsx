import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Globe, Ship, AlertTriangle, TrendingUp, Loader } from 'lucide-react';
import ShipmentTracker from '../components/ShipmentTracker';
import RiskDashboard from '../components/RiskDashboard';
import PortStatus from '../components/PortStatus';
import DisruptionAlerts from '../components/DisruptionAlerts';
import RiskScoring from '../components/RiskScoring';
import GlobalMap from '../components/GlobalMap';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import AdvancedSearch from '../components/AdvancedSearch';
import AlertsNotifications from '../components/AlertsNotifications';
import KPIDashboard from '../components/KPIDashboard';
import RealTimeVessels from '../components/RealTimeVessels';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await api.getDashboardSummary();
        setSummary(data.summary);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
    const interval = setInterval(fetchSummary, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading Sterling Global Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Sterling Global Intelligence</h1>
                <p className="text-sm text-slate-400">Real-time Supply Chain Intelligence</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Last updated: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Shipments</p>
                  <p className="text-3xl font-bold text-blue-300">{summary.activeShipments || 0}</p>
                </div>
                <Ship className="w-8 h-8 text-blue-400 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Global Risk Level</p>
                  <p className="text-3xl font-bold text-red-300">
                    {summary.globalRisks?.length || 0} Regions
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 border border-amber-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Predicted Disruptions</p>
                  <p className="text-3xl font-bold text-amber-300">{summary.predictedDisruptions || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-amber-400 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Avg Risk Score</p>
                  <p className="text-3xl font-bold text-green-300">
                    {summary.avgRiskScore?.toFixed(1) || 'N/A'}
                  </p>
                </div>
                <Globe className="w-8 h-8 text-green-400 opacity-50" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-slate-700 overflow-x-auto">
          {['overview', 'tracking', 'risks', 'ports', 'disruptions', 'scoring', 'map', 'analytics', 'search', 'alerts', 'kpis', 'vessels'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PortStatus />
              <DisruptionAlerts />
            </div>
          )}

          {activeTab === 'tracking' && <ShipmentTracker />}

          {activeTab === 'risks' && <RiskDashboard />}

          {activeTab === 'ports' && <PortStatus />}

          {activeTab === 'disruptions' && <DisruptionAlerts />}

          {activeTab === 'scoring' && <RiskScoring />}

          {activeTab === 'map' && <GlobalMap />}

          {activeTab === 'analytics' && <AnalyticsDashboard />}

          {activeTab === 'search' && <AdvancedSearch />}

          {activeTab === 'alerts' && <AlertsNotifications />}

          {activeTab === 'kpis' && <KPIDashboard />}

          {activeTab === 'vessels' && <RealTimeVessels />}
        </div>
      </main>
    </div>
  );
}
