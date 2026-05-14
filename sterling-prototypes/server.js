const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8888;

const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sterling Intelligence Group - Division Prototypes</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #fff;
      min-height: 100vh;
      padding: 40px 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { font-size: 3em; margin-bottom: 10px; text-align: center; }
    .subtitle { text-align: center; color: #94a3b8; margin-bottom: 50px; font-size: 1.2em; }
    
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; }
    
    .card {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8));
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 12px;
      padding: 30px;
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 200px;
    }
    
    .card:hover {
      border-color: rgba(148, 163, 184, 0.5);
      background: linear-gradient(135deg, rgba(30, 41, 59, 1), rgba(15, 23, 42, 1));
      transform: translateY(-5px);
    }
    
    .card-title { font-size: 1.5em; font-weight: 700; margin-bottom: 10px; }
    .card-description { color: #cbd5e1; font-size: 0.95em; line-height: 1.6; margin-bottom: 20px; flex-grow: 1; }
    
    .card-button {
      background: #3b82f6;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
      text-align: center;
      text-decoration: none;
      display: inline-block;
    }
    
    .card-button:hover { background: #2563eb; }
    
    .lexis { border-left: 4px solid #8b5cf6; }
    .cyber { border-left: 4px solid #3b82f6; }
    .revenue { border-left: 4px solid #10b981; }
    .estate { border-left: 4px solid #d97706; }
    .global { border-left: 4px solid #0ea5e9; }
    .private { border-left: 4px solid #a855f7; }
    .trade { border-left: 4px solid #059669; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Sterling Intelligence Group</h1>
    <p class="subtitle">Seven AI-Powered Business Divisions - Live Prototypes</p>
    
    <div class="grid">
      <a href="/cyber-governance" class="card cyber">
        <div>
          <div class="card-title">Cyber Governance</div>
          <div class="card-description">AI Risk Audit & Shadow AI Detection. Identify unauthorized AI tool usage and data exposure risks.</div>
        </div>
        <button class="card-button">Open Prototype →</button>
      </a>
      
      <a href="/revenue-recovery" class="card revenue">
        <div>
          <div class="card-title">Revenue Recovery</div>
          <div class="card-description">Billing Audit & Lost Revenue Recovery. Identify unbilled time and billing gaps worth 5-15% of revenue.</div>
        </div>
        <button class="card-button">Open Prototype →</button>
      </a>
      
      <a href="/estate-intelligence" class="card estate">
        <div>
          <div class="card-title">Estate Intelligence</div>
          <div class="card-description">Property Market Analysis & Investment Intelligence. Analyze market growth, rental yield, and investment potential.</div>
        </div>
        <button class="card-button">Open Prototype →</button>
      </a>
      
      <a href="/global-intelligence" class="card global">
        <div>
          <div class="card-title">Global Intelligence</div>
          <div class="card-description">Supply Chain & Market Risk Analysis. Assess geopolitical risks, currency volatility, and market opportunities.</div>
        </div>
        <button class="card-button">Open Prototype →</button>
      </a>
      
      <a href="/private-office" class="card private">
        <div>
          <div class="card-title">Private Office</div>
          <div class="card-description">Bespoke Wealth Management & Family Office Services. Portfolio allocation, tax optimization, estate planning.</div>
        </div>
        <button class="card-button">Open Prototype →</button>
      </a>
      
      <a href="/trade-growth" class="card trade">
        <div>
          <div class="card-title">Trade Growth Studio</div>
          <div class="card-description">Export Strategy & International Market Expansion. Identify target markets and growth opportunities.</div>
        </div>
        <button class="card-button">Open Prototype →</button>
      </a>
    </div>
  </div>
</body>
</html>
`;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(dashboardHTML);
    return;
  }

  // Route to each division
  const routes = {
    '/cyber-governance': './cyber-governance/index.html',
    '/revenue-recovery': './revenue-recovery/index.html',
    '/estate-intelligence': './estate-intelligence/index.html',
    '/global-intelligence': './global-intelligence/index.html',
    '/private-office': './private-office/index.html',
    '/trade-growth': './trade-growth/index.html'
  };

  const cleanUrl = req.url.split('?')[0];
  const filePath = routes[cleanUrl];

  if (filePath) {
    fs.readFile(path.join(__dirname, filePath), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Sterling Intelligence Group Dashboard running at http://localhost:${PORT}`);
});
