'use client';

import { motion, useReducedMotion } from 'framer-motion';
import AnimatedGlobe from './AnimatedGlobe';
import CitySelector from './CitySelector';
import Globe3D from './Globe3D';
import AnimatedNumber from './AnimatedNumber';

export default function LandingPage() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-950">
      {/* Animated Globe Background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={shouldReduceMotion ? { duration: 0.01 } : { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-0 w-full h-full opacity-30"
      >
        <Globe3D />
      </motion.div>

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 via-transparent to-gray-950/50 z-[5]" />

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="max-w-4xl w-full space-y-8">

          {/* Logo/Title Section */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0.01 } : { delay: 0.3, duration: 0.4 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gray-900/60 backdrop-blur-sm border border-gray-800"
            >
              <span className="text-xs font-bold text-gray-400 tracking-[0.25em] uppercase">All Together Linked</span>
              <span className="text-blue-400">•</span>
              <span className="text-blue-400 font-bold text-xs tracking-wider">ATL</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0.01 } : { delay: 0.5, duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight"
            >
              Connecting Every Community
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-emerald-400">
                One WiFi Network at a Time
              </span>
            </motion.h1>
          </div>

          {/* City Selector */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0.01 } : { delay: 0.8, duration: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <CitySelector />
          </motion.div>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={shouldReduceMotion ? { duration: 0.01 } : { duration: 0.5, delay: 0 }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -4 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-md border border-gray-800/50 p-8 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <AnimatedNumber
                  value={135000}
                  format="K+"
                  className="text-5xl font-bold text-blue-400 mb-3"
                />
                <div className="text-sm text-gray-400 font-medium leading-relaxed">
                  Underserved Residents Identified
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={shouldReduceMotion ? { duration: 0.01 } : { duration: 0.5, delay: 0.15 }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -4 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-md border border-gray-800/50 p-8 hover:border-emerald-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <AnimatedNumber
                  value={60}
                  format="%"
                  className="text-5xl font-bold text-emerald-400 mb-3"
                />
                <div className="text-sm text-gray-400 font-medium leading-relaxed">
                  Faster Planning with AI
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={shouldReduceMotion ? { duration: 0.01 } : { duration: 0.5, delay: 0.3 }}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -4 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-md border border-gray-800/50 p-8 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <AnimatedNumber
                  value={2800000}
                  format="$M"
                  className="text-5xl font-bold text-blue-400 mb-3"
                />
                <div className="text-sm text-gray-400 font-medium leading-relaxed">
                  Grant Funding Unlocked
                </div>
              </div>
            </motion.div>
          </div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={shouldReduceMotion ? { duration: 0.01 } : { delay: 0.2, duration: 0.5 }}
              className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              AI-powered platform helping city officials plan and deploy public WiFi networks
              that maximize equity, minimize cost, and transform communities.
            </motion.p>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={shouldReduceMotion ? { duration: 0.01 } : { delay: 0.3, duration: 0.5 }}
            className="text-center max-w-3xl mx-auto pt-8 border-t border-gray-800/50"
          >
            <p className="text-base text-gray-400 leading-relaxed">
              <span className="font-semibold text-white">All Together Linked.</span> Because when communities are connected,
              possibilities are limitless. 
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
