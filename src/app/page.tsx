'use client';

import { useEffect, useState } from 'react';

const MatrixText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
  
  useEffect(() => {
    let iterations = 0;
    const maxIterations = 8; // Reduced iterations for faster settling
    const interval = 80; // Slowed down the interval
    let timeoutId: NodeJS.Timeout;
    
    const scramble = () => {
      const scrambled = text.split('').map((char, index) => {
        if (char === ' ') return ' ';
        if (iterations > maxIterations - (index / 5)) { // Slower progression through characters
          return char;
        }
        return characters[Math.floor(Math.random() * characters.length)];
      }).join('');
      
      setDisplayText(scrambled);
      
      iterations++;
      if (iterations < maxIterations) {
        timeoutId = setTimeout(scramble, interval);
      } else {
        // Start a new scramble after a delay
        timeoutId = setTimeout(() => {
          iterations = 0;
          scramble();
        }, 5000); // Wait 5 seconds before repeating
      }
    };
    
    scramble();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text]);
  
  return <span>{displayText}</span>;
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white relative overflow-hidden px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="space-y-8 text-center">
          <h1 className="text-5xl md:text-7xl font-light tracking-tight">
            <MatrixText text="Digital Art & Creative Development" />
          </h1>
          <p className="text-neutral-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
            Exploring the intersection of art and technology through creative coding and digital experiences
          </p>
        </div>
      </div>
    </main>
  );
}
