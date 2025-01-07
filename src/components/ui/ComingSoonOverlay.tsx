'use client';

import { motion } from 'framer-motion';
import { ParticleOrb } from './ParticleOrb';

export function ComingSoonOverlay() {
  return (
    <motion.div 
      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ParticleOrb />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 text-center"
      >
        <h4 className="text-lg font-light mb-2">Coming Soon</h4>
        <p className="text-sm text-neutral-400">
          We&apos;re working on something amazing
        </p>
      </motion.div>
    </motion.div>
  );
}
