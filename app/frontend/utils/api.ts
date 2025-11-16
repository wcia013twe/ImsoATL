/**
 * API client functions for backend services
 */

import type { SimulationResponse, RecommendedSite } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Simulate personas for a given WiFi deployment site
 *
 * @param site - The recommended site data
 * @returns Simulation response with 5 personas and summary
 */
export async function simulatePersonas(
  site: RecommendedSite
): Promise<SimulationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/simulation/personas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tract_id: site.tract_id,
        county: site.county,
        poverty_rate: site.poverty_rate,
        total_population: site.total_population,
        no_internet_pct: site.no_internet_pct,
        median_income: 35000, // Placeholder for hackathon
        student_population: site.student_population,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `API error: ${response.status} ${response.statusText}`
      );
    }

    const data: SimulationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to simulate personas:', error);
    throw error;
  }
}
