'use client';

import { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeInDown, getTransition, TRANSITION } from '@/utils/motionVariants';
import type { Location } from '@/utils/boundariesApi';

export default function DashboardHeader({
  onToggleChat,
  onToggleRecommendations,
  cityName,
  location,
  onRunPipeline,
  isRunningPipeline
}: {
  onToggleChat: () => void;
  onToggleRecommendations?: () => void;
  cityName?: string;
  location?: Location | null;
  onRunPipeline?: () => void;
  isRunningPipeline?: boolean;
}) {
  const [darkMode, setDarkMode] = useState(true);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // You can add actual dark mode toggle logic here
  };

  const handleExport = (format: 'pdf' | 'csv' | 'kml') => {
    console.log(`Exporting as ${format}...`);
    setExportDropdownOpen(false);
    // Export logic will be implemented later
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.08)}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Logo/Title and Chat Toggle */}
        <motion.div variants={fadeInDown} className="flex items-center gap-4">
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            onClick={onToggleChat}
            className="flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/30 text-blue-300 font-semibold hover:bg-gradient-to-br hover:from-blue-500/30 hover:to-blue-600/30 hover:border-blue-400/50 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Atlas
          </motion.button>

          <div className="text-foreground">
            <span className="font-semibold text-lg">{cityName || 'Select a City'}</span>
            <span className="text-muted ml-2">• WiFi Planning Dashboard</span>
          </div>
        </motion.div>

        {/* Right: Run Pipeline Button, Sites Button, Export Tools and Dark Mode Toggle */}
        <motion.div variants={fadeInDown} className="flex items-center gap-3">
    
          {/* {onRunPipeline && location && (
            <motion.button
              onClick={onRunPipeline}
              disabled={isRunningPipeline}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className="flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/30 text-purple-300 font-semibold hover:bg-gradient-to-br hover:from-purple-500/30 hover:to-purple-600/30 hover:border-purple-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunningPipeline ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Run Pipeline
                </>
              )}
            </motion.button>
          )} */}

          {/* Sites/Recommendations Button */}
          {onToggleRecommendations && (
            <motion.button
              onClick={onToggleRecommendations}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className="flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm border border-emerald-400/30 text-emerald-300 font-semibold hover:bg-gradient-to-br hover:from-emerald-500/30 hover:to-emerald-600/30 hover:border-emerald-400/50 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Sites
            </motion.button>
          )}

          {/* Export Dropdown */}
          <div className="relative mr-4">
            <motion.button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className="flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-to-br from-gray-500/20 to-gray-600/20 backdrop-blur-sm border border-gray-400/30 text-gray-300 font-semibold hover:bg-gradient-to-br hover:from-gray-500/30 hover:to-gray-600/30 hover:border-gray-400/50 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
              <svg className={`w-4 h-4 transition-transform ${exportDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {exportDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setExportDropdownOpen(false)}
                  />

                  {/* Dropdown */}
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={getTransition({ duration: 0.2 }, shouldReduceMotion || false)}
                    className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-surface shadow-lg z-50"
                  >
                    <motion.div
                      variants={staggerContainer(0.05)}
                      initial="hidden"
                      animate="visible"
                      className="py-1"
                    >
                      <motion.button
                        variants={fadeInDown}
                        onClick={() => handleExport('pdf')}
                        whileHover={shouldReduceMotion ? {} : { x: 4 }}
                        className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-surface-hover transition-colors flex items-center gap-3"
                      >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Export as PDF
                      </motion.button>
                      <motion.button
                        variants={fadeInDown}
                        onClick={() => handleExport('csv')}
                        whileHover={shouldReduceMotion ? {} : { x: 4 }}
                        className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-surface-hover transition-colors flex items-center gap-3"
                      >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export as CSV
                      </motion.button>
                      <motion.button
                        variants={fadeInDown}
                        onClick={() => handleExport('kml')}
                        whileHover={shouldReduceMotion ? {} : { x: 4 }}
                        className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-surface-hover transition-colors flex items-center gap-3"
                      >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Export as KML
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          {/* <button
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
          </button> */}
        </motion.div>
      </div>
    </motion.header>
  );
}
