import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

export default function Analytics() {
  const trends = [
    { label: 'Certifications Issued', value: '71', change: '+12%', positive: true },
    { label: 'Audits Completed', value: '284', change: '+8%', positive: true },
    { label: 'Organizations Onboarded', value: '28', change: '+5%', positive: true },
    { label: 'Average Compliance Score', value: '91%', change: '+3%', positive: true },
  ];

  const certificationBreakdown = [
    { name: 'ISO 27001', count: 18, percentage: 25 },
    { name: 'ISO 42001', count: 15, percentage: 21 },
    { name: 'SOC 2 Type II', count: 12, percentage: 17 },
    { name: 'GDPR', count: 18, percentage: 25 },
    { name: 'FCA', count: 8, percentage: 12 },
  ];

  const monthlyData = [
    { month: 'Jan', audits: 32, issues: 8, resolved: 6 },
    { month: 'Feb', audits: 38, issues: 12, resolved: 10 },
    { month: 'Mar', audits: 42, issues: 15, resolved: 13 },
    { month: 'Apr', audits: 48, issues: 18, resolved: 16 },
    { month: 'May', audits: 54, issues: 22, resolved: 20 },
    { month: 'Jun', audits: 70, issues: 25, resolved: 22 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Analytics & Insights</h2>
        <p className="text-slate-600">Performance metrics and compliance trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trends.map((trend, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <p className="text-slate-600 text-sm font-medium mb-2">{trend.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-slate-900">{trend.value}</p>
              <div className={`flex items-center gap-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-semibold">{trend.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certification Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Certification Distribution
          </h3>
          <div className="space-y-4">
            {certificationBreakdown.map((cert, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-900">{cert.name}</span>
                  <span className="text-sm font-semibold text-slate-600">{cert.count} ({cert.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${cert.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Audit Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Monthly Activity
          </h3>
          <div className="space-y-4">
            {monthlyData.map((month, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600 w-12">{month.month}</span>
                <div className="flex-1">
                  <div className="flex gap-1 h-8">
                    <div className="flex-1 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-700">{month.audits}</span>
                    </div>
                    <div className="flex-1 bg-yellow-100 rounded flex items-center justify-center">
                      <span className="text-xs font-semibold text-yellow-700">{month.issues}</span>
                    </div>
                    <div className="flex-1 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-xs font-semibold text-green-700">{month.resolved}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex gap-4 text-xs mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-100 rounded"></div>
                <span className="text-slate-600">Audits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                <span className="text-slate-600">Issues</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 rounded"></div>
                <span className="text-slate-600">Resolved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Monthly Performance Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Month</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Audits</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Issues Found</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Issues Resolved</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Resolution Rate</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((month, index) => {
                const resolutionRate = ((month.resolved / month.issues) * 100).toFixed(0);
                return (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm font-medium text-slate-900">{month.month}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{month.audits}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{month.issues}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{month.resolved}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        resolutionRate >= 90 
                          ? 'bg-green-100 text-green-700' 
                          : resolutionRate >= 70
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {resolutionRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
