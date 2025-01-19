import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getSettings() {
  try {
    return await client.query(api.settings.get);
  } catch (error) {
    console.error('Failed to fetch settings from Convex:', error);
    return null;
  }
}

export async function updateSettings(data: {
  siteName: string;
  description: string;
  email?: string;
  socialLinks?: Record<string, string>;
  theme?: 'light' | 'dark';
  maxStorageSize?: number;
  analytics?: Record<string, any>;
}) {
  try {
    return await client.mutation(api.settings.update, {
      siteName: data.siteName,
      description: data.description,
      email: data.email,
      socialLinks: data.socialLinks || {},
      theme: data.theme || 'dark',
      maxStorageSize: data.maxStorageSize || 524288000,
      analytics: data.analytics || {},
    });
  } catch (error) {
    console.error('Failed to update settings in Convex:', error);
    return null;
  }
}
