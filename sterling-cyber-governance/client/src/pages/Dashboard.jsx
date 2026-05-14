import { CheckCircle, AlertCircle, Users, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      label: 'Organizations',
      value: '28',
      icon: Users,
      color: 'blue',
      description: 'Active organizations'
    },
    {
      label: 'Certified',
      value: '18',
      icon: CheckCircle,
      color: 'green',
      description: '64% certification rate'
    },
    {
      label: 'Compliance Score',
      value: '94%',
      icon: TrendingUp,
      color: 'purple',
      description: 'Average across all orgs'
    },
    {
      label: 'Issues',
      value: '6',
      icon: AlertCircle,
      color: 'orange',
      description: 'Open compliance issues'
    }
  ];

  const recentAudits = [
    { company: 'TechCorp Ltd', certification: 'ISO 27001', status: 'Passed', date: '2 days ago' },
    { company: 'FinanceHub Inc', certification: 'SOC 2 Type II', status: 'In Progress', date: '5 days ago' },
    { company: 'DataFlow Systems', certification: 'GDPR', status: 'Passed', date: '1 week ago' },
    { company: 'CloudFirst AI', certification: 'ISO 42001', status: 'Passed', date: '10 days ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-slate-600">Here's your compliance overview at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            purple: 'bg-purple-50 text-purple-600',
            orange: 'bg-orange-50 text-orange-600'
          };

          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Audits */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Recent Audits</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Company</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Certification</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentAudits.map((audit, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm text-slate-900 font-medium">{audit.company}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{audit.certification}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      audit.status === 'Passed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {audit.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-500">{audit.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
