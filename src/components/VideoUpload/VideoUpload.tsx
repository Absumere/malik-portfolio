'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { processVideo } from '@/utils/videoUtils';
import { toast } from 'react-hot-toast';

interface UploadProgress {
  status: 'processing' | 'uploading' | 'complete' | 'error';
  progress: number;
  resolution?: string;
}

export default function VideoUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    status: 'processing',
    progress: 0,
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }

    setUploading(true);
    setUploadProgress({ status: 'processing', progress: 0 });

    try {
      const { width, height, duration } = await processVideo(file);
      
      // Update progress
      setUploadProgress({
        status: 'uploading',
        progress: 20,
        resolution: `${width}x${height}`,
      });

      // Continue with your upload logic here
      // ...

    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress({ status: 'error', progress: 0 });
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={uploading} />
        {isDragActive ? (
          <p className="text-lg text-blue-500">Drop the video here</p>
        ) : (
          <div>
            <p className="text-lg mb-2">Drag and drop a video file here, or click to select</p>
            <p className="text-sm text-gray-500">Supported formats: MP4, MOV, AVI, WebM</p>
          </div>
        )}
      </div>

      {uploadProgress.status !== 'processing' && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium capitalize">{uploadProgress.status}</span>
            <span className="text-sm">{uploadProgress.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                uploadProgress.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${uploadProgress.progress}%` }}
            />
          </div>
          {uploadProgress.resolution && (
            <p className="text-sm text-gray-500 mt-2">
              Resolution: {uploadProgress.resolution}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
