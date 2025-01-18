'use client';

import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import { useResponsive } from '@/hooks/useResponsive';

interface SplineViewerProps {
  url: string;
  className?: string;
}

export default function SplineViewer({ url, className = '' }: SplineViewerProps) {
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
    }, 10000); // Set error after 10 seconds if not loaded

    return () => clearTimeout(timeout);
  }, [isLoaded]);

  useEffect(() => {
    // Add event listeners to the spline-viewer element
    const viewer = document.querySelector('spline-viewer');
    if (viewer) {
      viewer.addEventListener('load', handleLoad);
      viewer.addEventListener('error', handleError);
    }

    return () => {
      if (viewer) {
        viewer.removeEventListener('load', handleLoad);
        viewer.removeEventListener('error', handleError);
      }
    };
  }, [handleLoad, handleError]);

  return (
    <div className={`relative ${className}`}>
      <Script 
        type="module" 
        src="https://unpkg.com/@splinetool/viewer@1.9.56/build/spline-viewer.js" 
        strategy="afterInteractive"
        onError={handleError}
      />
      
      {/* Loading state */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center px-4">
            <p className="text-red-400 mb-2">Failed to load 3D scene</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-sm text-white/70 hover:text-white underline"
            >
              Reload page
            </button>
          </div>
        </div>
      )}

      {/* Spline Viewer */}
      <spline-viewer 
        url={url}
        className="w-full h-full"
        style={{ 
          width: '100%', 
          height: '100%',
          pointerEvents: isMobile ? 'none' : 'auto', // Disable interaction on mobile
          opacity: hasError ? '0.3' : '1'
        }}
      />
    </div>
  );
}
