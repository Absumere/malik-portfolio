interface B2AuthResponse {
  apiUrl: string;
  authorizationToken: string;
  downloadUrl: string;
}

interface B2FileInfo {
  fileName: string;
  contentType: string;
  uploadTimestamp: number;
  fileId: string;
}

const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export async function getB2Auth(): Promise<B2AuthResponse> {
  try {
    const applicationKeyId = getEnvVar('B2_APPLICATION_KEY_ID');
    const applicationKey = getEnvVar('B2_APPLICATION_KEY');

    const authString = Buffer.from(`${applicationKeyId}:${applicationKey}`).toString('base64');

    const response = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
      headers: {
        Authorization: `Basic ${authString}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('B2 auth error:', error);
      throw new Error(`Failed to authenticate with B2: ${error}`);
    }

    return response.json();
  } catch (error) {
    console.error('B2 auth error:', error);
    throw error;
  }
}

export async function getB2DownloadUrl(fileName: string): Promise<string> {
  try {
    const bucketName = getEnvVar('B2_BUCKET_NAME');
    return `https://s3.eu-central-003.backblazeb2.com/${bucketName}/${encodeURIComponent(fileName)}`;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
}

export async function listB2Files(): Promise<B2FileInfo[]> {
  try {
    const auth = await getB2Auth();
    const bucketId = getEnvVar('B2_BUCKET_ID');

    const response = await fetch(`${auth.apiUrl}/b2api/v2/b2_list_file_names`, {
      method: 'POST',
      headers: {
        Authorization: auth.authorizationToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketId,
        maxFileCount: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('B2 list files error:', error);
      throw new Error(`Failed to list files: ${error}`);
    }

    const data = await response.json();
    return data.files.map((file: any) => ({
      fileName: file.fileName,
      contentType: file.contentType || 'application/octet-stream',
      uploadTimestamp: file.uploadTimestamp * 1000, // Convert to milliseconds
      fileId: file.fileId,
    }));
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}
