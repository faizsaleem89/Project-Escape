import { useState, useEffect } from 'react'
import { Link, useParams } from 'wouter'

export default function PropertyDetail() {
  const params = useParams()
  const [property, setProperty] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate property data
    setProperty({
      id: params.id,
      address: 'Example Development Site',
      location: 'Manchester City Centre',
      size: 1.5,
      price: 750000,
      coordinates: [53.4808, -2.2426],
      description: 'Prime development site in Manchester city centre with excellent transport links and planning potential.'
    })

    // Simulate analysis
    setAnalysis({
      developmentPotential: {
        residentialUnits: 45,
        commercialSpace: 5000,
        gdv: 12500000,
        buildCost: 7500000,
        profit: 5000000,
        timeline: '24 months'
      },
      riskFactors: {
        floodRisk: 'Low',
        conservationArea: false,
        listedBuildings: false,
        greenBelt: false
      },
      competitiveOpportunities: [
        'Undervalued compared to recent sales',
        'Planning approval likely within 6 months',
        'High demand for residential in area',
        'Limited competing developments'
      ]
    })

    setLoading(false)
  }, [params.id])

  if (loading) {
    return <div className="loading">Loading property details...</div>
  }

  if (!property) {
    return <div className="error">Property not found</div>
  }

  return (
    <div className="property-detail">
      <header className="detail-header">
        <Link href="/search" className="back-link">← Back to Search</Link>
        <h1>{property.address}</h1>
        <p>{property.location}</p>
      </header>

      <main className="detail-content">
        <div className="container">
          <div className="detail-grid">
            <section className="property-info">
              <h2>Property Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Land Size</label>
                  <value>{property.size} acres</value>
                </div>
                <div className="info-item">
                  <label>Price</label>
                  <value>£{(property.price / 1000000).toFixed(2)}m</value>
                </div>
                <div className="info-item">
                  <label>Location</label>
                  <value>{property.location}</value>
                </div>
              </div>
              <p className="description">{property.description}</p>
            </section>

            {analysis && (
              <>
                <section className="development-analysis">
                  <h2>Development Potential</h2>
                  <div className="analysis-grid">
                    <div className="analysis-item">
                      <label>Residential Units</label>
                      <value>{analysis.developmentPotential.residentialUnits}</value>
                    </div>
                    <div className="analysis-item">
                      <label>Commercial Space</label>
                      <value>{analysis.developmentPotential.commercialSpace.toLocaleString()} sq ft</value>
                    </div>
                    <div className="analysis-item">
                      <label>Gross Development Value</label>
                      <value>£{(analysis.developmentPotential.gdv / 1000000).toFixed(1)}m</value>
                    </div>
                    <div className="analysis-item">
                      <label>Build Cost</label>
                      <value>£{(analysis.developmentPotential.buildCost / 1000000).toFixed(1)}m</value>
                    </div>
                    <div className="analysis-item highlight">
                      <label>Profit Potential</label>
                      <value>£{(analysis.developmentPotential.profit / 1000000).toFixed(1)}m</value>
                    </div>
                    <div className="analysis-item">
                      <label>Timeline</label>
                      <value>{analysis.developmentPotential.timeline}</value>
                    </div>
                  </div>
                </section>

                <section className="risk-assessment">
                  <h2>Risk Assessment</h2>
                  <div className="risk-grid">
                    <div className="risk-item">
                      <label>Flood Risk</label>
                      <badge className={analysis.riskFactors.floodRisk.toLowerCase()}>
                        {analysis.riskFactors.floodRisk}
                      </badge>
                    </div>
                    <div className="risk-item">
                      <label>Conservation Area</label>
                      <badge className={analysis.riskFactors.conservationArea ? 'yes' : 'no'}>
                        {analysis.riskFactors.conservationArea ? 'Yes' : 'No'}
                      </badge>
                    </div>
                    <div className="risk-item">
                      <label>Listed Buildings</label>
                      <badge className={analysis.riskFactors.listedBuildings ? 'yes' : 'no'}>
                        {analysis.riskFactors.listedBuildings ? 'Yes' : 'No'}
                      </badge>
                    </div>
                    <div className="risk-item">
                      <label>Green Belt</label>
                      <badge className={analysis.riskFactors.greenBelt ? 'yes' : 'no'}>
                        {analysis.riskFactors.greenBelt ? 'Yes' : 'No'}
                      </badge>
                    </div>
                  </div>
                </section>

                <section className="opportunities">
                  <h2>Competitive Opportunities</h2>
                  <ul className="opportunities-list">
                    {analysis.competitiveOpportunities.map((opp, idx) => (
                      <li key={idx}>{opp}</li>
                    ))}
                  </ul>
                </section>
              </>
            )}
          </div>

          <div className="action-buttons">
            <button className="btn-primary">Generate Full Report</button>
            <button className="btn-secondary">Save Property</button>
          </div>
        </div>
      </main>

      <style jsx>{`
        .property-detail {
          min-height: 100vh;
          background: #f5f5f5;
        }

        .detail-header {
          background: white;
          padding: 40px 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .back-link {
          display: inline-block;
          color: var(--primary);
          text-decoration: none;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .detail-header h1 {
          font-size: 36px;
          margin-bottom: 10px;
          color: var(--dark);
        }

        .detail-header p {
          color: #666;
          font-size: 16px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }

        section {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        section h2 {
          font-size: 24px;
          margin-bottom: 20px;
          color: var(--dark);
        }

        .info-grid,
        .analysis-grid,
        .risk-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .info-item,
        .analysis-item,
        .risk-item {
          padding: 15px;
          background: #f9f9f9;
          border-radius: 8px;
          border-left: 4px solid var(--primary);
        }

        .analysis-item.highlight {
          border-left-color: var(--secondary);
          background: rgba(0, 204, 102, 0.05);
        }

        .info-item label,
        .analysis-item label,
        .risk-item label {
          display: block;
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .info-item value,
        .analysis-item value {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: var(--dark);
        }

        .analysis-item.highlight value {
          color: var(--secondary);
        }

        .description {
          color: #666;
          line-height: 1.6;
          margin-top: 15px;
        }

        badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        badge.low {
          background: rgba(0, 204, 102, 0.2);
          color: var(--secondary);
        }

        badge.high {
          background: rgba(204, 0, 0, 0.2);
          color: var(--danger);
        }

        badge.no {
          background: rgba(0, 204, 102, 0.2);
          color: var(--secondary);
        }

        badge.yes {
          background: rgba(255, 170, 0, 0.2);
          color: var(--warning);
        }

        .opportunities-list {
          list-style: none;
          padding: 0;
        }

        .opportunities-list li {
          padding: 12px 0;
          padding-left: 24px;
          position: relative;
          color: #666;
          line-height: 1.6;
        }

        .opportunities-list li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--secondary);
          font-weight: 700;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .btn-primary,
        .btn-secondary {
          padding: 14px 28px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: white;
          color: var(--primary);
          border: 2px solid var(--primary);
        }

        .btn-secondary:hover {
          background: var(--primary);
          color: white;
        }

        .loading,
        .error {
          padding: 40px;
          text-align: center;
          font-size: 18px;
          color: #666;
        }

        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }

          .detail-header h1 {
            font-size: 24px;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
