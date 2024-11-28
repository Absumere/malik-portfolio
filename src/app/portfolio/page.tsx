'use client';

import ClientNav from "@/components/ClientNav";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useState } from "react";

export default function PortfolioPage() {
  const artworks = useQuery(api.artworks.getAll) ?? [];
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredArtworks = artworks.filter(artwork =>
    selectedCategory === "all" ? true : artwork.category === selectedCategory
  );

  const categories = ["all", ...new Set(artworks.map(artwork => artwork.category))];

  return (
    <div className="min-h-screen bg-black text-white">
      <ClientNav />
      <main className="pt-32 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Portfolio</h1>
          
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full ${
                    selectedCategory === category
                      ? "bg-white text-black"
                      : "border border-white/20 hover:border-white/40"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Artwork Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((artwork, index) => (
              <div key={index} className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-800">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{artwork.title}</h3>
                  <p className="text-gray-400 mb-4">{artwork.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm bg-gray-800 px-3 py-1 rounded-full">
                      {artwork.technique}
                    </span>
                    {artwork.isForSale && (
                      <span className="text-sm bg-green-900 text-green-200 px-3 py-1 rounded-full">
                        For Sale
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
