'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface B2Image {
  fileName: string;
  url: string;
}

interface ImageTurntableProps {
  images: B2Image[];
}

export default function ImageTurntable({ images }: ImageTurntableProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.8,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = images.length - 1;
      if (newIndex >= images.length) newIndex = 0;
      return newIndex;
    });
  };

  const handleImageLoad = (url: string) => {
    setLoadedImages(prev => new Set(prev).add(url));
  };

  // Preload next and previous images
  useEffect(() => {
    const preloadImage = (url: string) => {
      const img = document.createElement('img');
      img.src = url;
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(url));
      };
    };

    const nextIndex = (currentIndex + 1) % images.length;
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    
    if (images[nextIndex]) preloadImage(images[nextIndex].url);
    if (images[prevIndex]) preloadImage(images[prevIndex].url);
  }, [currentIndex, images]);

  if (!images.length) {
    return (
      <div className="w-full max-w-5xl mx-auto aspect-[3/2] bg-black rounded-lg flex items-center justify-center">
        <p className="text-neutral-400">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-[3/2] bg-black rounded-lg overflow-hidden group">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
        >
          {loadedImages.has(images[currentIndex].url) ? (
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].fileName}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        onClick={() => paginate(-1)}
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        onClick={() => paginate(1)}
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Image Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
