import type { RecommendedSite } from '@/lib/types';

type SiteCardProps = {
  rank: number;
  site: RecommendedSite;
};

// Priority tier configuration
const tierConfig = {
  top_priority: {
    label: 'Critical',
    color: '#ef4444',
    textColor: 'text-red-500',
  },
  high_priority: {
    label: 'High',
    color: '#f59e0b',
    textColor: 'text-amber-500',
  },
  medium_priority: {
    label: 'Medium',
    color: '#3b82f6',
    textColor: 'text-blue-500',
  },
  low_priority: {
    label: 'Low',
    color: '#6b7280',
    textColor: 'text-gray-500',
  },
};

// Generate reasoning bullets from site metrics
function generateReasoning(site: RecommendedSite): string[] {
  const reasons: string[] = [];

  if (site.poverty_rate && site.poverty_rate > 20) {
    reasons.push(`High poverty area (${site.poverty_rate.toFixed(1)}% below poverty line)`);
  }

  if (site.no_internet_pct && site.no_internet_pct > 15) {
    reasons.push(`Significant digital divide (${site.no_internet_pct.toFixed(1)}% without internet)`);
  }

  if (site.nearby_anchor_count && site.nearby_anchor_count > 0) {
    reasons.push(`${site.nearby_anchor_count} nearby civic asset${site.nearby_anchor_count > 1 ? 's' : ''} for deployment`);
  }

  if (site.composite_score >= 80) {
    reasons.push('Critical need - immediate deployment recommended');
  }

  if (site.student_population && site.student_population > 0) {
    reasons.push(`Serves ${site.student_population.toLocaleString()} students`);
  }

  // Fallback if no specific reasons
  if (reasons.length === 0) {
    reasons.push('Meets multiple deployment criteria');
  }

  return reasons;
}

// Determine icon based on nearby anchors
function getIcon(site: RecommendedSite): string {
  if (site.nearest_library) return '📚';
  if (site.nearest_community_center) return '🏛️';
  if (site.nearby_anchors && site.nearby_anchors.length > 0) {
    const firstAsset = site.nearby_anchors[0];
    if (firstAsset.type === 'library') return '📚';
    if (firstAsset.type === 'community_center') return '🏛️';
    if (firstAsset.type === 'school') return '🏫';
    if (firstAsset.type === 'transit') return '🚇';
  }
  return '📍'; // Default location pin
}

export default function SiteCard({ rank, site }: SiteCardProps) {
  const tier = tierConfig[site.recommendation_tier] || tierConfig.low_priority;
  const reasoning = generateReasoning(site);
  const icon = getIcon(site);
  const displayName = site.name || `Census Tract ${site.tract_id}`;

  return (
    <div
      className="civic-card border-l-4"
      style={{ borderLeftColor: tier.color }}
    >
      <div className="flex items-start gap-3">
        {/* Rank Badge */}
        <div
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
          style={{ backgroundColor: tier.color }}
        >
          {rank}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">{displayName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${tier.textColor}`}
                  style={{ backgroundColor: `${tier.color}20` }}
                >
                  {tier.label} Priority
                </span>
                <span className="text-xs text-muted">
                  Tract {site.tract_id}
                </span>
              </div>
            </div>
            <span className="text-2xl">{icon}</span>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <div className="text-lg font-semibold text-civic-green">
                {site.total_population?.toLocaleString() || '0'}
              </div>
              <div className="text-xs text-accent">People Helped</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-civic-blue">
                {site.composite_score?.toFixed(1) || '0.0'}
              </div>
              <div className="text-xs text-accent">Score</div>
            </div>
          </div>

          {/* Reasoning */}
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
              Why this site?
            </p>
            <ul className="space-y-1">
              {reasoning.slice(0, 3).map((reason, idx) => (
                <li key={idx} className="text-xs text-accent flex gap-2">
                  <span className="text-civic-green flex-shrink-0">✓</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
