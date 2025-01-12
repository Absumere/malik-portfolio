import { NextRequest, NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import { getB2DownloadUrl } from '@/utils/b2';
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

    if (!endpoint || !bucketName || !applicationKeyId || !applicationKey) {
      throw new Error('Missing required environment variables');
    }

    console.log('Creating S3 client...');
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
    console.log('Got response from B2');

    if (!response.Contents) {
      console.log('No files found in bucket');
      return NextResponse.json([], { headers });
    }

    const files: B2FileInfo[] = await Promise.all(
      response.Contents.map(async (content) => {
        if (!content.Key) return null;
        try {
          const url = await getB2DownloadUrl(content.Key);
          return {
            fileName: content.Key,
            contentType: content.Key.split('.').pop()?.toLowerCase() || 'application/octet-stream',
            uploadTimestamp: content.LastModified?.getTime() || Date.now(),
            fileId: content.ETag?.replace(/['"]/g, '') || content.Key,
            url,
          };
        } catch (error) {
          console.error(`Error processing file ${content.Key}:`, error);
          return null;
        }
      })
    );

    const validFiles = files
      .filter((file): file is NonNullable<typeof file> => file !== null)
      .sort((a, b) => b.uploadTimestamp - a.uploadTimestamp);

    console.log(`Found ${validFiles.length} valid files`);
    return NextResponse.json(validFiles, { headers });
  } catch (error: any) {
    console.error('API Error:', error);
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
