'use client';

import { EnhancedGallery } from '@/components/gallery/EnhancedGallery';
import { MediaUpload } from '@/components/upload/MediaUpload';
import { useState } from 'react';

export default function MediaManagementPage() {
  const [refreshGallery, setRefreshGallery] = useState(0);

  const handleUploadComplete = () => {
    // Trigger gallery refresh
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

      {/* Upload Section */}
      <div className="bg-black/80 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Upload Media</h2>
        <MediaUpload
          onUpload={(media) => {
            console.log('Uploaded media:', media);
            handleUploadComplete();
          }}
        />
      </div>

      {/* Gallery Section */}
      <div className="bg-black/80 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Media Gallery</h2>
        <EnhancedGallery key={refreshGallery} isAdmin={true} />
      </div>
    </div>
  );
}
