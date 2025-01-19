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

  // Reset error state when component mounts or URL changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [url]);

  return (
    <>
      <Script 
        src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js"
        strategy="beforeInteractive"
      />
      <div className={`relative w-full h-full ${className}`}>
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <p className="text-red-500 mb-2">Failed to load 3D scene</p>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoaded(false);
                const viewer = document.querySelector('spline-viewer');
                if (viewer) {
                  viewer.remove();
                  const newViewer = document.createElement('spline-viewer');
                  newViewer.setAttribute('url', url);
                  newViewer.setAttribute('class', `w-full h-full ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`);
                  viewer.parentElement?.appendChild(newViewer);
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
            loading="lazy"
            events-target="global"
            onLoad={handleLoad}
            onError={handleError}
            style={{ 
              width: '100%', 
              height: '100%',
              opacity: isLoaded ? '1' : '0',
              transition: 'opacity 0.5s ease-in-out',
              pointerEvents: isMobile ? 'none' : 'auto'
            }}
          />
        )}
      </div>
    </>
  );
}
