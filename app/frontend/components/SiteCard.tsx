type SiteCardProps = {
  rank: number;
  name: string;
  address: string;
  reach: number;
  equityScore: number;
  reasoning: string[];
  icon: string;
};

export default function SiteCard({
  rank,
  name,
  address,
  reach,
  equityScore,
  reasoning,
  icon,
}: SiteCardProps) {
  return (
    <div className="civic-card border-l-4" style={{ borderLeftColor: 'var(--civic-blue-500)' }}>
      <div className="flex items-start gap-3">
        {/* Rank Badge */}
        <div
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
          style={{ backgroundColor: 'var(--civic-blue-500)' }}
        >
          {rank}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
              <p className="text-sm text-gray-600">{address}</p>
            </div>
            <span className="text-2xl">{icon}</span>
          </div>

          {/* Metrics */}
          <div className="flex gap-4 mt-3 mb-3">
            <div>
              <div className="text-xl font-semibold" style={{ color: 'var(--civic-green-500)' }}>
                {reach.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Residents Reached</div>
            </div>
            <div>
              <div className="text-xl font-semibold" style={{ color: 'var(--civic-blue-500)' }}>
                {equityScore.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Equity Score</div>
            </div>
          </div>

          {/* Reasoning */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-2">Why this site?</p>
            <ul className="space-y-1">
              {reasoning.map((reason, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-civic-green">✓</span>
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
