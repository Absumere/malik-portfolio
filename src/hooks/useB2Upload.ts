import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UploadProgress } from '@/lib/b2';

interface UseB2UploadReturn {
  upload: (file: File) => Promise<string>;
  progress: UploadProgress | null;
  error: string | null;
  isUploading: boolean;
}

export function useB2Upload(): UseB2UploadReturn {
  const { user } = useAuth();
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

      const { uploadUrl, authorizationToken } = await response.json();

      // Upload file directly to B2
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': authorizationToken,
          'Content-Type': file.type,
          'X-Bz-File-Name': encodeURIComponent(file.name),
          'X-Bz-Content-Sha1': 'do_not_verify',
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const result = await uploadResponse.json();
      return result.fileId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  };

  return { upload, progress, error, isUploading };
}
