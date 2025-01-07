'use client';

import MuxVideoPlayer from '@mux/mux-player-react';
import { useEffect, useRef } from 'react';

interface MuxPlayerProps {
  playbackId: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  startTime?: number;
  className?: string;
}

export function MuxPlayer({
  playbackId,
  autoPlay = false,
  muted = true,
  loop = true,
  startTime = 0,
  className = '',
}: MuxPlayerProps) {
  const playerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Mux player optimization
    if (playerRef.current) {
      // Preload metadata for faster playback
      playerRef.current.preload = 'metadata';
      
      // Set playback quality (auto by default for adaptive streaming)
      playerRef.current.preferPlaybackQuality('auto');
    }
  }, []);

  return (
    <MuxVideoPlayer
      ref={playerRef}
      playbackId={playbackId}
      streamType="on-demand"
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      startTime={startTime}
      preload="metadata"
      className={`w-full h-full object-cover ${className}`}
      metadata={{
        video_title: 'Portfolio Video',
        player_name: 'Malik Portfolio Player',
      }}
      envKey={process.env.NEXT_PUBLIC_MUX_ENV_KEY}
    />
  );
}
