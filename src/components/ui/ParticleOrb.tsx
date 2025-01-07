'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';
import { GravityField } from './GravityField';

export function ParticleOrb() {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimationControls();

  useEffect(() => {
    if (isHovered) {
      controls.start({
        scale: 1.05,
        transition: {
          duration: 1,
          ease: [0.4, 0, 0.2, 1]
        }
      });
    } else {
      controls.start({
        scale: 1,
        transition: {
          duration: 1.2,
          ease: [0.4, 0, 0.2, 1]
        }
      });
    }
  }, [isHovered, controls]);

  return (
    <div className="relative w-[800px] h-[400px] flex items-center justify-center">
      <GravityField isOrbHovered={isHovered} />
      
      <motion.div 
        className="relative w-40 h-40 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={controls}
      >
        {/* Deep space particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: i * 0.1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Core orb */}
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Deep space layer */}
          <div 
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.95) 100%)',
              boxShadow: isHovered 
                ? '0 0 100px rgba(255,255,255,0.2), inset 0 0 60px rgba(255,255,255,0.15)'
                : '0 0 60px rgba(255,255,255,0.1), inset 0 0 40px rgba(255,255,255,0.1)'
            }}
          />

          {/* Galaxy-like swirl */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            animate={{
              rotate: 360
            }}
            transition={{
              duration: isHovered ? 15 : 25,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-full h-full"
                style={{
                  background: `conic-gradient(from ${90 * i}deg, transparent 0deg, rgba(255,255,255,${isHovered ? 0.06 : 0.03}) 60deg, transparent 120deg)`,
                  transform: `rotate(${90 * i}deg)`
                }}
              />
            ))}
          </motion.div>

          {/* Nebula effects */}
          <motion.div
            className="absolute inset-0 rounded-full mix-blend-screen"
            style={{
              background: isHovered
                ? 'radial-gradient(circle at 30% 40%, rgba(64,156,255,0.15), transparent 60%), radial-gradient(circle at 70% 60%, rgba(255,64,255,0.15), transparent 60%)'
                : 'radial-gradient(circle at 30% 40%, rgba(64,156,255,0.08), transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,64,255,0.08), transparent 50%)'
            }}
            animate={{
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: isHovered ? 3 : 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Energy field */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)'
            }}
            animate={{
              opacity: isHovered ? [0.4, 0.8, 0.4] : [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>

        {/* Outer glow */}
        <motion.div
          className="absolute -inset-8 rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.15), transparent 70%)'
          }}
          animate={{
            scale: isHovered ? [0.95, 1.05, 0.95] : [0.98, 1.02, 0.98]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
    </div>
  );
}
