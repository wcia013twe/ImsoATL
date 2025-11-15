'use client';

import SiteCard from './SiteCard';
import type { DeploymentPlan } from '@/lib/types';

interface RecommendationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  deploymentPlan: DeploymentPlan | null;
}

export default function RecommendationsSidebar({
  isOpen,
  onClose,
  deploymentPlan
}: RecommendationsSidebarProps) {
  return (
    <>
      {/* Backdrop (optional, for mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Right Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-surface border-l border-border z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  WiFi Deployment Sites
                </h2>
                <p className="text-sm text-accent">
                  {deploymentPlan?.recommended_sites_count || 0} sites recommended
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-surface-hover transition-colors text-muted hover:text-foreground"
                title="Close recommendations"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          {deploymentPlan ? (
            <>
              {/* Impact Summary */}
              <div className="px-6 py-4 border-b border-border bg-surface-hover">
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  Projected Impact
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-2xl font-bold text-civic-green">
                      {deploymentPlan.projected_impact.total_population_served?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-accent mt-1">People Reached</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-civic-blue">
                      {deploymentPlan.projected_impact.households_without_internet_served?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-accent mt-1">Households Connected</div>
                  </div>
                </div>
                {deploymentPlan.projected_impact.residents_in_poverty_served && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="text-xl font-bold" style={{ color: 'var(--civic-green)' }}>
                      {deploymentPlan.projected_impact.residents_in_poverty_served.toLocaleString()}
                    </div>
                    <div className="text-xs text-accent mt-1">Residents in Poverty Served</div>
                  </div>
                )}
              </div>

              {/* Scrollable Site List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {deploymentPlan.recommended_sites.map((site, index) => (
                  <SiteCard
                    key={site.tract_id}
                    site={site}
                    rank={index + 1}
                  />
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="text-center">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-foreground font-medium">No recommendations yet</p>
                <p className="text-accent text-sm mt-2">
                  Ask the AI assistant about WiFi deployment to see ranked sites
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
