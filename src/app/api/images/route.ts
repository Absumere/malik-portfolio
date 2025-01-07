import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dsmwumvpx',
  api_key: '553915873798198',
  api_secret: 'RMYOC0PLRAhh5BMc5Agj3VvdnOQ',
});

export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'portfolio',
      max_results: 100,
    });

    return NextResponse.json(result.resources);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
