import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    provider: v.string(),
    providerId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        name: args.name,
        image: args.image,
        lastLogin: Date.now(),
      });
    }

    return await ctx.db.insert("users", {
      ...args,
      role: "user",
      createdAt: Date.now(),
      lastLogin: Date.now(),
    });
  },
});

export const getUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.string(),
    bio: v.optional(v.string()),
    socialLinks: v.optional(v.array(v.object({
      platform: v.string(),
      url: v.string(),
    }))),
    preferences: v.optional(v.object({
      theme: v.optional(v.string()),
      newsletter: v.optional(v.boolean()),
      notifications: v.optional(v.boolean()),
    })),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    return await ctx.db.patch(userId, updates);
  },
});
