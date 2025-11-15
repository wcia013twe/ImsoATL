# Multi-Agent Orchestrator Test Suite

This document provides comprehensive test cases for the ImsoATL multi-agent orchestrator system. Each test includes the prompt, expected behavior, and success criteria.

---

## Overview

The orchestrator coordinates 6 specialized agents:
- **Query Parser (Explainer)** - Analyzes queries and generates reasoning plans
- **Census Data Agent** - Scores census tracts by demographic need
- **FCC Data Agent** - Identifies broadband coverage gaps
- **Civic Assets Agent** - Locates potential WiFi anchor sites
- **Synthesis Agent** - Combines data and ranks deployment sites
- **Explainer Agent** - Generates human-readable explanations

**Default Scoring Weights:**
- Census: poverty_rate (40%) + no_internet_pct (40%) + student_pct (20%)
- Synthesis: equity_need (40%) + coverage_gap (30%) + civic_anchor (20%) + student_density (10%)

---

## Category 1: Basic Flow (All Agents)

### Test #1: Default Deployment Query

**Prompt:**
```
Where should we deploy WiFi in Atlanta to help the most people?
```

**Tests:** Complete pipeline with all agents executing in sequence

**Agents Involved:** All 6 agents

**Expected Chat Bubble Output:**
```
🤔 Analyzing your request...

  🔍 Query Parser ✓
  Analyzing your question and planning approach...

  🔍 Query Parser ✓
  Plan: Census Data Agent → FCC Data Agent → Civic Assets Agent → Synthesis Agent

  🤖 Orchestrator ✓
  Coordinating 4 specialized agents to answer your question

  🤖 Orchestrator ✓
  I'm going to check the Census Bureau database for demographic data on poverty rates, internet access, and student populations across Georgia census tracts

  📊 Census Data Agent ⟳
  Fetching poverty, internet access, and student population data for Georgia

  📊 Census Data Agent ✓
  Analyzed 2,796 census tracts. Found 156 critical need areas.

  🤖 Orchestrator ✓
  Now I'll analyze FCC broadband coverage data to identify areas with insufficient internet speeds (below 25/3 Mbps)

  📡 FCC Data Agent ⟳
  Checking broadband coverage gaps (25/3 Mbps threshold)

  📡 FCC Data Agent ✓
  Found 1 tracts with coverage gaps. 1 critical gaps identified.

  🤖 Orchestrator ✓
  Next, I need to find civic assets like libraries, community centers, and schools that could serve as WiFi anchor points

  🏛️ Civic Assets Agent ⟳
  Locating libraries, community centers, schools, and transit stops

  🏛️ Civic Assets Agent ✓
  Identified 10 potential anchor sites. 10 located near high-need areas.

  🤖 Orchestrator ✓
  Time to synthesize everything! I'll cross-reference Census demographics, FCC coverage gaps, and civic asset locations to rank the best deployment sites

  🧠 Synthesis Agent ⟳
  Cross-referencing all datasets and scoring candidate sites

  🧠 Synthesis Agent ✓
  Ranked 2,796 sites by composite score. Top 15 sites selected.

  🤖 Orchestrator ✓
  Finally, let me translate all this technical data into a clear explanation you can use for decision-making

  ✨ Explainer Agent ⟳
  Generating human-readable explanation

  ✨ Explainer Agent ✓
  Analysis complete
```

**Expected Backend Logs:**
```
INFO - NEW QUERY RECEIVED: 'Where should we deploy WiFi in Atlanta to help the most people?'
INFO - STEP 1: Query Parser - Generating reasoning plan
INFO - Generated 4 reasoning steps
INFO - STEP 2: Census Data Agent - Fetching demographic data
INFO - Census analysis complete:
INFO -   - Total tracts: 2796
INFO -   - Critical need: 156
INFO -   - High need: 420
INFO -   - Avg poverty rate: 15.23%
INFO - STEP 3: FCC Data Agent - Analyzing broadband coverage
INFO - FCC analysis complete:
INFO -   - Coverage gaps found: 1
INFO -   - Critical gaps: 1
INFO - STEP 4: Civic Assets Agent - Locating anchor sites
INFO - Civic assets analysis complete:
INFO -   - Total anchor sites: 10
INFO -   - Near high-need areas: 10
INFO - STEP 5: Ranking Agent - Synthesizing data and ranking sites
INFO - Synthesis complete: 15 sites recommended
INFO - STEP 6: Explainer Agent - Generating natural language explanation
INFO - QUERY PROCESSING COMPLETE
```

