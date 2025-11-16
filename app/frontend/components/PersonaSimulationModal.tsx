'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import PersonaCard from './PersonaCard';
import type { SimulationResponse } from '@/lib/types';

interface PersonaSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulationData: SimulationResponse | null;
  isLoading: boolean;
  error: string | null;
  onRegenerate: () => void;
}

export default function PersonaSimulationModal({
  isOpen,
  onClose,
  simulationData,
  isLoading,
  error,
  onRegenerate,
}: PersonaSimulationModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[10000] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-6xl bg-surface rounded-2xl border border-border shadow-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="px-6 py-5 border-b border-border flex items-center justify-between sticky top-0 bg-surface z-10 rounded-t-2xl">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      🎭 Community Impact Simulation
                    </h2>
                    {simulationData && (
                      <p className="text-sm text-accent mt-1">
                        {simulationData.data.site_name} • {simulationData.data.personas.length} Personas
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-muted hover:text-foreground"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  {/* Loading State */}
                  {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="w-16 h-16 border-4 border-civic-blue/30 border-t-civic-blue rounded-full animate-spin mb-4" />
                      <p className="text-foreground text-lg font-medium">Generating personas...</p>
                      <p className="text-accent text-sm mt-2">
                        Creating realistic community members based on census data
                      </p>
                    </div>
                  )}

                  {/* Error State */}
                  {error && !isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-foreground text-lg font-medium mb-2">Failed to Generate Personas</p>
                      <p className="text-accent text-sm mb-4">{error}</p>
                      <button
                        onClick={onRegenerate}
                        className="px-4 py-2 rounded-lg bg-civic-blue text-white font-medium hover:bg-civic-blue/90 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {/* Success State with Personas */}
                  {simulationData && !isLoading && !error && (
                    <>
                      {/* Summary Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-6 bg-surface-hover rounded-xl border border-border"
                      >
                        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                          <span className="text-2xl">💡</span>
                          Community Overview
                        </h3>
                        <p className="text-foreground mb-4 leading-relaxed">
                          {simulationData.data.summary.overall_sentiment}
                        </p>

                        <div className="grid md:grid-cols-3 gap-4">
                          {simulationData.data.summary.key_impacts.map((impact, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-civic-green mt-0.5">✓</span>
                              <span className="text-sm text-accent">{impact}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm text-foreground leading-relaxed">
                            {simulationData.data.summary.community_transformation}
                          </p>
                        </div>
                      </motion.div>

                      {/* Personas Grid */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {simulationData.data.personas.map((persona, index) => (
                          <PersonaCard key={persona.id} persona={persona} index={index} />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Footer */}
                {simulationData && !isLoading && !error && (
                  <div className="px-6 py-4 border-t border-border bg-surface rounded-b-2xl flex items-center justify-between sticky bottom-0">
                    <p className="text-sm text-accent">
                      Personas generated using AI based on census demographic data
                    </p>
                    <button
                      onClick={onRegenerate}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-hover border border-border hover:bg-civic-blue hover:border-civic-blue hover:text-white transition-all font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Regenerate Personas
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
