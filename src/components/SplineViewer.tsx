'use client';

import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import { useResponsive } from '@/hooks/useResponsive';

interface SplineViewerProps {
  url?: string;
  className?: string;
}

export default function SplineViewer({ 
  url = 'https://prod.spline.design/JSRfrdvgsrn49EQP/scene.splinecode',
  className = '' 
}: SplineViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { isMobile } = useResponsive();

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        setHasError(true);
      }
    }, 15000); // Increased timeout to 15 seconds

    return () => clearTimeout(timeout);
  }, [isLoaded]);

  useEffect(() => {
    const loadSpline = async () => {
      try {
        // Reset states when trying to load
        setHasError(false);
        setIsLoaded(false);

        // Add event listeners to the spline-viewer element
        const viewer = document.querySelector('spline-viewer');
        if (viewer) {
          viewer.addEventListener('load', handleLoad);
          viewer.addEventListener('error', handleError);
        }
      } catch (error) {
        console.error('Error loading Spline:', error);
        setHasError(true);
      }
    };

    loadSpline();

    return () => {
      const viewer = document.querySelector('spline-viewer');
      if (viewer) {
        viewer.removeEventListener('load', handleLoad);
        viewer.removeEventListener('error', handleError);
      }
    };
  }, [handleLoad, handleError]);

  return (
    <>
      <Script 
        src="https://unpkg.com/@splinetool/viewer@1.0.50/build/spline-viewer.js"
        strategy="beforeInteractive"
        onError={handleError}
      />
      <div className={`relative w-full h-full ${className}`}>
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <p className="text-red-500 mb-2">Failed to load 3D scene</p>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoaded(false);
                const viewer = document.querySelector('spline-viewer');
                if (viewer) {
                  viewer.setAttribute('url', url);
                }
              }}
              className="text-sm text-white/60 hover:text-white underline"
            >
              Reload scene
            </button>
          </div>
        ) : (
          <spline-viewer
            url={url}
            loading-anim
            loading="lazy"
            className={`w-full h-full ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          />
        )}
      </div>
    </>
  );
}
