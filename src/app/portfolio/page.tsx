'use client';

import { useState, useEffect } from 'react';
import ImageTurntable from '@/components/ImageTurntable';
import VideoGallery from '@/components/VideoGallery';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface B2Image {
  fileName: string;
  url: string;
  contentType: string;
  uploadTimestamp: number;
  public_id: string;
}

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('videos');
  const [images, setImages] = useState<B2Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      if (activeTab !== 'images') return;
      
      try {
        console.log('Fetching images...');
        setLoading(true);
        const response = await fetch('/api/images');
        const data = await response.json();
        
        console.log('Response:', { status: response.status, data });
        
        if (!response.ok) {
          console.error('API Error:', data);
          throw new Error(data.details || 'Failed to fetch images');
        }
        
        if (!Array.isArray(data)) {
          console.error('Invalid data format:', data);
          throw new Error('Invalid data format received from server');
        }

        // Sort images by upload timestamp
        const sortedImages = [...data].sort((a, b) => 
          b.uploadTimestamp - a.uploadTimestamp
        );
        
        console.log('Sorted images:', sortedImages);
        setImages(sortedImages);
      } catch (error) {
        console.error('Error fetching images:', error);
        setError(error instanceof Error ? error.message : 'Failed to load images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [activeTab]);

  const handlePrevImage = () => {
    if (activeTab === 'images' && images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (activeTab === 'images' && images.length > 0) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="w-full mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-light tracking-tight">Portfolio</h1>
          <p className="text-neutral-400 text-lg">
            A collection of my creative work in video and image formats
          </p>
        </div>

        <div className="border-b border-[#222222] mb-12">
          <div className="flex gap-8">
            {['Videos', 'Images'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase() as 'videos' | 'images')}
                className={`pb-4 text-lg ${
                  activeTab === tab.toLowerCase()
                    ? 'text-white border-b-2 border-white'
                    : 'text-neutral-400 hover:text-white/80'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'videos' && <VideoGallery />}
        {activeTab === 'images' && (
          <>
            {error && (
              <div className="flex justify-center items-center min-h-[600px] text-red-500">
                <p>{error}</p>
              </div>
            )}
            {loading && (
              <div className="flex justify-center items-center min-h-[600px]">
                <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}
            {!loading && !error && images.length > 0 && (
              <div className="relative w-full h-[calc(100vh-16rem)] flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageTurntable 
                    images={images} 
                    currentIndex={currentImageIndex}
                    onNavigate={setCurrentImageIndex}
                  />
                </div>
                {/* Navigation Buttons */}
                <div className="absolute left-8 top-1/2 -translate-y-1/2">
                  <button
                    onClick={handlePrevImage}
                    className="p-3 bg-black/50 hover:bg-black/70 text-white transition-all rounded-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon className="w-8 h-8" strokeWidth={2} />
                  </button>
                </div>
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                  <button
                    onClick={handleNextImage}
                    className="p-3 bg-black/50 hover:bg-black/70 text-white transition-all rounded-lg"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="w-8 h-8" strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}
            {!loading && !error && images.length === 0 && (
              <div className="flex justify-center items-center min-h-[600px] text-neutral-400">
                <p>No images available</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
