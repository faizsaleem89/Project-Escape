# Sterling Global Intelligence - User Guide

**Live Dashboard:** https://3000-ib0cjqxs8dd6zdfu8bdtu-e0a53cdc.us2.manus.computer

---

## What Is Sterling Global Intelligence?

Sterling Global Intelligence is a **real-time supply chain tracking platform**. Think of it like a database where you can search and monitor:
- Where ships are right now (live positions)
- How busy ports are
- What risks exist in different regions
- How likely disruptions are

---

## The 13 Tabs Explained

### 1. **Overview** (Dashboard Summary)
**What you see:** Key metrics at a glance
- Active Shipments: Number of shipments being tracked
- Global Risk Level: How many high-risk regions exist
- Predicted Disruptions: Number of potential problems
- Avg Risk Score: Overall supply chain health (0-10 scale)

**How to use it:** Start here to get a quick health check of your supply chain.

---

### 2. **Tracking** (Shipment Tracking)
**What you see:** Track individual shipments in real-time
- Enter a Shipment ID (e.g., SHIP001)
- Enter container number
- Enter origin port (e.g., Shanghai)
- Enter destination port (e.g., Rotterdam)
- Click "Track Shipment"

**Result:** You'll see:
- Current location (latitude/longitude)
- Progress percentage
- Current status
- Estimated arrival time

**How to use it:** Use this when you need to track a specific shipment from pickup to delivery.

---

### 3. **Risks** (Geopolitical Risk Assessment)
**What you see:** 5 global risk regions with details
- **Region name** (e.g., Middle East, Eastern Europe)
- **Risk score** (0-10 scale, higher = more dangerous)
- **Risk level** (Low, Medium, High, Critical)
- **Affected countries** (which countries have problems)
- **Impact** (how it affects shipping)
- **Affected routes** (which shipping lanes are impacted)
- **Recent events** (what happened recently)

**How to use it:** Check this before shipping through a region. High-risk regions mean:
- Longer delays
- Higher insurance costs
- Need for special permits

---

### 4. **Ports** (Port Operations - Currently Showing)
**What you see:** 10 major ports worldwide with real-time data

For each port, you see:
- **Port name & code** (e.g., Shanghai - CNSHA)
- **Status** (Operational, Restricted, Closed)
- **Utilization %** (How full is the port? 87% = very busy)
- **Congestion level** (Low, Medium, High, Very High)
- **Avg Wait Time** (How long ships wait in queue)
- **Recent Issues** (What problems are happening)

**Example:**
- Shanghai: 87% full, 3.5 day wait, Issues: Weather + High volume
- Singapore: 91% full (busiest), 4.2 day wait, Issues: High volume + Vessel queuing
- Rotterdam: 72% full, 2.1 day wait, Issues: None

**How to use it:** Before shipping, check port status:
- If utilization > 85%, expect delays
- If wait time > 3 days, consider alternative ports
- Check "Recent Issues" for problems

---

### 5. **Disruptions** (Disruption Prediction)
**What you see:** AI predictions of potential supply chain problems

Enter:
- Shipment ID
- Route (e.g., Shanghai-Rotterdam)
- Origin port
- Destination port

**Result:** You'll see:
- Disruption probability (0-100%)
- Type of disruption (weather, port issue, geopolitical, etc.)
- Severity (Low, Medium, High)
- Recommended actions

**How to use it:** Use this to predict problems before they happen. If probability > 60%, take preventive action.

---

### 6. **Scoring** (Risk Scoring for Insurance)
**What you see:** Calculate risk score for any shipment

Enter:
- Shipment ID
- Origin port
- Destination port
- Cargo value ($)
- Commodity type (Electronics, Chemicals, Food, etc.)

**Result:** You'll get:
- **Overall Risk Score** (0-10, lower = safer)
- **Risk Tier** (LOW, MEDIUM, HIGH, CRITICAL)
- **Component breakdown:**
  - Geopolitical risk
  - Route risk
  - Commodity risk
  - Value risk
  - Time risk
- **Insurance recommendation** (type and premium %)
- **Action items** (what to do)

**Example:**
- Shanghai → Rotterdam, $500K Electronics = Risk 2.5/10 (LOW)
- Insurance: Basic all-risk, 0.3-0.8% premium
- Action: Proceed normally

**How to use it:** Use this before shipping to:
1. Understand the risk
2. Get insurance quotes
3. Decide if the route is acceptable

---

### 7. **Map** (Global Supply Chain Visualization)
**What you see:** Interactive world map showing:
- All 10 major ports (marked with icons)
- Live shipment routes (lines connecting ports)
- Current vessel positions (dots on the map)
- Active shipment details (click to see info)

**How to use it:** Visual overview of your entire supply chain. See where everything is at a glance.

