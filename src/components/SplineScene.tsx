'use client';

import Spline from '@splinetool/react-spline';

export default function SplineScene() {
  return (
    <div className="fixed inset-0 z-0">
      <Spline
        scene="https://prod.spline.design/xAToIHjdw3b5zWv7/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