**Expected Final Response:**
- Mentions specific census tract IDs
- Includes deployment site count (15 sites)
- References demographic data (poverty rates, internet access)
- Discusses civic infrastructure integration
- Provides projected impact metrics (population served, etc.)

**Success Criteria:**
- [ ] All 7 agents execute successfully
- [ ] Census API returns 2,796 GA tracts
- [ ] 15 deployment sites recommended
- [ ] Final explanation is coherent and data-driven
- [ ] Map highlights recommended locations (if integration working)
- [ ] Recommendations sidebar populates

---

### Test #2: Community WiFi Focus

**Prompt:**
```
What are the best locations for free community WiFi in Georgia?
```

**Tests:** Full workflow with emphasis on community impact and synthesis weighting

**Agents Involved:** All 6 agents

**Expected Behavior:**
- Similar to Test #1 but explanation emphasizes "community impact"
- Should mention public access points (libraries, community centers)
- May weight civic_anchor component higher in reasoning

**Success Criteria:**
- [ ] All agents execute
- [ ] Emphasis on public facilities in explanation
- [ ] 15 sites recommended with civic asset proximity

---

## Category 2: Census-Heavy Queries (Demographic Focus)

### Test #3: Poverty + Internet Access Query

**Prompt:**
```
Which neighborhoods have the highest poverty rates and no internet access?
```

**Tests:** Census demographic scoring (poverty_rate + no_internet_pct emphasis)

**Agents Involved:** Census Data Agent (primary), possibly light FCC/Synthesis

**Expected Chat Bubble Output:**
```
🤔 Analyzing your request...

  🔍 Query Parser ✓
  Plan: Census Data Agent → (possibly Synthesis for ranking)

  📊 Census Data Agent ⟳
  Fetching poverty and internet access data...

  📊 Census Data Agent ✓
  Analyzed 2,796 tracts. Identified high-poverty, low-connectivity areas.
```

**Expected Final Response:**
- Lists specific census tracts with high poverty_rate AND high no_internet_pct
- May skip FCC/Assets if query parser determines demographic-only query
- Should cite specific percentages (e.g., "Tract X has 42% poverty, 35% without internet")

**Success Criteria:**
- [ ] Census Agent executes
- [ ] Response focuses on demographic data
- [ ] Tracts ranked by combined poverty + internet access scores
- [ ] Minimal or no mention of civic infrastructure

---

### Test #4: Student Internet Access

**Prompt:**
```
Show me areas where students lack internet access for remote learning
```

**Tests:** Census student_pct weighting in need_score calculation

**Agents Involved:** Census Data Agent (emphasizing student population)

**Expected Behavior:**
- Highlights student_score component (20% of need_score)
- May reference enrolled_count from Census data
- Explanation should discuss remote learning impact

**Success Criteria:**
- [ ] Census student population data fetched (B14001_002E)
- [ ] Tracts with high student_pct ranked higher
- [ ] Explanation mentions educational impact

---

### Test #5: Economic Disadvantage Only

**Prompt:**
```
Find the most economically disadvantaged areas in Atlanta
```

**Tests:** Pure poverty_rate analysis without internet/coverage context

**Agents Involved:** Census Data Agent only (minimal synthesis)

**Expected Behavior:**
- Focuses solely on poverty_rate metric
- May skip FCC and Assets agents entirely
- Returns sorted list by below_poverty_count or poverty_rate

**Success Criteria:**
- [ ] Only Census Agent executes
- [ ] Response ranks by poverty_rate
- [ ] No mention of broadband coverage or infrastructure

---

### Test #6: Statistical Summary Query

**Prompt:**
```
What percentage of Atlanta households don't have broadband at home?
```

**Tests:** Census summary statistics (get_summary_statistics), not deployment-focused

**Agents Involved:** Census Data Agent with summary generation

