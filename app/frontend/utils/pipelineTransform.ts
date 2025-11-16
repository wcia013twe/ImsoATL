/**
 * Transform pipeline API response to DeploymentPlan format for the UI
 */

import type { DeploymentPlan, RecommendedSite } from '@/lib/types';

interface PipelineSite {
  geoid: string;
  coverage_percent: number;
  population: number;
  median_income: number;
  poverty_rate: number;
  schools: number;
  libraries: number;
  community_centers: number;
  transit_stops: number;
  total_assets: number;
  impact_score: number;
  deployment_rank: number;
  deployment_tier: string;
  centroid?: {
    lng: number;
    lat: number;
  };
}

interface PipelineResponse {
  status: string;
  location: {
    name: string;
    type: string;
    slug: string;
  };
  data: {
    location: {
      name: string;
      type: string;
      state: string | null;
      slug: string;
    };
    total_tracts: number;
    sites: PipelineSite[];
    geometries: any;
  };
}

/**
 * Map pipeline deployment_tier to UI recommendation_tier
 */
function mapTier(pipelineTier: string): 'top_priority' | 'high_priority' | 'medium_priority' | 'low_priority' {
  switch (pipelineTier) {
    case 'tier_1_critical':
      return 'top_priority';
    case 'tier_2_high':
      return 'high_priority';
    case 'tier_3_medium':
      return 'medium_priority';
    case 'tier_4_low':
    default:
      return 'low_priority';
  }
}

/**
 * Extract location name from GEOID
 * GEOID format: 12001001815 (State+County+Tract)
 * Returns county name from the GEOID
 */
function extractLocationFromGEOID(geoid: string): { county: string; state: string; tract: string } {
  const stateFips = geoid.substring(0, 2);
  const countyFips = geoid.substring(2, 5);
  const tractCode = geoid.substring(5);

  // Florida county FIPS codes (partial mapping)
  const countyNames: Record<string, string> = {
    '001': 'Alachua',
    '007': 'Bradford',
    '011': 'Broward',
    '013': 'Calhoun',
    '019': 'Clay',
    '023': 'Columbia',
    '029': 'Dixie',
    '041': 'Gilchrist',
    '047': 'Hamilton',
    '051': 'Hendry',
    '059': 'Holmes',
    '067': 'Lafayette',
    '069': 'Lake',
    '075': 'Levy',
    '077': 'Liberty',
    '079': 'Madison',
    '083': 'Marion',
    '085': 'Martin',
    '086': 'Miami-Dade',
    '091': 'Okaloosa',
    '093': 'Okeechobee',
    '099': 'Palm Beach',
    '107': 'Putnam',
    '115': 'Sarasota',
    '119': 'Sumter',
    '121': 'Suwannee',
    '125': 'Union',
    '133': 'Washington',
  };

  return {
    state: stateFips === '12' ? 'Florida' : 'FL',
    county: countyNames[countyFips] || `County ${countyFips}`,
    tract: tractCode,
  };
}

/**
 * Transform a single pipeline site to RecommendedSite format
 */
function transformSite(site: PipelineSite): RecommendedSite {
  const location = extractLocationFromGEOID(site.geoid);

  // Calculate percentage without internet (100% - coverage)
  const no_internet_pct = 100 - site.coverage_percent;

  return {
    tract_id: site.geoid,
    name: `${location.county} County - Tract ${location.tract}`,
    state: location.state,
    county: location.county,
    tract: location.tract,
    composite_score: site.impact_score,
    recommendation_tier: mapTier(site.deployment_tier),
    poverty_rate: site.poverty_rate,
    no_internet_pct: no_internet_pct,
    total_population: site.population,
    nearby_anchor_count: site.total_assets,
    impact_score: site.impact_score,
    need_score: site.impact_score, // Using impact_score as need_score
    centroid: site.centroid, // Include centroid coordinates from pipeline
  };
}

/**
 * Transform pipeline response to DeploymentPlan
 */
export function transformPipelineToDeploymentPlan(response: PipelineResponse): DeploymentPlan {
  const { data } = response;

  // Transform all sites
  const recommendedSites = data.sites.map(transformSite);

  // Calculate projected impact
  const totalPopulation = data.sites.reduce((sum, site) => sum + site.population, 0);
  const totalBelowPoverty = data.sites.reduce((sum, site) => {
    return sum + Math.round((site.population * site.poverty_rate) / 100);
  }, 0);
  const totalWithoutInternet = data.sites.reduce((sum, site) => {
    const no_internet_pct = 100 - site.coverage_percent;
    return sum + Math.round((site.population * no_internet_pct) / 100);
  }, 0);

  return {
    recommended_sites_count: data.total_tracts,
    recommended_sites: recommendedSites,
    projected_impact: {
      total_population_served: totalPopulation,
      residents_below_poverty_served: totalBelowPoverty,
      households_without_internet_served: totalWithoutInternet,
    },
  };
}

/**
 * Type guard to check if response is valid pipeline response
 */
export function isPipelineResponse(data: any): data is PipelineResponse {
  return (
    data &&
    typeof data === 'object' &&
    data.status === 'success' &&
    data.data &&
    Array.isArray(data.data.sites)
  );
}
