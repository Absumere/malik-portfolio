'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function SpectralWave() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full absolute"
        style={{ filter: 'blur(1px)' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,50 C30,60 70,40 100,50"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: 1,
            pathOffset: [0, 1],
          }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity,
          }}
        />
        <motion.path
          d="M0,50 C20,30 80,70 100,50"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: 1,
            pathOffset: [0, 1],
          }}
          transition={{
            duration: 3,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      </svg>
    </div>
  );
}
