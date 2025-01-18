'use client';

import { useEffect, useState } from 'react';

export const MobileDebug = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 bg-black/50 text-white text-xs p-1 font-mono">
      <div className="block sm:hidden">xs (&lt;640px)</div>
      <div className="hidden sm:block md:hidden">sm (≥640px)</div>
      <div className="hidden md:block lg:hidden">md (≥768px)</div>
      <div className="hidden lg:block xl:hidden">lg (≥1024px)</div>
      <div className="hidden xl:block 2xl:hidden">xl (≥1280px)</div>
      <div className="hidden 2xl:block">2xl (≥1536px)</div>
    </div>
  );
};
