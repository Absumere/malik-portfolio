'use client';

import { useState, useEffect } from 'react';
import ImageTurntable from '@/components/ImageTurntable';
import VideoGallery from '@/components/VideoGallery';

interface B2Image {
  fileName: string;
  url: string;
  contentType: string;
  uploadTimestamp: number;
  public_id: string;
}

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [images, setImages] = useState<B2Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-light mb-4">
          A collection of my creative work in video and image formats
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-sm transition-colors ${
              activeTab === 'videos'
                ? 'bg-white text-black'
                : 'bg-[#111111] text-white hover:bg-[#222222]'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2 rounded-sm transition-colors ${
              activeTab === 'images'
                ? 'bg-white text-black'
                : 'bg-[#111111] text-white hover:bg-[#222222]'
            }`}
          >
            Images
          </button>
        </div>

        {/* Content */}
        {activeTab === 'videos' ? (
          <VideoGallery />
        ) : (
          <div>
            {error ? (
              <div className="text-red-500 p-4 rounded-lg bg-red-500/10">
                Error: {error}
              </div>
            ) : loading ? (
              <div className="w-full aspect-[3/2] bg-neutral-900 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : images.length === 0 ? (
              <div className="w-full aspect-[3/2] bg-neutral-900 rounded-lg flex items-center justify-center">
                <p className="text-neutral-400">No images available</p>
              </div>
            ) : (
              <ImageTurntable images={images} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
