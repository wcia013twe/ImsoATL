# Multi-Agent WiFi Planning Assistant - Setup Guide

This document provides instructions for setting up and running the multi-agent WiFi planning assistant.

## Overview

The system uses a **FastAPI backend** with specialized agents that analyze Census demographics, FCC broadband coverage, and civic asset data to provide transparent, data-driven WiFi deployment recommendations.

### Architecture

- **Frontend**: Next.js 16 (TypeScript, React 19, Tailwind CSS v4)
- **Backend**: FastAPI (Python) with WebSocket streaming
- **AI**: Google Gemini 2.0 Flash for natural language explanations
- **Data Sources**: Census ACS API, FCC broadband data (mock), Civic assets (mock)

### Agent Workflow

1. **Query Parser** - Analyzes user intent using Gemini
2. **Census Data Agent** - Fetches and scores demographic data
3. **FCC Data Agent** - Identifies broadband coverage gaps
4. **Civic Assets Agent** - Locates libraries, community centers, schools
5. **Ranking Agent** - Synthesizes all data and ranks sites
6. **Explainer Agent** - Generates human-readable reasoning

---

## Prerequisites

- **Python 3.9+**
- **Node.js 18+**
- **API Keys**:
  - Google Gemini API key
  - US Census API key
  - Mapbox API token

---

## Installation

### 1. Install Backend Dependencies

```bash
cd app/backend
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies

```bash
cd app/frontend
npm install
```

---

## Configuration

### Environment Variables

The project uses environment variables stored in `.env` (root directory) and `.env.local` (frontend).

**Root `.env`** (already configured):
```bash
GEMINI_API_KEY=AIzaSyDA2OVEUzkMeFixZrtQKhfQiw1Ivg1LqMU
MAPBOX=pk.eyJ1Ijoid2NpYTAxM3R3ZSIsImEiOiJjbWh6cGs4eTcwYzZ5MmtvZ3dwazkyanE1In0.TRUv2-43Kzchqrn57tWzKQ
CENSUS_API_KEY=d47baf1115cab9e2fda3f55db8a48eb1c802f16e
```

**Frontend `.env.local`** (already configured):
```bash
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoid2NpYTAxM3R3ZSIsImEiOiJjbWh6cGs4eTcwYzZ5MmtvZ3dwazkyanE1In0.TRUv2-43Kzchqrn57tWzKQ
```

---

## Running the Application

### Step 1: Start the Backend Server

```bash
cd app/backend
python main.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

The backend will be available at `http://localhost:8000`

### Step 2: Start the Frontend

In a new terminal:

```bash
cd app/frontend
npm run dev
```

**Expected output:**
```
   ▲ Next.js 16.0.3
   - Local:        http://localhost:3000

 ✓ Ready in 2.1s
```

### Step 3: Access the Application

1. Open browser to `http://localhost:3000`
2. Select **Atlanta** from the city dropdown
3. Click **Continue** to access the dashboard
4. Click the **chat icon** (top right) to open the AI assistant

---

## Using the Multi-Agent Assistant

### Example Queries

Try these questions to see the multi-agent system in action:

1. **"Where should we deploy WiFi for underserved students?"**
   - Analyzes student population, poverty rates, and school proximity

2. **"Which areas have the worst broadband coverage gaps?"**
   - Identifies tracts below 25/3 Mbps threshold

3. **"Show me high-poverty neighborhoods without internet access"**
   - Cross-references Census poverty and internet access data

4. **"Find the best sites near libraries and community centers"**
   - Prioritizes civic assets as anchor points

### What Happens

When you ask a question, you'll see:

1. **Real-time Agent Steps** displayed in the chat:
   ```
   🔍 Query Parser: Analyzing your question...
   📊 Census Data Agent: Fetching poverty and internet data...
   📡 FCC Data Agent: Checking broadband coverage gaps...
   🏛️ Civic Assets Agent: Locating libraries and community centers...
   ⚖️ Ranking Agent: Synthesizing data and scoring sites...
   ✨ Explainer Agent: Generating explanation...
   ```

2. **Final Recommendation** with:
   - Human-readable explanation
   - Reasoning process details
   - Data synthesis summary

3. **Map Integration**:
   - Recommended sites automatically highlighted on the map
   - Color-coded by priority (red = top priority, orange = high, blue = medium)
   - Click markers for detailed scores

---

## System Architecture

### Backend Structure

