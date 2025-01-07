import { B2 } from 'backblaze-b2';

const b2 = new B2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID!,
  applicationKey: process.env.B2_APPLICATION_KEY!,
});

export interface UploadProgress {
  uploaded: number;
  total: number;
  percentage: number;
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
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  
  const { uploadUrl, authorizationToken, fileUrl } = await getUploadUrl(fileName);

  const xhr = new XMLHttpRequest();
  
  xhr.upload.onprogress = (event) => {
    if (onProgress) {
      onProgress({
        uploaded: event.loaded,
        total: event.total,
        percentage: (event.loaded / event.total) * 100
      });
    }
  };

  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(fileUrl);
      } else {
        reject(new Error('Upload failed'));
      }
    };

    xhr.onerror = () => reject(new Error('Upload failed'));

    xhr.open('POST', uploadUrl);
    xhr.setRequestHeader('Authorization', authorizationToken);
    xhr.setRequestHeader('X-Bz-File-Name', fileName);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.setRequestHeader('X-Bz-Content-Sha1', 'do_not_verify');
    xhr.send(file);
  });
}
