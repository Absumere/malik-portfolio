import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const range = request.headers.get('range');

  try {
    // Get the video URL from Convex
    const url = await convex.query(api.files.getUrl, { storageId: id });
    if (!url) {
      return new NextResponse('Video not found', { status: 404 });
    }

    // Fetch video metadata
    const response = await fetch(url, { method: 'HEAD' });
    const size = Number(response.headers.get('content-length'));

    // Handle range request
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunkSize = end - start + 1;

      const videoResponse = await fetch(url, {
        headers: { range: `bytes=${start}-${end}` },
      });

      return new NextResponse(videoResponse.body, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': 'video/mp4',
        },
      });
    }

    // Handle full video request
    const videoResponse = await fetch(url);
    return new NextResponse(videoResponse.body, {
      headers: {
        'Content-Length': size.toString(),
        'Content-Type': 'video/mp4',
      },
    });
  } catch (error) {
    console.error('Error streaming video:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
