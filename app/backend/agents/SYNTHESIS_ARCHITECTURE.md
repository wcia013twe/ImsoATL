# Synthesis Agent Architecture

## Overview

The Synthesis Agent is a dedicated reasoning/decision agent that combines results from specialized data-fetching agents (Census, FCC, Assets) into actionable WiFi deployment recommendations.

## Design Principles

### 1. **Specialization**
- **Data Agents** (Census, FCC, Assets): Retrieve, filter, and format data only
- **Synthesis Agent**: Makes strategic, cross-domain decisions only
- Clear separation of concerns prevents mixing data fetching with decision logic

### 2. **Transparency**
- Each scoring component is explicitly documented
- Weights and thresholds are configurable and traceable
- Score breakdowns show exactly how each site was evaluated

### 3. **Flexibility**
- Easy to adjust scoring criteria without modifying data agents
- User can override default priority weights
- New data sources can be integrated by adding scoring components

### 4. **Scalability**
- Modular design allows adding new datasets (e.g., crime data, infrastructure)
- Scoring components can be independently tuned
- Deployment phases can adapt to budget/timeline constraints

### 5. **Explainability**
- Every recommendation includes human-readable justification
- Score breakdowns show contribution of each factor
- Critical for public sector accountability

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      ORCHESTRATOR                            │
│         (Coordinates but doesn't make decisions)             │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Census Agent │    │  FCC Agent   │    │ Asset Agent  │
│              │    │              │    │              │
│ • Poverty    │    │ • Coverage   │    │ • Libraries  │
│ • Internet   │    │ • Gaps       │    │ • Centers    │
│ • Students   │    │ • Broadband  │    │ • Transit    │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       │    Raw Data       │    Raw Data       │    Raw Data
       │    Only           │    Only           │    Only
       └───────────────────┼───────────────────┘
                           │
                           ▼
                 ┌─────────────────────┐
                 │  SYNTHESIS AGENT    │
                 │  (Decision Making)  │
                 │                     │
                 │  • Merge Data       │
                 │  • Score Sites      │
                 │  • Rank & Tier      │
                 │  • Create Plan      │
                 │  • Justify Choices  │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │  Deployment Plan    │
                 │  with Phasing &     │
                 │  Justifications     │
                 └─────────────────────┘
```

## Scoring Methodology

### Default Weights (Configurable)

| Component | Weight | Description |
|-----------|--------|-------------|
| Equity Need | 40% | Poverty rate + digital divide + student population |
| Coverage Gap | 30% | FCC broadband availability gaps |
| Civic Anchor | 20% | Proximity to libraries, community centers, transit |
| Student Density | 10% | School-age population concentration |

### Scoring Components

#### 1. Equity Need Score (0-100)
```python
equity_score = (poverty_rate + no_internet_pct) / 2
```
- Combines poverty and internet access metrics
- Higher score = greater need
- Examples:
  - 40% poverty, 35% no internet → 37.5 score
  - 15% poverty, 10% no internet → 12.5 score

#### 2. Coverage Gap Score (0-100)
```python
Based on FCC gap severity:
- No broadband: 100
- Critical gap: 90
- High gap: 70
- Medium gap: 50
- Low/none: 20
```

#### 3. Civic Anchor Score (0-100)
```python
anchor_score = min((asset_count / 5) * 100, 100)
# Bonus +15 for having a library
```
- More nearby civic assets = easier deployment
- Libraries get bonus (ideal anchor sites)

#### 4. Student Density Score (0-100)
```python
student_pct = (student_pop / total_pop) * 100
student_score = min((student_pct / 25) * 100, 100)
```
- Prioritizes educational equity
- 25%+ students = maximum score

### Composite Score Calculation

```python
composite_score = (
    equity_score * 0.40 +
    coverage_score * 0.30 +
    anchor_score * 0.20 +
    student_score * 0.10
)
```

## Priority Tiers

| Tier | Score Range | Timeline | Description |
|------|-------------|----------|-------------|
| **Critical** | 85-100 | 0-3 months | Immediate deployment required |
| **High** | 70-84 | 3-9 months | Phase 1 expansion |
| **Medium** | 50-69 | 9-18 months | Phase 2 strategic sites |
| **Low** | 0-49 | 18+ months | Future consideration |

## Deployment Plan Structure

```json
{
  "recommended_sites_count": 15,
  "recommended_sites": [
    {
      "tract_id": "13121001100",
      "composite_score": 87.5,
      "score_breakdown": {
        "equity_need": 85.0,
        "coverage_gap": 90.0,
        "civic_anchor": 75.0,
        "student_density": 60.0
      },
      "priority_tier": "critical",
      "tier_label": "Critical - Deploy Immediately",
      "justification": "High equity need (42% poverty, 38% without internet); Significant broadband coverage gap (critical severity); 4 nearby civic assets for easy deployment"
    }
  ],
  "phases": [
    {
      "phase_number": 1,
      "phase_name": "Critical Need Deployment",
      "site_count": 5,
      "timeline": "Immediate (0-3 months)",
      "priority": "CRITICAL"
    }
  ],
  "scoring_methodology": {
    "weights_used": {...},
    "thresholds": {...}
  },
  "projected_impact": {
    "total_population_served": 125000,
    "residents_in_poverty_served": 45000,
    "households_without_internet_served": 18000,
    "students_served": 12000,
    "equity_reach_percentage": 36.0
  }
}
```

## Benefits of This Architecture

### 1. **Audit Trail**
Every recommendation can be traced back to specific data points:
- Which census tracts contributed
- What FCC gaps were identified
- Which civic assets influenced the decision
- How the composite score was calculated

### 2. **Policy Compliance**
Transparent methodology meets public sector requirements:
- Clear documentation of decision criteria
- Justifiable allocation of public resources
- Reproducible results

### 3. **Easy Tuning**
City officials can adjust priorities without code changes:
```python
custom_weights = {
    'equity_need': 0.50,      # Increase equity focus
    'coverage_gap': 0.25,
    'civic_anchor': 0.15,
    'student_density': 0.10
}
```

### 4. **Future Expansion**
New data sources integrate cleanly:
```python
# Future: Add crime safety component
def _calculate_safety_score(site: Dict) -> float:
    crime_rate = site.get('crime_incidents_per_1000', 0)
    # Lower crime = higher score (safer deployment)
    return max(100 - crime_rate, 0)

# Update weights
weights = {
    'equity_need': 0.35,
    'coverage_gap': 0.25,
    'civic_anchor': 0.20,
    'student_density': 0.10,
    'safety': 0.10  # New component
}
```

## Usage Example

```python
# In orchestrator
synthesis_agent = SynthesisAgent()

# Collect data from specialized agents
census_data = await census_agent.score_tracts_by_need(state_fips)
fcc_data = await fcc_agent.identify_coverage_gaps(state_fips)
asset_data = await asset_agent.find_candidate_anchor_sites()

# Synthesize into recommendations
deployment_plan = await synthesis_agent.synthesize_recommendations(
    census_data=census_data,
    fcc_data=fcc_data,
    asset_data=asset_data,
    user_weights=None,  # Use defaults
    max_sites=15
)

# Result is ready for explainer agent and frontend display
```

## Comparison: Before vs. After

### Before (Monolithic Ranking)
```
ProximityRankerAgent does everything:
- Merge data ✓
- Score sites ✓
- Rank ✓
- Generate plan ✓
- But: Hard to audit, modify, or explain
```

### After (Specialized Synthesis)
```
Data Agents → Raw data only
Synthesis Agent → Pure decision logic
Explainer Agent → Human-readable explanations

Benefits:
✓ Clear separation of concerns
✓ Transparent scoring
✓ Easy to tune/audit
✓ Explainable to stakeholders
```

## Best Practices

1. **Always log synthesis decisions**
   - Track which data went in
   - Record weights used
   - Save score breakdowns

2. **Validate inputs**
   - Check for missing/invalid data
   - Handle edge cases (zero population, etc.)
   - Fail gracefully with clear error messages

3. **Document weight changes**
   - Record why weights were adjusted
   - Test impact on recommendations
   - Get stakeholder buy-in

4. **Monitor fairness**
   - Review recommendations by demographics
   - Check for unintended bias
   - Ensure equitable distribution

5. **Iterate based on outcomes**
   - Track actual deployment success
   - Refine scoring based on results
   - Update weights with evidence

## Future Enhancements

- [ ] Machine learning to optimize weights based on historical success
- [ ] Geographic clustering to optimize installation routes
- [ ] Cost modeling integration
- [ ] Environmental impact scoring
- [ ] Multi-objective optimization (Pareto frontier)
- [ ] Simulation mode to test "what-if" scenarios
