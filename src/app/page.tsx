'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const GenerativeTitle = ({ children }: { children: React.ReactNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const textElement = textRef.current;
    if (!canvas || !textElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const rect = textElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initialize particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
    }> = [];

    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        life: Math.random()
      };
    };

    // Create initial particles
    for (let i = 0; i < 150; i++) {
      particles.push(createParticle());
    }

    const noise = (x: number, y: number, t: number) => {
      // Simplified noise function
      const X = Math.floor(x);
      const Y = Math.floor(y);
      const T = Math.floor(t);
      
      const value = Math.sin(
        X * 0.3 + Y * 0.2 + T * 0.1 +
        Math.sin(X * 0.1 + Y * 0.3 + T * 0.2) +
        Math.sin(X * 0.2 + Y * 0.1 + T * 0.3)
      );
      
      return value;
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      frameRef.current = requestAnimationFrame(animate);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      timeRef.current += 0.002;

      particles.forEach((particle, i) => {
        // Update velocity based on noise field
        const angle = noise(particle.x * 0.01, particle.y * 0.01, timeRef.current) * Math.PI * 2;
        particle.vx += Math.cos(angle) * 0.02;
        particle.vy += Math.sin(angle) * 0.02;

        // Apply some drag
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Update life
        particle.life -= 0.003;
        if (particle.life <= 0) {
          particles[i] = createParticle();
        }

        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.life * 0.5})`;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 50) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${
              (1 - distance / 50) * 0.2 * particle.life * other.life
            })`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });
    };

    animate();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
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
      <div ref={textRef} className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white relative overflow-hidden px-4">
      <div className="w-full max-w-4xl mx-auto -mt-16">
        <div className="space-y-8 text-center">
          <GenerativeTitle>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                Digital Art
                <br />
                <span className="text-4xl md:text-6xl font-light">
                  & Creative Development
                </span>
              </span>
            </h1>
          </GenerativeTitle>
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
