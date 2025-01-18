'use client';

import { useEffect, useState } from 'react';
import { breakpoints } from '@/utils/responsive';

export function useResponsive() {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: windowWidth < breakpoints.md,
    isTablet: windowWidth >= breakpoints.md && windowWidth < breakpoints.lg,
    isDesktop: windowWidth >= breakpoints.lg,
    windowWidth,
    breakpoints,
  };
}

export function useScrollLock() {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
}

export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
  });

  useEffect(() => {
    const updateSafeArea = () => {
      setSafeArea({
        top: parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--sat'
          ) || '0'
        ),
        bottom: parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--sab'
          ) || '0'
        ),
      });
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    return () => window.removeEventListener('resize', updateSafeArea);
  }, []);

  return safeArea;
}
