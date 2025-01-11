import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
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
      }),
    ]);

    // Combine and format the results
    const media = [
      ...imageResults.resources.map((resource: any) => ({
        ...resource,
        type: 'image',
      })),
      ...videoResults.resources.map((resource: any) => ({
        ...resource,
        type: 'video',
      })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ media });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json();
    
    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    // Check if the file is an image or video
    const resourceType = publicId.startsWith('video/') ? 'video' : 'image';
    
    // Delete the file from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result.result === 'ok') {
      return NextResponse.json({ message: 'Media deleted successfully' });
    } else {
      throw new Error('Failed to delete media');
    }
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}
