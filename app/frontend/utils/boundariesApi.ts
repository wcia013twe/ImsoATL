/**
 * Boundaries API Service
 *
 * Handles fetching boundary data from the backend API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Location {
  id: number;
  name: string;
  slug: string;
  coords: [number, number];
  type: 'state' | 'city';
  state?: string; // Only for cities
}

export interface BoundaryResponse {
  status: string;
  boundary: GeoJSON.Feature;
  source?: string;
}

/**
 * Fetch state boundary from backend
 */
export async function fetchStateBoundary(stateName: string): Promise<GeoJSON.Feature | null> {
  try {
    const url = `${API_BASE_URL}/api/boundaries/state/${encodeURIComponent(stateName)}`;
    console.log(`Fetching state boundary from: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch state boundary: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return null;
    }

    const data: BoundaryResponse = await response.json();
    console.log(`Successfully fetched state boundary for ${stateName}`);
    return data.boundary;
  } catch (error) {
    console.error('Error fetching state boundary:', error);
    console.error('API_BASE_URL:', API_BASE_URL);
    return null;
  }
}

/**
 * Fetch county/city boundary from backend
 */
export async function fetchCityBoundary(
  cityName: string,
  stateName: string,
  citySlug: string
): Promise<GeoJSON.Feature | null> {
  try {
    const params = new URLSearchParams({
      county_name: cityName,
      state_name: stateName,
      city_slug: citySlug,
    });

    const url = `${API_BASE_URL}/api/boundaries/county?${params.toString()}`;
    console.log(`Fetching city boundary from: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch city boundary: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return null;
    }

    const data: BoundaryResponse = await response.json();
    console.log(`Successfully fetched city boundary for ${cityName}, ${stateName}`);
    return data.boundary;
  } catch (error) {
    console.error('Error fetching city boundary:', error);
    console.error('API_BASE_URL:', API_BASE_URL);
    console.error('Request details:', { cityName, stateName, citySlug });
    return null;
  }
}

/**
 * Fetch boundary based on location type
 */
export async function fetchBoundary(location: Location): Promise<GeoJSON.Feature | null> {
  if (location.type === 'state') {
    return fetchStateBoundary(location.name);
  } else if (location.type === 'city' && location.state) {
    return fetchCityBoundary(location.name, location.state, location.slug);
  }

  console.error('Invalid location type or missing state information');
  return null;
}

/**
 * Fetch boundary - only from API, no static file fallback
 */
export async function fetchBoundaryFromAPI(
  location: Location
): Promise<GeoJSON.Feature | null> {
  return fetchBoundary(location);
}
