'use client';

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ArtworkList() {
  console.log('ArtworkList component rendering - START');
  
  try {
    const artworks = useQuery(api.artworks.getAll);
    console.log('Artworks query result:', artworks);

    const createArtwork = useMutation(api.artworks.create);

    const handleAddTest = async () => {
      try {
        await createArtwork({
          title: "Test Artwork",
          description: "A test artwork to verify Convex integration",
          imageUrl: "https://placeholder.co/300",
          category: "digital",
          tags: ["test", "digital"],
          technique: "digital",
          isForSale: true,
          price: 100,
        });
        console.log('Artwork created successfully');
      } catch (error) {
        console.error('Error creating artwork:', error);
      }
    };

    // Add a simple div first to test rendering
    return (
      <div className="p-4 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Artwork List</h1>
        {artworks === undefined ? (
          <div>Loading...</div>
        ) : artworks === null ? (
          <div>Error loading artworks</div>
        ) : artworks.length === 0 ? (
          <div>
            <p>No artworks yet</p>
            <button
              onClick={handleAddTest}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Test Artwork
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={handleAddTest}
              className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Test Artwork
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {artworks.map((artwork: any) => (
                <div key={artwork._id} className="border rounded-lg p-4 shadow-sm bg-white">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <h3 className="text-xl font-semibold mt-2">{artwork.title}</h3>
                  <p className="text-gray-600">{artwork.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{artwork.technique}</span>
                    {artwork.isForSale && (
                      <span className="text-green-600">€{artwork.price}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error in ArtworkList component:', error);
    return <div className="p-4 bg-red-100 text-red-700">Error loading artwork list: {String(error)}</div>;
  }
}
