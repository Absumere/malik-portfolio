'use client';

import { SpectralWave } from '@/components/UI/SpectralWave';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import TokenPurchaseModal from '@/components/UI/TokenPurchaseModal';
import { motion } from 'framer-motion';
import ScrollReset from '@/components/ScrollReset';

type Tool = {
  id: string;
  name: string;
  category: 'generative-ai' | 'deepfake';
  categoryLabel: string;
  description: string;
  cost: number;
  comingSoon?: boolean;
};

const tools: Tool[] = [
  {
    id: 'neural-image-generator',
    name: 'Neural Image Generator',
    category: 'generative-ai',
    categoryLabel: 'Generative AI',
    description: 'Create high-quality images from text descriptions using state-of-the-art AI models. Supports various styles and advanced parameters.',
    cost: 10,
  },
  {
    id: 'deepfake-studio',
    name: 'DeepFake Studio',
    category: 'deepfake',
    categoryLabel: 'Deepfake',
    description: 'Professional face swapping and manipulation tool with ethical guidelines and watermarking. For educational and entertainment purposes only.',
    cost: 20,
  },
];

export default function AiToolsPage() {
  const { user } = useAuth();
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const userTokens = useQuery(api.tokens.get, { userId: user?._id ?? "" });
  const [filter, setFilter] = useState<'all' | 'generative-ai' | 'deepfake'>('all');

  const filteredTools = tools.filter(tool => 
    filter === 'all' ? true : tool.category === filter
  );

  return (
    <>
      <ScrollReset />
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">AI Tools</h1>
            <p className="text-xl text-gray-400">
              Transform your creative process with our AI-powered tools
            </p>
          </motion.div>

          {/* Token Balance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 p-6 bg-[#111111] rounded-sm border border-white/10"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold mb-2">Token Balance</h2>
                <p className="text-4xl font-bold">
                  {userTokens?.balance || 0} <span className="text-sm text-gray-400">tokens</span>
                </p>
              </div>
              <button
                onClick={() => setIsPurchaseModalOpen(true)}
                className="px-6 py-2 bg-white text-black rounded-sm hover:bg-white/90 transition-colors"
              >
                Purchase Tokens
              </button>
            </div>
          </motion.div>

          {/* Filter buttons */}
          <div className="flex gap-2 mb-8">
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
              onClick={() => setFilter('generative-ai')}
              className={`px-4 py-2 rounded-sm transition-colors ${
                filter === 'generative-ai'
                  ? 'bg-white text-black'
                  : 'bg-[#111111] text-white hover:bg-[#222222]'
              }`}
            >
              Generative AI
            </button>
            <button
              onClick={() => setFilter('deepfake')}
              className={`px-4 py-2 rounded-sm transition-colors ${
                filter === 'deepfake'
                  ? 'bg-white text-black'
                  : 'bg-[#111111] text-white hover:bg-[#222222]'
              }`}
            >
              Deepfake
            </button>
          </div>

          {/* AI Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#111111] rounded-sm border border-white/10 p-6"
              >
                <h3 className="text-xl font-semibold mb-4">{tool.name}</h3>
                <p className="text-gray-400 mb-6">{tool.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-400">Cost</div>
                    <div className="font-medium">{tool.cost} tokens</div>
                  </div>
                  <button
                    disabled={!user || !!tool.comingSoon}
                    className={`w-full px-4 py-2 bg-white text-black rounded-sm hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {tool.comingSoon ? 'Coming Soon' : user ? 'Use Tool' : 'Sign in to Use'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Background Effect */}
        <div className="fixed inset-0 -z-10">
          <SpectralWave />
        </div>

        <TokenPurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
        />
      </div>
    </>
  );
}