**Expected Behavior:**
- Returns aggregated statistics, not site recommendations
- Should cite avg_no_internet_pct from summary
- No deployment plan generated

**Success Criteria:**
- [ ] Census summary statistics returned
- [ ] Response provides percentage (e.g., "18.5% of households lack broadband")
- [ ] No site recommendations
- [ ] Synthesis/Ranking agents may not execute

---

## Category 3: Coverage-Focused Queries (FCC Focus)

### Test #7: Broadband Coverage Gaps

**Prompt:**
```
Where are the broadband coverage gaps in Georgia?
```

**Tests:** FCC gap identification, severity classification (critical/moderate/minor)

**Agents Involved:** FCC Data Agent (primary), Census for context

**Expected Chat Bubble Output:**
```
🤔 Analyzing your request...

  🔍 Query Parser ✓
  Plan: FCC Data Agent → Census Data Agent (for context)

  📡 FCC Data Agent ⟳
  Analyzing broadband coverage gaps across Georgia...

  📡 FCC Data Agent ✓
  Found 1 tracts with coverage gaps. 1 critical, X moderate, X minor.
```

**Expected Behavior:**
- Focuses on gap_severity classifications
- May cite specific tracts with insufficient speeds
- Explains 25/3 Mbps threshold

**Success Criteria:**
- [ ] FCC Agent executes first
- [ ] Gap severity breakdown provided
- [ ] Response explains coverage gap criteria

---

### Test #8: Speed Threshold Query

**Prompt:**
```
Which areas don't meet the 25/3 Mbps broadband standard?
```

**Tests:** FCC threshold filtering logic (min_download=25, min_upload=3)

**Agents Involved:** FCC Data Agent with specific speed criteria

**Expected Behavior:**
- Filters tracts where max_download < 25 OR max_upload < 3
- Returns coverage gaps specifically citing speed deficiencies

**Success Criteria:**
- [ ] FCC filtering by speed thresholds
- [ ] Response cites 25/3 standard
- [ ] Lists tracts below threshold

---

### Test #9: Multi-Factor Coverage + Poverty

**Prompt:**
```
Find locations with critical broadband gaps that also have high poverty
```

**Tests:** FCC + Census merge (merge_with_census_data), correlation analysis

**Agents Involved:** FCC → Census → Synthesis

**Expected Behavior:**
- Requires data merge between FCC coverage_gaps and Census scored_tracts
- Prioritizes tracts with BOTH critical gaps AND high poverty
- Uses prioritize_by_impact() from FCC agent

**Success Criteria:**
- [ ] FCC and Census agents both execute
- [ ] Data merge successful (tract_id matching)
- [ ] Results show correlation between coverage gaps and poverty

---

## Category 4: Location-Based Queries (Civic Assets Focus)

### Test #10: Infrastructure Query

**Prompt:**
```
Where are the libraries and community centers we could use as WiFi anchor sites?
```

**Tests:** Asset locator, facility_score calculation for anchor potential

**Agents Involved:** Civic Assets Agent (primary)

**Expected Chat Bubble Output:**
```
🤔 Analyzing your request...

  🏛️ Civic Assets Agent ⟳
  Searching for libraries and community centers in Atlanta...

  🏛️ Civic Assets Agent ✓
  Found X libraries, X community centers. Scored by anchor potential.
```

**Expected Behavior:**
- Returns mock civic asset data (10 Atlanta facilities)
- Scores facilities: libraries=95, community_centers=90
- May not need Census/FCC if purely infrastructure-focused

**Success Criteria:**
- [ ] Assets Agent returns facility list
- [ ] Libraries and community centers highlighted
- [ ] Facility scores provided

---

### Test #11: Asset-Need Proximity

**Prompt:**
```
Find public schools near areas with poor internet access
```

**Tests:** Asset-Census proximity analysis (find_assets_near_high_need_areas)

**Agents Involved:** Census → Assets with proximity ranking

**Expected Behavior:**
- Census identifies high no_internet_pct tracts
- Assets finds schools within proximity threshold
- Returns schools sorted by need of surrounding area

**Success Criteria:**
- [ ] Census high-need areas identified first
- [ ] Asset proximity calculation executes
- [ ] Schools near high-need tracts prioritized

