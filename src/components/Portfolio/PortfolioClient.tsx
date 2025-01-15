'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { LoadingSpinner } from '../UI/LoadingSpinner';
import { useRef } from 'react';

export function PortfolioClient() {
  const projects = useQuery(api.portfolio.getAll);
  const sliderRef = useRef<HTMLDivElement>(null);

  if (!projects) {
    return <LoadingSpinner />;
  }

  const videoProjects = projects.filter(p => p.category === 'video');
  const imageProjects = projects.filter(p => p.category === 'image');

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-8"></h2>

      {/* Video Projects Slider */}
      {videoProjects.length > 0 && (
        <section className="mb-12">
          <div className="relative">
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 p-2 rounded-full hover:bg-black/60 transition"
            >
              ←
            </button>
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 p-2 rounded-full hover:bg-black/60 transition"
            >
              →
            </button>
            <div
              ref={sliderRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {videoProjects.map((project) => (
                <div 
                  key={project._id} 
                  className="flex-none w-[400px] snap-start"
                >
                  <div className="aspect-video rounded-md overflow-hidden bg-neutral-900/50">
                    <video
                      src={`https://stream.mux.com/${project.muxPlaybackId}/high.mp4`}
                      className="w-full h-full object-cover"
                      controls
                      playsInline
                      preload="none"
                      poster={project.imageUrl}
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm text-neutral-300 font-light">
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 bg-neutral-800/50 rounded text-xs text-neutral-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Image Projects Grid */}
      {imageProjects.length > 0 && (
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageProjects.map((project) => (
              <div key={project._id} className="group">
                <div className="aspect-video rounded-md overflow-hidden bg-neutral-900/50">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2 space-y-1">
                  <h3 className="text-sm text-neutral-300 font-light group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {project.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 bg-neutral-800/50 rounded text-xs text-neutral-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
