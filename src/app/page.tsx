'use client';

import Link from 'next/link';
import SplineViewer from '@/components/SplineViewer';
import Script from 'next/script';

export default function Home() {
  return (
    <>
      <Script id="structured-data" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["Person", "Artist"],
          "@id": "https://malikarbab.de/#person",
          "name": "Malik Arbab",
          "url": "https://malikarbab.de",
          "image": "https://malikarbab.de/malik-arbab.jpg",
          "sameAs": [
            "https://twitter.com/malikarbab",
            "https://github.com/malikarbab",
            "https://linkedin.com/in/malikarbab"
          ],
          "jobTitle": ["Visual Artist", "AI Developer"],
          "description": "Visual Artist and AI Developer specializing in machine learning, digital art, and creative technology",
          "knowsAbout": [
            "Machine Learning",
            "Digital Art",
            "Creative Technology",
            "WebGL",
            "Real-time Graphics",
            "Neural Networks"
          ],
          "workLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Berlin",
              "addressCountry": "DE"
            }
          }
        })}
      </Script>
      <div className="relative">
        {/* Hero Section */}
        <div className="h-screen relative overflow-hidden">
          {/* Content */}
          <div className="absolute top-[15%] sm:top-1/5 md:top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center max-w-4xl mx-auto space-y-4 md:space-y-4 z-20 px-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight animate-scale-in">
              Digital Art & Creative Development
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-gray-400 max-w-2xl mx-auto">
              Delivering advanced technical solutions in real-time graphics, machine learning, and interactive systems
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8">
              <Link 
                href="/portfolio" 
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform text-xs sm:text-sm md:text-base"
              >
                View Portfolio
              </Link>
              <Link 
                href="/ai-tools" 
                className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 border border-white/20 rounded-full font-medium hover:border-white/40 hover:scale-105 transition-all text-xs sm:text-sm md:text-base"
              >
                Explore AI Tools
              </Link>
            </div>
          </div>

          {/* Spline Scene */}
          <div className="absolute inset-x-0 top-[45%] sm:top-[35%] md:top-[25%] h-[35vh] sm:h-[70vh] md:h-[90vh] z-10">
            <SplineViewer 
              url="https://prod.spline.design/JSRfrdvgsrn49EQP/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="relative h-[20vh]">
          <div className="absolute inset-0">
            <SplineViewer 
              url="https://prod.spline.design/6EqZ6HwgTfB8LEy5/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Gradient transition */}
        <div className="h-4 bg-gradient-to-b from-transparent to-black/80" />
      </div>
    </>
  );
}
