'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
    return null;
  }

  return (
    <div className="relative w-full h-[calc(100vh-12rem)]">
      <div className="absolute inset-0 flex items-center justify-center">
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
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-[60%] h-[calc(100%-4rem)]">
              <Image
                src={images[currentIndex].url}
                alt=""
                fill
                className="object-contain"
                priority={true}
                quality={100}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/75 hover:text-white hover:bg-black/75 transition-colors z-10"
          onClick={() => paginate(-1)}
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/75 hover:text-white hover:bg-black/75 transition-colors z-10"
          onClick={() => paginate(1)}
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Progress dots - moved outside the main container and positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 py-4 bg-gradient-to-t from-black/50 to-transparent">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/30'
            }`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
