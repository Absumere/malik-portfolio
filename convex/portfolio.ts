import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Get all portfolio items
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query('portfolio').collect();
  },
});

// Get a single portfolio item
export const getById = query({
  args: { id: v.id('portfolio') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a new portfolio item
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    playbackId: v.optional(v.string()), // Mux playback ID
    assetId: v.optional(v.string()), // Mux asset ID (for management)
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { title, description, imageUrl, playbackId, assetId, tags } = args;
    return await ctx.db.insert('portfolio', {
      title,
      description,
      imageUrl,
      playbackId,
      assetId,
      tags,
      createdAt: Date.now(),
    });
  },
});

// Update a portfolio item
export const update = mutation({
  args: {
    id: v.id('portfolio'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    playbackId: v.optional(v.string()),
    assetId: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error('Portfolio item not found');
    
    return await ctx.db.patch(id, {
      ...fields,
      updatedAt: Date.now(),
    });
  },
});

// Delete a portfolio item
export const remove = mutation({
  args: { id: v.id('portfolio') },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error('Portfolio item not found');
    
    await ctx.db.delete(args.id);
  },
});
