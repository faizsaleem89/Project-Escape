import { useState } from 'react';
import { Shield, Menu, X } from 'lucide-react';
import Landing from './pages/Landing';
import Certifications from './pages/Certifications';
import AuditProcess from './pages/AuditProcess';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: '🏠' },
    { id: 'certifications', label: 'Certifications', icon: '✓' },
    { id: 'audit', label: 'Audit Process', icon: '🔍' },
    { id: 'pricing', label: 'Pricing', icon: '💷' },
    { id: 'contact', label: 'Get Started', icon: '→' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Sterling Cyber Governance</h1>
              <p className="text-xs text-slate-500">Enterprise Compliance & Certification</p>
            </div>
          </div>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Navigation */}
        <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white border-r border-slate-200 p-4 md:p-6 md:sticky md:top-20 md:h-[calc(100vh-80px)] md:overflow-y-auto`}>
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {currentPage === 'landing' && <Landing setCurrentPage={setCurrentPage} />}
          {currentPage === 'certifications' && <Certifications />}
          {currentPage === 'audit' && <AuditProcess />}
          {currentPage === 'pricing' && <Pricing setCurrentPage={setCurrentPage} />}
          {currentPage === 'contact' && <Contact />}
        </main>
      </div>
    </div>
  );
}
