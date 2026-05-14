import { useState } from 'react'
import { Link } from 'wouter'

export default function Reports() {
  const [reports] = useState([
    {
      id: 1,
      title: 'Manchester City Centre Development Site',
      date: '2026-05-07',
      type: 'Feasibility Analysis',
      status: 'completed',
      gdv: 12500000
    },
    {
      id: 2,
      title: 'Liverpool Waterfront Opportunity',
      date: '2026-05-06',
      type: 'Market Analysis',
      status: 'completed',
      gdv: 8750000
    },
    {
      id: 3,
      title: 'Birmingham City Centre Mixed Use',
      date: '2026-05-05',
      type: 'Development Report',
      status: 'completed',
      gdv: 15000000
    }
  ])

  return (
    <div className="reports-page">
      <header className="reports-header">
        <Link href="/" className="back-link">← Back to Dashboard</Link>
        <h1>Generated Reports</h1>
        <p>Access and manage all feasibility and market analysis reports</p>
      </header>

      <main className="reports-content">
        <div className="container">
          <div className="reports-toolbar">
            <button className="btn-generate">+ Generate New Report</button>
            <div className="filters">
              <select>
                <option>All Types</option>
                <option>Feasibility Analysis</option>
                <option>Market Analysis</option>
                <option>Development Report</option>
              </select>
              <select>
                <option>All Status</option>
                <option>Completed</option>
                <option>In Progress</option>
              </select>
            </div>
          </div>

          <div className="reports-grid">
            {reports.map((report) => (
              <div key={report.id} className="report-card">
                <div className="report-header">
                  <h3>{report.title}</h3>
                  <span className={`status ${report.status}`}>{report.status}</span>
                </div>
                <div className="report-meta">
                  <span className="type">{report.type}</span>
                  <span className="date">{new Date(report.date).toLocaleDateString()}</span>
                </div>
                <div className="report-gdv">
                  <label>Gross Development Value</label>
                  <value>£{(report.gdv / 1000000).toFixed(1)}m</value>
                </div>
                <div className="report-actions">
                  <button className="btn-view">View Report</button>
                  <button className="btn-download">Download PDF</button>
                </div>
              </div>
            ))}
          </div>

          {reports.length === 0 && (
            <div className="empty-state">
              <p>No reports generated yet</p>
              <Link href="/search" className="btn-create">Start Searching for Land</Link>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .reports-page {
          min-height: 100vh;
          background: #f5f5f5;
        }

        .reports-header {
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

        .reports-header h1 {
          font-size: 36px;
          margin-bottom: 10px;
          color: var(--dark);
        }

        .reports-header p {
          color: #666;
          font-size: 16px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .reports-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .btn-generate {
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-generate:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
        }

        .filters {
          display: flex;
          gap: 12px;
        }

        .filters select {
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .report-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .report-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          gap: 10px;
        }

        .report-header h3 {
          font-size: 18px;
          color: var(--dark);
          margin: 0;
          flex: 1;
        }

        .status {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .status.completed {
          background: rgba(0, 204, 102, 0.2);
          color: var(--secondary);
        }

        .status.in-progress {
          background: rgba(255, 170, 0, 0.2);
          color: var(--warning);
        }

        .report-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }

        .type {
          color: var(--primary);
          font-size: 13px;
          font-weight: 600;
        }

        .date {
          color: #999;
          font-size: 13px;
        }

        .report-gdv {
          margin-bottom: 20px;
        }

        .report-gdv label {
          display: block;
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .report-gdv value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: var(--secondary);
        }

        .report-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .btn-view,
        .btn-download {
          padding: 10px 15px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-view {
          background: var(--primary);
          color: white;
        }

        .btn-view:hover {
          background: #0052a3;
        }

        .btn-download {
          background: #f0f0f0;
          color: var(--dark);
          border: 1px solid #ddd;
        }

        .btn-download:hover {
          background: #e0e0e0;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
        }

        .empty-state p {
          font-size: 18px;
          color: #666;
          margin-bottom: 20px;
        }

        .btn-create {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-create:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .reports-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-generate {
            width: 100%;
          }

          .filters {
            flex-direction: column;
          }

          .filters select {
            width: 100%;
          }

          .reports-grid {
            grid-template-columns: 1fr;
          }

          .report-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
