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

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/images');
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        console.log('API Response:', data);
        
        if (Array.isArray(data)) {
          // Sort images by size to load smaller ones first
          const sortedImages = [...data].sort((a, b) => {
            const sizeA = Number(a.fileName.split('MB')[0]) || 0;
            const sizeB = Number(b.fileName.split('MB')[0]) || 0;
            return sizeA - sizeB;
          });
          console.log('Sorted Images:', sortedImages);
          setImages(sortedImages);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        setError(error instanceof Error ? error.message : 'Failed to load images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="relative aspect-square bg-[#111111] border border-[#222222]"
          >
            <div className="absolute inset-0 bg-white/5" />
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
          console.log('Rendering image:', image.url);
          return (
            <div
              key={image.fileName}
              className="relative aspect-square cursor-pointer bg-[#111111] border border-[#222222] overflow-hidden"
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
                alt=""
                fill
                className="object-cover transition-opacity duration-300"
                style={{ opacity: loadedImages.has(image.url) ? 1 : 0 }}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                priority={index < 4}
                loading={index < 4 ? 'eager' : 'lazy'}
                onLoadingComplete={() => {
                  console.log('Image loaded:', image.url);
                  setLoadedImages(prev => new Set(prev).add(image.url));
                }}
                onError={(e) => {
                  console.error('Image load error:', image.url);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.classList.add('bg-[#331111]');
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
              width={1920}
              height={1080}
              className="object-contain max-h-[90vh] w-auto transition-opacity duration-300"
              style={{ opacity: loadedImages.has(selectedImage) ? 1 : 0 }}
              priority={true}
              onLoadingComplete={() => {
                setLoadedImages(prev => new Set(prev).add(selectedImage));
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 text-white/75 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
