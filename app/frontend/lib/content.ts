/**
 * Content configuration for the WiFi deployment dashboard
 */

export const content = {
  hero: {
    title: 'CivicConnect WiFi Dashboard',
    subtitle: 'AI-Powered WiFi Deployment Planning for Underserved Communities',
  },

  introduction: {
    heading: 'About This Tool',
    body: 'This dashboard uses multi-agent AI to analyze Census demographics, FCC broadband data, and civic assets to recommend optimal WiFi deployment sites. Our goal is to bridge the digital divide by identifying high-impact locations for community WiFi access.',
    stats: [
      { value: '500K+', label: 'Residents Analyzed' },
      { value: '1,200+', label: 'Census Tracts' },
      { value: '150+', label: 'Civic Assets' },
    ],
  },

  goalInput: {
    heading: 'Define Your Deployment Goal',
    helpText: 'Describe what you want to achieve with your WiFi deployment. Our AI will analyze the data and recommend optimal sites.',
    placeholder: 'e.g., "Find the best locations to deploy WiFi for underserved students near schools and libraries"',
    examples: [
      'Deploy WiFi for students in high-poverty areas',
      'Target neighborhoods with worst broadband gaps',
      'Focus on areas near libraries and community centers',
      'Maximize impact per dollar in Phase 1 deployment',
    ],
  },

  priorities: {
    heading: 'Adjust Priority Weights',
    description: 'Fine-tune how the AI weighs different factors when recommending deployment sites.',
    sliders: [
      {
        id: 'equity',
        label: 'Equity & Need',
        description: 'Prioritize high-poverty areas and households without internet',
        icon: 'equity',
      },
      {
        id: 'transit',
        label: 'Transit & Civic Assets',
        description: 'Favor locations near libraries, schools, and community centers',
        icon: 'transit',
      },
      {
        id: 'population',
        label: 'Population Density',
        description: 'Maximize the number of residents served',
        icon: 'population',
      },
      {
        id: 'coverage',
        label: 'Coverage Gaps',
        description: 'Target areas with the worst existing broadband coverage',
        icon: 'coverage',
      },
    ],
  },

  export: {
    heading: 'Export Recommendations',
    description: 'Download your deployment plan in various formats for presentation and implementation.',
    formats: [
      'PDF Summary',
      'Excel Spreadsheet',
      'GeoJSON (Map Data)',
      'Full Technical Report',
    ],
    reportSections: [
      'Recommended deployment sites with priority tiers',
      'Demographic and broadband coverage analysis',
      'Projected impact metrics (population served, equity gains)',
      'Interactive map with site markers',
      'Grant funding recommendations',
    ],
  },

  footer: {
    impact: {
      heading: 'Projected Impact',
      metrics: [
        { value: '125,000+', label: 'Residents Served' },
        { value: '15,000+', label: 'Students Connected' },
        { value: '$2.5M', label: 'Potential Grant Funding' },
      ],
    },
    grants: {
      heading: 'Applicable Grant Programs',
      sources: [
        'NTIA Broadband Equity, Access, and Deployment (BEAD)',
        'FCC Affordable Connectivity Program (ACP)',
        'USDA ReConnect Program',
        'State Digital Equity Planning Grants',
      ],
    },
    credits: '© 2024 CivicConnect. Built with multi-agent AI and open civic data.',
  },
};

export const iconography = {
  equity: '⚖️',
  transit: '🚌',
  population: '👥',
  coverage: '📡',
};
