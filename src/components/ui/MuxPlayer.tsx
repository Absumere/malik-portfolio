'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';

// Import MuxPlayer dynamically to prevent SSR issues
const MuxPlayerComponent = dynamic(
  () => import('@mux/mux-player-react').then((mod) => mod.default),
  { ssr: false }
);

interface MuxPlayerProps {
  playbackId: string;
  className?: string;
}

const MuxPlayer = ({ playbackId, className = '' }: MuxPlayerProps) => {
  return (
    <div className={className}>
      <MuxPlayerComponent
        streamType="on-demand"
        playbackId={playbackId}
        autoPlay="muted"
        loop
        thumbnailTime={1}
        style={{ height: '100%', width: '100%' }}
        metadata={{
          video_title: 'Portfolio Video',
          player_name: 'Portfolio Player',
        }}
      />
    </div>
  );
};

export default MuxPlayer;
