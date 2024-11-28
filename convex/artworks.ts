import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query to get all artworks
export const getAll = query({
  handler: async (ctx) => {
    console.log('Executing getAll query');
    const results = await ctx.db.query("artworks").collect();
    console.log('Query results:', results);
    return results;
  },
});

// Query to get artwork by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    console.log('Executing getByCategory query with category:', args.category);
    const results = await ctx.db
      .query("artworks")
      .filter((q) => q.eq(q.field("category"), args.category))
      .collect();
    console.log('Query results:', results);
    return results;
  },
});

// Mutation to create new artwork
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    technique: v.string(),
    dimensions: v.optional(v.string()),
    isForSale: v.boolean(),
    price: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    console.log('Creating new artwork:', args);
    const id = await ctx.db.insert("artworks", {
      ...args,
      createdAt: Date.now(),
    });
    console.log('Created artwork with ID:', id);
    return id;
  },
});
