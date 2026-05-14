import { AlertCircle, CheckCircle, Clock, TrendingDown } from 'lucide-react';

export default function ComplianceMonitoring() {
  const complianceItems = [
    {
      id: 1,
      name: 'Data Encryption',
      category: 'Security',
      status: 'Compliant',
      coverage: '100%',
      lastChecked: '2 hours ago',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 2,
      name: 'Access Control',
      category: 'Security',
      status: 'Compliant',
      coverage: '98%',
      lastChecked: '1 hour ago',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 3,
      name: 'Data Retention Policy',
      category: 'Governance',
      status: 'Warning',
      coverage: '85%',
      lastChecked: '3 hours ago',
      icon: AlertCircle,
      color: 'yellow'
    },
    {
      id: 4,
      name: 'Audit Logging',
      category: 'Monitoring',
      status: 'Compliant',
      coverage: '99%',
      lastChecked: '30 mins ago',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 5,
      name: 'Incident Response',
      category: 'Security',
      status: 'Non-Compliant',
      coverage: '72%',
      lastChecked: '4 hours ago',
      icon: AlertCircle,
      color: 'red'
    },
    {
      id: 6,
      name: 'Data Classification',
      category: 'Governance',
      status: 'Compliant',
      coverage: '96%',
      lastChecked: '2 hours ago',
      icon: CheckCircle,
      color: 'green'
    },
  ];

  const organizations = [
    { name: 'TechCorp Ltd', compliance: 94, trend: 'up', issues: 2 },
    { name: 'FinanceHub Inc', compliance: 88, trend: 'up', issues: 4 },
    { name: 'DataFlow Systems', compliance: 92, trend: 'stable', issues: 1 },
    { name: 'CloudFirst AI', compliance: 96, trend: 'up', issues: 0 },
    { name: 'SecureNet Ltd', compliance: 85, trend: 'down', issues: 6 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Compliance Monitoring</h2>
        <p className="text-slate-600">Real-time monitoring of compliance controls and policies</p>
      </div>

      {/* Compliance Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Active Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceItems.map((item) => {
            const Icon = item.icon;
            const statusColors = {
              'Compliant': 'bg-green-50 border-green-200',
              'Warning': 'bg-yellow-50 border-yellow-200',
              'Non-Compliant': 'bg-red-50 border-red-200'
            };

            const iconColors = {
              'green': 'text-green-600',
              'yellow': 'text-yellow-600',
              'red': 'text-red-600'
            };

            return (
              <div key={item.id} className={`border rounded-lg p-4 ${statusColors[item.status]}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-600">{item.category}</p>
                  </div>
                  <Icon className={`w-5 h-5 ${iconColors[item.color]}`} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Coverage</span>
                    <span className="font-semibold text-slate-900">{item.coverage}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.color === 'green' ? 'bg-green-600' : 
                        item.color === 'yellow' ? 'bg-yellow-600' : 
                        'bg-red-600'
                      }`}
                      style={{ width: item.coverage }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-600">Last checked: {item.lastChecked}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Organization Compliance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Organization Compliance Scores</h3>
        <div className="space-y-4">
          {organizations.map((org, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-900">{org.name}</h4>
                <div className="flex items-center gap-2">
                  {org.trend === 'up' && <TrendingDown className="w-4 h-4 text-green-600 rotate-180" />}
                  {org.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                  {org.trend === 'stable' && <Clock className="w-4 h-4 text-slate-600" />}
                  <span className="text-sm font-semibold text-slate-900">{org.compliance}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 mb-3">
                <div 
                  className={`h-3 rounded-full ${
                    org.compliance >= 90 ? 'bg-green-600' : 
                    org.compliance >= 80 ? 'bg-yellow-600' : 
                    'bg-red-600'
                  }`}
                  style={{ width: `${org.compliance}%` }}
                ></div>
              </div>
              <p className={`text-xs ${org.issues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {org.issues} open issues
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm font-medium mb-2">Overall Compliance</p>
          <p className="text-4xl font-bold text-slate-900">91%</p>
          <p className="text-xs text-green-600 mt-2">↑ 2% from last month</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm font-medium mb-2">Controls Monitored</p>
          <p className="text-4xl font-bold text-slate-900">156</p>
          <p className="text-xs text-slate-600 mt-2">Across 5 organizations</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm font-medium mb-2">Active Issues</p>
          <p className="text-4xl font-bold text-red-600">13</p>
          <p className="text-xs text-slate-600 mt-2">Requiring attention</p>
        </div>
      </div>
    </div>
  );
}
