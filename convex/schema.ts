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

  // Videos
  videos: defineTable({
    title: v.string(),
    description: v.string(),
    playbackId: v.optional(v.string()), // Made optional
    category: v.string(),
    tags: v.array(v.string()),
    uploadedAt: v.number(),
    views: v.optional(v.number()),
    duration: v.optional(v.number()),
    order: v.optional(v.number()),
    resolutions: v.optional(v.array(v.string())),
    storageId: v.optional(v.string()),
    thumbnailStorageId: v.optional(v.string()),
  }).index("by_category", ["category"])
    .index("by_uploadedAt", ["uploadedAt"]),

  // Portfolio items
  portfolio: defineTable({
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    playbackId: v.optional(v.string()),
    assetId: v.optional(v.string()),
    tags: v.array(v.string()),
    category: v.optional(v.string()), // 'featured' or undefined
    createdAt: v.number(),
  }).index("by_category", ["category"]),

  // User Tokens
  tokens: defineTable({
    userId: v.string(),
    balance: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  // Token Transactions
  tokenTransactions: defineTable({
    userId: v.string(),
    amount: v.number(),
    type: v.string(), // 'purchase' or 'usage'
    status: v.string(), // 'pending', 'completed', 'failed'
    toolId: v.optional(v.string()), // Reference to aiTools table if type is 'usage'
    paymentIntentId: v.optional(v.string()), // Stripe payment intent ID if type is 'purchase'
    createdAt: v.number(),
  }).index("by_userId", ["userId"])
    .index("by_status", ["status"]),

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

  // Page content
  pageContent: defineTable({
    path: v.string(),
    content: v.array(
      v.object({
        id: v.string(),
        type: v.string(),
        content: v.any(),
      })
    ),
    updatedAt: v.number(),
  }).index("by_path", ["path"]),

  // Analytics
  analytics: defineTable({
    pageUrl: v.string(),
    visitorId: v.optional(v.string()),
    country: v.optional(v.string()),
    device: v.optional(v.string()),
    browser: v.optional(v.string()),
    duration: v.optional(v.number()),
    timestamp: v.string(),
  }).index("by_timestamp", ["timestamp"])
    .index("by_visitorId", ["visitorId"])
    .index("by_country", ["country"]),
});
