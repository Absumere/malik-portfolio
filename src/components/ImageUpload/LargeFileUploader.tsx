'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

interface LargeFileUploaderProps {
  onUploadComplete?: (result: any) => void;
  onUploadError?: (error: any) => void;
  folder?: string;
}

export default function LargeFileUploader({
  onUploadComplete,
  onUploadError,
  folder = 'portfolio/high-res'
}: LargeFileUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File) => {
    try {
      // Step 1: Get signed upload credentials
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signatureResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp, folder }),
      });
      const { signature, cloudName, apiKey } = await signatureResponse.json();

      // Step 2: Prepare for chunked upload
      const chunkSize = 100 * 1024 * 1024; // 100MB chunks
      const chunks = Math.ceil(file.size / chunkSize);
      let uploadedBytes = 0;

      for (let i = 0; i < chunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
        formData.append('cloud_name', cloudName);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);
        formData.append('folder', folder);
        
        if (chunks > 1) {
          formData.append('chunk_size', chunkSize.toString());
          formData.append('chunk_number', (i + 1).toString());
          formData.append('total_chunks', chunks.toString());
        }

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        uploadedBytes += chunk.size;
        const progress = Math.round((uploadedBytes / file.size) * 100);
        setUploadProgress(prev => ({ ...prev, [file.name]: progress }));

        const result = await response.json();
        
        if (i === chunks - 1) {
          onUploadComplete?.(result);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(error);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        await uploadFile(file);
      }
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    disabled: uploading,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.tif', '.tiff', '.psd', '.raw']
    }
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium">
              {isDragActive
                ? 'Drop your high-res images here'
                : 'Drag & drop high-res images'}
            </p>
            <p className="text-sm text-gray-500">
              Supports large files (500MB+) - PNG, JPG, TIFF, PSD, RAW
            </p>
          </div>
        </div>
      </div>

      {Object.entries(uploadProgress).map(([fileName, progress]) => (
        <div key={fileName} className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">{fileName}</span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          <motion.div
            className="h-2 bg-gray-200 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
          >
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>
      ))}
    </div>
  );
}
