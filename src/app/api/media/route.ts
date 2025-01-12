import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;

async function fetchFromCloudinary(resourceType: 'image' | 'video') {
  // Use btoa for base64 encoding in Edge runtime
  const credentials = btoa(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`);
  
  const response = await fetch(
    `${CLOUDINARY_URL}/resources/${resourceType}/upload?prefix=portfolio`,
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${resourceType}s from Cloudinary`);
  }

  const data = await response.json();
  return data.resources;
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [images, videos] = await Promise.all([
      fetchFromCloudinary('image'),
      fetchFromCloudinary('video'),
    ]);

    return NextResponse.json({
      images,
      videos,
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { public_id, resource_type } = await request.json();
    if (!public_id || !resource_type) {
      return NextResponse.json(
        { error: 'Missing public_id or resource_type' },
        { status: 400 }
      );
    }

    // Generate signature for deletion
    const timestamp = Math.round(new Date().getTime() / 1000);
    const toSign = `public_id=${public_id}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
    
    // Use Web Crypto API for hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(toSign);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const formData = new FormData();
    formData.append('public_id', public_id);
    formData.append('api_key', process.env.CLOUDINARY_API_KEY!);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    const deleteResponse = await fetch(
      `${CLOUDINARY_URL}/${resource_type}/destroy`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!deleteResponse.ok) {
      const error = await deleteResponse.text();
      console.error('Cloudinary deletion failed:', error);
      return NextResponse.json(
        { error: 'Failed to delete from Cloudinary' },
        { status: 500 }
      );
    }

    const result = await deleteResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
