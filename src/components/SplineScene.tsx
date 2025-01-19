'use client';

import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-0 bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
    </div>
  ),
});

export default function SplineScene() {
  return (
    <div className="fixed inset-0 z-0 bg-black">
      <Spline
        scene="https://prod.spline.design/xAToIHjdw3b5zWv7/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
