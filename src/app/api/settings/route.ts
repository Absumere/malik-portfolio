import { NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const settings = await client.query(api.settings.get);
    return NextResponse.json(settings);
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

    const settings = await client.mutation(api.settings.update, {
      siteName: data.siteName,
      description: data.description,
      email: data.email,
      socialLinks: data.socialLinks || {},
      theme: data.theme || 'dark',
      maxStorageSize: data.maxStorageSize || 524288000, // 500MB default
      analytics: data.analytics || {},
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
