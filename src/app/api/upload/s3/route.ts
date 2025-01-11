import { NextResponse } from 'next/server';
import { generatePresignedUploadUrl } from '@/lib/s3';
import { nanoid } from 'nanoid';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filename, contentType } = await request.json();
    
    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const key = `${session.user.id}/${nanoid()}-${filename}`;
    const presignedUrl = await generatePresignedUploadUrl(key, contentType);

    return NextResponse.json({ presignedUrl, key });
  } catch (error) {
    console.error('S3 upload error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
