import { NextRequest, NextResponse } from 'next/server';
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

    const s3Client = new S3Client(config);
    const command = new ListObjectsV2Command({
      Bucket: process.env.B2_BUCKET_NAME,
      MaxKeys: 1000
    });

    const response = await s3Client.send(command);
    const files = response.Contents || [];

    return files.map(file => {
      const key = file.Key || '';
      return {
        fileName: key,
        url: `/api/media/${encodeURIComponent(key)}`,
        contentType: key.split('.').pop()?.toLowerCase() || '',
        uploadTimestamp: file.LastModified?.getTime() || 0,
        public_id: key
      };
    });

  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Set CORS headers
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60'
    });

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { headers });
    }

    const files = await listFiles();
    return NextResponse.json(files, { 
      headers,
      status: 200
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files', details: error.message },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}
