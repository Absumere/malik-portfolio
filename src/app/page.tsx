'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

const MatrixText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const targetRef = useRef(text);
  const iterationsRef = useRef(0);
  const frameRef = useRef(0);
  
  const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ';
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const maxFrames = 20;
    const interval = 40; // Faster initial animation
    
    const scramble = () => {
      const frame = frameRef.current;
      const currentText = targetRef.current;
      
      const scrambled = currentText.split('').map((targetChar, charIndex) => {
        if (targetChar === ' ') return ' ';
        
        // Calculate progress for this character (0 to 1)
        const charProgress = Math.max(0, frame - charIndex * 1.5) / maxFrames;
        
        // If we've reached the final state for this character
        if (charProgress >= 1) {
          return targetChar;
        }
        
        // Random character selection with bias towards the target character
        if (Math.random() < charProgress * 0.5) {
          return targetChar;
        }
        
        // Select random character with preference for matrix-like characters
        const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
        return randomChar;
      }).join('');
      
      setDisplayText(scrambled);
      
      frameRef.current++;
      
      // Continue animation if not all characters have settled
      if (frameRef.current <= maxFrames + currentText.length * 1.5) {
        timeoutId = setTimeout(scramble, interval);
      }
    };
    
    // Reset and start animation
    frameRef.current = 0;
    targetRef.current = text;
    scramble();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text]);
  
  return (
    <span className="font-mono tracking-tight">
      {displayText}
    </span>
  );
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white relative overflow-hidden px-4">
      <div className="w-full max-w-4xl mx-auto -mt-16">
        <div className="space-y-8 text-center">
          <h1 className="text-5xl md:text-7xl font-light tracking-tight">
            <MatrixText text="Digital Art & Creative Development" />
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
