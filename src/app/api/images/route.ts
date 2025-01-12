import { NextRequest, NextResponse } from 'next/server';
import { listB2Files } from '@/utils/b2';

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

    console.log('Fetching B2 files...');
    const files = await listB2Files();
    console.log(`Returning ${files.length} files`);

    return NextResponse.json(files, { 
      headers,
      status: 200
    });
  } catch (error: any) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch files', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { 
        status: error.message.includes('Access Denied') ? 403 : 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}
