import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Loader } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [risks, ports] = await Promise.all([
          api.getGlobalRisks(),
          api.getPortStatus()
        ]);

        // Process data for charts
        const riskData = (risks.risks || []).map(r => ({
          name: r.region,
          score: r.riskScore,
          level: r.riskLevel
        }));

        const portData = (ports.ports || []).slice(0, 5).map(p => ({
          name: p.code,
          utilization: p.utilization,
          waitTime: parseInt(p.avgWaitTime)
        }));

        const riskTierData = [
          { name: 'Critical', value: (risks.risks || []).filter(r => r.riskLevel === 'Critical').length },
          { name: 'High', value: (risks.risks || []).filter(r => r.riskLevel === 'High').length },
          { name: 'Medium', value: (risks.risks || []).filter(r => r.riskLevel === 'Medium').length },
          { name: 'Low', value: (risks.risks || []).filter(r => r.riskLevel === 'Low').length }
        ];

        setData({
          risks: riskData,
          ports: portData,
          tiers: riskTierData
        });
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
      <div className="flex items-center justify-center p-8">
        <Loader className="w-6 h-6 animate-spin text-blue-400" />
      </div>
    );
  }

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" /> Live Analytics
      </h2>

      {/* Risk Scores Chart */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Global Risk Scores by Region</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data?.risks || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Port Utilization Chart */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Port Utilization Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data?.ports || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Legend />
            <Line type="monotone" dataKey="utilization" stroke="#10b981" strokeWidth={2} name="Utilization %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Tier Distribution */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Risk Tier Distribution</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data?.tiers || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Avg Risk Score</p>
          <p className="text-3xl font-bold text-blue-300">
            {data?.risks ? (data.risks.reduce((sum, r) => sum + r.score, 0) / data.risks.length).toFixed(1) : '0'}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">High Risk Regions</p>
          <p className="text-3xl font-bold text-red-300">
            {data?.risks ? data.risks.filter(r => r.score > 7).length : '0'}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Avg Port Utilization</p>
          <p className="text-3xl font-bold text-green-300">
            {data?.ports ? Math.round(data.ports.reduce((sum, p) => sum + p.utilization, 0) / data.ports.length) : '0'}%
          </p>
        </div>
      </div>
    </div>
  );
}
