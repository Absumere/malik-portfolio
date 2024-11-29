'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import LargeFileUploader from '@/components/ImageUpload/LargeFileUploader';

export default function ImagesPage() {
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">High Resolution Image Upload</h1>
          <p className="text-gray-600">
            Upload large, high-quality images (500MB+). Supports RAW, TIFF, PSD, and high-res JPG/PNG formats.
          </p>
        </div>

        {uploadStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              uploadStatus.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {uploadStatus.message}
          </motion.div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <LargeFileUploader
            folder="portfolio/high-res"
            onUploadComplete={(result) => {
              setUploadStatus({
                type: 'success',
                message: 'Successfully uploaded high-resolution image'
              });
            }}
            onUploadError={(error) => {
              setUploadStatus({
                type: 'error',
                message: 'Failed to upload image. Please try again.'
              });
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
