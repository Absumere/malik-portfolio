import { createMuxUploadUrl } from '@/lib/mux';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { url, assetId } = await createMuxUploadUrl();
    return NextResponse.json({ url, assetId });
  } catch (error) {
    console.error('Error creating upload URL:', error);
    return NextResponse.json(
      { error: 'Failed to create upload URL' },
      { status: 500 }
    );
  }
}
