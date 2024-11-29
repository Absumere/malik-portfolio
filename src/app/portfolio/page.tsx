'use client';

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useRef, useState } from "react";
import CloudinaryImage from "@/components/CloudinaryImage";
import gsap from "gsap";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function Portfolio() {
  const { data: session } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Try to fetch data from Convex
  const convexArtworks = useQuery(api.artworks.getAll);

  // Fallback data while Convex loads
  const fallbackArtworks = [
    {
      _id: 1,
      imageUrl: "malik-portfolio/artwork1_kxwqvs",
      title: "Digital Dreams",
      description: "A journey through digital landscapes",
      tags: ["Digital", "Abstract"]
    },
    {
      _id: 2,
      imageUrl: "malik-portfolio/artwork2_uuqxts",
      title: "Abstract Reality",
      description: "Exploring the boundaries of perception",
      tags: ["Abstract", "Experimental"]
    },
    {
      _id: 3,
      imageUrl: "malik-portfolio/artwork3_wnlcpx",
      title: "Future Vision",
      description: "A glimpse into tomorrow",
      tags: ["Futuristic", "Digital"]
    }
  ];

  const artworks = convexArtworks || fallbackArtworks;

  useEffect(() => {
    if (convexArtworks !== undefined) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [convexArtworks]);

  useEffect(() => {
    if (containerRef.current && !isLoading) {
      gsap.from(".portfolio-item", {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6">Portfolio</h1>
          <p className="text-xl text-gray-400">Explore my digital artwork collection</p>
        </motion.div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.map((artwork, index) => (
            <motion.div
              key={artwork._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="portfolio-item group relative overflow-hidden rounded-lg"
              whileHover={{ y: -10 }}
            >
              <CloudinaryImage
                src={artwork.imageUrl}
                alt={artwork.title}
                width={400}
                height={400}
                className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold mb-2">{artwork.title}</h3>
                  <p className="text-gray-200 mb-4">{artwork.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {artwork.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-white/20 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {session?.user && (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors duration-300"
                    >
                      Edit
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
