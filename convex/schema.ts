import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,
  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    completed: v.boolean(),
  }),
});

export default schema;
