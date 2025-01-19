'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        url?: string;
      };
    }
  }
}

export default function SplineBackground() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  return (
    <>
      <Script
        src="https://unpkg.com/@splinetool/viewer@1.9.59/build/spline-viewer.js"
        type="module"
        onLoad={() => setIsScriptLoaded(true)}
      />
      <div className="fixed inset-0 z-0 bg-black">
        {isScriptLoaded ? (
          <spline-viewer
            url="https://prod.spline.design/xAToIHjdw3b5zWv7/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </>
  );
}
