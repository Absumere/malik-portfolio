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
      <div className="relative min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 relative overflow-hidden flex flex-col justify-start">
          {/* Content */}
          <div className="relative pt-20 sm:pt-24 md:pt-32 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto text-center z-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight animate-scale-in mb-4 sm:mb-6">
              Digital Art & Creative Development
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10">
              Delivering advanced technical solutions in real-time graphics, machine learning, and interactive systems
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-12 sm:mb-16">
              <Link 
                href="/portfolio" 
                className="px-8 py-3 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform text-base"
              >
                View Portfolio
              </Link>
              <Link 
                href="/ai-tools" 
                className="px-8 py-3 border border-white/20 rounded-full font-medium hover:border-white/40 hover:scale-105 transition-all text-base"
              >
                Explore AI Tools
              </Link>
            </div>
          </div>

          {/* Single Spline Scene with Gradient Overlay */}
          <div className="relative flex-1 min-h-[60vh] w-full">
            <SplineViewer 
              url="https://prod.spline.design/JSRfrdvgsrn49EQP/scene.splinecode"
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />
          </div>
        </div>
      </div>
    </>
  );
}
