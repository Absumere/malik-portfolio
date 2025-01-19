'use client';

import { useState, useEffect } from 'react';

export default function SplineScene() {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadSpline = async () => {
      try {
        const Spline = (await import('@splinetool/react-spline')).default;
        const splineContainer = document.getElementById('spline-container');
        
        if (splineContainer) {
          const viewer = new Spline({
            scene: 'https://prod.spline.design/xAToIHjdw3b5zWv7/scene.splinecode',
            container: splineContainer,
          });

          viewer.load().then(() => {
            setSplineLoaded(true);
          }).catch((err) => {
            console.error('Error loading Spline scene:', err);
            setError(true);
          });
        }
      } catch (err) {
        console.error('Error initializing Spline:', err);
        setError(true);
      }
    };

    loadSpline();

    return () => {
      // Cleanup if needed
      const container = document.getElementById('spline-container');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 z-0 bg-black flex items-center justify-center">
        <p className="text-white/70">Interactive background temporarily unavailable</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 bg-black">
      <div 
        id="spline-container" 
        className="w-full h-full"
        style={{ 
          opacity: splineLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      />
      {!splineLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
}
