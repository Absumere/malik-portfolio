import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

async function listFiles() {
  try {
    if (!process.env.B2_APPLICATION_KEY_ID || !process.env.B2_APPLICATION_KEY || !process.env.B2_BUCKET_NAME) {
      throw new Error('Missing required B2 configuration');
    }

    // Parse endpoint URL
    const endpointUrl = new URL(process.env.B2_ENDPOINT || '');
    // Handle both formats: eu-central-003 and us-west-002
    const region = endpointUrl.hostname.split('.')[1] + '-' + endpointUrl.hostname.split('.')[2];

    const config = {
      region,
      endpoint: process.env.B2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.B2_APPLICATION_KEY_ID,
        secretAccessKey: process.env.B2_APPLICATION_KEY
      },
      forcePathStyle: true
    };

    console.log('S3 Client Configuration:', {
      region,
      endpoint: process.env.B2_ENDPOINT,
      bucket: process.env.B2_BUCKET_NAME,
      keyIdPrefix: process.env.B2_APPLICATION_KEY_ID?.substring(0, 8),
      forcePathStyle: true
    });

    const s3Client = new S3Client(config);

    console.log('Listing files...');
    const command = new ListObjectsV2Command({
      Bucket: process.env.B2_BUCKET_NAME,
      MaxKeys: 1000
    });

    const response = await s3Client.send(command);
    console.log('Response received:', {
      success: !!response.Contents,
      fileCount: response.Contents?.length || 0,
      keyCount: response.KeyCount,
      isTruncated: response.IsTruncated
    });

    if (response.Contents && response.Contents.length > 0) {
      console.log('First file URL:', `https://cdn.malikarbab.de/${response.Contents[0].Key}`);
    }

    const files = response.Contents || [];
    return files.map(file => ({
      fileName: file.Key || '',
      url: `https://cdn.malikarbab.de/${file.Key}`,
      contentType: file.Key?.split('.').pop()?.toLowerCase() || '',
      uploadTimestamp: file.LastModified?.getTime() || 0,
      public_id: file.Key || ''
    }));

  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const files = await listFiles();
    return NextResponse.json(files);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}
