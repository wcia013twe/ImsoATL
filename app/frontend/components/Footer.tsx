import { content } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 gap-12 mb-8">
          {/* Impact Metrics */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--civic-blue-500)' }}>
              {content.footer.impact.heading}
            </h3>
            <div className="space-y-3">
              {content.footer.impact.metrics.map((metric, idx) => (
                <div key={idx}>
                  <div className="text-2xl font-semibold text-white">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Grants */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--civic-green-500)' }}>
              {content.footer.grants.heading}
            </h3>
            <ul className="space-y-2">
              {content.footer.grants.sources.map((source, idx) => (
                <li key={idx} className="text-sm text-gray-300 flex gap-2">
                  <span className="text-civic-green">✓</span>
                  <span>{source}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Credits */}
        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">{content.footer.credits}</p>
        </div>
      </div>
    </footer>
  );
}
