import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const defaultSettings = {
  siteName: 'Malik Arbab',
  description: 'Digital Artist & Developer',
  theme: 'dark',
  maxStorageSize: 524288000, // 500MB default
  socialLinks: {},
  analytics: {},
};

export async function GET() {
  try {
    // Return default settings during build
    return NextResponse.json(defaultSettings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.siteName || !data.description) {
      return NextResponse.json(
        { error: 'Site name and description are required' },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Return the validated settings
    return NextResponse.json({
      siteName: data.siteName,
      description: data.description,
      email: data.email,
      socialLinks: data.socialLinks || {},
      theme: data.theme || 'dark',
      maxStorageSize: data.maxStorageSize || 524288000,
      analytics: data.analytics || {},
    });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
