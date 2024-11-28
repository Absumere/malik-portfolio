import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Portfolio items
  artworks: defineTable({
    title: v.string(),
    description: v.string(),
    imageUrl: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    technique: v.string(),
    dimensions: v.optional(v.string()),
    isForSale: v.boolean(),
    price: v.optional(v.number()),
    createdAt: v.number(),
  }),

  // AI Tools
  aiTools: defineTable({
    name: v.string(),
    description: v.string(),
    endpoint: v.string(),
    isActive: v.boolean(),
    configuration: v.object({
      modelType: v.string(),
      parameters: v.any(),
    }),
  }),
});
