import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dsmwumvpx',
  api_key: '553915873798198',
  api_secret: 'RMYOC0PLRAhh5BMc5Agj3VvdnOQ',
  secure: true,
});

export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  created_at: string;
}

export async function getCloudinaryImages(folder = 'portfolio'): Promise<CloudinaryImage[]> {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: 100,
    });

    return result.resources.map((resource: any) => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
      format: resource.format,
      width: resource.width,
      height: resource.height,
      created_at: resource.created_at,
    }));
  } catch (error) {
    console.error('Error fetching Cloudinary images:', error);
    return [];
  }
}

export const getCloudinaryUrl = (publicId: string, options = {}) => {
  return cloudinary.url(publicId, {
    quality: 'auto',
    format: 'auto',
    ...options,
  });
};

export default cloudinary;
