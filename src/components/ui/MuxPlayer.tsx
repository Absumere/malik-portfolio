'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import MuxPlayerComponent from '@mux/mux-player-react';

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
      />
    </div>
  );
};

// Prevent SSR issues with the Mux Player
export default dynamic(() => Promise.resolve(MuxPlayer), {
  ssr: false
});
