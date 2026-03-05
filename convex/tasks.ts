import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    status: v.union(v.literal("completed"), v.literal("pending")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const completed = args.status === "completed";
    let query = ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc");

    if (args.limit !== undefined) {
      return (await query.collect())
        .filter((t) => t.completed === completed)
        .slice(0, args.limit);
    }

    return (await query.collect()).filter((t) => t.completed === completed);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const title = args.title.trim();
    const description = args.description.trim();
    if (!title) {
      throw new Error("Title is required");
    }
    if (!description) {
      throw new Error("Description is required");
    }

    return await ctx.db.insert("tasks", {
      userId,
      title,
      description,
      completed: false,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.string(),
    description: v.string(),
    comments: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const task = await ctx.db.get("tasks", args.id);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.userId !== userId) {
      throw new Error("Forbidden");
    }

    await ctx.db.patch("tasks", args.id, {
      title: args.title.trim(),
      description: args.description.trim(),
      comments: args.comments?.trim(),
    });
  },
});

export const setCompleted = mutation({
  args: {
    id: v.id("tasks"),
    completed: v.boolean(),
    comments: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const task = await ctx.db.get("tasks", args.id);
    if (!task) {
      throw new Error("Task not found");
    }
    if (task.userId !== userId) {
      throw new Error("Forbidden");
    }

    const patch: { completed: boolean; comments?: string } = {
      completed: args.completed,
    };
    if (args.completed && args.comments !== undefined) {
      patch.comments = args.comments.trim();
    }

    await ctx.db.patch("tasks", args.id, patch);
  },
});
