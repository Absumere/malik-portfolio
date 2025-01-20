'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

// Perlin noise implementation
const noise = {
  grad3: new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,
                          1,0,1,-1,0,1,1,0,-1,-1,0,-1,
                          0,1,1,0,-1,1,0,1,-1,0,-1,-1]),
  p: new Uint8Array(256),
  perm: new Uint8Array(512),
  
  seed(seed: number) {
    if(seed > 0 && seed < 1) seed *= 65536;
    seed = Math.floor(seed);
    if(seed < 256) seed |= seed << 8;
    const p = this.p;
    for(let i = 0; i < 256; i++) {
      const v = i & 1 ? ((seed * i) >> 8) & 255 : (seed * i) & 255;
      p[i] = v;
    }
    for(let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
    }
  },

  noise2D(x: number, y: number) {
    const perm = this.perm;
    const grad3 = this.grad3;

    const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

    const s = (x + y) * F2;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const t = (i + j) * G2;
    
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = x - X0;
    const y0 = y - Y0;

    let i1, j1;
    if(x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2;
    const y2 = y0 - 1.0 + 2.0 * G2;

    const ii = i & 255;
    const jj = j & 255;

    const gi0 = perm[ii + perm[jj]] % 12 * 3;
    const gi1 = perm[ii + i1 + perm[jj + j1]] % 12 * 3;
    const gi2 = perm[ii + 1 + perm[jj + 1]] % 12 * 3;

    let n0 = 0.0;
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if(t0 >= 0) {
      t0 *= t0;
      n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0);
    }

    let n1 = 0.0;
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if(t1 >= 0) {
      t1 *= t1;
      n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
    }

    let n2 = 0.0;
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if(t2 >= 0) {
      t2 *= t2;
      n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
    }

    return 70.0 * (n0 + n1 + n2);
  }
};

noise.seed(Math.random());

const GenerativeTitle = ({ children }: { children: React.ReactNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<{x: number; y: number; vx: number; vy: number; life: number}[]>([]);
  const timeRef = useRef(0);

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
    const numParticles = 200;
    particlesRef.current = Array.from({ length: numParticles }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0,
      vy: 0,
      life: Math.random()
    }));

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      timeRef.current += 0.002;

      particlesRef.current.forEach((particle, i) => {
        // Use Perlin noise for organic movement
        const angle = noise.noise2D(particle.x * 0.005, particle.y * 0.005 + timeRef.current) * Math.PI * 2;
        particle.vx = Math.cos(angle) * 0.5;
        particle.vy = Math.sin(angle) * 0.5;

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Update life cycle
        particle.life -= 0.001;
        if (particle.life <= 0) {
          particle.life = 1;
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }

        // Draw particle
        const size = 1 + noise.noise2D(timeRef.current + i * 0.1, 0) * 2;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.life * 0.5})`;
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        particlesRef.current.forEach((other, j) => {
          if (i === j) return;
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 50) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - distance / 50) * 0.15 * particle.life * other.life})`;
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
