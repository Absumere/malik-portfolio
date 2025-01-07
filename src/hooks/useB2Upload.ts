import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface UploadProgress {
  uploaded: number;
  total: number;
  percentage: number;
}

interface UseB2UploadReturn {
  upload: (file: File) => Promise<string>;
  progress: UploadProgress | null;
  error: string | null;
  isUploading: boolean;
}

export function useB2Upload(): UseB2UploadReturn {
  const { user } = useUser();
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    setIsUploading(true);
    setError(null);
    setProgress({ uploaded: 0, total: file.size, percentage: 0 });

    try {
      // Get upload URL
      const response = await fetch('/api/upload/b2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, authorizationToken, fileUrl } = await response.json();

      // Upload file with progress tracking
      await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': authorizationToken,
          'Content-Type': file.type,
          'X-Bz-File-Name': file.name,
          'X-Bz-Content-Sha1': 'do_not_verify', // For large files, we skip SHA1 verification
        },
        body: file,
      });

      setProgress({ uploaded: file.size, total: file.size, percentage: 100 });
      return fileUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    upload,
    progress,
    error,
    isUploading,
  };
}
