import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

// Get user's token balance
export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const tokens = await ctx.db
      .query("tokens")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    
    return tokens;
  },
});

// Purchase tokens
export const purchase = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    paymentIntentId: v.string(),
  },
  handler: async (ctx, args) => {
    // Create transaction record
    const transaction = await ctx.db.insert("tokenTransactions", {
      userId: args.userId,
      amount: args.amount,
      type: "purchase",
      status: "pending",
      paymentIntentId: args.paymentIntentId,
      createdAt: Date.now(),
    });

    // Get or create user's token record
    const existingTokens = await ctx.db
      .query("tokens")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existingTokens) {
      await ctx.db.patch(existingTokens._id, {
        balance: existingTokens.balance + args.amount,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("tokens", {
        userId: args.userId,
        balance: args.amount,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // Update transaction status
    await ctx.db.patch(transaction, {
      status: "completed",
    });

    return transaction;
  },
});

// Use tokens for AI tool
export const use = mutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    toolId: v.string(),
  },
  handler: async (ctx, args) => {
    const tokens = await ctx.db
      .query("tokens")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!tokens || tokens.balance < args.amount) {
      throw new Error("Insufficient tokens");
    }

    // Create usage transaction
    const transaction = await ctx.db.insert("tokenTransactions", {
      userId: args.userId,
      amount: -args.amount,
      type: "usage",
      status: "completed",
      toolId: args.toolId,
      createdAt: Date.now(),
    });

    // Update token balance
    await ctx.db.patch(tokens._id, {
      balance: tokens.balance - args.amount,
      updatedAt: Date.now(),
    });

    return transaction;
  },
});
