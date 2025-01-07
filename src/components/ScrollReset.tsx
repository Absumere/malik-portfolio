'use client';

import { useEffect, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ScrollReset() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const resetScroll = useCallback(() => {
    // Try multiple scroll reset approaches
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Force layout recalculation
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, []);

  // Reset on route changes
  useEffect(() => {
    resetScroll();
  }, [pathname, searchParams, resetScroll]);

  // Reset on initial load
  useEffect(() => {
    // Immediate reset
    resetScroll();

    // Delayed reset to handle dynamic content
    const timeoutId = setTimeout(resetScroll, 100);

    // Add navigation event listeners
    const handleRouteChange = () => {
      resetScroll();
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('load', resetScroll);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('load', resetScroll);
      clearTimeout(timeoutId);
    };
  }, [resetScroll]);

  return null;
}
