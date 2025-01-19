import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { nanoid } from 'nanoid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Change to nodejs runtime since we're using AWS SDK
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_BUCKET = process.env.AWS_BUCKET_NAME || '';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
const CLOUDFLARE_DOMAIN = process.env.NEXT_PUBLIC_CLOUDFLARE_DOMAIN || 'cdn.malikarbab.de';

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request: Request) {
  try {
    const auth = getAuth(request);
    const { userId } = auth;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { filename, contentType } = await request.json();
    
    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Filename and content type are required' },
        { status: 400 }
      );
    }

    const key = `${nanoid()}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: AWS_BUCKET,
      Key: key,
      ContentType: contentType,
      ACL: 'public-read',
      CacheControl: 'public, max-age=31536000', // 1 year cache
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    // Return both the upload URL and the Cloudflare CDN URL
    const cdnUrl = `https://${CLOUDFLARE_DOMAIN}/${key}`;

    return NextResponse.json({
      uploadUrl: signedUrl,
      publicUrl: cdnUrl,
      key: key
    });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
