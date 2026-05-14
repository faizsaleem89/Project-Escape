import { CheckCircle, Shield } from 'lucide-react';

export default function Certifications() {
  const certifications = [
    {
      id: 1,
      name: 'ISO 27001',
      fullName: 'Information Security Management System',
      description: 'The world\'s most recognized information security standard. Demonstrates your organization\'s commitment to protecting sensitive data and managing information risks.',
      focus: 'Data protection, security controls, risk management',
      industries: ['Tech', 'Finance', 'Healthcare', 'Retail'],
      standalone: true
    },
    {
      id: 2,
      name: 'ISO 42001',
      fullName: 'AI Management System',
      description: 'The new standard for AI governance. Proves your organization manages AI risks responsibly and complies with emerging AI regulations.',
      focus: 'AI governance, model validation, risk assessment',
      industries: ['Tech', 'Finance', 'AI/ML', 'Consulting'],
      standalone: true
    },
    {
      id: 3,
      name: 'SOC 2 Type II',
      fullName: 'Service Organization Control',
      description: 'Demonstrates your organization meets strict security and operational standards. Essential for SaaS and cloud service providers.',
      focus: 'Security controls, availability, processing integrity',
      industries: ['SaaS', 'Cloud', 'Tech', 'Finance'],
      standalone: true
    },
    {
      id: 4,
      name: 'GDPR',
      fullName: 'General Data Protection Regulation',
      description: 'Ensure your organization complies with EU data protection regulations. Required for any organization handling EU citizen data.',
      focus: 'Data privacy, consent management, data subject rights',
      industries: ['All industries'],
      standalone: true
    },
    {
      id: 5,
      name: 'FCA Compliance',
      fullName: 'Financial Conduct Authority AI Governance',
      description: 'Meet FCA requirements for AI governance in financial services. Mandatory for regulated financial institutions using AI systems.',
      focus: 'FCA compliance, AI governance, regulatory approval',
      industries: ['Finance', 'Banking', 'Insurance'],
      standalone: true
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Certification Programs</h2>
        <p className="text-slate-600">Choose any combination of certifications. We'll conduct a comprehensive audit tailored to your needs.</p>
      </div>

      {/* Key Message */}
      <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
        <div className="flex gap-4">
          <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Flexible Certification Paths</h3>
            <p className="text-slate-700 mb-3">
              Whether you need a single certification or comprehensive coverage across all standards, we design an audit tailored to your requirements. Every audit includes implementation support, training, and ongoing monitoring.
            </p>
            <p className="text-slate-600 text-sm">
              See our <span className="font-semibold">Pricing page</span> for package options: Starter (1 cert), Professional (2-3 certs), or Enterprise (4-5 certs).
            </p>
          </div>
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-slate-900">Available Certifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert) => (
            <div key={cert.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{cert.name}</h4>
                  <p className="text-sm text-slate-600">{cert.fullName}</p>
                </div>
              </div>
              
              <p className="text-slate-700 mb-4">{cert.description}</p>
              
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-900 mb-2">Focus Areas:</p>
                <p className="text-sm text-slate-600">{cert.focus}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900 mb-2">Common Industries:</p>
                <div className="flex flex-wrap gap-2">
                  {cert.industries.map((industry, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Combinations */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Popular Combinations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">🔒 Security-Focused</h4>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                ISO 27001
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                SOC 2 Type II
              </li>
            </ul>
            <p className="text-sm text-slate-600">Perfect for: Tech companies, SaaS providers</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">🤖 AI-Focused</h4>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                ISO 42001
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                ISO 27001
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                GDPR
              </li>
            </ul>
            <p className="text-sm text-slate-600">Perfect for: AI companies, ML platforms</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">🏦 Finance-Focused</h4>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                FCA Compliance
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                ISO 27001
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <CheckCircle className="w-4 h-4 text-green-600" />
                SOC 2 Type II
              </li>
            </ul>
            <p className="text-sm text-slate-600">Perfect for: Banks, fintech, insurance</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">How Our Audit Process Works</h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-blue-600">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Choose Your Certifications</h4>
              <p className="text-slate-600">Select which standards you need (1, 2-3, or 4-5 certifications)</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-blue-600">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Comprehensive Assessment</h4>
              <p className="text-slate-600">We assess your organization across all selected standards simultaneously</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-blue-600">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Unified Framework</h4>
              <p className="text-slate-600">We design a single governance framework that satisfies all your selected standards</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-blue-600">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Implementation & Support</h4>
              <p className="text-slate-600">We help implement controls, develop policies, and prepare for certification audits</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-blue-600">5</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Ongoing Monitoring</h4>
              <p className="text-slate-600">Quarterly reviews and support for 1 year to maintain compliance</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Certifications FAQ</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Can I choose which certifications I want?</h4>
            <p className="text-slate-700">Yes, absolutely. You can choose any combination of the five standards. We'll tailor the audit to your specific needs.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">What if I start with one and want to add more later?</h4>
            <p className="text-slate-700">You can expand your certifications over time. We recommend discussing your full compliance roadmap upfront so we can design a scalable framework.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">How long does the audit take?</h4>
            <p className="text-slate-700">All audits take 8 weeks, regardless of how many certifications you choose. This includes assessment, implementation support, and preparation for certification.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Are the certifications official?</h4>
            <p className="text-slate-700">Yes. We support your path to official certification through recognized certification bodies. Our audit prepares you for formal certification audits.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">What about maintenance and recertification?</h4>
            <p className="text-slate-700">We provide quarterly monitoring for 1 year included in your audit fee. For ongoing maintenance and recertification, we offer annual support packages.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Do I need all five certifications?</h4>
            <p className="text-slate-700">Not necessarily. Which certifications you pursue depends on your industry and regulatory requirements. We can help you determine which are most important for your organization.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
