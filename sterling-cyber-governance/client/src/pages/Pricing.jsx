import { CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';

export default function Pricing({ setCurrentPage }) {
  const pricingTiers = [
    {
      name: 'Starter Audit',
      description: 'Single certification focus',
      price: '£15,000',
      period: 'fixed fee',
      timeline: '8 weeks',
      certifications: 1,
      example: 'e.g., ISO 27001 OR GDPR',
      features: [
        'Single certification audit',
        'Compliance gap analysis',
        'Risk assessment & scoring',
        'Governance framework design',
        'Policy recommendations',
        'Implementation support',
        'Training & documentation',
        'Certification support',
        'Quarterly monitoring (1 year)',
        'Regulatory compliance documentation'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Professional Audit',
      description: 'Multiple certifications',
      price: '£30,000-£35,000',
      period: 'fixed fee',
      timeline: '8 weeks',
      certifications: '2-3',
      example: 'e.g., ISO 27001 + ISO 42001 + GDPR',
      features: [
        'Up to 3 certifications',
        'Comprehensive gap analysis',
        'Integrated governance framework',
        'Full implementation support',
        'Mock audit preparation',
        'Dedicated audit coordinator',
        'Training & documentation',
        'Certification support',
        'Quarterly monitoring (1 year)',
        'Regulatory compliance documentation'
      ],
      cta: 'Most Popular',
      highlighted: true
    },
    {
      name: 'Enterprise Audit',
      description: 'Comprehensive coverage',
      price: '£55,000-£60,000',
      period: 'fixed fee',
      timeline: '8 weeks',
      certifications: '4-5',
      example: 'e.g., All major standards',
      features: [
        'All 5 major certifications',
        'Executive-level consulting',
        'Comprehensive gap analysis',
        'Unified governance framework',
        'Full implementation support',
        'Multiple mock audits',
        'Dedicated audit team',
        'Training & documentation',
        'Certification support',
        'Quarterly monitoring (1 year)',
        'Regulatory compliance documentation'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  const certifications = [
    { name: 'ISO 27001', description: 'Information Security Management', standalone: true },
    { name: 'ISO 42001', description: 'AI Management System', standalone: true },
    { name: 'SOC 2 Type II', description: 'Service Organization Control', standalone: true },
    { name: 'GDPR', description: 'Data Protection Regulation', standalone: true },
    { name: 'FCA Compliance', description: 'Financial Conduct Authority AI Governance', standalone: true }
  ];

  const valueProposition = [
    {
      title: 'Regulatory Fine Risk',
      amount: '£2-5M',
      description: 'Potential cost of a single regulatory violation'
    },
    {
      title: 'Our Audit Cost',
      amount: '£15K-£60K',
      description: 'Depends on certifications needed'
    },
    {
      title: 'ROI Multiple',
      amount: '33-333x',
      description: 'Potential return on investment by avoiding fines'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Flexible, Transparent Pricing</h2>
        <p className="text-slate-600">Choose the certifications you need. Pay only for what you require. All audits include full support and ongoing monitoring.</p>
      </div>

      {/* Value Proposition */}
      <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Why This Investment Matters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {valueProposition.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 border border-blue-200">
              <p className="text-sm text-slate-600 mb-2">{item.title}</p>
              <p className="text-3xl font-bold text-blue-600 mb-2">{item.amount}</p>
              <p className="text-sm text-slate-700">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Pricing Tiers */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Audit Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier, idx) => (
            <div 
              key={idx}
              className={`rounded-xl overflow-hidden shadow-sm border transition-all ${
                tier.highlighted 
                  ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-white ring-2 ring-blue-200 scale-105' 
                  : 'border-slate-200 bg-white'
              }`}
            >
              {/* Header */}
              <div className={`p-6 ${tier.highlighted ? 'bg-blue-600 text-white' : 'bg-slate-50'}`}>
                <h3 className={`text-2xl font-bold mb-2 ${tier.highlighted ? 'text-white' : 'text-slate-900'}`}>
                  {tier.name}
                </h3>
                <p className={tier.highlighted ? 'text-blue-100' : 'text-slate-600'}>
                  {tier.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="p-6 border-b border-slate-200">
                <div className="mb-2">
                  <span className="text-4xl font-bold text-slate-900">{tier.price}</span>
                  <span className="text-slate-600 ml-2">{tier.period}</span>
                </div>
                <p className="text-sm text-slate-600 mb-2">Timeline: <span className="font-semibold">{tier.timeline}</span></p>
                <p className="text-sm text-slate-600 mb-4">Certifications: <span className="font-semibold">{tier.certifications}</span></p>
                <p className="text-xs text-slate-500 mb-4 italic">{tier.example}</p>
                <button 
                  onClick={() => setCurrentPage('contact')}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    tier.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {tier.cta} <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Features */}
              <div className="p-6">
                <p className="text-sm font-semibold text-slate-900 mb-4">What's Included:</p>
                <ul className="space-y-3">
                  {tier.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Available */}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Available Certifications</h3>
        <p className="text-slate-600 mb-6">Choose any combination of these certifications for your audit. Mix and match based on your needs.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {certifications.map((cert, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="font-semibold text-slate-900">{cert.name}</p>
              </div>
              <p className="text-sm text-slate-600">{cert.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How Pricing Works */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">How Our Pricing Works</h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-blue-600">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Choose Your Certifications</h4>
              <p className="text-slate-600">Select which certifications you need (1, 2-3, or 4-5)</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-blue-600">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Comprehensive Audit</h4>
              <p className="text-slate-600">We conduct a full audit across all selected standards (8 weeks)</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-blue-600">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Implementation & Support</h4>
              <p className="text-slate-600">We help you implement required controls and prepare for certification</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-blue-600">4</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-1">Ongoing Monitoring</h4>
              <p className="text-slate-600">Quarterly reviews and support for 1 year included in your audit cost</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Packages */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Need Something Different?</h3>
        <p className="text-slate-700 mb-4">
          We understand that every organization has unique compliance needs. If you need a custom package or have specific requirements, we're happy to discuss options.
        </p>
        <button 
          onClick={() => setCurrentPage('contact')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          Contact Our Team <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Pricing FAQ</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">What's included in the audit price?</h4>
            <p className="text-slate-700">Everything: gap analysis, governance framework design, policy development, implementation support, training, certification support, and 1 year of quarterly monitoring.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Can I start with one certification and add more later?</h4>
            <p className="text-slate-700">Yes. You can start with a Starter Audit (1 certification) and expand later. We recommend discussing your full compliance roadmap upfront so we can design a scalable framework.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Are there any hidden fees?</h4>
            <p className="text-slate-700">No. The price you see is the complete cost. No surprises, no additional charges. Optional add-ons (like extended monitoring) are available but never required.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">What if we need to extend the timeline?</h4>
            <p className="text-slate-700">We can adjust timelines if needed. The price remains the same regardless of timeline flexibility.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Do you offer payment plans?</h4>
            <p className="text-slate-700">Yes. We offer flexible payment options for all packages. Contact us to discuss arrangements that work for your budget.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">What happens after the audit?</h4>
            <p className="text-slate-700">You receive complete documentation, policies, and certification support. We provide quarterly reviews for 1 year. After that, we offer annual maintenance packages to keep you compliant.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 md:p-12 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to Get Certified?</h3>
        <p className="text-lg mb-8 opacity-90">Choose your certifications and start your compliance journey today.</p>
        <button 
          onClick={() => setCurrentPage('contact')}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors inline-flex items-center gap-2"
        >
          Schedule Your Audit <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
