import { useState, useEffect } from 'react'
import { Link } from 'wouter'

export default function Dashboard() {
  const [stats, setStats] = useState({
    propertiesAnalyzed: 0,
    opportunitiesFound: 0,
    reportsGenerated: 0
  })

  useEffect(() => {
    // Fetch dashboard stats
    fetch('/api/health')
      .then(res => res.json())
      .then(data => console.log('System status:', data))
      .catch(err => console.error('Error:', err))
  }, [])

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <h1>Sterling Estate Intelligence</h1>
          <p>Global Land Development Intelligence Platform</p>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.propertiesAnalyzed}</div>
              <div className="stat-label">Properties Analyzed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.opportunitiesFound}</div>
              <div className="stat-label">Opportunities Found</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.reportsGenerated}</div>
              <div className="stat-label">Reports Generated</div>
            </div>
          </div>

          <div className="action-cards">
            <Link href="/search" className="action-card primary">
              <h2>Search Land</h2>
              <p>Find development opportunities across the UK</p>
            </Link>
            <Link href="/reports" className="action-card secondary">
              <h2>View Reports</h2>
              <p>Access generated feasibility and market analysis reports</p>
            </Link>
          </div>

          <section className="features">
            <h2>Platform Features</h2>
            <div className="features-grid">
              <div className="feature">
                <h3>🗺️ Interactive Mapping</h3>
                <p>Explore available development land across the entire UK with real-time data</p>
              </div>
              <div className="feature">
                <h3>📊 Development Analysis</h3>
                <p>Calculate development potential, build costs, and profit margins</p>
              </div>
              <div className="feature">
                <h3>🎯 Opportunity Detection</h3>
                <p>Identify what competitors are missing with AI-powered analysis</p>
              </div>
              <div className="feature">
                <h3>📋 Feasibility Reports</h3>
                <p>Generate comprehensive reports with market analysis and recommendations</p>
              </div>
              <div className="feature">
                <h3>⚠️ Risk Assessment</h3>
                <p>Evaluate planning constraints, flood risk, and environmental factors</p>
              </div>
              <div className="feature">
                <h3>🌍 Global Ready</h3>
                <p>UK system ready to scale to any country worldwide</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .dashboard-header {
          background: rgba(0, 0, 0, 0.2);
          color: white;
          padding: 60px 20px;
          text-align: center;
        }

        .dashboard-header h1 {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .dashboard-header p {
          font-size: 20px;
          opacity: 0.9;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .dashboard-content {
          padding: 60px 20px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 60px;
        }

        .stat-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .stat-number {
          font-size: 48px;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 10px;
        }

        .stat-label {
          font-size: 16px;
          color: #666;
        }

        .action-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 60px;
        }

        .action-card {
          display: block;
          padding: 40px;
          border-radius: 12px;
          text-decoration: none;
          color: white;
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: pointer;
        }

        .action-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .action-card.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .action-card.secondary {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .action-card h2 {
          font-size: 28px;
          margin-bottom: 10px;
        }

        .action-card p {
          font-size: 16px;
          opacity: 0.9;
        }

        .features {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .features h2 {
          font-size: 32px;
          margin-bottom: 30px;
          color: var(--dark);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .feature {
          padding: 20px;
          border-left: 4px solid var(--primary);
        }

        .feature h3 {
          font-size: 20px;
          margin-bottom: 10px;
          color: var(--dark);
        }

        .feature p {
          color: #666;
          line-height: 1.6;
        }
      `}</style>
    </div>
  )
}
