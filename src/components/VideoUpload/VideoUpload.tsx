'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { processVideo } from '@/utils/videoUtils';
import { toast } from 'react-hot-toast';

interface UploadProgress {
  status: 'processing' | 'uploading' | 'complete' | 'error';
  progress: number;
  resolution?: string;
}

export default function VideoUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    status: 'processing',
    progress: 0,
  });
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    category: 'featured',
    tags: [] as string[],
  });

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const createVideo = useMutation(api.videos.create);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress({ status: 'processing', progress: 0 });

      // Process video and generate different resolutions
      const { metadata, thumbnail, videos } = await processVideo(file);
      setUploadProgress({ status: 'uploading', progress: 10 });

      // Upload thumbnail
      const thumbnailUrl = await generateUploadUrl();
      await fetch(thumbnailUrl, {
        method: 'POST',
        body: thumbnail,
      });
      const thumbnailId = thumbnailUrl.split('/').pop()!;
      setUploadProgress({ status: 'uploading', progress: 20 });

      // Upload each resolution
      const uploadedVideos = await Promise.all(
        videos.map(async (video, index) => {
          const uploadUrl = await generateUploadUrl();
          await fetch(uploadUrl, {
            method: 'POST',
            body: video.file,
          });
          const storageId = uploadUrl.split('/').pop()!;

          setUploadProgress({
            status: 'uploading',
            progress: 20 + ((index + 1) / videos.length) * 70,
            resolution: `${video.width}p`,
          });

          return {
            width: video.width,
            height: video.height,
            storageId,
            bitrate: video.bitrate,
          };
        })
      );

      // Create video record in Convex
      await createVideo({
        ...videoData,
        storageId: uploadedVideos[0].storageId, // Original quality
        thumbnailStorageId: thumbnailId,
        resolutions: uploadedVideos,
        duration: metadata.duration,
        uploadedAt: Date.now(),
        views: 0,
        order: 0,
      });

      setUploadProgress({ status: 'complete', progress: 100 });
      toast.success('Video uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress({ status: 'error', progress: 0 });
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
    }
  }, [videoData, generateUploadUrl, createVideo]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Video Details Form */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Video Title"
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none"
          value={videoData.title}
          onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
        />
        <textarea
          placeholder="Video Description"
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none h-32 resize-none"
          value={videoData.description}
          onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
        />
        <select
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none"
          value={videoData.category}
          onChange={(e) => setVideoData({ ...videoData, category: e.target.value })}
        >
          <option value="featured">Featured</option>
          <option value="showreel">Showreel</option>
          <option value="projects">Projects</option>
          <option value="experiments">Experiments</option>
        </select>
        <div className="flex flex-wrap gap-2">
          {videoData.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-white/10 text-sm flex items-center gap-2"
            >
              {tag}
              <button
                onClick={() =>
                  setVideoData({
                    ...videoData,
                    tags: videoData.tags.filter((_, i) => i !== index),
                  })
                }
                className="hover:text-red-400"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add tag (press Enter)"
            className="px-3 py-1 rounded-full bg-white/5 border border-white/10 focus:border-white/20 focus:outline-none text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value) {
                setVideoData({
                  ...videoData,
                  tags: [...videoData.tags, e.currentTarget.value],
                });
                e.currentTarget.value = '';
              }
            }}
          />
        </div>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`w-full aspect-video rounded-lg border-2 border-dashed transition-colors ${
          isDragActive ? 'border-white/40 bg-white/5' : 'border-white/10'
        } flex items-center justify-center cursor-pointer`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="text-center space-y-4">
            <div className="w-full max-w-xs mx-auto bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${uploadProgress.progress}%` }}
              />
            </div>
            <p className="text-white/60">
              {uploadProgress.status === 'processing'
                ? 'Processing video...'
                : uploadProgress.status === 'uploading'
                ? `Uploading ${uploadProgress.resolution || ''}...`
                : uploadProgress.status === 'complete'
                ? 'Upload complete!'
                : 'Upload failed'}
            </p>
          </div>
        ) : (
          <div className="text-center space-y-2 p-8">
            <svg
              className="w-12 h-12 mx-auto text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-white/60">
              {isDragActive
                ? 'Drop your video here'
                : 'Drag & drop your video here, or click to select'}
            </p>
            <p className="text-white/40 text-sm">
              Supports MP4, MOV, AVI, WebM (max 500MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
