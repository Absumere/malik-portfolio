import { NextRequest, NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import { getB2DownloadUrl } from '@/utils/b2';

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

    console.log('Fetching files from bucket:', bucketName);
    
    const url = `${endpoint}/${bucketName}?list-type=2`;
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

    const xmlText = await response.text();
    const parser = new XMLParser();
    const result = parser.parse(xmlText);

    const contents = result.ListBucketResult?.Contents || [];
    const files: B2FileInfo[] = await Promise.all(
      (Array.isArray(contents) ? contents : [contents]).map(async (content: any) => {
        const url = await getB2DownloadUrl(content.Key);
        return {
          fileName: content.Key,
          contentType: content.Key.split('.').pop()?.toLowerCase() || 'application/octet-stream',
          uploadTimestamp: new Date(content.LastModified).getTime(),
          fileId: content.ETag?.replace(/['"]/g, '') || content.Key,
          url,
        };
      })
    );

    console.log(`Found ${files.length} files`);
    const sortedFiles = files.sort((a, b) => b.uploadTimestamp - a.uploadTimestamp);

    return NextResponse.json(sortedFiles, { headers });
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
