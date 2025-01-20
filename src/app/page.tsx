'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const DigitalText = ({ text }: { text: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Create a glitch effect every few seconds
    intervalRef.current = setInterval(() => {
      setIsHovered(false);
      setTimeout(() => setIsHovered(true), 100);
    }, 2000);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <div className="relative inline-block">
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
            <feBlend mode="multiply" />
          </filter>
          <filter id="distort">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.01 0.01"
              numOctaves="1"
              seed="1"
              stitchTiles="stitch"
            >
              <animate
                attributeName="baseFrequency"
                values="0.01 0.01;0.02 0.02;0.01 0.01"
                dur="2s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="10" />
          </filter>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="blur" operator="over" in2="SourceGraphic" />
          </filter>
        </defs>
      </svg>
      <motion.div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={isHovered ? {
          filter: [
            'url(#distort) brightness(1.2)',
            'url(#noise) brightness(1.1)',
            'url(#glow) brightness(1.2)',
          ],
          transition: { duration: 0.2, repeat: Infinity, repeatType: 'reverse' }
        } : {
          filter: 'none',
          transition: { duration: 0.3 }
        }}
      >
        <motion.span
          className={`inline-block font-bold bg-gradient-to-r from-white via-white/90 to-white bg-clip-text text-transparent`}
          animate={isHovered ? {
            x: [-1, 1, -1],
            transition: { duration: 0.2, repeat: Infinity }
          } : { x: 0 }}
        >
          {text}
        </motion.span>
        <AnimatePresence>
          {isHovered && (
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 opacity-50 mix-blend-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const GenerativeText = ({ text }: { text: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<{x: number; y: number; angle: number; speed: number; size: number}[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const textElement = textRef.current;
    if (!canvas || !textElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match text element
    const updateCanvasSize = () => {
      const rect = textElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initialize particles
    const numParticles = 100;
    particlesRef.current = Array.from({ length: numParticles }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      angle: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.3,
      size: 1 + Math.random() * 2
    }));

    let time = 0;
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01;

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Update position with flowing motion
        particle.angle += Math.sin(time + i * 0.1) * 0.02;
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with gradient
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        
        // Use time to create color transitions
        const hue = (time * 10 + i) % 360;
        gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, 0.8)`);
        gradient.addColorStop(1, `hsla(${hue}, 100%, 70%, 0)`);

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        particlesRef.current.forEach((other, j) => {
          if (i === j) return;
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 50) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${0.2 * (1 - distance / 50)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
      <div
        ref={textRef}
        className="relative z-10 font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#ff3366] via-[#ff6b6b] to-[#4834d4]"
      >
        {text}
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white relative overflow-hidden px-4">
      <div className="w-full max-w-4xl mx-auto -mt-16">
        <div className="space-y-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            <DigitalText text="Digital Art" />
            <br />
            <span className="text-4xl md:text-6xl font-light bg-gradient-to-r from-white/90 to-white/70 bg-clip-text text-transparent">
              & Creative Development
            </span>
          </h1>
          <p className="text-neutral-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
            Exploring the intersection of art and technology through creative coding and digital experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/portfolio"
              className="px-8 py-3 bg-white text-black rounded-sm hover:bg-white/90 transition-colors text-lg font-light"
            >
              View Portfolio
            </Link>
            <Link
              href="/ai-tools"
              className="px-8 py-3 border border-white text-white rounded-sm hover:bg-white/10 transition-colors text-lg font-light"
            >
              AI Tools
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
