import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();
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

    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {
        siteName: data.siteName,
        description: data.description,
        email: data.email,
        socialLinks: data.socialLinks || {},
        theme: data.theme || 'dark',
        maxStorageSize: data.maxStorageSize || 524288000, // 500MB default
        analytics: data.analytics || {},
      },
      create: {
        siteName: data.siteName,
        description: data.description,
        email: data.email,
        socialLinks: data.socialLinks || {},
        theme: data.theme || 'dark',
        maxStorageSize: data.maxStorageSize || 524288000,
        analytics: data.analytics || {},
      },
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
