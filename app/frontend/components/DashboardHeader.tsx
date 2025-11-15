'use client';

import { useState } from 'react';

export default function DashboardHeader({
  onToggleChat,
  onToggleRecommendations,
  cityName
}: {
  onToggleChat: () => void;
  onToggleRecommendations?: () => void;
  cityName?: string;
}) {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You can add actual dark mode toggle logic here
  };

  const handleExport = (format: 'pdf' | 'csv' | 'kml') => {
    console.log(`Exporting as ${format}...`);
    // Export logic will be implemented later
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Logo/Title and Chat Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleChat}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-civic-blue text-white font-semibold hover:bg-civic-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Atlas
          </button>

          <div className="text-foreground">
            <span className="font-semibold text-lg">{cityName || 'Select a City'}</span>
            <span className="text-muted ml-2">• WiFi Planning Dashboard</span>
          </div>
        </div>

        {/* Right: Sites Button, Export Tools and Dark Mode Toggle */}
        <div className="flex items-center gap-3">
          {/* Sites/Recommendations Button */}
          {onToggleRecommendations && (
            <button
              onClick={onToggleRecommendations}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-civic-green text-white font-semibold hover:bg-civic-green-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Sites
            </button>
          )}

          {/* Export Buttons */}
          <div className="flex items-center gap-2 mr-4">
            <span className="text-sm text-muted font-medium mr-2">Export:</span>
            <button
              onClick={() => handleExport('pdf')}
              className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-surface-hover transition-colors"
            >
              PDF
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-surface-hover transition-colors"
            >
              CSV
            </button>
            <button
              onClick={() => handleExport('kml')}
              className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-surface-hover transition-colors"
            >
              KML
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg border border-border hover:bg-surface-hover transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
