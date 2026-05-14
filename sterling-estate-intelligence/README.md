# Sterling Estate Intelligence

**Global Land Development Intelligence Platform**

A production-ready system for identifying, analyzing, and evaluating development opportunities across the UK and worldwide.

## Overview

Sterling Estate Intelligence is a comprehensive land development platform that combines real-time data from multiple sources to provide actionable intelligence for property developers, investors, and consultants.

**Key Features:**
- Interactive UK-wide mapping of available development land
- Real-time search and filtering by location, size, and budget
- Development potential analysis (units, GDV, build costs, profit)
- Competitive opportunity identification
- Risk assessment (flood zones, conservation areas, planning constraints)
- Comprehensive feasibility reports
- Global-ready architecture for worldwide expansion

## Technology Stack

**Frontend:**
- React 19 + Vite
- Tailwind CSS 4
- Mapbox GL JS (mapping)
- Wouter (routing)
- Zustand (state management)

**Backend:**
- Node.js + Express
- PostgreSQL with PostGIS (spatial data)
- Redis (caching)
- Bull (job queue)

**Data Sources:**
- Planning Data API (planning.data.gov.uk)
- PlanAPI (all 384 UK councils)
- PropertyData API (68+ endpoints)
- Land Registry data
- Council planning records

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Redis 6+

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and database credentials

# Run migrations
npm run migrate

# Start development server
npm run dev
```

### Development

```bash
# Start both server and client
npm run dev

# Or run separately:
npm run dev:server  # Terminal 1
npm run dev:client  # Terminal 2

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
sterling-estate-intelligence/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── App.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── index.html
├── server/                    # Express backend
│   ├── index.js              # Main server file
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   └── models/               # Data models
├── package.json
├── .env
└── README.md
```

## API Endpoints

### Health Check
- `GET /api/health` - System status

### Search
- `POST /api/search` - Search for development land
  ```json
  {
    "location": "Manchester",
    "landSize": "1-2",
    "budget": "500000",
    "developmentType": "residential"
  }
  ```

### Analysis
- `POST /api/analyze` - Analyze property development potential
  ```json
  {
    "propertyId": "123"
  }
  ```

### Reports
- `POST /api/report` - Generate feasibility report
  ```json
  {
    "propertyId": "123",
    "reportType": "feasibility"
  }
  ```

## Data Integration

### Planning Data API
Provides 100+ planning datasets for England including:
- Brownfield land
- Conservation areas
- Listed buildings
- Flood risk zones
- Planning applications

### PlanAPI
Real-time planning applications from all 384 UK councils with:
- Daily updates from council portals
- Spatial search capabilities
- Webhooks for new applications
- Consistent JSON format

### PropertyData API
68+ endpoints covering:
- Property titles and ownership
- Valuations and market prices
- Planning applications
- Development calculators
- Constraint data

## Configuration

### Environment Variables

```env
# API Keys
PLANNING_DATA_API_KEY=xxx
PLANAPI_KEY=xxx
PROPERTYDATA_KEY=xxx
VITE_MAPBOX_TOKEN=xxx

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sterling_estate_intelligence
DB_USER=postgres
DB_PASSWORD=postgres

# Redis
REDIS_URL=redis://localhost:6379

# Server
NODE_ENV=development
PORT=3000
```

## Usage Examples

### Search for Development Land

```javascript
const response = await fetch('/api/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'Manchester City Centre',
    landSize: '1-2',
    budget: '500000',
    developmentType: 'residential'
  })
})
const results = await response.json()
```

### Analyze Property Development Potential

```javascript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    propertyId: '12345'
  })
})
const analysis = await response.json()
```

### Generate Feasibility Report

```javascript
const response = await fetch('/api/report', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    propertyId: '12345',
    reportType: 'feasibility'
  })
})
const report = await response.json()
```

## Roadmap

### Phase 1: UK (Current)
- Complete UK coverage with all data sources
- Interactive mapping and search
- Development analysis engine
- Report generation

### Phase 2: Europe
- France (Cadastre)
- Germany (Grundbuch)
- Spain (Catastro)
- Netherlands (Kadaster)

### Phase 3: Global
- USA (County assessor records)
- Canada (Provincial registries)
- Asia-Pacific (Australia, Singapore, Hong Kong)
- Emerging markets (UAE, India)

## Performance

- Search response time: <1 second
- Report generation: <5 minutes
- Map rendering: Real-time
- Data update frequency: Daily

## Security

- API authentication via keys
- HTTPS only
- Rate limiting
- SQL injection prevention
- CORS configured
- Environment variables for secrets

## Support

For issues, feature requests, or questions:
- Create an issue in the repository
- Contact: support@sterlingintelligence.com

## License

Proprietary - Sterling Intelligence Group

## Version

1.0.0 - May 2026
