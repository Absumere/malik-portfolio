'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploadProps {
  onUpload: (urls: UploadedImage[]) => void;
  maxFiles?: number;
  className?: string;
}

export function ImageUpload({ 
  onUpload, 
  maxFiles = 10,
  className
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<{ file: File; preview: string }[]>([]);

  const getSignature = async () => {
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp, folder: 'portfolio' }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get upload signature');
    }
    
    return response.json();
  };

  const uploadImage = async (file: File): Promise<UploadedImage> => {
    try {
      console.log('Getting signature for upload...');
      const { signature, timestamp, cloudName, apiKey } = await getSignature();
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', apiKey);
      formData.append('folder', 'portfolio');
      formData.append('upload_preset', 'ml_default');

      console.log('Starting upload to Cloudinary...');
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary response error:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      return {
        url: data.secure_url,
        publicId: data.public_id,
      };
    } catch (err) {
      console.error('Upload error details:', err);
      throw err;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setUploading(true);
      setError(null);
      
      // Create preview images
      const newPreviews = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setPreviewImages(prev => [...prev, ...newPreviews]);

      console.log('Starting upload process for', acceptedFiles.length, 'files');
      const uploadPromises = acceptedFiles.map(uploadImage);
      const results = await Promise.all(uploadPromises);
      console.log('All uploads completed:', results);
      onUpload(results);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image(s). Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const removePreview = (index: number) => {
    setPreviewImages(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB per file
    multiple: maxFiles > 1,
    maxFiles,
    disabled: uploading
  });

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg',
          isDragActive ? 'border-blue-500 bg-blue-50/10' : 'border-gray-600',
          uploading ? 'opacity-50' : 'cursor-pointer',
        )}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="w-12 h-12 mb-4 text-gray-400" />
        {uploading ? (
          <p className="text-sm text-gray-400">Uploading...</p>
        ) : isDragActive ? (
          <p className="text-sm text-gray-400">Drop the images here...</p>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Drag & drop images here, or click to select
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Maximum file size: 10MB per image
              {maxFiles > 1 && ` (up to ${maxFiles} files)`}
            </p>
          </div>
        )}
      </div>

      {/* Preview Grid */}
      {previewImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previewImages.map((preview, index) => (
            <div key={preview.preview} className="relative aspect-square">
              <Image
                src={preview.preview}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <button
                onClick={() => removePreview(index)}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
