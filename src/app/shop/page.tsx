'use client';

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useRef } from "react";
import CloudinaryImage from "@/components/CloudinaryImage";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function Shop() {
  const { data: session } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Try to fetch data from Convex
  const convexArtworks = useQuery(api.artworks.getAll);

  // Fallback data while Convex loads
  const fallbackProducts = [
    {
      _id: 1,
      imageUrl: "malik-portfolio/artwork1_kxwqvs",
      title: "Digital Dreams Print",
      description: "High-quality print of Digital Dreams artwork",
      price: 49.99,
      inStock: true,
      tags: ["Print", "Digital Art"]
    },
    {
      _id: 2,
      imageUrl: "malik-portfolio/artwork2_uuqxts",
      title: "Abstract Reality Canvas",
      description: "Canvas print of Abstract Reality",
      price: 89.99,
      inStock: true,
      tags: ["Canvas", "Abstract"]
    },
    {
      _id: 3,
      imageUrl: "malik-portfolio/artwork3_wnlcpx",
      title: "Future Vision Limited Edition",
      description: "Limited edition print of Future Vision",
      price: 149.99,
      inStock: false,
      tags: ["Limited Edition", "Print"]
    }
  ];

  const products = convexArtworks || fallbackProducts;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6">Shop</h1>
          <p className="text-xl text-gray-400">Purchase prints and original artworks</p>
        </motion.div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg bg-gray-900"
            >
              <CloudinaryImage
                src={product.imageUrl}
                alt={product.title}
                width={400}
                height={400}
                className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold mb-2">{product.title}</h3>
                  <p className="text-gray-200 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold">${product.price}</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      product.inStock 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-white/20 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-full font-bold transition-colors duration-300 ${
                      product.inStock
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
