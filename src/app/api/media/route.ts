import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;

async function fetchFromCloudinary(resourceType: 'image' | 'video') {
  const response = await fetch(
    `${CLOUDINARY_URL}/resources/${resourceType}/upload?prefix=portfolio`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`
        ).toString('base64')}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${resourceType}s from Cloudinary`);
  }

  const data = await response.json();
  return data.resources.map((resource: any) => ({
    id: resource.public_id,
    url: resource.secure_url,
    type: resourceType,
    title: resource.context?.custom?.alt || '',
    description: resource.context?.custom?.caption || '',
    createdAt: resource.created_at,
  }));
}

export async function GET() {
  try {
    const [images, videos] = await Promise.all([
      fetchFromCloudinary('image'),
      fetchFromCloudinary('video'),
    ]);

    // Combine and sort by creation date
    const allMedia = [...images, ...videos].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(allMedia);
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
    const auth = getAuth(request);
    const { userId } = auth;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('id');

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${CLOUDINARY_URL}/resources/image/upload/${publicId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`
          ).toString('base64')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete resource');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}
