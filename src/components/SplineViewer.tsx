'use client';

import Script from 'next/script';

interface SplineViewerProps {
  url: string;
  className?: string;
}

export default function SplineViewer({ url, className = '' }: SplineViewerProps) {
  return (
    <>
      <Script 
        type="module" 
        src="https://unpkg.com/@splinetool/viewer@1.9.56/build/spline-viewer.js" 
        strategy="afterInteractive"
      />
      <spline-viewer 
        url={url}
        className={`${className} w-full h-full`}
        style={{ 
          width: '100%', 
          height: '100%',
          pointerEvents: 'auto'
        }}
      />
    </>
  );
}
