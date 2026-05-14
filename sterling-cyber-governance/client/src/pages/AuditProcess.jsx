import { CheckCircle, FileText, Users, BarChart3, Award } from 'lucide-react';

export default function AuditProcess() {
  const processSteps = [
    {
      step: 1,
      title: 'Discovery & Assessment',
      description: 'We conduct a comprehensive review of your current compliance posture, systems, and processes.',
      duration: 'Weeks 1-2',
      activities: ['Initial consultation', 'Gap analysis', 'Risk assessment', 'Scope definition']
    },
    {
      step: 2,
      title: 'Planning & Roadmap',
      description: 'We create a detailed roadmap with timelines, resource requirements, and remediation priorities.',
      duration: 'Week 3',
      activities: ['Remediation plan', 'Timeline creation', 'Resource allocation', 'Stakeholder alignment']
    },
    {
      step: 3,
      title: 'Implementation Support',
      description: 'Our team works with your organization to implement required controls and close compliance gaps.',
      duration: 'Weeks 4-6',
      activities: ['Control implementation', 'Policy development', 'Training & awareness', 'Regular check-ins']
    },
    {
      step: 4,
      title: 'Pre-Audit Review',
      description: 'We conduct a mock audit to ensure your organization is ready for the formal certification audit.',
      duration: 'Week 7',
      activities: ['Mock audit', 'Final gap closure', 'Documentation review', 'Readiness confirmation']
    },
    {
      step: 5,
      title: 'Formal Audit & Certification',
      description: 'The certification body conducts the official audit. We coordinate and support throughout.',
      duration: 'Week 8',
      activities: ['Audit coordination', 'Evidence presentation', 'Issue resolution', 'Certificate issuance']
    },
    {
      step: 6,
      title: 'Ongoing Monitoring',
      description: 'We provide quarterly compliance reviews and ongoing support for 1 year.',
      duration: 'Year 1+',
      activities: ['Quarterly reviews', 'Compliance updates', 'Regulatory changes', 'Continuous improvement']
    }
  ];

  const auditCapabilities = [
    {
      icon: FileText,
      title: 'Documentation Review',
      description: 'Comprehensive review of policies, procedures, and compliance documentation'
    },
    {
      icon: Users,
      title: 'Staff Interviews',
      description: 'In-depth interviews with key personnel to assess compliance understanding'
    },
    {
      icon: BarChart3,
      title: 'System Testing',
      description: 'Technical testing of controls, access management, and security measures'
    },
    {
      icon: Award,
      title: 'Evidence Collection',
      description: 'Systematic collection and validation of compliance evidence'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Our Audit Process</h2>
        <p className="text-slate-600">A proven, transparent methodology that gets organizations certified efficiently and effectively</p>
      </div>

      {/* Process Timeline */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">The 8-Week Audit Process</h3>
        {processSteps.map((step, index) => (
          <div key={step.step} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex gap-6">
              {/* Step Number */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {step.step}
                </div>
                {index < processSteps.length - 1 && (
                  <div className="w-1 h-16 bg-blue-200 mx-auto mt-2"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{step.title}</h4>
                    <p className="text-sm text-blue-600 font-medium">{step.duration}</p>
                  </div>
                </div>
                <p className="text-slate-700 mb-3">{step.description}</p>
                <div className="flex flex-wrap gap-2">
                  {step.activities.map((activity, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Capabilities */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Our Audit Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {auditCapabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{capability.title}</h4>
                <p className="text-slate-600">{capability.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Why Our Process Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-3xl font-bold text-blue-600 mb-2">94%</p>
            <p className="text-slate-700 font-medium">Average Compliance Score</p>
            <p className="text-sm text-slate-600">Our clients achieve exceptional compliance levels</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600 mb-2">16 weeks</p>
            <p className="text-slate-700 font-medium">Average Certification Time</p>
            <p className="text-sm text-slate-600">Efficient, streamlined process from start to finish</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600 mb-2">100%</p>
            <p className="text-slate-700 font-medium">Success Rate</p>
            <p className="text-sm text-slate-600">All prepared organizations pass their audits</p>
          </div>
        </div>
      </div>

      {/* Expert Team */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Expert Audit Team</h3>
        <p className="text-slate-700 mb-6">
          Sterling Cyber Governance's audit team consists of certified compliance professionals with 15+ years of experience across multiple industries. Each auditor is:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Certified by major compliance bodies (CISA, CISSP, ISO Lead Auditor)',
            'Experienced across multiple industries (Finance, Tech, Healthcare, Retail)',
            'Trained in latest compliance standards and regulations',
            'Dedicated to your organization\'s success',
            'Available for ongoing support and guidance',
            'Committed to transparent, ethical practices'
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
