import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    provider: v.string(), // 'github' or 'google'
    providerId: v.string(),
    role: v.optional(v.string()), // 'admin', 'user', etc.
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
    lastLogin: v.optional(v.number()),
    createdAt: v.number(),
  }),

  // Portfolio items
  artworks: defineTable({
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    tags: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    technique: v.optional(v.string()),
    dimensions: v.optional(v.string()),
    isForSale: v.optional(v.boolean()),
    price: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    userId: v.optional(v.string()), // Reference to users table
    likes: v.optional(v.number()),
    views: v.optional(v.number()),
  }),

  // User interactions
  interactions: defineTable({
    userId: v.string(),
    artworkId: v.string(),
    type: v.string(), // 'like', 'view', 'comment', etc.
    createdAt: v.number(),
    content: v.optional(v.string()), // For comments
  }),

  // AI Tools
  aiTools: defineTable({
    name: v.string(),
    description: v.string(),
    endpoint: v.string(),
    isActive: v.boolean(),
    category: v.optional(v.string()),
    configuration: v.object({
      modelType: v.string(),
      parameters: v.object({
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        steps: v.optional(v.number()),
        styles: v.optional(v.array(v.string())),
      }),
    }),
  }),
});
