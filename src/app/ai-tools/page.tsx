'use client';

import { api } from "@convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useEffect, useState, useRef } from "react";

type Category = "Generative AI" | "Deepfake" | "Image Analysis" | "Experimental" | "WebGPU";

export default function AiToolsPage() {
  const aiTools = useQuery(api.aiTools.getAll) ?? [];
  const createTool = useMutation(api.aiTools.create);
  const deleteAll = useMutation(api.aiTools.deleteAll);
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const initialized = useRef(false);

  useEffect(() => {
    const initializeTools = async () => {
      if (!initialized.current && aiTools.length === 0) {
        initialized.current = true;
        
        // Delete any existing tools first
        await deleteAll();

        const tools = [
          {
            name: "Neural Image Generator",
            description: "Create high-quality images from text descriptions using state-of-the-art AI models. Supports various styles and advanced parameters.",
            endpoint: "/tools/neural-image",
            isActive: true,
            category: "Generative AI",
            configuration: {
              modelType: "Stable Diffusion XL",
              parameters: {
                styles: ["Photorealistic", "Artistic", "Abstract"]
              }
            }
          },
          {
            name: "DeepFake Studio",
            description: "Professional face swapping and manipulation tool with ethical guidelines and watermarking. For educational and entertainment purposes only.",
            endpoint: "/tools/deepfake",
            isActive: false,
            category: "Deepfake",
            configuration: {
              modelType: "InsightFace",
              parameters: {
                styles: ["Natural", "Artistic", "Realistic"]
              }
            }
          },
          {
            name: "AI Scene Analyzer",
            description: "Advanced image segmentation and object detection. Identify objects, people, and scenes with detailed annotations.",
            endpoint: "/tools/scene-analyzer",
            isActive: true,
            category: "Image Analysis",
            configuration: {
              modelType: "YOLO-X",
              parameters: {
                styles: ["Detection", "Segmentation", "Tracking"]
              }
            }
          },
          {
            name: "Neural Video Director",
            description: "Generate and edit videos using AI. Create animations, modify existing videos, and apply neural effects.",
            endpoint: "/tools/video-director",
            isActive: false,
            category: "Generative AI",
            configuration: {
              modelType: "ModelScope",
              parameters: {
                styles: ["Animation", "Style Transfer", "Motion Synthesis"]
              }
            }
          },
          {
            name: "WebGPU Texture Synthesis",
            description: "Generate seamless textures and patterns using WebGPU-accelerated AI models directly in your browser.",
            endpoint: "/tools/texture-synthesis",
            isActive: true,
            category: "WebGPU",
            configuration: {
              modelType: "Neural Textures",
              parameters: {
                styles: ["Seamless", "Procedural", "Organic"]
              }
            }
          },
          {
            name: "Experimental Style Mixer",
            description: "Experimental tool for combining multiple artistic styles and generating unique visual effects.",
            endpoint: "/tools/style-mixer",
            isActive: false,
            category: "Experimental",
            configuration: {
              modelType: "Custom Neural Network",
              parameters: {
                styles: ["Abstract", "Surreal", "Geometric"]
              }
            }
          }
        ];

        // Create tools one by one
        for (const tool of tools) {
          await createTool(tool);
        }
      }
    };

    initializeTools();
  }, [aiTools.length, createTool, deleteAll]);

  const categories: Category[] = [
    "Generative AI",
    "Deepfake",
    "Image Analysis",
    "Experimental",
    "WebGPU"
  ];

  // Log the raw tools data
  console.log('Raw tools:', aiTools);

  const filteredTools = aiTools.reduce((acc, tool) => {
    if (selectedCategory === "all") {
      // For "all" category, only add the first instance of each tool name
      const isDuplicate = acc.some(t => t.name === tool.name);
      if (!isDuplicate) {
        acc.push(tool);
      }
    } else {
      // For specific categories, show all tools in that category
      console.log('Checking tool:', tool.name, 'category:', tool.category, 'selected:', selectedCategory);
      if (tool.category === selectedCategory) {
        console.log('Adding tool to category:', tool.name);
        acc.push(tool);
      }
    }
    return acc;
  }, [] as typeof aiTools);

  // Log the filtered results
  console.log('Filtered tools:', filteredTools);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-32 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">AI Tools</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore my collection of AI-powered tools for creative professionals
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                selectedCategory === "all"
                ? "bg-white text-black"
                : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  selectedCategory === category
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool) => (
              <div
                key={tool.name}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">{tool.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10">
                      {tool.category}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4 h-24 overflow-auto">{tool.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      tool.isActive 
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}>
                      {tool.isActive ? "Active" : "Coming Soon"}
                    </span>
                    {tool.isActive && (
                      <button className="px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-all duration-300">
                        Try Now
                      </button>
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
