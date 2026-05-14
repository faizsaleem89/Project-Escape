-- Sterling Estate Intelligence Database Schema

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address VARCHAR(255) NOT NULL,
  postcode VARCHAR(10),
  county VARCHAR(100),
  region VARCHAR(100),
  land_size_acres DECIMAL(10, 2),
  price DECIMAL(15, 2),
  location GEOGRAPHY(POINT, 4326),
  description TEXT,
  source VARCHAR(100),
  source_id VARCHAR(255) UNIQUE,
  planning_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_properties_location ON properties USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_properties_postcode ON properties (postcode);
CREATE INDEX IF NOT EXISTS idx_properties_county ON properties (county);
CREATE INDEX IF NOT EXISTS idx_properties_planning_status ON properties (planning_status);

-- Development analysis table
CREATE TABLE IF NOT EXISTS development_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  residential_units INTEGER,
  commercial_space_sqft INTEGER,
  gdv DECIMAL(15, 2),
  build_cost DECIMAL(15, 2),
  profit_potential DECIMAL(15, 2),
  timeline_months INTEGER,
  development_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analysis_property ON development_analysis (property_id);

-- Risk assessment table
CREATE TABLE IF NOT EXISTS risk_assessment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  flood_risk VARCHAR(20),
  conservation_area BOOLEAN DEFAULT FALSE,
  listed_buildings BOOLEAN DEFAULT FALSE,
  green_belt BOOLEAN DEFAULT FALSE,
  article_4_direction BOOLEAN DEFAULT FALSE,
  environmental_designation VARCHAR(100),
  planning_history TEXT,
  risk_score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_risk_property ON risk_assessment (property_id);

-- Planning applications table
CREATE TABLE IF NOT EXISTS planning_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  application_reference VARCHAR(100) UNIQUE,
  description TEXT,
  status VARCHAR(50),
  application_date DATE,
  decision_date DATE,
  decision VARCHAR(50),
  applicant_name VARCHAR(255),
  source VARCHAR(100),
  source_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_planning_property ON planning_applications (property_id);
CREATE INDEX IF NOT EXISTS idx_planning_status ON planning_applications (status);

-- Market data table
CREATE TABLE IF NOT EXISTS market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  postcode VARCHAR(10),
  county VARCHAR(100),
  average_price DECIMAL(15, 2),
  price_per_sqft DECIMAL(10, 2),
  rental_yield DECIMAL(5, 2),
  demand_score INTEGER,
  growth_rate DECIMAL(5, 2),
  data_date DATE,
  source VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_market_postcode ON market_data (postcode);
CREATE INDEX IF NOT EXISTS idx_market_county ON market_data (county);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  report_type VARCHAR(50),
  title VARCHAR(255),
  content TEXT,
  gdv DECIMAL(15, 2),
  profit_potential DECIMAL(15, 2),
  recommendations TEXT,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reports_property ON reports (property_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports (report_type);

-- Data sync log table
CREATE TABLE IF NOT EXISTS data_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(100),
  sync_type VARCHAR(50),
  records_processed INTEGER,
  records_added INTEGER,
  records_updated INTEGER,
  errors TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  status VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_sync_source ON data_sync_log (source);
CREATE INDEX IF NOT EXISTS idx_sync_status ON data_sync_log (status);
