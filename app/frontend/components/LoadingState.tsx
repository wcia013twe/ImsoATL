'use client';

import { motion } from 'framer-motion';

export default function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-12 h-12 border-4 border-civic-blue/30 border-t-civic-blue rounded-full mx-auto mb-4"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-foreground text-lg"
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
}
