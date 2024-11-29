'use client';

import { ReactNode } from 'react';
import { Lenis as ReactLenis } from '@studio-freight/react-lenis';

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis 
      root 
      options={{
        lerp: 0.02,           // Ultra-low lerp for near-instant response
        duration: 0.2,        // Very short duration
        smoothWheel: true,
        smoothTouch: false,   // Disable smooth scrolling on touch for native feel
        wheelMultiplier: 2,   // Higher multiplier for faster scroll
        touchMultiplier: 2.5, // Higher touch sensitivity
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        normalizeWheel: true, // Normalize wheel across different devices
        syncTouch: true,      // Sync touch and wheel behavior
      }}
    >
      {children}
    </ReactLenis>
  );
}
