'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Spline to prevent SSR issues
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});

function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-0 bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
    </div>
  );
}

export default function SplineScene() {
  const [error, setError] = useState(false);

  const handleError = () => {
    console.error('Failed to load Spline scene');
    setError(true);
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-0 bg-black flex items-center justify-center">
        <p className="text-white/70">Interactive background temporarily unavailable</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0">
      <Suspense fallback={<LoadingSpinner />}>
        <Spline
          scene="https://prod.spline.design/xAToIHjdw3b5zWv7/scene.splinecode"
          onError={handleError}
          style={{ width: '100%', height: '100%' }}
        />
      </Suspense>
    </div>
  );
}
