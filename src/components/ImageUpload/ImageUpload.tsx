'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { trackFileOperation, trackError, trackEngagement } from '@/utils/analytics';
import { toast } from 'react-hot-toast';

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

  const uploadImage = async (file: File): Promise<UploadedImage> => {
    const startTime = Date.now();
    const fileExtension = file.name.split('.').pop() || '';
    
    try {
      trackEngagement('Upload Started', 'image-upload-dropzone', {
        fileType: file.type,
        fileSize: file.size,
        fileName: file.name,
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
      formData.append('folder', 'portfolio');

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        throw new Error('Cloudinary cloud name is not configured');
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const duration = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        
        trackFileOperation(
          'upload',
          {
            type: file.type,
            size: file.size,
            name: file.name,
            extension: fileExtension,
          },
          true,
          duration,
          {
            cloudinary_public_id: data.public_id,
            cloudinary_url: data.secure_url,
            width: data.width,
            height: data.height,
            format: data.format,
          }
        );

        return {
          url: data.secure_url,
          publicId: data.public_id,
        };
      } else {
        const errorText = await response.text();
        const errorMessage = `Upload failed: ${response.status} ${response.statusText}. ${errorText}`;
        
        trackFileOperation(
          'upload',
          {
            type: file.type,
            size: file.size,
            name: file.name,
            extension: fileExtension,
          },
          false,
          duration,
          {
            error_status: response.status,
            error_text: errorText,
          }
        );

        throw new Error(errorMessage);
      }
    } catch (err) {
      const duration = Date.now() - startTime;
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during image upload';
      
      trackError(
        'ImageUploadError',
        errorMessage,
        err instanceof Error ? err.stack : undefined,
        {
          fileType: file.type,
          fileSize: file.size,
          fileName: file.name,
          duration_ms: duration,
        }
      );

      console.error('Upload error details:', err);
      toast.error(errorMessage);
      throw err;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    trackEngagement('Files Dropped', 'image-upload-dropzone', {
      fileCount: acceptedFiles.length,
      totalSize: acceptedFiles.reduce((acc, file) => acc + file.size, 0),
      fileTypes: acceptedFiles.map(file => file.type),
    });
    
    setUploading(true);
    setError(null);
    
    const uploadedImages: UploadedImage[] = [];
    
    try {
      for (const file of acceptedFiles) {
        try {
          const result = await uploadImage(file);
          uploadedImages.push(result);
          setPreviewImages(prev => [...prev, { file, preview: result.url }]);
          
          trackEngagement('Image Added to Gallery', 'image-gallery', {
            imageUrl: result.url,
            publicId: result.publicId,
          });
        } catch (error) {
          // Error already tracked and toasted in uploadImage
          continue;
        }
      }
      
      if (uploadedImages.length > 0) {
        onUpload(uploadedImages);
        toast.success(`Successfully uploaded ${uploadedImages.length} image${uploadedImages.length === 1 ? '' : 's'}`);
      }
    } catch (error) {
      setError('Failed to upload images');
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
    <div className={className}>
      <div 
        {...getRootProps()} 
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-white/50 bg-white/5' : 'border-white/10 hover:border-white/20',
          'focus:outline-none focus:ring-2 focus:ring-white/20'
        )}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-white/50" />
        <p className="mt-2 text-sm text-white/70">
          {isDragActive ? (
            'Drop the files here...'
          ) : (
            'Drag & drop media files here, or click to select'
          )}
        </p>
        <p className="mt-1 text-xs text-white/50">
          Supports large files (500MB+) • Images: JPG, PNG, TIFF, PSD, RAW<br />
          Videos: MP4, MOV, AVI, WEBM
        </p>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      {previewImages.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {previewImages.map((image, index) => (
            <div key={image.preview} className="relative aspect-square">
              <Image
                src={image.preview}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <button
                onClick={() => removePreview(index)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white/70 hover:text-white"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
