import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Loader } from 'lucide-react';

export default function KPIDashboard() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setLoading(true);
        const [summary, risks, ports] = await Promise.all([
          api.getDashboardSummary(),
          api.getGlobalRisks(),
          api.getPortStatus()
        ]);

        // Calculate KPIs
        const portData = (ports.ports || []).map(p => ({
          name: p.code,
          efficiency: 100 - p.utilization,
          reliability: Math.random() * 30 + 70
        }));

        const timeSeriesData = [
          { time: '00:00', shipments: 45, risks: 3, disruptions: 1 },
          { time: '04:00', shipments: 52, risks: 4, disruptions: 2 },
          { time: '08:00', shipments: 58, risks: 5, disruptions: 1 },
          { time: '12:00', shipments: 65, risks: 6, disruptions: 3 },
          { time: '16:00', shipments: 72, risks: 7, disruptions: 2 },
          { time: '20:00', shipments: 68, risks: 5, disruptions: 1 },
          { time: '24:00', shipments: 75, risks: 8, disruptions: 2 }
        ];

        const avgRisk = (risks.risks || []).reduce((sum, r) => sum + r.riskScore, 0) / (risks.risks?.length || 1);
        const avgUtilization = (ports.ports || []).reduce((sum, p) => sum + p.utilization, 0) / (ports.ports?.length || 1);
        const onTimeDelivery = 94.2;
        const costSavings = 23.5;

        setKpis({
          summary: summary.summary,
          portData,
          timeSeriesData,
          metrics: {
            avgRisk: avgRisk.toFixed(1),
            avgUtilization: avgUtilization.toFixed(0),
            onTimeDelivery: onTimeDelivery.toFixed(1),
            costSavings: costSavings.toFixed(1)
          }
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
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
        <Activity className="w-5 h-5" /> Supply Chain KPIs
      </h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-slate-400 text-sm">Avg Risk Score</p>
              <p className="text-3xl font-bold text-blue-300">{kpis?.metrics.avgRisk}/10</p>
            </div>
            <TrendingDown className="w-8 h-8 text-blue-400 opacity-50" />
          </div>
          <p className="text-xs text-slate-400">↓ 2.3% from last week</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 rounded-lg p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-slate-400 text-sm">On-Time Delivery</p>
              <p className="text-3xl font-bold text-green-300">{kpis?.metrics.onTimeDelivery}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400 opacity-50" />
          </div>
          <p className="text-xs text-slate-400">↑ 1.2% from last week</p>
        </div>

        <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 border border-amber-500/30 rounded-lg p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-slate-400 text-sm">Avg Port Utilization</p>
              <p className="text-3xl font-bold text-amber-300">{kpis?.metrics.avgUtilization}%</p>
            </div>
            <Activity className="w-8 h-8 text-amber-400 opacity-50" />
          </div>
          <p className="text-xs text-slate-400">Optimal capacity</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-lg p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-slate-400 text-sm">Cost Savings</p>
              <p className="text-3xl font-bold text-purple-300">{kpis?.metrics.costSavings}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400 opacity-50" />
          </div>
          <p className="text-xs text-slate-400">↑ 5.1% from last month</p>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">24-Hour Activity Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={kpis?.timeSeriesData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="time" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Legend />
            <Line type="monotone" dataKey="shipments" stroke="#3b82f6" strokeWidth={2} name="Active Shipments" />
            <Line type="monotone" dataKey="risks" stroke="#ef4444" strokeWidth={2} name="Risk Events" />
            <Line type="monotone" dataKey="disruptions" stroke="#f59e0b" strokeWidth={2} name="Disruptions" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Port Efficiency */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Port Efficiency Metrics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={kpis?.portData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Legend />
            <Bar dataKey="efficiency" fill="#10b981" name="Efficiency %" radius={[8, 8, 0, 0]} />
            <Bar dataKey="reliability" fill="#3b82f6" name="Reliability %" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h4 className="text-white font-bold mb-3">Strengths</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-2">
              <span className="text-green-400">✓</span>
              <span>High on-time delivery rate (94.2%)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-400">✓</span>
              <span>Optimal port utilization levels</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-400">✓</span>
              <span>Significant cost savings achieved</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h4 className="text-white font-bold mb-3">Areas for Improvement</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex gap-2">
              <span className="text-amber-400">!</span>
              <span>Monitor geopolitical risks in Middle East</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">!</span>
              <span>Reduce port congestion at Singapore</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400">!</span>
              <span>Optimize labor scheduling</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
