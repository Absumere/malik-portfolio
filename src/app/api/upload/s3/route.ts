import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { nanoid } from 'nanoid';

// Configure route segment
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_BUCKET = process.env.AWS_BUCKET || '';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';

async function generatePresignedUrl(key: string, contentType: string) {
  const date = new Date();
  const timestamp = Math.floor(date.getTime() / 1000);
  const datestamp = date.toISOString().slice(0, 10).replace(/-/g, '');

  // AWS V4 signing
  const algorithm = 'AWS4-HMAC-SHA256';
  const scope = `${datestamp}/${AWS_REGION}/s3/aws4_request`;
  const expiration = timestamp + 60 * 5; // 5 minutes

  const policy = {
    expiration: new Date(expiration * 1000).toISOString(),
    conditions: [
      { bucket: AWS_BUCKET },
      { key },
      ['content-length-range', 0, 10485760], // 10MB max
      ['starts-with', '$Content-Type', contentType],
      { 'x-amz-algorithm': algorithm },
      { 'x-amz-credential': `${AWS_ACCESS_KEY_ID}/${scope}` },
      { 'x-amz-date': date.toISOString().replace(/[:\-]|\.\d{3}/g, '') },
    ],
  };

  const policyBase64 = Buffer.from(JSON.stringify(policy)).toString('base64');

  // Generate signature
  const kDate = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(`AWS4${AWS_SECRET_ACCESS_KEY}`),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const kRegion = await crypto.subtle.sign(
    'HMAC',
    kDate,
    new TextEncoder().encode(AWS_REGION)
  );

  const kService = await crypto.subtle.sign(
    'HMAC',
    await crypto.subtle.importKey(
      'raw',
      kRegion,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ),
    new TextEncoder().encode('s3')
  );

  const kSigning = await crypto.subtle.sign(
    'HMAC',
    await crypto.subtle.importKey(
      'raw',
      kService,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ),
    new TextEncoder().encode('aws4_request')
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    await crypto.subtle.importKey(
      'raw',
      kSigning,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ),
    new TextEncoder().encode(policyBase64)
  );

  return {
    url: `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com`,
    fields: {
      key,
      'Content-Type': contentType,
      'x-amz-algorithm': algorithm,
      'x-amz-credential': `${AWS_ACCESS_KEY_ID}/${scope}`,
      'x-amz-date': date.toISOString().replace(/[:\-]|\.\d{3}/g, ''),
      policy: policyBase64,
      'x-amz-signature': Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join(''),
    },
  };
}

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
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const key = `${nanoid()}-${filename}`;
    const presignedUrl = await generatePresignedUrl(key, contentType);

    return NextResponse.json({
      ...presignedUrl,
      key,
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
