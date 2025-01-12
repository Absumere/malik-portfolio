import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

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

    // Generate signed URLs for each file
    const signedUrls = await Promise.all(
      files.map(async (file) => {
        const key = file.Key || '';
        const getCommand = new GetObjectCommand({
          Bucket: process.env.B2_BUCKET_NAME,
          Key: key,
        });
        
        try {
          // Generate a signed URL that expires in 1 hour
          const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
          return {
            fileName: key,
            url: signedUrl,
            contentType: key.split('.').pop()?.toLowerCase() || '',
            uploadTimestamp: file.LastModified?.getTime() || 0,
            public_id: key
          };
        } catch (error) {
          console.error('Error generating signed URL:', error);
          return null;
        }
      })
    );

    // Filter out any null entries from failed URL generation
    const validFiles = signedUrls.filter((file): file is NonNullable<typeof file> => file !== null);

    return validFiles;

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
      'Cache-Control': 'no-store' // Don't cache since we're using signed URLs
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
