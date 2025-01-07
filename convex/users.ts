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

export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    // Get the first admin user's settings
    const adminUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .first();

    if (!adminUser) return null;

    return {
      siteName: adminUser.name || '',
      description: adminUser.bio || '',
      email: adminUser.email || '',
      socialLinks: adminUser.socialLinks?.reduce((acc: any, link: any) => {
        acc[link.platform.toLowerCase()] = link.url;
        return acc;
      }, {
        twitter: '',
        github: '',
        linkedin: '',
        instagram: '',
      }) || {
        twitter: '',
        github: '',
        linkedin: '',
        instagram: '',
      },
    };
  },
});

export const updateSettings = mutation({
  args: {
    siteName: v.string(),
    description: v.string(),
    email: v.string(),
    socialLinks: v.object({
      twitter: v.string(),
      github: v.string(),
      linkedin: v.string(),
      instagram: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // Get the first admin user
    const adminUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .first();

    if (!adminUser) throw new Error("No admin user found");

    // Convert social links to array format
    const socialLinks = Object.entries(args.socialLinks).map(([platform, url]) => ({
      platform,
      url,
    }));

    // Update admin user with new settings
    return await ctx.db.patch(adminUser._id, {
      name: args.siteName,
      bio: args.description,
      email: args.email,
      socialLinks,
    });
  },
});
