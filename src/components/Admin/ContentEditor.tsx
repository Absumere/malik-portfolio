'use client';

import { useState, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

interface ContentBlock {
  id: string;
  type: 'text' | 'heading' | 'image' | 'button' | 'spacer';
  content: any;
}

interface ContentEditorProps {
  initialContent: ContentBlock[];
  pagePath: string;
  onSave?: () => void;
}

export default function ContentEditor({
  initialContent,
  pagePath,
  onSave,
}: ContentEditorProps) {
  const [content, setContent] = useState<ContentBlock[]>(initialContent);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const updateContent = useMutation(api.content.updatePageContent);

  const handleSave = useCallback(async () => {
    try {
      await updateContent({
        path: pagePath,
        content,
      });
      toast.success('Content saved successfully');
      onSave?.();
    } catch (error) {
      toast.error('Failed to save content');
      console.error('Save error:', error);
    }
  }, [content, pagePath, updateContent, onSave]);

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'heading' ? 'New Heading' : 
               type === 'text' ? 'New text block' :
               type === 'button' ? { text: 'New Button', link: '/' } :
               type === 'spacer' ? { height: 40 } : '',
    };
    setContent([...content, newBlock]);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === content.length - 1)
    )
      return;

    const newContent = [...content];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newContent[index], newContent[newIndex]] = [
      newContent[newIndex],
      newContent[index],
    ];
    setContent(newContent);
  };

  const updateBlock = (id: string, newContent: any) => {
    setContent(
      content.map((block) =>
        block.id === id ? { ...block, content: newContent } : block
      )
    );
  };

  const deleteBlock = (id: string) => {
    setContent(content.filter((block) => block.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Content Blocks */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {content.map((block, index) => (
            <motion.div
              key={block.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="group relative"
            >
              {/* Block Controls */}
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => moveBlock(index, 'up')}
                  className="p-1 rounded bg-white/5 hover:bg-white/10"
                >
                  <ArrowUpIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveBlock(index, 'down')}
                  className="p-1 rounded bg-white/5 hover:bg-white/10"
                >
                  <ArrowDownIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteBlock(block.id)}
                  className="p-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Content Block */}
              <div
                className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                onClick={() => setEditingBlock(block.id)}
              >
                {block.type === 'heading' && (
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    className="w-full bg-transparent text-2xl font-bold focus:outline-none"
                    placeholder="Enter heading..."
                  />
                )}

                {block.type === 'text' && (
                  <textarea
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, e.target.value)}
                    className="w-full bg-transparent resize-none focus:outline-none min-h-[100px]"
                    placeholder="Enter text..."
                  />
                )}

                {block.type === 'button' && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={block.content.text}
                      onChange={(e) =>
                        updateBlock(block.id, {
                          ...block.content,
                          text: e.target.value,
                        })
                      }
                      className="w-full bg-transparent focus:outline-none"
                      placeholder="Button text..."
                    />
                    <input
                      type="text"
                      value={block.content.link}
                      onChange={(e) =>
                        updateBlock(block.id, {
                          ...block.content,
                          link: e.target.value,
                        })
                      }
                      className="w-full bg-transparent text-sm text-white/60 focus:outline-none"
                      placeholder="Button link..."
                    />
                  </div>
                )}

                {block.type === 'spacer' && (
                  <input
                    type="number"
                    value={block.content.height}
                    onChange={(e) =>
                      updateBlock(block.id, { height: parseInt(e.target.value) })
                    }
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="Spacer height (px)..."
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Block Button */}
      <div className="flex gap-2">
        <button
          onClick={() => addBlock('heading')}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Heading
        </button>
        <button
          onClick={() => addBlock('text')}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Text
        </button>
        <button
          onClick={() => addBlock('button')}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Button
        </button>
        <button
          onClick={() => addBlock('spacer')}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Spacer
        </button>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition-colors"
      >
        Save Changes
      </button>
    </div>
  );
}
