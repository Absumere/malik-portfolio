import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveAnalytics = mutation({
  args: {
    pageUrl: v.string(),
    visitorId: v.optional(v.string()),
    country: v.optional(v.string()),
    device: v.optional(v.string()),
    browser: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const analyticsId = await ctx.db.insert("analytics", {
      pageUrl: args.pageUrl,
      visitorId: args.visitorId,
      country: args.country,
      device: args.device,
      browser: args.browser,
      duration: args.duration,
      timestamp: new Date().toISOString(),
    });
    return analyticsId;
  },
});

export const getAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const analytics = await ctx.db
      .query("analytics")
      .filter((q) => q.gte(q.field("timestamp"), thirtyDaysAgo.toISOString()))
      .collect();

    // Calculate statistics
    const totalVisits = analytics.length;
    const uniqueVisitors = new Set(analytics.map((a) => a.visitorId).filter(Boolean)).size;

    // Get top countries
    const countryStats = analytics
      .filter((a) => a.country)
      .reduce((acc: { [key: string]: number }, curr) => {
        if (curr.country) {
          acc[curr.country] = (acc[curr.country] || 0) + 1;
        }
        return acc;
      }, {});

    // Calculate average duration
    const durations = analytics.map((a) => a.duration).filter(Boolean) as number[];
    const avgDuration = durations.length
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0;

    return {
      totalVisits,
      uniqueVisitors,
      countryStats,
      avgDuration,
    };
  },
});
