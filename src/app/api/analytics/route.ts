import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const analytics = await convex.query(api.analytics.getAnalytics);
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Failed to fetch analytics:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const analyticsId = await convex.mutation(api.analytics.saveAnalytics, {
      pageUrl: data.pageUrl || '/',
      visitorId: data.visitorId || null,
      country: data.country || null,
      device: data.device || null,
      browser: data.browser || null,
      duration: data.duration || 0,
    });

    return NextResponse.json({ success: true, analyticsId });
  } catch (error) {
    console.error('Failed to save analytics:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Failed to save analytics' }, { status: 500 });
  }
}
