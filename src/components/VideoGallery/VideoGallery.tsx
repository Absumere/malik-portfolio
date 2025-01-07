'use client';

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import VideoPlayer from "./VideoPlayer";
import { motion, AnimatePresence } from "framer-motion";

interface VideoGalleryProps {
  category?: string;
}

export default function VideoGallery({ category }: VideoGalleryProps) {
  const [cursor, setCursor] = useState<string | undefined>();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
  });

  const { videos, cursor: newCursor } = useQuery(api.videos.listVideos, {
    category,
    cursor,
    limit: 12,
  }) ?? { videos: [], cursor: undefined };

  useEffect(() => {
    if (inView && newCursor && !loadingMore) {
      setLoadingMore(true);
      setCursor(newCursor);
    }
  }, [inView, newCursor]);

  useEffect(() => {
    setLoadingMore(false);
  }, [videos]);

  return (
    <div className="w-full" ref={containerRef}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {videos?.map((video) => (
            <motion.div
              key={video._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="aspect-video relative group cursor-pointer"
              onClick={() => setSelectedVideo(video._id)}
            >
              <VideoPlayer
                videoId={video._id}
                thumbnailId={video.thumbnailStorageId}
                autoPlay={false}
                muted={true}
                controls={false}
                className="rounded-lg overflow-hidden hover:scale-[1.02] transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium">{video.title}</h3>
                  <p className="text-white/80 text-sm">{video.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Trigger */}
      {newCursor && (
        <div
          ref={loadMoreRef}
          className="w-full h-20 flex items-center justify-center mt-8"
        >
          {loadingMore && (
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          )}
        </div>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-6xl aspect-video relative"
              onClick={(e) => e.stopPropagation()}
            >
              <VideoPlayer
                videoId={selectedVideo}
                autoPlay={true}
                muted={false}
                controls={true}
                className="rounded-lg overflow-hidden w-full h-full"
              />
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
