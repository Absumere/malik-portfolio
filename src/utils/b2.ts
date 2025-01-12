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

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (s3Client) {
    return s3Client;
  }

  const endpoint = getEnvVar('B2_ENDPOINT');
  const applicationKeyId = getEnvVar('B2_APPLICATION_KEY_ID');
  const applicationKey = getEnvVar('B2_APPLICATION_KEY');

  s3Client = new S3Client({
    endpoint,
    region: 'eu-central-003',
    credentials: {
      accessKeyId: applicationKeyId,
      secretAccessKey: applicationKey,
    },
    forcePathStyle: true,
  });

  return s3Client;
}

export async function getB2DownloadUrl(key: string): Promise<string> {
  try {
    const client = getS3Client();
    const bucketName = getEnvVar('B2_BUCKET_NAME');

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    return getSignedUrl(client, command, { expiresIn: 3600 });
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
}

export async function listB2Files(): Promise<B2FileInfo[]> {
  try {
    const client = getS3Client();
    const bucketName = getEnvVar('B2_BUCKET_NAME');

    console.log('Listing files from bucket:', bucketName);

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 1000,
    });

    const response = await client.send(command);
    
    if (!response.Contents) {
      console.log('No files found in bucket');
      return [];
    }

    console.log(`Found ${response.Contents.length} files`);

    // Get signed URLs for all files
    const filesWithUrls = await Promise.all(
      response.Contents.map(async (file) => {
        if (!file.Key) return null;

        try {
          const url = await getB2DownloadUrl(file.Key);
          return {
            fileName: file.Key,
            contentType: file.Key.split('.').pop()?.toLowerCase() || 'application/octet-stream',
            uploadTimestamp: file.LastModified?.getTime() || 0,
            fileId: file.ETag?.replace(/['"]/g, '') || file.Key,
            url,
          };
        } catch (error) {
          console.error(`Error getting URL for file ${file.Key}:`, error);
          return null;
        }
      })
    );

    // Filter out nulls and sort by timestamp
    return filesWithUrls
      .filter((file): file is NonNullable<typeof file> => file !== null)
      .sort((a, b) => b.uploadTimestamp - a.uploadTimestamp);

  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}
