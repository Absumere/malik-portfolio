import { B2 } from 'backblaze-b2';

const b2 = new B2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID!,
  applicationKey: process.env.B2_APPLICATION_KEY!,
});

export interface UploadProgress {
  percent: number;
  loaded: number;
  total: number;
}

export async function getUploadUrl(fileName: string): Promise<{
  uploadUrl: string;
  authorizationToken: string;
  fileUrl: string;
}> {
  await b2.authorize();
  
  const { data: { bucketId } } = await b2.getBucket({
    bucketName: process.env.B2_BUCKET_NAME!
  });

  const { data: { uploadUrl, authorizationToken } } = await b2.getUploadUrl({
    bucketId: bucketId
  });

  const fileUrl = `${process.env.B2_CLOUDFLARE_URL}/${fileName}`;

  return {
    uploadUrl,
    authorizationToken,
    fileUrl
  };
}

export async function uploadFile(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  try {
    // Get presigned URL
    const response = await fetch('/api/upload/b2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { uploadUrl, authorizationToken, fileUrl } = await response.json();

    // Upload to B2
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl, true);
    xhr.setRequestHeader('Authorization', authorizationToken);
    xhr.setRequestHeader('X-Bz-File-Name', fileUrl.split('/').pop() || '');
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.setRequestHeader('X-Bz-Content-Sha1', 'do_not_verify');

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          percent: (event.loaded / event.total) * 100,
          loaded: event.loaded,
          total: event.total,
        });
      }
    };

    // Return a promise that resolves with the file URL
    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(fileUrl);
        } else {
          reject(new Error('Upload failed'));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Upload failed'));
      };

      xhr.send(file);
    });
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
