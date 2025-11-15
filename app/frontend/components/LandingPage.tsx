import USMapBackground from './USMapBackground';
import CitySelector from './CitySelector';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 3D Blurred US Map Background */}
      <USMapBackground />

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <div className="max-w-3xl w-full text-center space-y-10">
          {/* Logo/Title */}
          <div className="space-y-6">
            <div className="inline-block">
              {/* <h1
                className="text-6xl font-bold tracking-tight mb-3"
                style={{ color: 'var(--civic-blue-500)' }}
              >
                All Together Linked
              </h1> */}
              <div className="flex items-center justify-center gap-3 text-2xl pt-5 font-semibold text-muted tracking-widest">
                <span>ALL TOGETHER LINKED</span>
                <span className="text-civic-blue">•</span>
                <span className="text-civic-blue">ATL</span>
              </div>
            </div>

            <p className="text-3xl font-semibold text-foreground leading-tight">
              Connecting Every Community
              <br />
              <span style={{ color: 'var(--civic-green-500)' }}>One WiFi Network at a Time</span>
            </p>
          </div>

          {/* Value Proposition */}
          {/* <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-lg text-accent leading-relaxed">
              Our AI-powered platform helps city officials plan and deploy public WiFi networks that maximize equity, minimize cost, and transform communities through connectivity.
            </p>
          </div> */}

          {/* City Selector */}
          <div className="mt-12 space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              Select Your City to Get Started
            </h2>
            <CitySelector />
          </div>

          {/* Impact Stats */}
          <div className="mt-16 pt-10 border-t-2 border-border/60">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-6">
              Our Impact Across America
            </h3>
            <div className="grid grid-cols-3 gap-10">
              <div>
                <div
                  className="text-5xl font-bold mb-2"
                  style={{ color: 'var(--civic-blue-500)' }}
                >
                  135K+
                </div>
                <div className="text-sm text-accent font-medium">
                  Underserved Residents
                  <br />
                  Identified
                </div>
              </div>
              <div>
                <div
                  className="text-5xl font-bold mb-2"
                  style={{ color: 'var(--civic-green-500)' }}
                >
                  60%
                </div>
                <div className="text-sm text-accent font-medium">
                  Faster Planning
                  <br />
                  with AI
                </div>
              </div>
              <div>
                <div
                  className="text-5xl font-bold mb-2"
                  style={{ color: 'var(--civic-blue-500)' }}
                >
                  $2.8M
                </div>
                <div className="text-sm text-accent font-medium">
                  Grant Funding
                  <br />
                  Unlocked
                </div>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-base text-accent leading-relaxed max-w-2xl mx-auto">
              <span className="font-semibold text-foreground">All Together Linked.</span> Because when communities are connected, possibilities are limitless. From remote work to online education, telehealth to civic engagement—public WiFi transforms lives.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
