'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface UploadedMedia {
  url: string;
  publicId: string;
  type: 'image' | 'video';
  title?: string;
  description?: string;
}

interface MediaUploadProps {
  onUpload: (media: UploadedMedia[]) => void;
  className?: string;
}

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks

export function MediaUpload({ onUpload, className }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([]);

  const uploadLargeFile = async (file: File): Promise<UploadedMedia> => {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'portfolio';
    
    // Get upload signature
    const signatureResponse = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp, folder }),
    });
    
    if (!signatureResponse.ok) {
      throw new Error('Failed to get upload signature');
    }
    
    const { signature, cloudName, apiKey } = await signatureResponse.json();

    // Calculate total chunks
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let uploadedChunks = 0;

    // Create a new Blob for each chunk and upload
    for (let start = 0; start < file.size; start += CHUNK_SIZE) {
      const chunk = file.slice(start, start + CHUNK_SIZE);
      const formData = new FormData();
      formData.append('file', chunk);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', apiKey);
      formData.append('folder', folder);
      
      if (start > 0) {
        formData.append('chunk_number', Math.floor(start / CHUNK_SIZE).toString());
      }
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      uploadedChunks++;
      setProgress(prev => ({
        ...prev,
        [file.name]: (uploadedChunks / totalChunks) * 100
      }));
    }

    // Final response from last chunk contains the media details
    const data = await signatureResponse.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      type: data.resource_type === 'video' ? 'video' : 'image',
    };
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setUploading(true);
      setError(null);
      
      // Create previews
      const newPreviews = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setPreviews(prev => [...prev, ...newPreviews]);

      // Upload files
      const uploadPromises = acceptedFiles.map(uploadLargeFile);
      const results = await Promise.all(uploadPromises);
      
      onUpload(results);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload media. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const removePreview = (index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.tiff', '.psd', '.raw'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
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
          <p className="text-sm text-gray-400">Drop the files here...</p>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Drag & drop media files here, or click to select
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Supports large files (500MB+) - Images: JPG, PNG, TIFF, PSD, RAW
              <br />
              Videos: MP4, MOV, AVI, WEBM
            </p>
          </div>
        )}
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={preview.preview} className="relative aspect-square">
              {preview.file.type.startsWith('image/') ? (
                <Image
                  src={preview.preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <video
                  src={preview.preview}
                  className="w-full h-full object-cover rounded-lg"
                />
              )}
              <button
                onClick={() => removePreview(index)}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-white" />
              </button>
              {progress[preview.file.name] !== undefined && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">
                  {Math.round(progress[preview.file.name])}%
                </div>
              )}
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
