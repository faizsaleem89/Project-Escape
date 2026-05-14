import { useState } from 'react'
import { Link } from 'wouter'

export default function Search() {
  const [searchParams, setSearchParams] = useState({
    location: '',
    landSize: '1-2',
    budget: '500000',
    developmentType: 'residential'
  })

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams)
      })
      const data = await response.json()
      
      // Extract results array from API response
      if (data.results && Array.isArray(data.results)) {
        setResults(data.results)
      } else if (Array.isArray(data)) {
        setResults(data)
      } else {
        setResults([])
        setError('No results found')
      }
    } catch (error) {
      console.error('Search error:', error)
      setError('Search failed. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="search-page">
      <header className="search-header">
        <Link href="/" className="back-link">← Back to Dashboard</Link>
        <h1>Search Development Land</h1>
        <p>Find prime development opportunities across the UK</p>
      </header>

      <main className="search-content">
        <div className="container">
          <div className="search-form-container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="form-group">
                <label>Location (Postcode, City, or County)</label>
                <input
                  type="text"
                  placeholder="e.g., Manchester, M1 1AA, Greater Manchester"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Land Size (Acres)</label>
                  <select
                    value={searchParams.landSize}
                    onChange={(e) => setSearchParams({...searchParams, landSize: e.target.value})}
                  >
                    <option value="0.5-1">0.5 - 1 acre</option>
                    <option value="1-2">1 - 2 acres</option>
                    <option value="2-5">2 - 5 acres</option>
                    <option value="5-10">5 - 10 acres</option>
                    <option value="10+">10+ acres</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Budget (£)</label>
                  <input
                    type="number"
                    placeholder="e.g., 500000"
                    value={searchParams.budget}
                    onChange={(e) => setSearchParams({...searchParams, budget: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Development Type</label>
                <select
                  value={searchParams.developmentType}
                  onChange={(e) => setSearchParams({...searchParams, developmentType: e.target.value})}
                >
                  <option value="residential">Residential (Houses)</option>
                  <option value="commercial">Commercial (Shops, Offices)</option>
                  <option value="mixed">Mixed Use</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="search-button">
                {loading ? 'Searching...' : 'Search Land'}
              </button>
            </form>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {results.length > 0 && (
            <div className="results-container">
              <h2>Search Results ({results.length} opportunities found)</h2>
              <div className="results-grid">
                {results.map((result, idx) => (
                  <Link key={result.id || idx} href={`/property/${result.id || idx}`} className="result-card">
                    <h3>{result.address}</h3>
                    <p className="location">{result.location}</p>
                    <div className="metrics">
                      <span className="metric">
                        <strong>{parseFloat(result.size).toFixed(2)}</strong> acres
                      </span>
                      <span className="metric">
                        £<strong>{(parseFloat(result.price) / 1000).toFixed(0)}k</strong>
                      </span>
                      <span className="metric">
                        GDV: £<strong>{(parseFloat(result.gdv) / 1000000).toFixed(1)}m</strong>
                      </span>
                    </div>
                    <div className="profit-section">
                      <p className="profit-potential">
                        Profit Potential: £<strong>{(parseFloat(result.profitPotential) / 1000000).toFixed(2)}m</strong>
                      </p>
                      <p className="risk-score">
                        Risk Score: <strong>{result.riskScore}</strong>/100
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!loading && results.length === 0 && !error && (
            <div className="no-results">
              <p>Enter your search criteria and click "Search Land" to find development opportunities</p>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .search-page {
          min-height: 100vh;
          background: #f5f5f5;
        }

        .search-header {
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

        .search-header h1 {
          font-size: 36px;
          margin-bottom: 10px;
          color: var(--dark);
        }

        .search-header p {
          color: #666;
          font-size: 16px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .search-form-container {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 40px;
        }

        .search-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--dark);
        }

        .form-group input,
        .form-group select {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .search-button {
          padding: 14px 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .search-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
        }

        .search-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          background: #fee;
          color: #c33;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #c33;
        }

        .results-container {
          margin-top: 40px;
        }

        .results-container h2 {
          font-size: 28px;
          margin-bottom: 20px;
          color: var(--dark);
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .result-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
          border-left: 4px solid var(--primary);
        }

        .result-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .result-card h3 {
          font-size: 18px;
          margin-bottom: 8px;
          color: var(--dark);
        }

        .result-card .location {
          color: #666;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .metrics {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #eee;
        }

        .metric {
          color: #666;
          font-size: 13px;
        }

        .metric strong {
          color: var(--primary);
          font-size: 14px;
        }

        .profit-section {
          margin-top: 12px;
        }

        .profit-potential {
          color: #2d5016;
          font-size: 14px;
          font-weight: 500;
          margin: 4px 0;
        }

        .profit-potential strong {
          color: #4caf50;
          font-size: 15px;
        }

        .risk-score {
          color: #666;
          font-size: 13px;
          margin: 4px 0;
        }

        .risk-score strong {
          color: var(--primary);
        }

        .no-results {
          background: white;
          padding: 40px;
          border-radius: 8px;
          text-align: center;
          color: #666;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .search-header h1 {
            font-size: 24px;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
