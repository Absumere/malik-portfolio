import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';
import { getAuth } from '@clerk/nextjs/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;
const CDN_URL = 'https://cdn.malikarbab.de';

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
    console.error('Cloudinary API Error:', await response.text());
    throw new Error(`Failed to fetch from Cloudinary: ${response.status}`);
  }

  const data = await response.json();
  return data.resources.map((resource: any) => ({
    ...resource,
    url: resource.secure_url.replace('res.cloudinary.com', CDN_URL)
  }));
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch both images and videos
    const [images, videos] = await Promise.all([
      fetchFromCloudinary('image'),
      fetchFromCloudinary('video')
    ]);

    return NextResponse.json([...images, ...videos]);
  } catch (error: any) {
    console.error('Media API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('public_id');
    const resourceType = searchParams.get('resource_type') || 'image';

    if (!publicId) {
      return NextResponse.json(
        { error: 'Missing public_id parameter' },
        { status: 400 }
      );
    }

    const credentials = btoa(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`);
    const response = await fetch(
      `${CLOUDINARY_URL}/resources/${resourceType}/upload/${publicId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary Delete Error:', errorText);
      throw new Error(`Failed to delete from Cloudinary: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete API Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete media', details: error.message },
      { status: 500 }
    );
  }
}
