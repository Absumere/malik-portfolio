'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { PortfolioItem } from './PortfolioItem';
import { useInView } from 'react-intersection-observer';
import MuxPlayer from '../UI/MuxPlayer';

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  playbackId?: string;
  tags: string[];
  category: string;
}

interface PortfolioGridProps {
  projects: Project[];
}

export function PortfolioGrid({ projects }: PortfolioGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="min-h-screen px-6 py-24">
      {/* Featured Section */}
      <section className="mb-40">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl font-light mb-24 tracking-tight"
        >
          Featured Projects
        </motion.h2>
        <div className="grid grid-cols-1 gap-40">
          {projects
            .filter(p => p.category === 'featured')
            .map((project) => (
              <FeaturedProject key={project.id} project={project} />
            ))}
        </div>
      </section>

      {/* Grid Section */}
      <section className="mt-40">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl font-light mb-24 tracking-tight"
        >
          
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects
            .filter(p => p.category !== 'featured')
            .map((project) => (
              <GridItem key={project.id} project={project} />
            ))}
        </div>
      </section>
    </div>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1 }}
      className="relative"
    >
      <div className="space-y-8">
        <h3 className="text-4xl font-light">{project.title}</h3>
        <p className="text-xl text-neutral-400 max-w-2xl">
          {project.description}
        </p>
        {project.playbackId ? (
          <div className="w-full aspect-video rounded-lg shadow-lg mt-8 overflow-hidden">
            <MuxPlayer
              playbackId={project.playbackId}
              className="w-full h-full"
            />
          </div>
        ) : (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full aspect-video object-cover rounded-lg shadow-lg mt-8"
          />
        )}
        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm text-neutral-400 border border-neutral-800 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function GridItem({ project }: { project: Project }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <div className="space-y-4">
        {project.playbackId ? (
          <div className="aspect-video rounded-lg shadow-lg overflow-hidden">
            <MuxPlayer
              playbackId={project.playbackId}
              className="w-full h-full"
            />
          </div>
        ) : (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full aspect-video object-cover rounded-lg shadow-lg"
          />
        )}
        <h3 className="text-2xl font-light group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-neutral-400">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm text-neutral-400 border border-neutral-800 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