---

### 8. **Analytics** (Charts & Metrics)
**What you see:** Visual charts showing:
- **Risk by Region** (bar chart) - which regions are most dangerous
- **Port Utilization Trends** (line chart) - how busy ports are over time
- **Risk Distribution** (pie chart) - breakdown of risk types
- **Key Metrics** - summary statistics

**How to use it:** Identify trends and patterns:
- Which regions are getting riskier?
- Which ports are getting busier?
- What's the overall risk trend?

---

### 9. **Search** (Advanced Search & Filtering)
**What you see:** Search and filter all data

You can search by:
- Shipment ID
- Port name
- Risk region
- Vessel name

You can filter by:
- Risk level (Low, Medium, High, Critical)
- Status (Active, Delayed, Completed)
- Origin port
- Destination port

**How to use it:** Find specific shipments or data quickly. Like using a database search.

---

### 10. **Alerts** (Real-Time Notifications)
**What you see:** Active alerts and warnings

Alerts show:
- **Alert type** (Risk, Disruption, Delay, etc.)
- **Severity** (color-coded: green=low, yellow=medium, red=high)
- **Description** (what's happening)
- **Affected shipments** (which shipments are impacted)
- **Recommended action** (what to do)

**How to use it:** Monitor for problems in real-time. Dismiss alerts once you've taken action.

---

### 11. **KPIs** (Supply Chain Performance)
**What you see:** Key Performance Indicators

Metrics include:
- **Avg Risk Score** (0-10, lower is better)
- **On-Time Delivery Rate** (%, higher is better)
- **Port Utilization** (%, lower is better for speed)
- **Cost Savings** (%, from optimizations)
- **24-Hour Activity** (shipments moved)
- **Port Efficiency** (throughput per hour)

**How to use it:** Track performance over time. Identify where improvements are needed.

---

### 12. **Vessels** (Real-Time Vessel Tracking - Phase 1)
**What you see:** Live AIS data from active vessels

For each vessel, you see:
- **Vessel name** (e.g., EVERGREEN EVER)
- **MMSI** (unique identifier)
- **Current position** (latitude, longitude)
- **Speed** (knots)
- **Course** (direction in degrees)
- **Destination** (where it's going)
- **ETA** (estimated time of arrival)
- **Status** (Under way, Anchored, etc.)

**Click on a vessel** to see detailed information:
- Vessel type (Container Ship, Tanker, etc.)
- IMO number
- Length, beam, draft
- Call sign
- Route details

**How to use it:** Track specific vessels in real-time. See exactly where your cargo is.

---

### 13. **Overview** (Tab 1 - Summary)
Already explained above.

---

## Quick Start Guide

### Scenario 1: "I want to track a shipment"
1. Go to **Tracking** tab
2. Enter shipment details (ID, origin, destination)
3. Click "Track Shipment"
4. See live location and progress

### Scenario 2: "Is it safe to ship through the Middle East?"
1. Go to **Risks** tab
2. Look for "Middle East" region
3. Check risk score and affected routes
4. Read recent events

### Scenario 3: "Which port should I use?"
1. Go to **Ports** tab
2. Compare utilization % and wait times
3. Check recent issues
4. Choose port with lowest utilization

### Scenario 4: "Should I insure this shipment?"
1. Go to **Scoring** tab
2. Enter shipment details
3. Get risk score and insurance recommendation
4. Decide based on risk tier

### Scenario 5: "Are there any problems right now?"
1. Go to **Alerts** tab
2. See all active alerts
3. Check severity and affected shipments
4. Take recommended action

---

## Data Sources (Phase 1 - Real-Time)

All data is updated every 30 seconds:

| Data Type | Source | Cost |
|-----------|--------|------|
| Vessel Positions | AIS (Automatic Identification System) | Free |
| Weather | OpenWeatherMap | Free |
| Geopolitical Risks | ACLED (Armed Conflict Location & Event Data) | Free |
| Port Operations | Public Port Authority APIs | Free |
| **Total Monthly Cost** | | **$0** |

---

## Tips for Success

1. **Check Ports before shipping** - High utilization = delays
2. **Monitor Risks** - Avoid high-risk regions if possible
3. **Use Scoring** - Get insurance before shipping
4. **Watch Alerts** - React quickly to problems
5. **Track Vessels** - Know where your cargo is in real-time
6. **Review KPIs** - Improve performance over time

---

## Need Help?

- **Live Dashboard:** https://3000-ib0cjqxs8dd6zdfu8bdtu-e0a53cdc.us2.manus.computer
- **API Documentation:** Available on request
- **Support:** Contact your account manager

---

**Sterling Global Intelligence - Your Real-Time Supply Chain Command Center**
