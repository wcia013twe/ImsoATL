import { content, iconography } from '@/lib/content';
import SiteCard from './SiteCard';

// Mock data for demonstration
const mockSites = [
  {
    rank: 1,
    name: 'Southwest Atlanta Regional Library',
    address: '3665 Cascade Rd SW',
    reach: 2200,
    equityScore: 9.2,
    reasoning: [
      'Serves 2,200 unconnected residents within 0.5 miles',
      'Adjacent to high-poverty census tract (32% below poverty line)',
      '0.2 miles from MARTA bus line 95',
      'Existing library provides indoor access point',
      'Fills coverage gap—nearest public WiFi is 1.8 miles away',
    ],
    icon: iconography.library,
  },
  {
    rank: 2,
    name: 'Greenbriar Transit Center',
    address: '2841 Greenbriar Pkwy SW',
    reach: 3100,
    equityScore: 8.7,
    reasoning: [
      'Major MARTA hub with 3,100+ daily riders',
      'Serves high-density residential area (6,200 per sq mi)',
      'Adjacent to retail corridor for economic development',
      'Low home broadband adoption (48% vs. 72% citywide)',
      'Existing infrastructure from transit authority',
    ],
    icon: iconography.transit,
  },
  {
    rank: 3,
    name: 'Pittsburg Community Center',
    address: '255 Lakewood Way SE',
    reach: 1850,
    equityScore: 9.0,
    reasoning: [
      'Community hub with after-school programs and senior services',
      'High concentration of zero-internet households (28%)',
      'Adjacent to Title I elementary school',
      'Walking distance to public housing (450 units)',
      'Existing community WiFi demand documented in city survey',
    ],
    icon: iconography.community,
  },
];

export default function RecommendationsSidebar() {
  return (
    <section className="w-full py-8 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-96 shrink-0 space-y-4">
            <div className="civic-card">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {content.recommendations.heading}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {content.recommendations.agentExplanation}
              </p>
            </div>

            {/* Site Cards */}
            {mockSites.map((site) => (
              <SiteCard key={site.rank} {...site} />
            ))}
          </div>

          {/* Main Content Area (for map integration) */}
          <div className="flex-1">
            <div className="civic-card h-full min-h-[600px] flex items-center justify-center bg-gray-50">
              <p className="text-gray-500">
                Map view will display selected sites here
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
