'use client';

import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { useEffect, useState } from 'react';

export const RiveAnimation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { rive, RiveComponent } = useRive({
    src: '/animations/main_animation.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
    onLoad: () => {
      setIsLoading(false);
      setError(null);
    },
    onLoadError: (e) => {
      console.error('Failed to load Rive animation:', e);
      setError('Failed to load animation');
      setIsLoading(false);
    },
  });

  // Example inputs - modify these based on your Rive animation's actual inputs
  const hoverInput = useStateMachineInput(rive, 'State Machine 1', 'Hover', false);
  const clickInput = useStateMachineInput(rive, 'State Machine 1', 'Click', false);

  if (error) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center text-neutral-400">
        <p>Animation temporarily unavailable</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] relative">
      <RiveComponent 
        className="w-full h-full"
        onMouseEnter={() => hoverInput?.fire()}
        onClick={() => clickInput?.fire()}
      />
    </div>
  );
};
