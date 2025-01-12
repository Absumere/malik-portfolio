import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface B2AuthResponse {
  apiUrl: string;
  authorizationToken: string;
  downloadUrl: string;
}

interface B2FileInfo {
  fileName: string;
  contentType: string;
  uploadTimestamp: number;
  fileId: string;
  url: string;
}

const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export async function getB2DownloadUrl(fileName: string): Promise<string> {
  try {
    const cloudflareUrl = getEnvVar('B2_CLOUDFLARE_URL');
    return `${cloudflareUrl}/${encodeURIComponent(fileName)}`;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
}

export async function listB2Files(): Promise<B2FileInfo[]> {
  try {
    const endpoint = getEnvVar('B2_ENDPOINT');
    const bucketName = getEnvVar('B2_BUCKET_NAME');
    const applicationKeyId = getEnvVar('B2_APPLICATION_KEY_ID');
    const applicationKey = getEnvVar('B2_APPLICATION_KEY');

    // Create the URL for listing objects
    const url = `${endpoint}/${bucketName}?list-type=2`;
    
    console.log('Listing files from bucket:', bucketName);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${applicationKeyId}:${applicationKey}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('B2 list files error:', error);
      throw new Error(`Failed to list files: ${error}`);
    }

    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    const contents = xmlDoc.getElementsByTagName('Contents');
    const files: B2FileInfo[] = [];

    for (let i = 0; i < contents.length; i++) {
      const content = contents[i];
      const key = content.getElementsByTagName('Key')[0]?.textContent;
      const lastModified = content.getElementsByTagName('LastModified')[0]?.textContent;
      const etag = content.getElementsByTagName('ETag')[0]?.textContent;

      if (key) {
        const url = await getB2DownloadUrl(key);
        files.push({
          fileName: key,
          contentType: key.split('.').pop()?.toLowerCase() || 'application/octet-stream',
          uploadTimestamp: lastModified ? new Date(lastModified).getTime() : Date.now(),
          fileId: etag?.replace(/['"]/g, '') || key,
          url,
        });
      }
    }

    console.log(`Found ${files.length} files`);
    return files.sort((a, b) => b.uploadTimestamp - a.uploadTimestamp);
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}
