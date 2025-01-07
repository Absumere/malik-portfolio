'use client';

import { useEffect, useRef, useState } from 'react';
import Player from '@vimeo/player';

interface VimeoPlayerProps {
  videoId: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
}

export function VimeoPlayer({
  videoId,
  autoplay = false,
  muted = true,
  loop = true,
  controls = false,
  className = '',
}: VimeoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const vimeoPlayer = new Player(containerRef.current, {
      id: videoId,
      autopause: false,
      autoplay,
      muted,
      loop,
      controls,
      responsive: true,
      background: !controls, // Background mode when no controls
      dnt: true, // Do not track
    });

    setPlayer(vimeoPlayer);

    return () => {
      vimeoPlayer.destroy();
    };
  }, [videoId, autoplay, muted, loop, controls]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full ${className}`}
      data-vimeo-initialized="true"
    />
  );
}
