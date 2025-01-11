import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;

function generateSignature(params: Record<string, any>) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const toSign = Object.entries({ ...params, timestamp })
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&') + process.env.CLOUDINARY_API_SECRET;

  return {
    signature: require('crypto')
      .createHash('sha256')
      .update(toSign)
      .digest('hex'),
    timestamp,
  };
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

    const { signature, timestamp } = generateSignature(params);

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

    return NextResponse.json({
      public_id: result.public_id,
      url: result.secure_url,
      resource_type: result.resource_type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
