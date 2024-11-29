'use client';

import { CldImage } from 'next-cloudinary';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function CloudinaryImage({
  src,
  alt,
  width = 400,
  height = 400,
  className = "",
}: CloudinaryImageProps) {
  // Remove the version prefix if it exists (e.g., "v1234567890/")
  const cleanSrc = src.replace(/^v\d+\//, '');

  return (
    <CldImage
      src={cleanSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