```
app/backend/
├── main.py                    # FastAPI server with WebSocket endpoint
├── requirements.txt           # Python dependencies
├── data_sources/
│   ├── census_client.py      # Census ACS API integration
│   ├── fcc_client.py         # FCC broadband data (mock)
│   └── civic_assets.py       # Civic asset locations (mock)
└── agents/
    ├── orchestrator.py        # Coordinates all agents
    ├── census_scorer.py       # Scores tracts by demographic need
    ├── fcc_filter.py          # Identifies coverage gaps
    ├── asset_locater.py       # Finds anchor site candidates
    ├── proximity_ranker.py    # Synthesizes and ranks sites
    └── explainer.py           # Generates explanations (Gemini)
```

### Frontend Structure

```
app/frontend/
├── components/
│   ├── ChatSidebar.tsx        # WebSocket chat UI with agent steps
│   ├── InteractiveMap.tsx     # Mapbox map with recommendations layer
│   └── [other components]
├── lib/
│   └── types.ts               # TypeScript types for messages
└── app/
    └── dashboard/[city]/page.tsx  # Main dashboard with chat integration
```

---

## Data Flow

1. **User** asks question in ChatSidebar
2. **WebSocket** sends message to FastAPI backend
3. **Orchestrator** coordinates specialized agents
4. Each **agent** streams progress updates via WebSocket
5. **Frontend** displays agent steps in real-time
6. **Final response** includes deployment plan
7. **Map** automatically highlights recommended sites

---

## Troubleshooting

### Backend won't start

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**:
```bash
cd app/backend
pip install -r requirements.txt
```

### WebSocket connection fails

**Error in browser console**: `WebSocket connection to 'ws://localhost:8000/ws/chat' failed`

**Solution**: Make sure the backend is running on port 8000:
```bash
cd app/backend
python main.py
```

### Census API errors

**Error**: `Census API returned error`

**Solution**: Check that `CENSUS_API_KEY` is set in root `.env` file

### Gemini API errors

**Error**: `Gemini API authentication failed`

**Solution**: Verify `GEMINI_API_KEY` in root `.env` file

---

## Development Notes

### Current Limitations

1. **FCC Data**: Currently using mock data. For production, integrate with FCC Broadband Map API or use bulk datasets.

2. **Civic Assets**: Using hardcoded Atlanta locations. For production, integrate with city open data APIs.

3. **Census Tracts**: Recommendations display as points on the map. For production, load actual tract geometries from the GeoJSON file.

4. **City Support**: Currently only Atlanta (Georgia) is supported. To add more cities, update state FIPS mapping in orchestrator.

### Future Enhancements

1. **Real FCC Data Integration**: Connect to FCC Broadband Map API
2. **Actual Tract Geometries**: Display census tracts as polygons instead of points
3. **Multi-City Support**: Add support for other US cities
4. **Cost Estimation**: Add budget constraints and cost modeling
5. **Grant Matching**: Suggest relevant federal/state grant programs

---

## API Endpoints

### Backend Endpoints

- **GET** `/` - API status check
- **GET** `/health` - Health check
- **WebSocket** `/ws/chat` - Chat endpoint for multi-agent workflow

### Message Format

**Client → Server**:
```json
{
  "message": "Where should we deploy WiFi?",
  "city": "Atlanta"
}
```

**Server → Client** (streaming):
```json
{
  "type": "agent_step",
  "agent": "📊 Census Data Agent",
  "action": "Analyzed 847 census tracts...",
  "status": "completed",
  "data": { ... }
}
```

**Final Response**:
```json
{
  "type": "final_response",
  "explanation": "Based on the analysis...",
  "deployment_plan": {
    "recommended_sites_count": 10,
    "recommended_sites": [ ... ],
    "projected_impact": { ... }
  }
}
```

---

## Testing

### Test the Backend

```bash
# Start backend
cd app/backend
python main.py

# In another terminal, test health endpoint
curl http://localhost:8000/health
```

**Expected**: `{"status":"healthy"}`

### Test the Chat Flow

1. Start both backend and frontend
2. Open browser to `http://localhost:3000`
3. Navigate to Atlanta dashboard
4. Open chat sidebar
5. Ask: "Where should we deploy WiFi for underserved students?"
6. Verify:
   - Agent steps appear in real-time
   - Final explanation is generated
   - Map shows highlighted recommendations

---

## Credits

- **AI Framework**: Google Gemini 2.0 Flash
- **Census Data**: US Census Bureau ACS 5-Year Estimates
- **Mapping**: Mapbox GL JS
- **Framework**: Next.js 16, FastAPI

---

## Support

For issues or questions:
1. Check this setup guide
2. Review error messages in terminal/browser console
3. Verify API keys are correctly configured
4. Ensure both frontend and backend are running

**Happy WiFi Planning!** 🛜✨