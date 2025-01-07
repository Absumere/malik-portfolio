'use client';

import Link from 'next/link';
import { RiveAnimation } from '@/components/RiveAnimation/RiveAnimation';
import { useEffect } from 'react';

export default function Home() {
  // Force scroll reset when component mounts
  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Reset immediately
    resetScroll();

    // Reset after a small delay to handle dynamic content
    const timeoutId = setTimeout(resetScroll, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-8">
        <h1 className="text-6xl font-bold tracking-tight mb-6 animate-scale-in">
          Digital Art & Creative Development
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Delivering advanced technical solutions in real-time graphics, machine learning, and interactive systems
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link 
            href="/portfolio" 
            className="px-8 py-4 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform"
          >
            View Portfolio
          </Link>
          <Link 
            href="/ai-tools" 
            className="px-8 py-4 border border-white/20 rounded-full font-medium hover:border-white/40 hover:scale-105 transition-all"
          >
            Explore AI Tools
          </Link>
        </div>
      </div>

      {/* Rive Animation Section */}
      <div className="w-full max-w-7xl mt-16">
        <RiveAnimation />
      </div>
    </main>
  );
}
