import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

// Initialize any necessary tables and indexes
export const init = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Create tokens table if it doesn't exist
    await ctx.db.system.ensureTable("tokens");
    await ctx.db.system.ensureIndex("tokens", "by_user", ["userId"]);

    // Create videos table if it doesn't exist
    await ctx.db.system.ensureTable("videos");
    await ctx.db.system.ensureIndex("videos", "by_project", ["projectId"]);

    // Create analytics table if it doesn't exist
    await ctx.db.system.ensureTable("analytics");
    await ctx.db.system.ensureIndex("analytics", "by_timestamp", ["timestamp"]);
    await ctx.db.system.ensureIndex("analytics", "by_visitor", ["visitorId"]);
  },
});
