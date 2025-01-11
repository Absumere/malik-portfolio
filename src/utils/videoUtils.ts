import ffmpeg from 'fluent-ffmpeg';

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
  return new Promise<{ width: number; height: number; duration: number }>((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration
      });
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video metadata'));
    };
    
    video.src = URL.createObjectURL(file);
  });
}
