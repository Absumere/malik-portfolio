import { NextRequest, NextResponse } from 'next/server';
import { listB2Files, getB2DownloadUrl } from '@/utils/b2';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Set CORS headers
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-store'
    });

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { headers });
    }

    // List files from B2
    const files = await listB2Files();
    
    // Get download URLs for each file
    const filesWithUrls = await Promise.all(
      files.map(async (file) => {
        try {
          const url = await getB2DownloadUrl(file.fileName);
          return {
            ...file,
            url,
          };
        } catch (error) {
          console.error('Error getting download URL:', error);
          return null;
        }
      })
    );

    // Filter out any failed URLs
    const validFiles = filesWithUrls.filter((file): file is NonNullable<typeof file> => file !== null);

    return NextResponse.json(validFiles, { 
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
