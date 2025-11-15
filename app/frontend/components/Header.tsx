import { content } from '@/lib/content';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              {content.hero.title}
            </h1>
            <p className="text-lg text-gray-600">
              {content.hero.subtitle}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-8">
            {content.introduction.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-semibold" style={{ color: 'var(--civic-blue-500)' }}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
