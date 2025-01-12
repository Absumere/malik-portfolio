import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;

async function generateSignature(params: Record<string, any>) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const toSign = Object.entries({ ...params, timestamp })
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&') + process.env.CLOUDINARY_API_SECRET;

  // Use Web Crypto API instead of Node's crypto
  const encoder = new TextEncoder();
  const data = encoder.encode(toSign);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return { signature, timestamp };
}

export async function POST(request: NextRequest) {
  try {
    const auth = getAuth(request);
    const { userId } = auth;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.formData();
    const file = data.get('file') as File;
    const folder = data.get('folder') as string || 'portfolio';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');

    // Generate upload parameters
    const params = {
      folder,
      upload_preset: 'ml_default',
    };

    const { signature, timestamp } = await generateSignature(params);

    // Create form data for upload
    const formData = new FormData();
    formData.append('file', `data:${file.type};base64,${base64Data}`);
    formData.append('api_key', process.env.CLOUDINARY_API_KEY!);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', folder);
    formData.append('upload_preset', 'ml_default');

    // Upload to Cloudinary
    const uploadResponse = await fetch(
      `${CLOUDINARY_URL}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error('Upload failed');
    }

    const result = await uploadResponse.json();

    // Replace B2 URL with CDN URL
    const cdnUrl = result.secure_url.replace(
      's3.eu-central-003.backblazeb2.com/malikarbab-storage',
      'cdn.malikarbab.de'
    );

    return NextResponse.json({
      success: true,
      url: cdnUrl,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
