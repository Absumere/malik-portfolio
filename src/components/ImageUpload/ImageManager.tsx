'use client';

import { useState } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import UploadZone from './UploadZone';
import LargeFileUploader from './LargeFileUploader';
import { getCloudinaryUrl } from '@/lib/cloudinary';

interface UploadResult {
  info: {
    public_id: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    original_filename: string;
    folder: string;
    tags?: string[];
  };
}

interface ImageManagerProps {
  folder?: string;
  tags?: string[];
  onUploadComplete?: (results: UploadResult[]) => void;
  onUploadError?: (error: any) => void;
}

export default function ImageManager({
  folder = 'portfolio',
  tags = [],
  onUploadComplete,
  onUploadError
}: ImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'standard' | 'large'>('standard');

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      // Upload logic will be handled by CldUploadWidget
      // This function is just for preview handling
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-4 mb-4">
        <button
          onClick={() => setUploadMode('standard')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            uploadMode === 'standard'
              ? 'bg-primary text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Standard Upload (≤10MB)
        </button>
        <button
          onClick={() => setUploadMode('large')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            uploadMode === 'large'
              ? 'bg-primary text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Large File Upload (>10MB)
        </button>
      </div>

      {uploadMode === 'standard' ? (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            folder,
            tags,
            sources: ['local', 'url', 'camera'],
            multiple: true,
            maxFiles: 10,
            clientAllowedFormats: ['png', 'jpeg', 'jpg', 'webp'],
            maxFileSize: 10000000, // 10MB
            styles: {
              palette: {
                window: '#FFFFFF',
                windowBorder: '#90A0B3',
                tabIcon: '#0078FF',
                menuIcons: '#5A616A',
                textDark: '#000000',
                textLight: '#FFFFFF',
                link: '#0078FF',
                action: '#FF620C',
                inactiveTabIcon: '#0E2F5A',
                error: '#F44235',
                inProgress: '#0078FF',
                complete: '#20B832',
                sourceBg: '#E4EBF1'
              }
            }
          }}
          onUpload={(result: any) => {
            if (result.info) {
              onUploadComplete?.([result as UploadResult]);
            }
          }}
          onError={(error: any) => {
            console.error('Cloudinary upload error:', error);
            onUploadError?.(error);
          }}
        >
          {({ open }) => (
            <UploadZone
              onUpload={async (files) => {
                handleUpload(files);
                open();
              }}
            />
          )}
        </CldUploadWidget>
      ) : (
        <LargeFileUploader
          folder={`${folder}/high-res`}
          onUploadComplete={(result) => {
            onUploadComplete?.([result as UploadResult]);
          }}
          onUploadError={onUploadError}
        />
      )}
    </div>
  );
}
