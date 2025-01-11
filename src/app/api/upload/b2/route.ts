import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { nanoid } from 'nanoid';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const B2_API_URL = 'https://api.backblazeb2.com';
const B2_CLOUDFLARE_URL = process.env.B2_CLOUDFLARE_URL;
const B2_APPLICATION_KEY_ID = process.env.B2_APPLICATION_KEY_ID;
const B2_APPLICATION_KEY = process.env.B2_APPLICATION_KEY;
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;

async function getAuthToken() {
  const authString = `${B2_APPLICATION_KEY_ID}:${B2_APPLICATION_KEY}`;
  const base64Auth = btoa(authString);

  const response = await fetch(`${B2_API_URL}/b2api/v2/b2_authorize_account`, {
    headers: {
      Authorization: `Basic ${base64Auth}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to authenticate with B2');
  }

  return response.json();
}

async function getBucketId(authToken: string, apiUrl: string) {
  const response = await fetch(`${apiUrl}/b2api/v2/b2_list_buckets`, {
    method: 'POST',
    headers: {
      Authorization: authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accountId: B2_APPLICATION_KEY_ID,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to list buckets');
  }

  const { buckets } = await response.json();
  const bucket = buckets.find((b: any) => b.bucketName === B2_BUCKET_NAME);

  if (!bucket) {
    throw new Error(`Bucket ${B2_BUCKET_NAME} not found`);
  }

  return bucket.bucketId;
}

async function getUploadUrl(authToken: string, apiUrl: string, bucketId: string) {
  const response = await fetch(`${apiUrl}/b2api/v2/b2_get_upload_url`, {
    method: 'POST',
    headers: {
      Authorization: authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bucketId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get upload URL');
  }

  return response.json();
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

    const { filename } = await request.json();
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const key = `${nanoid()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Get B2 auth token
    const { authorizationToken, apiUrl } = await getAuthToken();

    // Get bucket ID
    const bucketId = await getBucketId(authorizationToken, apiUrl);

    // Get upload URL and token
    const { uploadUrl, authorizationToken: uploadAuthToken } = await getUploadUrl(
      authorizationToken,
      apiUrl,
      bucketId
    );

    return NextResponse.json({
      uploadUrl,
      authorizationToken: uploadAuthToken,
      fileUrl: `${B2_CLOUDFLARE_URL}/${key}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
