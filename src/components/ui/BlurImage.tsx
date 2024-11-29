import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BlurImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export const BlurImage = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: BlurImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn('overflow-hidden relative', className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn(
          'duration-700 ease-in-out',
          isLoading
            ? 'scale-110 blur-2xl grayscale'
            : 'scale-100 blur-0 grayscale-0'
        )}
        onLoadingComplete={() => setIsLoading(false)}
      />
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/20 to-transparent',
          'opacity-0 transition-opacity duration-300',
          'group-hover:opacity-100'
        )}
      />
    </div>
  );
};
