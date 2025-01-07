'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import ContentEditor from '@/components/Admin/ContentEditor';
import { motion } from 'framer-motion';

export default function LandingPageSettings() {
  const content = useQuery(api.content.getPageContent, { path: '/' }) ?? [];

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold"
        >
          Landing Page Content
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/60"
        >
          Edit your landing page content below. Changes will be reflected on the main site immediately.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ContentEditor
          initialContent={content}
          pagePath="/"
        />
      </motion.div>

      {/* Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border-t border-white/10 pt-8"
      >
        <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
        <div className="rounded-lg border border-white/10 bg-black/50 p-8">
          {content.map((block) => {
            switch (block.type) {
              case 'heading':
                return (
                  <h2 key={block.id} className="text-3xl font-bold mb-4">
                    {block.content}
                  </h2>
                );
              case 'text':
                return (
                  <p key={block.id} className="text-white/80 mb-4">
                    {block.content}
                  </p>
                );
              case 'button':
                return (
                  <button
                    key={block.id}
                    className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors mb-4"
                  >
                    {block.content.text}
                  </button>
                );
              case 'spacer':
                return (
                  <div
                    key={block.id}
                    style={{ height: block.content.height }}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      </motion.div>
    </div>
  );
}
