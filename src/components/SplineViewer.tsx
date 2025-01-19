'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        url?: string;
      };
    }
  }
}

export default function SplineViewer() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      <Script 
        type="module" 
        src="https://unpkg.com/@splinetool/viewer@1.9.59/build/spline-viewer.js"
        onLoad={() => setIsLoaded(true)}
      />
      <div className="w-full h-screen fixed inset-0 z-0" style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}>
        <spline-viewer 
          url="https://prod.spline.design/xAToIHjdw3b5zWv7/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </>
  );
}
