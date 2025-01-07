import ffmpeg from 'fluent-ffmpeg';
import { generateUploadUrl } from '../../convex/files';

interface Resolution {
  width: number;
  height: number;
  bitrate: number;
}

const RESOLUTIONS: Resolution[] = [
  { width: 1920, height: 1080, bitrate: 5000 },
  { width: 1280, height: 720, bitrate: 2500 },
  { width: 854, height: 480, bitrate: 1000 },
  { width: 640, height: 360, bitrate: 500 },
];

export async function processVideo(file: File) {
  const videoBlob = new Blob([file], { type: file.type });
  const videoUrl = URL.createObjectURL(videoBlob);

  // Get video metadata
  const metadata = await getVideoMetadata(videoUrl);
  
  // Generate thumbnail
  const thumbnail = await generateThumbnail(videoUrl, metadata.duration / 2);
  
  // Process different resolutions
  const processedVideos = await Promise.all(
    RESOLUTIONS.map(async (resolution) => {
      if (metadata.width < resolution.width) return null;
      
      const processedVideo = await transcodeVideo(videoUrl, resolution);
      return {
        ...resolution,
        file: processedVideo,
      };
    })
  );

  // Filter out null values and sort by width
  const validVideos = processedVideos
    .filter((v): v is NonNullable<typeof v> => v !== null)
    .sort((a, b) => b.width - a.width);

  return {
    metadata,
    thumbnail,
    videos: validVideos,
  };
}

export function getVideoMetadata(videoUrl: string): Promise<{
  width: number;
  height: number;
  duration: number;
}> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      });
    };
    video.onerror = reject;
    video.src = videoUrl;
  });
}

async function generateThumbnail(
  videoUrl: string,
  timeInSeconds: number
): Promise<Blob> {
  const video = document.createElement('video');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  return new Promise((resolve, reject) => {
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    video.onseeked = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to generate thumbnail'));
      }, 'image/jpeg', 0.8);
    };

    video.onerror = reject;
    video.src = videoUrl;
    video.currentTime = timeInSeconds;
  });
}

async function transcodeVideo(
  videoUrl: string,
  resolution: Resolution
): Promise<Blob> {
  // Note: This is a simplified version. In production, you'd want to use a server-side
  // transcoding service or Web Assembly version of FFmpeg
  return new Promise((resolve, reject) => {
    ffmpeg(videoUrl)
      .size(`${resolution.width}x${resolution.height}`)
      .videoBitrate(resolution.bitrate)
      .format('mp4')
      .on('end', (output: Blob) => resolve(output))
      .on('error', reject)
      .run();
  });
}
