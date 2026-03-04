import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,
  tasks: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    completed: v.boolean(),
  }).index("by_user", ["userId"]),
});

export default schema;
