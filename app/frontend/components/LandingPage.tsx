import AnimatedGlobe from './AnimatedGlobe';
import CitySelector from './CitySelector';
import Globe3D from './Globe3D';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-950">
      {/* Animated Globe Background */}
      <div className="absolute inset-0 w-full h-full opacity-30">
        <Globe3D />
      </div>

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 via-transparent to-gray-950/50 z-[5]" />

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="max-w-4xl w-full space-y-8">

          {/* Logo/Title Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gray-900/60 backdrop-blur-sm border border-gray-800">
              <span className="text-xs font-bold text-gray-400 tracking-[0.25em] uppercase">All Together Linked</span>
              <span className="text-blue-400">•</span>
              <span className="text-blue-400 font-bold text-xs tracking-wider">ATL</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Connecting Every Community
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-emerald-400">
                One WiFi Network at a Time
              </span>
            </h1>
          </div>

          {/* City Selector */}
          <div className="max-w-xl mx-auto">
            <CitySelector />
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-md border border-gray-800/50 p-8 hover:border-blue-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-5xl font-bold text-blue-400 mb-3">
                  135K+
                </div>
                <div className="text-sm text-gray-400 font-medium leading-relaxed">
                  Underserved Residents Identified
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-md border border-gray-800/50 p-8 hover:border-emerald-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-5xl font-bold text-emerald-400 mb-3">
                  60%
                </div>
                <div className="text-sm text-gray-400 font-medium leading-relaxed">
                  Faster Planning with AI
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-md border border-gray-800/50 p-8 hover:border-blue-500/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-5xl font-bold text-blue-400 mb-3">
                  $2.8M
                </div>
                <div className="text-sm text-gray-400 font-medium leading-relaxed">
                  Grant Funding Unlocked
                </div>
              </div>
            </div>
          </div>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              AI-powered platform helping city officials plan and deploy public WiFi networks
              that maximize equity, minimize cost, and transform communities.
            </p>

          {/* Mission Statement */}
          <div className="text-center max-w-3xl mx-auto pt-8 border-t border-gray-800/50">
            <p className="text-base text-gray-400 leading-relaxed">
              <span className="font-semibold text-white">All Together Linked.</span> Because when communities are connected,
              possibilities are limitless. From remote work to online education, telehealth to civic engagement—public WiFi transforms lives.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
