'use client';

import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import ClientNav from "@/components/ClientNav";

export default function ShopPage() {
  const artworks = useQuery(api.artworks.getAll) ?? [];
  const [priceFilter, setPriceFilter] = useState("all");

  const filteredArtworks = artworks.filter(artwork => {
    if (!artwork.isForSale) return false;
    if (priceFilter === "all") return true;
    if (priceFilter === "under100" && artwork.price) return artwork.price < 100;
    if (priceFilter === "100to500" && artwork.price) return artwork.price >= 100 && artwork.price <= 500;
    if (priceFilter === "over500" && artwork.price) return artwork.price > 500;
    return false;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <ClientNav />
      <main className="pt-32 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">Shop</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Purchase limited edition prints and digital artwork
            </p>
          </div>

          {/* Filters */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setPriceFilter("all")}
                className={`px-6 py-2 rounded-full ${
                  priceFilter === "all"
                    ? "bg-white text-black"
                    : "border border-white/20 hover:border-white/40"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setPriceFilter("under100")}
                className={`px-6 py-2 rounded-full ${
                  priceFilter === "under100"
                    ? "bg-white text-black"
                    : "border border-white/20 hover:border-white/40"
                }`}
              >
                Under $100
              </button>
              <button
                onClick={() => setPriceFilter("100to500")}
                className={`px-6 py-2 rounded-full ${
                  priceFilter === "100to500"
                    ? "bg-white text-black"
                    : "border border-white/20 hover:border-white/40"
                }`}
              >
                $100 - $500
              </button>
              <button
                onClick={() => setPriceFilter("over500")}
                className={`px-6 py-2 rounded-full ${
                  priceFilter === "over500"
                    ? "bg-white text-black"
                    : "border border-white/20 hover:border-white/40"
                }`}
              >
                Over $500
              </button>
            </div>
          </div>

          {/* Shop Grid */}
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
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">${artwork.price}</span>
                    <button className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
                      Add to Cart
                    </button>
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
