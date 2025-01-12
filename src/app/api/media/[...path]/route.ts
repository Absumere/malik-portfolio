import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { Buffer } from 'buffer';

export const runtime = 'edge';

async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const chunks = [];
  const reader = stream.getReader();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  
  return Buffer.concat(chunks);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    if (!process.env.B2_APPLICATION_KEY_ID || !process.env.B2_APPLICATION_KEY || !process.env.B2_BUCKET_NAME) {
      throw new Error('Missing required B2 configuration');
    }

    // Join the path segments and decode them
    const filePath = decodeURIComponent(params.path.join('/'));
    console.log('Fetching file:', filePath);

    // Parse endpoint URL for region
    const endpointUrl = new URL(process.env.B2_ENDPOINT || '');
    const region = endpointUrl.hostname.split('.')[1] + '-' + endpointUrl.hostname.split('.')[2];

    const s3Client = new S3Client({
      region,
      endpoint: process.env.B2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.B2_APPLICATION_KEY_ID,
        secretAccessKey: process.env.B2_APPLICATION_KEY
      },
      forcePathStyle: true
    });

    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: filePath,
    });

    const response = await s3Client.send(command);
    
    if (!response.Body) {
      throw new Error('No body in response');
    }

    // Convert the readable stream to a buffer
    const buffer = await streamToBuffer(response.Body as unknown as ReadableStream);

    // Determine content type from file extension if not provided
    const contentType = response.ContentType || 
      filePath.toLowerCase().endsWith('.png') ? 'image/png' :
      filePath.toLowerCase().endsWith('.jpg') || filePath.toLowerCase().endsWith('.jpeg') ? 'image/jpeg' :
      filePath.toLowerCase().endsWith('.gif') ? 'image/gif' :
      filePath.toLowerCase().endsWith('.webp') ? 'image/webp' :
      'application/octet-stream';

    // Set appropriate headers
    const headers = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*'
    });

    if (response.ContentLength) {
      headers.set('Content-Length', response.ContentLength.toString());
    }

    return new NextResponse(buffer, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error fetching image:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch image' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}
