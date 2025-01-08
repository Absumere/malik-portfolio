"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export const TracingBeam = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseY = useMotionValue(0);
  const mouseX = useMotionValue(0);

  const [rect, setRect] = useState<DOMRect | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }
    setRendered(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    if (rect) {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  const translateX = useSpring(useTransform(mouseX, [0, rect?.width || 0], [0, rect?.width || 0]), {
    stiffness: 500,
    damping: 30,
  });
  const translateY = useSpring(useTransform(mouseY, [0, rect?.height || 0], [0, rect?.height || 0]), {
    stiffness: 500,
    damping: 30,
  });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={className}
      style={{
        position: "relative",
      }}
    >
      {rendered && (
        <motion.div
          className="absolute h-full w-1.5 bg-gradient-to-b from-transparent via-emerald-500 to-transparent"
          style={{
            translateY: translateY,
            left: "-2px",
            top: "-50%",
            height: "200%",
          }}
        />
      )}
      {children}
    </motion.div>
  );
};
