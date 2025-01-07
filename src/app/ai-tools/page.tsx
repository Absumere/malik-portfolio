'use client';

import { SpectralWave } from '@/components/UI/SpectralWave';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import TokenPurchaseModal from '@/components/UI/TokenPurchaseModal';
import { motion } from 'framer-motion';

const tools = [
  {
    id: 1,
    name: 'Neural Image Generator',
    description: 'Create high-quality images from text descriptions using state-of-the-art AI models. Supports various styles and advanced parameters.',
    category: 'Generative AI',
    status: 'Active',
    cost: 10, // tokens per use
  },
  {
    id: 2,
    name: 'DeepFake Studio',
    description: 'Professional face swapping and manipulation tool with ethical guidelines and watermarking. For educational and entertainment purposes only.',
    category: 'Deepfake',
    status: 'Coming Soon',
    cost: 20,
  },
];

export default function AiToolsPage() {
  const { user } = useUser();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const tokens = useQuery(api.tokens.get, { userId: user?.id ?? "" });

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex justify-center">
      <SpectralWave />
      
      <div className="max-w-[1600px] w-full mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="space-y-4 mb-24 relative z-10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light tracking-tight">AI Tools</h1>
              <p className="text-neutral-400 text-lg">
                Explore my collection of AI-powered tools for creative professionals
              </p>
            </div>
            
            {user && (
              <div className="bg-[#141414] p-4 rounded border border-white/10">
                <div className="text-sm text-gray-400">Available Tokens</div>
                <div className="text-2xl font-medium">{tokens?.balance || 0}</div>
                <button 
                  onClick={() => setIsPurchaseModalOpen(true)}
                  className="mt-2 px-4 py-2 bg-black rounded text-sm border border-white/10 hover:bg-white/10 transition"
                >
                  Buy Tokens
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Filter buttons */}
        <div className="flex gap-2 mt-8">
          <button className="px-4 py-2 bg-white/10 rounded text-sm hover:bg-white/20 transition">
            All
          </button>
          <button className="px-4 py-2 bg-black rounded text-sm border border-white/10 hover:bg-white/10 transition">
            Generative AI
          </button>
          <button className="px-4 py-2 bg-black rounded text-sm border border-white/10 hover:bg-white/10 transition">
            Deepfake
          </button>
          <button className="px-4 py-2 bg-black rounded text-sm border border-white/10 hover:bg-white/10 transition">
            Image Analysis
          </button>
          <button className="px-4 py-2 bg-black rounded text-sm border border-white/10 hover:bg-white/10 transition">
            WebGPU
          </button>
          <button className="px-4 py-2 bg-black rounded text-sm border border-white/10 hover:bg-white/10 transition">
            Experimental
          </button>
        </div>

        {/* Grid of tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#141414] rounded-lg p-6 border border-white/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">{tool.name}</h3>
                  <span className="text-sm px-2 py-1 bg-white/10 rounded">
                    {tool.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Cost</div>
                  <div className="font-medium">{tool.cost} tokens</div>
                </div>
              </div>
              
              <p className="text-gray-400 mb-4">{tool.description}</p>
              
              {!user ? (
                <p className="text-sm text-gray-500 italic">Sign in from the navigation bar to use this tool</p>
              ) : (
                <button 
                  className={`w-full px-4 py-2 rounded text-sm transition ${
                    tool.status === 'Active'
                      ? 'bg-white text-black hover:bg-white/90'
                      : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={tool.status !== 'Active'}
                >
                  {tool.status === 'Active' ? 'Use Tool' : 'Coming Soon'}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <TokenPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </main>
  );
}
