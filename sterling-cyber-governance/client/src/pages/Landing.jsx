import { CheckCircle, ArrowRight, Shield, TrendingUp, Lock, Zap } from 'lucide-react';

export default function Landing({ setCurrentPage }) {
  const features = [
    {
      icon: Shield,
      title: 'Comprehensive Audits',
      description: 'Expert-led compliance audits across ISO 27001, ISO 42001, SOC 2, GDPR, and FCA standards'
    },
    {
      icon: TrendingUp,
      title: 'Certification Pathways',
      description: 'Clear roadmaps to achieve and maintain industry-leading certifications'
    },
    {
      icon: Lock,
      title: 'Risk Management',
      description: 'Identify, assess, and remediate compliance gaps before they become issues'
    },
    {
      icon: Zap,
      title: 'Fast-Track Programs',
      description: 'Accelerated certification timelines with dedicated audit teams'
    }
  ];

  const stats = [
    { number: '28', label: 'Organizations Certified' },
    { number: '71', label: 'Active Certifications' },
    { number: '94%', label: 'Average Compliance Score' },
    { number: '16 weeks', label: 'Average Certification Time' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-slate-200">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Enterprise Compliance Made Simple
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Sterling Cyber Governance helps organizations achieve and maintain world-class compliance certifications. We handle the audits, you focus on your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setCurrentPage('pricing')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              View Pricing <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentPage('contact')}
              className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <p className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</p>
            <p className="text-slate-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section>
        <h3 className="text-3xl font-bold text-slate-900 mb-8">What We Offer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-blue-50 rounded-xl p-8 md:p-12 border border-blue-200">
        <h3 className="text-3xl font-bold text-slate-900 mb-8">Why Choose Sterling Cyber Governance?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            'Expert auditors with 15+ years compliance experience',
            'Proven track record with 28+ certified organizations',
            'Transparent pricing with no hidden fees',
            'Fast-track certification programs (as quick as 12 weeks)',
            'Ongoing compliance support and monitoring',
            'Industry-leading certification success rate'
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <p className="text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 md:p-12 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to Get Certified?</h3>
        <p className="text-lg mb-8 opacity-90">Start your compliance journey today. Our team is ready to help.</p>
        <button 
          onClick={() => setCurrentPage('contact')}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors inline-flex items-center gap-2"
        >
          Get Started Now <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
}
