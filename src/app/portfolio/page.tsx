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
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('videos');
  const [images, setImages] = useState<B2Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (activeTab !== 'images') return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/images');
        const data = await response.json();
        
        if (!response.ok) {
          console.error('API Error:', data);
          throw new Error(data.details || 'Failed to fetch images');
        }
        
        if (Array.isArray(data)) {
          // Sort images by upload timestamp
          const sortedImages = [...data].sort((a, b) => 
            b.uploadTimestamp - a.uploadTimestamp
          );
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
  }, [activeTab]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-[1600px] w-full mx-auto px-6 py-24">
        <div className="mb-12">
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
                onClick={() => setActiveTab(tab.toLowerCase())}
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
            {loading && (
              <div className="flex justify-center items-center min-h-[600px]">
                <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}
            {error && (
              <div className="flex justify-center items-center min-h-[600px] text-red-500">
                <p>{error}</p>
              </div>
            )}
            {!loading && !error && images.length > 0 && <ImageTurntable images={images} />}
          </>
        )}
      </div>
    </main>
  );
}
