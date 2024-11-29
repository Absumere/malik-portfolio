'use client';

import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText = ({ text, className }: GlitchTextProps) => {
  const [displayText, setDisplayText] = useState(text);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    // Matrix effect that runs continuously when active
    const matrixInterval = setInterval(() => {
      if (isMatrixActive) {
        setDisplayText(text.split("").map((char) => {
          if (char === " ") return " ";
          return Math.random() > 0.8 ? letters[Math.floor(Math.random() * 26)] : char;
        }).join(""));
      } else {
        setDisplayText(text);
      }
    }, 70); // Slightly slower for smoother appearance

    return () => clearInterval(matrixInterval);
  }, [text, isMatrixActive]);

  useEffect(() => {
    const cycleEffect = () => {
      // Fade in
      setOpacity(0.85);
      setIsMatrixActive(true);
      
      // Start fade out slightly before effect ends
      setTimeout(() => {
        setOpacity(1);
        setTimeout(() => {
          setIsMatrixActive(false);
        }, 200);
      }, 1500);
    };

    cycleEffect(); // Initial run
    const cycleInterval = setInterval(cycleEffect, 6000); // Total cycle: 6 seconds (1.7s effect + 4.3s pause)

    return () => clearInterval(cycleInterval);
  }, []);

  return (
    <span 
      className={cn("font-light tracking-wider", className)}
      style={{ 
        opacity: opacity,
        transition: "opacity 400ms ease-in-out"
      }}
    >
      {displayText}
    </span>
  );
};
