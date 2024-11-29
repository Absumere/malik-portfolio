'use client';

import { cn } from "@/lib/utils";
import React from "react";

interface ShimmerTextProps {
  text: string;
  className?: string;
  isHeader?: boolean;
}

export const ShimmerText = ({ text, className, isHeader = false }: ShimmerTextProps) => {
  return (
    <span
      className={cn(
        "inline-flex animate-text-shimmer bg-[length:200%_auto] bg-clip-text text-transparent transition-all duration-500",
        isHeader
          ? "bg-gradient-to-r from-white via-indigo-300 to-white animate-text-fade"
          : "bg-gradient-to-r from-white via-purple-300 to-white",
        className
      )}
    >
      {text}
    </span>
  );
};
