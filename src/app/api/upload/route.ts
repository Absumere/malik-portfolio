import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dxmx5cyu3',
  api_key: '899921125767321',
  api_secret: '7v0deFKIu4E4QTptQmgAy0oqpiw'
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { timestamp, folder } = data;

    // Generate signature for upload
    const signatureResponse = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
        upload_preset: 'ml_default',
      },
      '7v0deFKIu4E4QTptQmgAy0oqpiw'
    );

    return NextResponse.json({
      signature: signatureResponse,
      timestamp,
      cloudName: 'dxmx5cyu3',
      apiKey: '899921125767321',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    );
  }
}
