import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getPageContent = query({
  args: { path: v.string() },
  handler: async (ctx, args) => {
    const content = await ctx.db
      .query("pageContent")
      .filter((q) => q.eq(q.field("path"), args.path))
      .first();
    return content?.content ?? [];
  },
});

export const updatePageContent = mutation({
  args: {
    path: v.string(),
    content: v.array(
      v.object({
        id: v.string(),
        type: v.string(),
        content: v.any(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pageContent")
      .filter((q) => q.eq(q.field("path"), args.path))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { content: args.content });
    } else {
      await ctx.db.insert("pageContent", {
        path: args.path,
        content: args.content,
        updatedAt: Date.now(),
      });
    }
  },
});
