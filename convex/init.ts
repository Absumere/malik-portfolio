import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { DatabaseWriter } from "./_generated/server";

// Initialize any necessary tables and indexes
export const init = internalMutation({
  args: {},
  handler: async (ctx: { db: DatabaseWriter }) => {
    // Create tokens table
    const tokens = await ctx.db.query("tokens").collect();
    if (!tokens.length) {
      await ctx.db.insert("tokens", {});
    }

    // Create videos table
    const videos = await ctx.db.query("videos").collect();
    if (!videos.length) {
      await ctx.db.insert("videos", {});
    }

    // Create analytics table
    const analytics = await ctx.db.query("analytics").collect();
    if (!analytics.length) {
      await ctx.db.insert("analytics", {});
    }

    // Create indexes
    await ctx.db.query("tokens").withIndex("by_user", (q) => q.eq("userId", ""));
    await ctx.db.query("videos").withIndex("by_project", (q) => q.eq("projectId", ""));
    await ctx.db.query("analytics").withIndex("by_timestamp", (q) => q.eq("timestamp", 0));
    await ctx.db.query("analytics").withIndex("by_visitor", (q) => q.eq("visitorId", ""));
  },
});
