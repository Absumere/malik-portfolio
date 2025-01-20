'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface B2Image {
  fileName: string;
  url: string;
}

interface ImageTurntableProps {
  images: B2Image[];
  currentIndex: number;
  onNavigate: (newIndex: number) => void;
}

export default function ImageTurntable({ images, currentIndex, onNavigate }: ImageTurntableProps) {
  const [direction, setDirection] = useState(0);

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
    }),
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
    let newIndex = currentIndex + newDirection;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    onNavigate(newIndex);
  };

  if (!images.length) {
    return (
      <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
        <p className="text-neutral-400">No images available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden">
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
          className="w-full h-full flex items-center justify-center p-8"
        >
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].fileName}
            className="max-w-full max-h-full w-auto h-auto object-contain"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
