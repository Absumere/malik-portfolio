'use client';

import { api } from "@convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import ClientNav from "@/components/ClientNav";
import { useEffect } from "react";

export default function AiToolsPage() {
  const aiTools = useQuery(api.aiTools.getAll) ?? [];
  const createTool = useMutation(api.aiTools.create);

  useEffect(() => {
    const addTestTool = async () => {
      if (aiTools.length === 0) {
        await createTool({
          name: "Image Generator",
          description: "Generate unique images using state-of-the-art AI models",
          endpoint: "https://example.com/image-generator",
          isActive: true,
          configuration: {
            modelType: "Stable Diffusion XL",
            parameters: {
              width: 1024,
              height: 1024,
              steps: 50
            }
          }
        });
      }
    };
    addTestTool();
  }, [aiTools.length, createTool]);

  return (
    <div className="min-h-screen bg-black text-white">
      <ClientNav />
      <main className="pt-32 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">AI Tools</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore my collection of AI-powered tools for creative professionals
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiTools.map((tool, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                  <p className="text-gray-400 mb-4">{tool.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      tool.isActive 
                        ? "bg-green-900 text-green-200" 
                        : "bg-gray-800 text-gray-400"
                    }`}>
                      {tool.isActive ? "Active" : "Coming Soon"}
                    </span>
                    {tool.isActive && (
                      <button 
                        className="px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                        onClick={() => window.open(tool.endpoint, '_blank')}
                      >
                        Try Now
                      </button>
                    )}
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <span className="font-medium">Model:</span> {tool.configuration.modelType}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {aiTools.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Tools Coming Soon</h3>
              <p className="text-gray-400">
                AI tools are currently being developed. Check back soon!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
