import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getVideoMetadata } from "../utils/videoUtils";

export const listVideos = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { category, limit = 12, cursor } = args;
    
    let videos = ctx.db
      .query("videos")
      .order("desc")
      .take(limit);

    if (category) {
      videos = videos.filter((q) => q.eq(q.field("category"), category));
    }

    if (cursor) {
      videos = videos.filter((q) => q.lt(q.field("_id"), cursor));
    }

    const results = await videos;
    const hasMore = results.length === limit;
    const newCursor = hasMore ? results[results.length - 1]._id : undefined;

    return {
      videos: results,
      cursor: newCursor,
    };
  },
});

export const getVideo = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateViews = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.id);
    if (!video) return;
    
    await ctx.db.patch(args.id, {
      views: (video.views || 0) + 1,
    });
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    duration: v.number(),
    order: v.optional(v.number()),
    resolutions: v.array(v.string()),
    storageId: v.string(),
    thumbnailStorageId: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { order = 0, ...rest } = args;
    return await ctx.db.insert("videos", {
      ...rest,
      order,
      views: 0,
      uploadedAt: Date.now(),
    });
  },
});

export const deleteVideo = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.id);
    if (!video) return;

    // Delete all video files and thumbnail
    await ctx.db.delete(args.id);
  },
});

export const updateVideo = mutation({
  args: {
    id: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const video = await ctx.db.get(id);
    if (!video) return;

    return await ctx.db.patch(id, updates);
  },
});