---

### Test #12: Transit-Specific Query

**Prompt:**
```
Which transit stops are in neighborhoods that need WiFi the most?
```

**Tests:** Asset filtering by type (transit_stop) + Census correlation

**Agents Involved:** Census → Assets (transit filtering)

**Expected Behavior:**
- Filters assets where asset_type == 'transit_stop'
- Correlates with Census high-need areas
- Returns transit stops in high need_score tracts

**Success Criteria:**
- [ ] Transit stops filtered from full asset list
- [ ] Correlation with Census need_score
- [ ] Results show transit stops in high-need areas

---

## Category 5: Synthesis Challenges (Complex Multi-Factor)

### Test #13: Custom Priority Weighting

**Prompt:**
```
Recommend WiFi sites prioritizing low-income families over student density
```

**Tests:** Custom user_weights in synthesis (equity_need > student_density)

**Agents Involved:** All agents, synthesis with custom weighting

**Expected Behavior:**
- May adjust default weights: equity_need > 40%, student_density < 10%
- Synthesis composite_score reflects priority shift
- Explanation mentions prioritization of low-income over students

**Success Criteria:**
- [ ] Synthesis weights adjusted (if supported)
- [ ] Results favor high-poverty areas over high-student areas
- [ ] Explanation acknowledges user priorities

---

### Test #14: Phased Deployment

**Prompt:**
```
Create a phased deployment plan starting with the most urgent areas
```

**Tests:** Synthesis phasing logic, tier categorization

**Agents Involved:** Full pipeline, emphasis on deployment_plan phases

**Expected Chat Bubble Output:**
```
🧠 Synthesis Agent ✓
Created 3-phase deployment plan:
  Phase 1 (Critical): 5 sites, score 85+
  Phase 2 (High): 7 sites, score 70-84
  Phase 3 (Medium): 3 sites, score 50-69
```

**Expected Behavior:**
- Synthesis generates phased plan using score thresholds:
  - Critical: composite_score >= 85
  - High: 70 <= composite_score < 85
  - Medium: 50 <= composite_score < 70
  - Low: composite_score < 50
- Explanation discusses phased rollout strategy

**Success Criteria:**
- [ ] Multiple phases in deployment_plan
- [ ] Sites categorized by recommendation_tier
- [ ] Explanation includes phasing rationale

---

### Test #15: Limited Site Count

**Prompt:**
```
Which 5 locations would have the biggest combined impact?
```

**Tests:** Synthesis composite scoring with max_sites constraint

**Agents Involved:** All agents, synthesis with limited output

**Expected Behavior:**
- Synthesis ranks all sites but returns only top 5
- Should select highest composite_score sites
- Impact metrics aggregated for 5 sites only

**Success Criteria:**
- [ ] Exactly 5 sites recommended
- [ ] Sites have highest composite_score values
- [ ] Projected impact metrics reflect 5-site constraint

---

### Test #16: Trade-off Analysis

**Prompt:**
```
Balance WiFi deployment between high poverty areas and good infrastructure
```

**Tests:** Conflicting priorities (equity_need vs civic_anchor)

**Agents Involved:** Census + Assets + Synthesis with balanced weighting

**Expected Behavior:**
- Synthesis balances equity_need (40%) and civic_anchor (20%)
- May increase civic_anchor weight for this query
- Results show mix of high-need AND well-equipped areas

**Success Criteria:**
- [ ] Results include both high-poverty and well-equipped sites
- [ ] Explanation discusses trade-offs
- [ ] Composite scores reflect balance

---

## Category 6: Edge Cases & Error Handling

### Test #17: Conversational Greeting

**Prompt:**
```
Hello, how are you?
```

**Tests:** Conversational detection, is_conversational_query() bypass

**Agents Involved:** Explainer only (conversational response)

**Expected Behavior:**
- Query parser detects conversational intent
- Skips all data collection agents
- Returns friendly greeting without analysis

**Success Criteria:**
- [ ] No Census/FCC/Assets execution
- [ ] Simple conversational response
- [ ] Processing completes quickly (no API calls)

---

### Test #18: Appreciation Message

**Prompt:**
```
Thanks for the analysis!
```

