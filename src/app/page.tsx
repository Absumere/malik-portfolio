'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const NeuralFlowText = ({ text }: { text: string }) => {
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

    // Neural network nodes
    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    const numNodes = 50;
    const connectionDistance = 100;
    
    // Initialize nodes
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      // Clear canvas with slight fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i === j) return;
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const alpha = (1 - distance / connectionDistance) * 0.2;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        });

        // Draw node
        ctx.beginPath();
        ctx.fillStyle = 'rgba(100, 200, 255, 0.8)';
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
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
        className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x"
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
            <NeuralFlowText text="Digital Art" />
            <br />
            <span className="text-4xl md:text-6xl font-light bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
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
