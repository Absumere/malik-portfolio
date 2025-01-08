import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

async function listFiles() {
  try {
    if (!process.env.B2_APPLICATION_KEY_ID || !process.env.B2_APPLICATION_KEY || !process.env.B2_BUCKET_NAME) {
      throw new Error('Missing required B2 configuration');
    }

    // Parse endpoint URL
    const endpointUrl = new URL(process.env.B2_ENDPOINT || '');
    // Handle both formats: eu-central-003 and us-west-002
    const region = endpointUrl.hostname.split('.')[1] + '-' + endpointUrl.hostname.split('.')[2];

    const config = {
      region,
      endpoint: process.env.B2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.B2_APPLICATION_KEY_ID,
        secretAccessKey: process.env.B2_APPLICATION_KEY
      },
      forcePathStyle: true
    };

    console.log('S3 Client Configuration:', {
      region,
      endpoint: process.env.B2_ENDPOINT,
      bucket: process.env.B2_BUCKET_NAME,
      keyIdPrefix: process.env.B2_APPLICATION_KEY_ID?.substring(0, 8),
      forcePathStyle: true
    });

    const s3Client = new S3Client(config);

    console.log('Listing files...');
    const command = new ListObjectsV2Command({
      Bucket: process.env.B2_BUCKET_NAME,
      MaxKeys: 1000
    });

    const response = await s3Client.send(command);
    console.log('Response received:', {
      success: !!response.Contents,
      fileCount: response.Contents?.length || 0,
      keyCount: response.KeyCount,
      isTruncated: response.IsTruncated
    });

    const files = response.Contents || [];

    // Generate signed URLs for each file
    const transformedFiles = await Promise.all(files.map(async file => {
      const getObjectCommand = new GetObjectCommand({
        Bucket: process.env.B2_BUCKET_NAME,
        Key: file.Key,
      });

      const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
        expiresIn: 3600 // URL expires in 1 hour
      });

      return {
        fileName: file.Key,
        url: signedUrl,
        contentType: file.Key?.split('.').pop() || '',
        uploadTimestamp: file.LastModified?.getTime() || 0,
        public_id: file.ETag?.replace(/"/g, '') || '',
        format: file.Key?.split('.').pop() || ''
      };
    }));

    console.log('First file URL:', transformedFiles[0]?.url);
    return NextResponse.json(transformedFiles);
  } catch (error: any) {
    console.error('Detailed error in /api/images:', {
      message: error.message,
      code: error.$metadata?.httpStatusCode,
      requestId: error.$metadata?.requestId,
      cfRay: error.$metadata?.cfRay,
      env: {
        hasKeyId: !!process.env.B2_APPLICATION_KEY_ID,
        hasKey: !!process.env.B2_APPLICATION_KEY,
        bucketName: process.env.B2_BUCKET_NAME,
        endpoint: process.env.B2_ENDPOINT
      }
    });

    return NextResponse.json(
      { 
        error: 'Failed to fetch images', 
        details: error.message,
        code: error.$metadata?.httpStatusCode
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return listFiles();
}
