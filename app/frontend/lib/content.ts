/**
 * CivicConnect Content Strategy
 * All UI copy, storytelling, and microcopy
 */

export const content = {
  // Hero/Header Section
  hero: {
    title: "CivicConnect WiFi: Accelerating Digital Equity in Atlanta",
    subtitle: "AI-powered site planning to connect every Atlanta resident to free, public WiFi",
  },

  // Problem Statement
  introduction: {
    heading: "Bridging Atlanta's Digital Divide",
    body: "Over 135,000 Atlanta residents lack reliable internet access at home. Public WiFi can transform lives—enabling remote work, online education, telehealth, and civic engagement. But where should we build it? CivicConnect uses AI to recommend high-impact WiFi sites that maximize equity, coverage, and accessibility.",
    stats: [
      { value: "135,000+", label: "Residents without home internet" },
      { value: "60%", label: "Faster site planning with AI" },
      { value: "$2.8M", label: "Estimated grant funding unlocked" },
    ],
  },

  // Goal Input Section
  goalInput: {
    heading: "Describe Your WiFi Project",
    placeholder: "E.g., 'Place 10 WiFi hotspots in Southwest Atlanta focusing on areas with high poverty rates near libraries and transit stops'",
    examples: [
      "Prioritize underserved neighborhoods with low internet access",
      "Focus on high-traffic transit hubs and community centers",
      "Target areas with schools and senior centers",
      "Maximize coverage for unconnected households",
    ],
    helpText: "Tell us your goals in plain English. Our AI will recommend optimal sites.",
  },

  // Priority Controls
  priorities: {
    heading: "Adjust Optimization Priorities",
    description: "Fine-tune how the AI balances competing objectives",
    sliders: [
      {
        id: "equity",
        label: "Digital Equity",
        description: "Prioritize areas with low home internet access and high poverty",
        icon: "equity",
      },
      {
        id: "transit",
        label: "Transit Access",
        description: "Favor locations near MARTA stations and bus stops",
        icon: "transit",
      },
      {
        id: "population",
        label: "Population Density",
        description: "Maximize total residents served",
        icon: "population",
      },
      {
        id: "coverage",
        label: "Coverage Gaps",
        description: "Fill areas with no existing public WiFi",
        icon: "coverage",
      },
    ],
  },

  // Map Section
  map: {
    heading: "Interactive Site Map",
    layers: [
      { id: "candidates", label: "Candidate Sites", color: "#2691FF" },
      { id: "existing", label: "Existing WiFi", color: "#6B7280" },
      { id: "equity", label: "Equity Overlay", color: "#19B987" },
      { id: "transit", label: "Transit Lines", color: "#7DBDFF" },
      { id: "coverage", label: "Coverage Gaps", color: "#FFB84D" },
    ],
    tooltipTemplate: {
      title: "Site Name",
      metrics: [
        "Estimated reach: X,XXX residents",
        "Equity score: X.X/10",
        "Transit proximity: X.X miles",
        "Existing coverage gap: Yes/No",
      ],
    },
  },

  // Recommendations Sidebar
  recommendations: {
    heading: "Top Recommended Sites",
    emptyState: "Adjust your goals or priorities to see site recommendations",
    siteCardTemplate: {
      // Site 1: Southwest Atlanta Regional Library
      example: {
        rank: 1,
        name: "Southwest Atlanta Regional Library",
        address: "3665 Cascade Rd SW",
        reach: 2200,
        equityScore: 9.2,
        reasoning: [
          "Serves 2,200 unconnected residents within 0.5 miles",
          "Adjacent to high-poverty census tract (32% below poverty line)",
          "0.2 miles from MARTA bus line 95",
          "Existing library provides indoor access point",
          "Fills coverage gap—nearest public WiFi is 1.8 miles away",
        ],
        icon: "library",
      },
    },
    agentExplanation: "Our AI analyzed 247 potential sites across Atlanta, weighing equity, transit access, population density, and coverage gaps. These top 5 sites maximize impact per dollar spent.",
  },

  // Export Section
  export: {
    heading: "Export Report",
    description: "Generate grant-ready documentation for city council and federal funding applications",
    formats: ["PDF Summary", "CSV Data Export", "Full Technical Report"],
    reportSections: [
      "Executive Summary",
      "Site Recommendations with Rationale",
      "Equity Impact Analysis",
      "Cost Estimates and ROI",
      "Implementation Timeline",
    ],
  },

  // Footer
  footer: {
    impact: {
      heading: "Projected Impact",
      metrics: [
        { label: "Planning Time Saved", value: "8 weeks → 3 days" },
        { label: "Cost per Connected Household", value: "$127 (vs. $340 traditional)" },
        { label: "Equity Score Improvement", value: "+43% vs. manual planning" },
      ],
    },
    grants: {
      heading: "Eligible Funding Sources",
      sources: [
        "NTIA Digital Equity Act ($2.75B nationwide)",
        "FCC Affordable Connectivity Program",
        "State of Georgia Broadband Deployment Initiative",
        "Atlanta City Council Digital Inclusion Fund",
      ],
    },
    credits: "Built with support from Code for Atlanta and Georgia Tech Urban Analytics Lab",
  },
};

export const iconography = {
  equity: "👥", // Or use library icon for diverse people
  transit: "🚇", // Or bus/train icon
  population: "🏘️", // Or community icon
  coverage: "📶", // Or signal icon
  library: "📚",
  school: "🏫",
  community: "🏛️",
  park: "🌳",
};
