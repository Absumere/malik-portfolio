import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {
        siteName: data.siteName,
        description: data.description,
        email: data.email,
        socialLinks: data.socialLinks,
        maxStorageSize: data.maxStorageSize,
        theme: data.theme,
        analytics: data.analytics,
      },
      create: {
        id: 1,
        siteName: data.siteName,
        description: data.description,
        email: data.email,
        socialLinks: data.socialLinks,
        maxStorageSize: data.maxStorageSize || 1024 * 1024 * 500, // 500MB default
        theme: data.theme || 'dark',
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
