'use client';

import Link from 'next/link';
import SplineViewer from '@/components/SplineViewer';

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="h-screen relative overflow-hidden">
        {/* Content */}
        <div className="absolute top-1/4 md:top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center max-w-4xl mx-auto space-y-4 md:space-y-6 z-20 px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-scale-in">
            Digital Art & Creative Development
          </h1>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto">
            Delivering advanced technical solutions in real-time graphics, machine learning, and interactive systems
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-6 md:mt-8">
            <Link 
              href="/portfolio" 
              className="px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform text-sm md:text-base"
            >
              View Portfolio
            </Link>
            <Link 
              href="/ai-tools" 
              className="px-6 md:px-8 py-3 md:py-4 border border-white/20 rounded-full font-medium hover:border-white/40 hover:scale-105 transition-all text-sm md:text-base"
            >
              Explore AI Tools
            </Link>
          </div>
        </div>

        {/* Spline Scene */}
        <div className="absolute inset-x-0 top-[35%] md:top-[25%] h-[70vh] md:h-[90vh] z-10">
          <SplineViewer 
            url="https://prod.spline.design/JSRfrdvgsrn49EQP/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>

      <div className="relative h-[30vh]">
        <div className="absolute inset-0">
          <SplineViewer 
            url="https://prod.spline.design/6EqZ6HwgTfB8LEy5/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Gradient transition */}
      <div className="h-6 bg-gradient-to-b from-transparent to-black/80" />
    </div>
  );
}
