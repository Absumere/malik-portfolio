import { NextRequest, NextResponse } from 'next/server';
import { getUploadUrl } from '@/lib/b2';
import { auth } from '@clerk/nextjs';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { filename, contentType } = await req.json();
    
    if (!filename) {
      return new NextResponse('Filename is required', { status: 400 });
    }

    const safeFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    const uploadData = await getUploadUrl(safeFilename);

    return NextResponse.json(uploadData);
  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
