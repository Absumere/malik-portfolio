'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import VideoUpload from '@/components/VideoUpload/VideoUpload';
import VideoPlayer from '@/components/VideoGallery/VideoPlayer';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function AdminVideosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [showUploader, setShowUploader] = useState(false);

  const { videos } = useQuery(api.videos.listVideos, {
    category: selectedCategory,
    limit: 50,
  }) ?? { videos: [] };

  const categories = [
    'featured',
    'showreel',
    'projects',
    'experiments',
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Video Management</h1>
          <button
            onClick={() => setShowUploader(!showUploader)}
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
          >
            {showUploader ? 'Close Uploader' : 'Upload Video'}
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-4 py-2 rounded-full ${
              !selectedCategory
                ? 'bg-white text-black'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full capitalize ${
                selectedCategory === category
                  ? 'bg-white text-black'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Video Uploader */}
        {showUploader && (
          <div className="border border-white/10 rounded-xl p-8 bg-white/5">
            <VideoUpload />
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos?.map((video) => (
            <div
              key={video._id}
              className="border border-white/10 rounded-xl overflow-hidden bg-white/5"
            >
              <div className="aspect-video">
                <VideoPlayer
                  videoId={video._id}
                  thumbnailId={video.thumbnailStorageId}
                  autoPlay={false}
                  muted={true}
                  controls={true}
                />
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{video.title}</h3>
                  <p className="text-white/60 text-sm">{video.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-full bg-white/10 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-white/40">
                  <span>{video.views} views</span>
                  <span>
                    {formatDistanceToNow(video.uploadedAt, { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      // TODO: Implement edit functionality
                      toast.error('Edit functionality coming soon');
                    }}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement delete functionality
                      toast.error('Delete functionality coming soon');
                    }}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
