import { NextResponse } from 'next/server';
import { generatePresignedUploadUrl } from '@/lib/s3';
import { nanoid } from 'nanoid';
import { auth } from '@clerk/nextjs';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filename, contentType } = await req.json();
    
    // Validate input
    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate a unique key for the file
    const fileExtension = filename.split('.').pop();
    const key = `uploads/${userId}/${nanoid()}.${fileExtension}`;

    const { uploadUrl, fileUrl } = await generatePresignedUploadUrl(key, contentType);

    return NextResponse.json({ uploadUrl, fileUrl });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
