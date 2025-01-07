'use client';

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useMutation } from "convex/react";

interface VideoPlayerProps {
  videoId: string;
  thumbnailId?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
}

export default function VideoPlayer({
  videoId,
  thumbnailId,
  autoPlay = false,
  muted = true,
  controls = false,
  className = "",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentResolution, setCurrentResolution] = useState<number>(720);
  const [loading, setLoading] = useState(true);
  const updateViews = useMutation(api.videos.updateViews);

  const { ref: videoContainerRef, inView } = useInView({
    threshold: 0.5,
  });

  const video = useQuery(api.videos.getVideo, { id: videoId });

  useEffect(() => {
    if (!video) return;

    // Find the best resolution based on container width
    const containerWidth = videoRef.current?.parentElement?.clientWidth ?? 1920;
    const availableResolutions = video.resolutions.map((r) => r.width);
    const bestResolution = availableResolutions.reduce((prev, curr) =>
      Math.abs(curr - containerWidth) < Math.abs(prev - containerWidth) ? curr : prev
    );
    
    setCurrentResolution(bestResolution);
  }, [video, videoRef.current?.parentElement?.clientWidth]);

  useEffect(() => {
    if (!video) return;

    const currentSource = video.resolutions.find(
      (r) => r.width === currentResolution
    );
    if (!currentSource) return;

    // Update video source
    if (videoRef.current) {
      videoRef.current.src = `/api/videos/${currentSource.storageId}`;
    }
  }, [currentResolution, video]);

  useEffect(() => {
    if (inView && autoPlay && !isPlaying) {
      videoRef.current?.play();
      setIsPlaying(true);
      updateViews({ id: videoId });
    } else if (!inView && isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [inView, autoPlay]);

  if (!video) return null;

  return (
    <div ref={videoContainerRef} className={`relative ${className}`}>
      {loading && thumbnailId && (
        <img
          src={`/api/files/${thumbnailId}`}
          alt="Video thumbnail"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        muted={muted}
        controls={controls}
        playsInline
        loop
        className="w-full h-full object-cover"
        onCanPlay={() => setLoading(false)}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
