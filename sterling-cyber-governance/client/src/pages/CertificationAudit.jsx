import { CheckCircle, Clock, Plus } from 'lucide-react';

export default function CertificationAudit() {
  const certifications = [
    {
      id: 1,
      name: 'ISO 27001',
      description: 'Information Security Management',
      organizations: 18,
      status: 'Active',
      lastAudit: '2024-05-15',
      nextAudit: '2025-05-15'
    },
    {
      id: 2,
      name: 'ISO 42001',
      description: 'AI Risk Management',
      organizations: 15,
      status: 'Active',
      lastAudit: '2024-05-10',
      nextAudit: '2025-05-10'
    },
    {
      id: 3,
      name: 'SOC 2 Type II',
      description: 'Service Organization Control',
      organizations: 12,
      status: 'Active',
      lastAudit: '2024-04-20',
      nextAudit: '2025-04-20'
    },
    {
      id: 4,
      name: 'GDPR Compliance',
      description: 'General Data Protection Regulation',
      organizations: 18,
      status: 'Active',
      lastAudit: '2024-05-01',
      nextAudit: '2025-05-01'
    },
    {
      id: 5,
      name: 'FCA Compliance',
      description: 'Financial Conduct Authority',
      organizations: 8,
      status: 'Pending',
      lastAudit: '2024-03-15',
      nextAudit: '2024-06-15'
    },
  ];

  const upcomingAudits = [
    { org: 'TechCorp Ltd', certification: 'ISO 27001', daysUntil: 3, auditor: 'John Smith' },
    { org: 'FinanceHub Inc', certification: 'SOC 2 Type II', daysUntil: 7, auditor: 'Sarah Johnson' },
    { org: 'DataFlow Systems', certification: 'GDPR', daysUntil: 12, auditor: 'Mike Chen' },
    { org: 'CloudFirst AI', certification: 'ISO 42001', daysUntil: 15, auditor: 'Emma Davis' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Certifications & Audits</h2>
          <p className="text-slate-600">Manage and track all certification programs</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Audit
        </button>
      </div>

      {/* Certification Programs */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Active Certification Programs</h3>
        <div className="space-y-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{cert.name}</h4>
                  <p className="text-sm text-slate-600">{cert.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  cert.status === 'Active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {cert.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-slate-600 text-xs">Organizations</p>
                  <p className="text-slate-900 font-semibold">{cert.organizations}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-xs">Last Audit</p>
                  <p className="text-slate-900 font-semibold">{cert.lastAudit}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-xs">Next Audit</p>
                  <p className="text-slate-900 font-semibold">{cert.nextAudit}</p>
                </div>
                <div className="text-right">
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View Details →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Audits */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Upcoming Audits</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Organization</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Certification</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Days Until</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Auditor</th>
              </tr>
            </thead>
            <tbody>
              {upcomingAudits.map((audit, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm text-slate-900 font-medium">{audit.org}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{audit.certification}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      audit.daysUntil <= 7 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {audit.daysUntil} days
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{audit.auditor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
