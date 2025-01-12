'use client';

import { Suspense } from 'react';
import { EnhancedGallery } from '@/components/gallery/EnhancedGallery';
import { MediaUpload } from '@/components/upload/MediaUpload';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

function MediaContent() {
  const [refreshGallery, setRefreshGallery] = useState(0);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-black p-8 flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  const handleUploadComplete = () => {
    setRefreshGallery(prev => prev + 1);
  };

  return (
    <div className="bg-black p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-white">Media Management</h1>
        <p className="text-gray-400">
          Upload and manage images and videos for your portfolio
        </p>
      </div>

      <div className="bg-black/80 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Upload Media</h2>
        <MediaUpload
          onUpload={(media) => {
            console.log('Uploaded media:', media);
            handleUploadComplete();
          }}
        />
      </div>

      <div className="bg-black/80 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Media Gallery</h2>
        <EnhancedGallery key={refreshGallery} isAdmin={true} />
      </div>
    </div>
  );
}

export default function MediaManagementPage() {
  return (
    <Suspense fallback={
      <div className="bg-black p-8 flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <MediaContent />
    </Suspense>
  );
}
