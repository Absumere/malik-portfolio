'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface B2Image {
  fileName: string;
  url: string;
  contentType: string;
  uploadTimestamp: number;
  public_id: string;
}

export default function ImageGallery() {
  const [images, setImages] = useState<B2Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Function to refresh images periodically (every 45 minutes)
  const refreshImages = async () => {
    try {
      const response = await fetch('/api/images');
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const sortedImages = data.sort((a, b) => 
          b.uploadTimestamp - a.uploadTimestamp
        );
        setImages(sortedImages);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error refreshing images:', error);
      // Don't set error state here to avoid disrupting the display
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        await refreshImages();
      } catch (error) {
        console.error('Error fetching images:', error);
        setError(error instanceof Error ? error.message : 'Failed to load images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();

    // Refresh signed URLs every 45 minutes
    const interval = setInterval(refreshImages, 45 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="relative aspect-square bg-[#111111] border border-[#222222]"
          >
            <div className="absolute inset-0 bg-white/5 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-gray-400">
        <p>No images found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => {
          console.log('Rendering image:', image.fileName);
          return (
            <div
              key={image.fileName}
              className="relative aspect-square cursor-pointer bg-[#111111] border border-[#222222] overflow-hidden group"
              onClick={() => setSelectedImage(image.url)}
            >
              <div className="absolute inset-0 bg-white/5" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-black/50">
                <div
                  className="h-full bg-white transition-all duration-200 ease-out"
                  style={{ 
                    width: loadedImages.has(image.url) ? '100%' : '0%'
                  }}
                />
              </div>
              <Image
                src={image.url}
                alt={image.fileName}
                fill
                className="object-cover transition-all duration-300 group-hover:scale-105"
                style={{ opacity: loadedImages.has(image.url) ? 1 : 0 }}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                priority={index < 4}
                loading={index < 4 ? 'eager' : 'lazy'}
                onLoadingComplete={() => {
                  console.log('Image loaded:', image.fileName);
                  setLoadedImages(prev => new Set(prev).add(image.url));
                }}
                onError={(e) => {
                  console.error('Image load error:', image.fileName);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.classList.add('bg-[#331111]');
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'absolute inset-0 flex items-center justify-center text-red-500 text-sm p-2 text-center';
                    errorMsg.textContent = 'Failed to load image';
                    parent.appendChild(errorMsg);
                  }
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl w-full max-h-[90vh] flex items-center justify-center">
            <div className="absolute inset-0 bg-[#111111] border border-[#222222]" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/50">
              <div
                className="h-full bg-white transition-all duration-200 ease-out"
                style={{ 
                  width: loadedImages.has(selectedImage) ? '100%' : '0%'
                }}
              />
            </div>
            <Image
              src={selectedImage}
              alt=""
              fill
              className="object-contain"
              style={{ opacity: loadedImages.has(selectedImage) ? 1 : 0 }}
              sizes="100vw"
              priority
              onLoadingComplete={() => {
                setLoadedImages(prev => new Set(prev).add(selectedImage));
              }}
              onError={(e) => {
                console.error('Lightbox image load error');
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.classList.add('bg-[#331111]');
                  const errorMsg = document.createElement('div');
                  errorMsg.className = 'absolute inset-0 flex items-center justify-center text-red-500 text-sm p-2 text-center';
                  errorMsg.textContent = 'Failed to load image';
                  parent.appendChild(errorMsg);
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
