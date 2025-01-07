'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

interface VideoUploadProps {
  onUploadComplete: (playbackId: string, assetId: string) => void;
  onUploadError: (error: string) => void;
}

export function VideoUpload({ onUploadComplete, onUploadError }: VideoUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get upload URL from your API
      const response = await fetch('/api/mux/upload', {
        method: 'POST',
      });
      const { url, assetId } = await response.json();

      // Upload to Mux
      const upload = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!upload.ok) throw new Error('Upload failed');

      // Poll for asset status
      let asset = null;
      while (!asset?.playbackId) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const assetResponse = await fetch(`/api/mux/asset/${assetId}`);
        asset = await assetResponse.json();
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }

      setUploadProgress(100);
      onUploadComplete(asset.playbackId, assetId);
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [onUploadComplete, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50/10' : 'border-gray-300'}
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="space-y-4">
            <p className="text-lg">Uploading video...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div
                className="bg-blue-600 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-gray-500">{uploadProgress}%</p>
          </div>
        ) : (
          <div>
            <p className="text-lg">
              {isDragActive
                ? 'Drop your video here'
                : 'Drag & drop your video here, or click to select'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports MP4, MOV, AVI, and WebM
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
