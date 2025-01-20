'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const MatrixText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
  
  useEffect(() => {
    let iterations = 0;
    const maxIterations = 15;
    const interval = 50;
    
    const scramble = () => {
      const scrambled = text.split('').map((char, index) => {
        if (char === ' ') return ' ';
        if (iterations > maxIterations - (index / 3)) {
          return char;
        }
        return characters[Math.floor(Math.random() * characters.length)];
      }).join('');
      
      setDisplayText(scrambled);
      
      iterations++;
      if (iterations < maxIterations) {
        setTimeout(scramble, interval);
      }
    };
    
    scramble();
    
    return () => {
      iterations = maxIterations;
    };
  }, [text]);
  
  return <span>{displayText}</span>;
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
        <div className="w-full text-center">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
            <MatrixText text="Digital Art & Creative Development" />
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto">
            Exploring the intersection of art and technology through creative coding and digital experiences
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
  );
}
