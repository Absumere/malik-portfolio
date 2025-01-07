'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface GravityFieldProps {
  isOrbHovered: boolean;
}

export function GravityField({ isOrbHovered }: GravityFieldProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;

    // Initialize particles
    const initialParticles: Particle[] = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 1.5 + 0.5,
    }));

    setParticles(initialParticles);

    const updateParticles = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setParticles(prevParticles => {
        const centerX = width / 2;
        const centerY = height / 2;
        
        return prevParticles.map(particle => {
          const dx = centerX - particle.x;
          const dy = centerY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Gravitational force
          const force = isOrbHovered ? 0.3 : 0.1;
          const ax = (dx / distance) * force;
          const ay = (dy / distance) * force;

          // Update velocity with gravitational acceleration
          let newVx = particle.vx + ax * (deltaTime / 16);
          let newVy = particle.vy + ay * (deltaTime / 16);

          // Add some random movement
          newVx += (Math.random() - 0.5) * 0.1;
          newVy += (Math.random() - 0.5) * 0.1;

          // Damping
          newVx *= 0.99;
          newVy *= 0.99;

          // Update position
          let newX = particle.x + newVx;
          let newY = particle.y + newVy;

          // Wrap around edges
          if (newX < 0) newX = width;
          if (newX > width) newX = 0;
          if (newY < 0) newY = height;
          if (newY > height) newY = 0;

          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        });
      });

      animationRef.current = requestAnimationFrame(updateParticles);
    };

    animationRef.current = requestAnimationFrame(updateParticles);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOrbHovered]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
            opacity: isOrbHovered ? 0.3 : 0.15,
          }}
          animate={{
            scale: isOrbHovered ? [1, 1.5, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
