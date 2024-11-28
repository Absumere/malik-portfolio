import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query to get all AI tools
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("aiTools").collect();
  },
});

// Query to get active AI tools
export const getActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("aiTools")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Mutation to create new AI tool
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    endpoint: v.string(),
    isActive: v.boolean(),
    configuration: v.object({
      modelType: v.string(),
      parameters: v.any(),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiTools", args);
  },
});