**Tests:** Appreciation detection, conversational bypass

**Expected Behavior:**
- Similar to Test #17
- Returns acknowledgment without re-running analysis

**Success Criteria:**
- [ ] No agent execution beyond Explainer
- [ ] Polite acknowledgment response

---

### Test #19: Capability Query

**Prompt:**
```
What can you do?
```

**Tests:** Meta-query about system capabilities

**Expected Behavior:**
- Explainer describes available analyses
- May list agent capabilities (Census, FCC, Assets)
- No actual data processing

**Success Criteria:**
- [ ] Conversational response
- [ ] Describes system capabilities
- [ ] No data agents execute

---

### Test #20: Geographic Limitation

**Prompt:**
```
Find WiFi deployment sites in California
```

**Tests:** Error handling for non-Georgia locations (state_fips hardcoded to "13")

**Expected Behavior:**
- Attempts pipeline but limited to Georgia data
- May return error or clarification that only Georgia is supported
- Census/FCC calls still use state_fips="13"

**Success Criteria:**
- [ ] System handles gracefully
- [ ] Clarifies geographic limitation
- [ ] No data returned for California

---

### Test #21: Constraint Handling

**Prompt:**
```
Show me WiFi recommendations with zero budget
```

**Tests:** Handling of unusual constraints/parameters

**Expected Behavior:**
- May acknowledge constraint in explanation
- Still provides recommendations but notes budget limitation
- No actual budget filtering implemented (may ignore constraint)

**Success Criteria:**
- [ ] Query processed successfully
- [ ] Constraint acknowledged or gracefully ignored
- [ ] Recommendations still provided

---

### Test #22: Single-Factor Optimization

**Prompt:**
```
Rank sites using only broadband coverage gaps, ignore everything else
```

**Tests:** Extreme custom weighting (coverage_gap=100%, others=0%)

**Agents Involved:** FCC → Synthesis with single-factor scoring

**Expected Behavior:**
- Synthesis weights: coverage_gap=100%, equity_need=0%, civic_anchor=0%, student_density=0%
- Results ranked purely by FCC gap severity
- Explanation clarifies single-factor optimization

**Success Criteria:**
- [ ] FCC Agent executes
- [ ] Results ranked solely by coverage gaps
- [ ] Demographic/infrastructure data ignored in ranking

---

## Test Execution Checklist

For each test, verify:
- [ ] Chat bubble accumulates all expected agent steps
- [ ] Each agent completes (shows ✓ checkmark)
- [ ] Backend logs match expected output
- [ ] Final explanation is coherent and addresses the query
- [ ] No errors or exceptions in backend
- [ ] Response time is reasonable (< 30 seconds for full pipeline)
- [ ] Map integration works (if applicable)
- [ ] Recommendations sidebar populates (if applicable)

---

## Known Limitations

1. **FCC Data:** Currently uses mock data (returns 1 coverage gap)
2. **Civic Assets:** Mock data (10 Atlanta facilities)
3. **Geography:** Only Georgia (state_fips="13") supported
4. **Real-time Data:** Census data from 2022 ACS 5-Year estimates
5. **Custom Weighting:** May not be fully implemented for all queries

---

## Running Tests

1. Navigate to `/dashboard/atlanta` in your browser
2. Ensure backend is running: `cd app/backend && python main.py`
3. Ensure frontend is running: `cd app/frontend && npm run dev`
4. Open the chat sidebar (should be open by default)
5. Type or paste each test prompt
6. Observe the accumulating bubble and final response
7. Check backend logs for detailed execution trace
8. Mark test as passed/failed based on success criteria

---

## Success Metrics

**Overall System Health:**
- All 22 tests should complete without errors
- Agent execution order should be consistent
- Response times should be < 30 seconds
- Final explanations should be coherent and data-driven
- Real Census data should be fetched (2,796 GA tracts)

**Performance Benchmarks:**
- Census API call: ~3-4 seconds
- FCC processing: < 1 second (mock data)
- Assets processing: < 1 second (mock data)
- Synthesis: ~1-2 seconds
- Gemini explanation: ~10-15 seconds
- Total pipeline: 20-30 seconds

---

*Last Updated: 2025-11-15*
