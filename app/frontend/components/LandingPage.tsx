import USMapBackground from './USMapBackground';
import CitySelector from './CitySelector';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 3D Blurred US Map Background */}
      <USMapBackground />

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Logo/Title */}
          <div className="space-y-4">
            <h1
              className="text-6xl font-bold tracking-tight"
              style={{ color: 'var(--civic-blue-500)' }}
            >
              CivicConnect WiFi
            </h1>
            <p className="text-2xl font-medium text-gray-700">
              Accelerating Digital Equity Across America
            </p>
          </div>

          {/* Tagline */}
          <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            AI-powered WiFi site planning to connect every community to free, public internet.
            Select your city to get started.
          </p>

          {/* City Selector */}
          <div className="mt-12">
            <CitySelector />
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-3 gap-8 pt-8 border-t border-gray-300/50">
            <div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: 'var(--civic-blue-500)' }}
              >
                50+
              </div>
              <div className="text-sm text-gray-600 font-medium">Cities Supported</div>
            </div>
            <div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: 'var(--civic-green-500)' }}
              >
                2.5M+
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Residents Connected
              </div>
            </div>
            <div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: 'var(--civic-blue-500)' }}
              >
                $120M
              </div>
              <div className="text-sm text-gray-600 font-medium">Grant Funding Secured</div>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-sm text-gray-500 mt-8">
            Powered by AI • Built for City Officials • Optimized for Equity
          </p>
        </div>
      </div>
    </div>
  );
}
