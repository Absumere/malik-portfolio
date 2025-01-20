'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const CreativeText = ({ text }: { text: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

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

    let time = 0;
    const lines: { x1: number; y1: number; x2: number; y2: number; progress: number }[] = [];
    const maxLines = 15;

    const addLine = () => {
      if (lines.length >= maxLines) return;
      
      const x1 = Math.random() * canvas.width;
      const y1 = Math.random() * canvas.height;
      const angle = Math.random() * Math.PI * 2;
      const length = 50 + Math.random() * 100;
      
      lines.push({
        x1,
        y1,
        x2: x1 + Math.cos(angle) * length,
        y2: y1 + Math.sin(angle) * length,
        progress: 0
      });
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add new lines occasionally
      if (Math.random() < 0.05) {
        addLine();
      }

      // Update and draw lines
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        line.progress += 0.01;

        if (line.progress >= 1) {
          lines.splice(i, 1);
          continue;
        }

        const progress = Math.sin(line.progress * Math.PI);
        const alpha = progress * 0.5;
        
        // Draw line with gradient
        const gradient = ctx.createLinearGradient(line.x1, line.y1, line.x2, line.y2);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
      }

      time += 0.01;
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
        className="absolute inset-0 pointer-events-none opacity-75"
        style={{ mixBlendMode: 'screen' }}
      />
      <div
        ref={textRef}
        className="relative z-10 font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80"
      >
        {text}
      </div>
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
            <CreativeText text="Digital Art" />
            <br />
            <span className="text-4xl md:text-6xl font-light text-white/90">
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
