'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  type: 'print' | 'original';
  soldOut?: boolean;
};

const products: Product[] = [
  {
    id: 'above-print',
    title: 'Above',
    description: 'Limited edition digital fine art print',
    price: 149.99,
    image: '/api/b2/IMG_1253.PNG',
    type: 'print',
    soldOut: true
  },
  {
    id: 'aether-print',
    title: 'Äther',
    description: 'Limited edition digital fine art print',
    price: 99.99,
    image: '/api/b2/%C3%A4ther.png',
    type: 'print',
    soldOut: true
  },
];

export default function Shop() {
  const [filter, setFilter] = useState<'all' | 'print'>('all');
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const filteredProducts = products.filter(
    (product) => filter === 'all' || product.type === filter
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-[1600px] w-full mx-auto px-6 py-24">
        <div className="mb-12">
          <h1 className="text-4xl font-light tracking-tight">Shop</h1>
          <p className="text-neutral-400 text-lg">
            Purchase prints and original artworks
          </p>
        </div>

        <div className="flex gap-2 mb-12 max-w-[1200px]">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-sm transition-colors ${
              filter === 'all'
                ? 'bg-white text-black'
                : 'bg-[#111111] text-white hover:bg-[#222222]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('print')}
            className={`px-4 py-2 rounded-sm transition-colors ${
              filter === 'print'
                ? 'bg-white text-black'
                : 'bg-[#111111] text-white hover:bg-[#222222]'
            }`}
          >
            Print Collection
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative bg-[#111111] border border-[#222222] hover:border-white/20 transition-all duration-300">
              <div className="aspect-[4/3] relative">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    loadedImages.has(product.id) ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onLoad={() => setLoadedImages(prev => new Set([...prev, product.id]))}
                  onError={(e) => {
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.style.opacity = '0';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium">{product.title}</h3>
                <p className="text-neutral-400 text-sm mt-1">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg">${product.price}</span>
                  {product.soldOut && (
                    <span className="text-red-500">Sold Out</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
