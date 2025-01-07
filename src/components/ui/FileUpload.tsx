'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile, UploadProgress } from '@/lib/b2';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  maxSize?: number;
  accept?: Record<string, string[]>;
}

export default function FileUpload({
  onUploadComplete,
  maxSize = 1024 * 1024 * 300, // 300MB default
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  },
}: FileUploadProps) {
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const file = acceptedFiles[0];
      const url = await uploadFile(file, (progress) => {
        setProgress(progress);
      });
      
      onUploadComplete(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxSize,
    accept,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer
        ${isDragActive ? 'border-white bg-white/10' : 'border-white/20 hover:border-white/40'}
        ${isDragReject ? 'border-red-500 bg-red-500/10' : ''}
        ${isUploading ? 'pointer-events-none' : ''}`}
    >
      <input {...getInputProps()} />
      
      <div className="text-center">
        {isUploading ? (
          <div className="space-y-4">
            <div className="text-lg">Uploading...</div>
            {progress && (
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            )}
            <div className="text-sm text-neutral-400">
              {progress && `${Math.round(progress.percentage)}%`}
            </div>
          </div>
        ) : isDragActive ? (
          <div className="text-lg">Drop your file here</div>
        ) : (
          <div className="space-y-2">
            <div className="text-lg">
              Drag & drop your file here, or click to select
            </div>
            <div className="text-sm text-neutral-400">
              Maximum file size: {Math.round(maxSize / 1024 / 1024)}MB
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 text-red-500 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}
