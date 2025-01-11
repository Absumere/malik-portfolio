'use client';

import { useState } from 'react';
import { MediaViewer } from './MediaViewer';
import { Card, Title } from '@tremor/react';
import { 
  FunnelIcon, 
  ArrowsUpDownIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  title?: string;
  description?: string;
  created_at: string;
  size?: number;
  format?: string;
}

interface EnhancedGalleryProps {
  isAdmin?: boolean;
  media: MediaItem[];
}

export function EnhancedGallery({ isAdmin = false, media }: EnhancedGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedMedia = media
    .filter((item) => {
      if (filter === 'all') return true;
      return filter === item.type + 's';
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          break;
        case 'name':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'size':
          comparison = (b.size || 0) - (a.size || 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const response = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      // loadMedia();
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-gray-800 p-4 rounded-lg">
        <div className="flex gap-2">
          <select
            className="bg-gray-700 text-white rounded-md px-3 py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Media</option>
            <option value="images">Images</option>
            <option value="videos">Videos</option>
          </select>

          <select
            className="bg-gray-700 text-white rounded-md px-3 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
          </select>

          <button
            onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
            className="bg-gray-700 text-white rounded-md px-3 py-2 flex items-center gap-2"
          >
            <ArrowsUpDownIcon className="h-5 w-5" />
            {sortOrder.toUpperCase()}
          </button>
        </div>

        <div className="text-gray-300 text-sm">
          {filteredAndSortedMedia.length} items
        </div>
      </div>

      <Title>Media Gallery</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedMedia.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setSelectedMedia(item);
              setIsViewerOpen(true);
            }}
          >
            <div className="aspect-video relative">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.title || 'Gallery image'}
                  className="object-cover w-full h-full rounded-lg"
                />
              ) : (
                <video
                  src={item.url}
                  className="object-cover w-full h-full rounded-lg"
                  muted
                  playsInline
                />
              )}
            </div>
            {item.title && (
              <p className="mt-2 text-sm font-medium">{item.title}</p>
            )}
            {isAdmin && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                >
                  <TrashIcon className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={() => {/* TODO: Implement edit */}}
                  className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <PencilIcon className="h-5 w-5 text-white" />
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {selectedMedia && (
        <MediaViewer
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          currentMedia={selectedMedia}
          allMedia={filteredAndSortedMedia}
        />
      )}
    </div>
  );
}
