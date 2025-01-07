import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    // Fetch both images and videos from Cloudinary
    const [imageResults, videoResults] = await Promise.all([
      cloudinary.api.resources({
        type: 'upload',
        prefix: 'portfolio',
        resource_type: 'image',
        max_results: 500,
      }),
      cloudinary.api.resources({
        type: 'upload',
        prefix: 'portfolio',
        resource_type: 'video',
        max_results: 500,
      })
    ]);

    // Combine and format results
    const media = [
      ...imageResults.resources.map(resource => ({
        id: resource.public_id,
        url: resource.secure_url,
        type: 'image',
        created_at: resource.created_at,
        format: resource.format,
        size: resource.bytes,
      })),
      ...videoResults.resources.map(resource => ({
        id: resource.public_id,
        url: resource.secure_url,
        type: 'video',
        created_at: resource.created_at,
        format: resource.format,
        size: resource.bytes,
      }))
    ];

    return NextResponse.json(media);
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
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('id');

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    // Try to delete as both image and video
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    } catch {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
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
