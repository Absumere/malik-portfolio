'use client';

import { cn } from "@/lib/utils";
import React from "react";

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export const AnimatedBorder = ({
  children,
  className,
  containerClassName,
}: AnimatedBorderProps) => {
  return (
    <div className={cn("relative group", containerClassName)}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
      <div className={cn("relative bg-black/50 rounded-lg", className)}>
        {children}
      </div>
    </div>
  );
};
