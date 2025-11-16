/**
 * TypeScript types for WiFi assistant messages and data
 */

export type MessageRole = 'user' | 'assistant';

export type MessageType = 'agent_step' | 'final_response' | 'error' | 'processing';

export type AgentStepStatus = 'in_progress' | 'completed' | 'error' | 'typing';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  type?: MessageType;
  agentSteps?: AgentStep[];
  deploymentPlan?: DeploymentPlan;
}

export interface AgentStep {
  agent: string;
  action: string;
  status: AgentStepStatus;
  data?: Record<string, any>;
}

export interface RecommendedSite {
  tract_id: string;
  name: string;
  state: string;
  county: string;
  tract: string;
  composite_score: number;
  recommendation_tier: 'top_priority' | 'high_priority' | 'medium_priority' | 'low_priority';
  poverty_rate: number;
  no_internet_pct: number;
  total_population: number;
  nearby_anchor_count: number;
  nearby_anchors?: CivicAsset[];
  need_score?: number;
  impact_score?: number;
  student_population?: number;
  nearest_library?: string;
  nearest_community_center?: string;
  centroid?: {
    lng: number;
    lat: number;
  };
}

export interface CivicAsset {
  id: string;
  name: string;
  type: 'library' | 'community_center' | 'school' | 'transit_stop';
  lat: number;
  lng: number;
  address?: string;
  county?: string;
}

export interface DeploymentPlan {
  recommended_sites_count: number;
  recommended_sites: RecommendedSite[];
  projected_impact: {
    total_population_served: number;
    residents_below_poverty_served: number;
    households_without_internet_served: number;
  };
  deployment_phases?: DeploymentPhase[];
}

export interface DeploymentPhase {
  phase: number;
  name: string;
  sites_count: number;
  sites: RecommendedSite[];
}

export interface FinalResponse {
  type: 'final_response';
  explanation: string;
  data_synthesis: string;
  deployment_plan: DeploymentPlan;
  summaries: {
    census: CensusSummary;
    fcc: FCCSummary;
    assets: AssetsSummary;
  };
}

export interface CensusSummary {
  total_tracts_analyzed: number;
  critical_need_tracts: number;
  high_need_tracts: number;
  avg_poverty_rate: number;
  avg_no_internet_pct: number;
  total_population: number;
  total_below_poverty: number;
}

export interface FCCSummary {
  total_tracts: number;
  tracts_with_adequate_coverage: number;
  tracts_with_gaps: number;
  coverage_rate_pct: number;
  gap_severity_breakdown: Record<string, number>;
}

export interface AssetsSummary {
  total_assets: number;
  asset_type_breakdown: {
    library: number;
    community_center: number;
    school: number;
    transit_stop: number;
  };
  counties_covered: number;
}

export interface WebSocketMessage {
  type: 'agent_step' | 'final_response' | 'error';
  agent?: string;
  action?: string;
  status?: AgentStepStatus;
  data?: Record<string, any>;
  explanation?: string;
  data_synthesis?: string;
  deployment_plan?: DeploymentPlan;
  summaries?: {
    census: CensusSummary;
    fcc: FCCSummary;
    assets: AssetsSummary;
  };
  message?: string;
}

// Persona Simulation Types
export type PersonaSentiment = 'very_positive' | 'positive' | 'neutral';

export interface PersonaReaction {
  sentiment: PersonaSentiment;
  quote: string;
  reasons: string[];
}

export interface Persona {
  id: string;
  name: string;
  age: number;
  occupation: string;
  living_situation: string;
  daily_routine: string;
  internet_needs: string[];
  reaction: PersonaReaction;
  life_impact: string;
}

export interface SimulationSummary {
  overall_sentiment: string;
  key_impacts: string[];
  community_transformation: string;
}

export interface SimulationResponse {
  status: string;
  data: {
    site_name: string;
    tract_id: string;
    personas: Persona[];
    summary: SimulationSummary;
  };
}
