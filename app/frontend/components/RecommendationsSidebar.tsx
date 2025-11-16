'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { fadeInUp, sidebarSlide, getTransition, TRANSITION, SPRING } from '@/utils/motionVariants';
import { useAnimationContext } from '@/contexts/AnimationContext';
import SiteCard from './SiteCard';
import AnimatedNumber from './AnimatedNumber';
import type { DeploymentPlan } from '@/lib/types';

interface RecommendationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  deploymentPlan: DeploymentPlan | null;
  onSiteClick?: (siteIndex: number) => void;
}

export default function RecommendationsSidebar({
  isOpen,
  onClose,
  deploymentPlan,
  onSiteClick
}: RecommendationsSidebarProps) {
  const shouldReduceMotion = useReducedMotion();
  const { siteRevealKey } = useAnimationContext();

  return (
    <>
      {/* Backdrop (optional, for mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Right Sidebar */}
      <motion.div
        initial={false}
        animate={isOpen ? 'visible' : 'hidden'}
        variants={sidebarSlide('right')}
        transition={{
          type: 'spring',
          ...SPRING.snappy,
        }}
        className="fixed top-0 right-0 h-full w-96 bg-surface border-l border-border z-40"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  WiFi Deployment Sites
                </h2>
                <p className="text-sm text-accent">
                  {deploymentPlan?.recommended_sites_count || 0} sites recommended
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-surface-hover transition-colors text-muted hover:text-foreground"
                title="Close recommendations"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          {deploymentPlan ? (
            <>
              {/* Impact Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={getTransition(
                  { duration: 0.4, delay: 0.1 },
                  shouldReduceMotion
                )}
                className="px-6 py-4 border-b border-border bg-surface-hover"
              >
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                  Projected Impact
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <AnimatedNumber
                      value={deploymentPlan.projected_impact.total_population_served || 0}
                      format="none"
                      className="text-2xl font-bold text-civic-green"
                    />
                    <div className="text-xs text-accent mt-1">People Reached</div>
                  </div>
                  <div>
                    <AnimatedNumber
                      value={deploymentPlan.projected_impact.households_without_internet_served || 0}
                      format="none"
                      className="text-2xl font-bold text-civic-blue"
                    />
                    <div className="text-xs text-accent mt-1">Households Connected</div>
                  </div>
                </div>
                {deploymentPlan.projected_impact.residents_in_poverty_served && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="text-civic-green">
                      <AnimatedNumber
                        value={deploymentPlan.projected_impact.residents_in_poverty_served}
                        format="none"
                        className="text-xl font-bold"
                      />
                    </div>
                    <div className="text-xs text-accent mt-1">Residents in Poverty Served</div>
                  </div>
                )}
              </motion.div>

              {/* Scrollable Site List */}
              <motion.div
                key={siteRevealKey}
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.2,
                    },
                  },
                }}
                className="flex-1 overflow-y-auto px-6 py-4 space-y-3"
              >
                {deploymentPlan.recommended_sites.map((site, index) => (
                  <motion.div
                    key={site.tract_id}
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={getTransition(TRANSITION.snappy, shouldReduceMotion)}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02, x: -4 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                  >
                    <SiteCard
                      site={site}
                      rank={index + 1}
                      onClick={onSiteClick ? () => onSiteClick(index) : undefined}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center px-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={getTransition(
                  { duration: 0.4, delay: 0.3 },
                  shouldReduceMotion
                )}
                className="text-center"
              >
                <div className="text-4xl mb-3">📊</div>
                <p className="text-foreground font-medium">No recommendations yet</p>
                <p className="text-accent text-sm mt-2">
                  Ask the AI assistant about WiFi deployment to see ranked sites
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
