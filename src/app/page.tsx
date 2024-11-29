'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-8">
        <h1 className="text-6xl font-bold tracking-tight mb-6 animate-scale-in">
          Digital Art & Creative Development
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Exploring the intersection of art and technology through innovative digital experiences
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

      {/* Featured Section */}
      <div className="mt-32 w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-8 text-center">Featured Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="aspect-square relative overflow-hidden rounded-lg hover:scale-105 transition-transform"
            >
              <img
                src={`https://source.unsplash.com/random/800x800/?digital-art&sig=${i}`}
                alt={`Featured artwork ${i}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
