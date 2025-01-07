'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const products = [
  {
    id: 1,
    title: 'Neon Dreams',
    image: 'https://placehold.co/600x400/111/333?text=Neon+Dreams',
    category: 'Print Collection',
    description: 'Limited edition prints featuring surreal neon-infused cityscapes and abstract compositions.',
    price: '$149.99',
    status: 'In Stock'
  },
  {
    id: 2,
    title: 'Digital Dreams',
    image: 'https://placehold.co/600x400/111/333?text=Digital+Dreams',
    category: 'Digital Art',
    description: 'High-resolution digital artworks exploring the intersection of technology and imagination.',
    price: '$99.99',
    status: 'In Stock'
  },
  // Add more products as needed
];

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-[1600px] mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-[40px] font-medium">Shop</h1>
          <p className="text-gray-400 text-xl">
            Purchase prints and original artworks
          </p>
        </motion.div>

        {/* Filter buttons */}
        <div className="flex gap-2 mt-8">
          <button className="px-4 py-2 bg-white/10 rounded text-sm hover:bg-white/20 transition">
            All
          </button>
          <button className="px-4 py-2 bg-black rounded text-sm border border-white/10 hover:bg-white/10 transition">
            Print Collection
          </button>
          <button className="px-4 py-2 bg-black rounded text-sm border border-white/10 hover:bg-white/10 transition">
            Digital Art
          </button>
          <button className="px-4 py-2 bg-black rounded text-sm border border-white/10 hover:bg-white/10 transition">
            Original Works
          </button>
        </div>

        {/* Grid of products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-12">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="p-6 rounded bg-[#141414] hover:bg-[#1a1a1a] transition h-full">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-medium">{product.title}</h3>
                  <span className="px-2 py-1 text-xs rounded bg-black border border-white/10">
                    {product.category}
                  </span>
                </div>
                <Image
                  src={product.image}
                  alt={product.title}
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover mb-4"
                />
                <p className="text-gray-400 mb-6 text-base leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl">{product.price}</span>
                  <button className="px-4 py-2 rounded bg-black border border-white/10 hover:bg-white/10 transition text-sm">
                    Add to Cart
                  </button>
                </div>
                <div className="mt-4">
                  <span className="text-emerald-400 text-sm">{product.status}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
