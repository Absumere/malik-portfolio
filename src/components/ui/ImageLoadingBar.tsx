'use client';

import { useEffect, useState } from 'react';

interface ImageLoadingBarProps {
  imageUrl: string;
  onLoadComplete: () => void;
}

export function ImageLoadingBar({ imageUrl, onLoadComplete }: ImageLoadingBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const img = new Image();
    let progressInterval: NodeJS.Timeout;

    const simulateProgress = () => {
      setProgress(prev => {
        if (prev >= 99) return prev;
        const increment = Math.random() * 15;
        return Math.min(prev + increment, 99);
      });
    };

    img.onloadstart = () => {
      progressInterval = setInterval(simulateProgress, 200);
    };

    img.onload = () => {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(onLoadComplete, 200);
    };

    img.onerror = () => {
      clearInterval(progressInterval);
      setProgress(0);
    };

    img.src = imageUrl;

    return () => {
      clearInterval(progressInterval);
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, onLoadComplete]);

  return (
    <div className="absolute inset-x-0 bottom-0 h-1 bg-black/50">
      <div
        className="h-full bg-white transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
