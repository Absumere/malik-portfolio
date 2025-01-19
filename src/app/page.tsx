'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import { Suspense } from 'react';

// Dynamically import Spline without SSR
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => null,
});

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

      <div className="fixed inset-0 z-0 bg-black">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        }>
          <Spline 
            scene="https://prod.spline.design/xAToIHjdw3b5zWv7/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      </div>

      <main className="relative min-h-screen">
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl w-full text-center mt-32 mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight animate-scale-in mb-6 sm:mb-8">
              Digital Art & Creative Development
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 sm:mb-12">
              Delivering advanced technical solutions in real-time graphics, machine learning, and interactive systems
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/portfolio"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                View Portfolio
              </Link>
              <Link
                href="/ai-tools"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                Explore AI Tools
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
