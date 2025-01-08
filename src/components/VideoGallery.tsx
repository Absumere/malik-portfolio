'use client';

import { useState } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { motion } from 'framer-motion';

const videos = [
  { 
    id: 'Kqi9OTyjyCe01EGJ02qOSb00RYiHuXbwJlTtOCxghpqels',
    title: 'Project 1'
  },
  { 
    id: 'Ero9YiIIxKe011Um4vOAHFb02Dix6gKe00oyaE2QIr7FRM',
    title: 'Project 2'
  },
  { 
    id: '85nCC2mw6lgJOE8TGULrbOau7rJi015sFY8XHcjgI000200',
    title: 'Project 3'
  },
  { 
    id: 'IQnfC56RsoESilOeJIVXaeFi8TV7dIxlJIFu00EDGZAk',
    title: 'Project 4'
  },
  { 
    id: 'nr22uVtnzjZ6Ad5YEWjSxbxwFEGkeC3RTUzmAZJN5DM',
    title: 'Project 5'
  },
  {
    id: 'andOi7FlQYlWyvOw00pMMJUWaiDAy1huUlhGJmvqS2U4',
    title: 'Project 6'
  },
  {
    id: 'NuvzFESr001beHQPWGko2qp4A5UYp00xDyVbyKSnQ02Dt4',
    title: 'Project 7'
  },
  {
    id: '7PTBflpt6CkrOImGVqiFaMkxSyRjarWAA2XljsghNUU',
    title: 'Project 8'
  },
  {
    id: 'Gl02WDnINMkY2wMjdmeIRUfI1yzwpD6PdK3lqKSSMvCY',
    title: 'Project 9'
  },
  {
    id: 'o5024WoFR201hXlka0100pU02CJk4gVVeomzcdi85w01RqTtI',
    title: 'Project 10'
  },
  {
    id: 'JhbLttao023WwAgz2gCI4GrOh1GuhB6YDYkfkd6t9WBo',
    title: 'Project 11'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      ease: "easeOut"
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function VideoGallery() {
  const [loadedVideos, setLoadedVideos] = useState(new Set<string>());

  const handleVideoLoad = (videoId: string) => {
    setLoadedVideos(prev => new Set(prev).add(videoId));
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {videos.map((video) => (
        <motion.div
          key={video.id}
          variants={item}
          className="group relative bg-[#111111] overflow-hidden border border-[#222222] hover:border-white/20 transition-all duration-300"
        >
          {!loadedVideos.has(video.id) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
          <MuxPlayer
            streamType="on-demand"
            playbackId={video.id}
            metadata={{
              video_title: video.title,
            }}
            onLoadStart={() => handleVideoLoad(video.id)}
            className={`w-full h-full transition-opacity duration-300 ${
              loadedVideos.has(video.id) ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay={false}
            muted={true}
            thumbnailTime={1}
            primaryColor="#FFFFFF"
            secondaryColor="#000000"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
