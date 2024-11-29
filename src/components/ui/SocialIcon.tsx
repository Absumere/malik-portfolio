'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SocialIconProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export const SocialIcon = ({ href, className, children }: SocialIconProps) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "relative group flex items-center justify-center w-10 h-10",
        "text-neutral-400/80 hover:text-white",
        "transition-all duration-500 ease-out",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-[-8px] rounded-full bg-white/5 blur-md" />
      </div>

      {/* Icon */}
      <div className="relative">
        {/* Rotating border */}
        <div className="absolute -inset-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-full border border-white/20 group-hover:rotate-180 transition-transform duration-1000" />
        </div>
        
        {/* Icon content */}
        <div className="relative z-10 transition-transform duration-500">
          {children}
        </div>
      </div>
    </motion.a>
  );
};
