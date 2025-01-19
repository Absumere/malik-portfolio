import { NextRequest, NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface B2FileInfo {
  fileName: string;
  contentType: string;
  uploadTimestamp: number;
  fileId: string;
  url: string;
}

export async function GET(request: NextRequest) {
  try {
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-store'
    });

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { headers });
    }

    const endpoint = process.env.B2_ENDPOINT;
    const bucketName = process.env.B2_BUCKET_NAME;
    const applicationKeyId = process.env.B2_APPLICATION_KEY_ID;
    const applicationKey = process.env.B2_APPLICATION_KEY;
    const cdnDomain = process.env.NEXT_PUBLIC_CLOUDFLARE_DOMAIN;

    if (!endpoint || !bucketName || !applicationKeyId || !applicationKey || !cdnDomain) {
      console.error('Missing environment variables:', {
        endpoint: !!endpoint,
        bucketName: !!bucketName,
        applicationKeyId: !!applicationKeyId,
        applicationKey: !!applicationKey,
        cdnDomain: !!cdnDomain
      });
      throw new Error('Missing required environment variables');
    }

    console.log('Creating S3 client...', {
      endpoint,
      region: 'eu-central-003',
      bucketName
    });

    const client = new S3Client({
      endpoint,
      region: 'eu-central-003',
      credentials: {
        accessKeyId: applicationKeyId,
        secretAccessKey: applicationKey,
      },
      forcePathStyle: true,
    });

    console.log('Fetching files from bucket:', bucketName);
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 1000,
    });

    const response = await client.send(command);
    console.log('Got response from B2:', {
      success: !!response,
      filesCount: response.Contents?.length || 0
    });

    if (!response.Contents) {
      console.log('No files found in bucket');
      return NextResponse.json([], { headers });
    }

    const files: B2FileInfo[] = response.Contents
      .filter(content => content.Key)
      .map(content => {
        const key = content.Key!;
        return {
          fileName: key,
          contentType: key.split('.').pop()?.toLowerCase() || 'application/octet-stream',
          uploadTimestamp: content.LastModified?.getTime() || Date.now(),
          fileId: content.ETag?.replace(/['"]/g, '') || key,
          url: `https://${cdnDomain}/${key}`,
        };
      })
      .sort((a, b) => b.uploadTimestamp - a.uploadTimestamp);

    console.log(`Found ${files.length} files, first file:`, files[0]);
    return NextResponse.json(files, { headers });
  } catch (error: any) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch files', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { 
        status: error.message.includes('Missing required') ? 500 : 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}
