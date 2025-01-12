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

let cachedAuth: B2AuthResponse | null = null;
let authExpiration = 0;

export async function getB2Auth(): Promise<B2AuthResponse> {
  try {
    // Check if we have a valid cached auth
    const now = Date.now();
    if (cachedAuth && now < authExpiration) {
      return cachedAuth;
    }

    const applicationKeyId = getEnvVar('B2_APPLICATION_KEY_ID');
    const applicationKey = getEnvVar('B2_APPLICATION_KEY');
    const authString = Buffer.from(`${applicationKeyId}:${applicationKey}`).toString('base64');

    console.log('Getting new B2 auth token...');
    const response = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
      headers: {
        Authorization: `Basic ${authString}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('B2 auth error:', error);
      throw new Error(`Failed to authenticate with B2: ${error}`);
    }

    const auth = await response.json();
    cachedAuth = auth;
    authExpiration = now + (23 * 60 * 60 * 1000); // Cache for 23 hours
    console.log('Got new B2 auth token');

    return auth;
  } catch (error) {
    console.error('B2 auth error:', error);
    throw error;
  }
}

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
    const auth = await getB2Auth();
    const bucketId = getEnvVar('B2_BUCKET_ID');

    console.log('Listing files...');
    const response = await fetch(`${auth.apiUrl}/b2api/v2/b2_list_file_names`, {
      method: 'POST',
      headers: {
        Authorization: auth.authorizationToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketId,
        maxFileCount: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('B2 list files error:', error);
      throw new Error(`Failed to list files: ${error}`);
    }

    const data = await response.json();
    console.log(`Found ${data.files.length} files`);

    return Promise.all(
      data.files.map(async (file: any) => {
        const url = await getB2DownloadUrl(file.fileName);
        return {
          fileName: file.fileName,
          contentType: file.contentType || 'application/octet-stream',
          uploadTimestamp: file.uploadTimestamp * 1000,
          fileId: file.fileId,
          url,
        };
      })
    );
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}
