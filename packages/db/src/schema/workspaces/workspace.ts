import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { usersToWorkspaces } from "../users";
import { workspacePlans } from "./constants";

export const workspace = sqliteTable("workspace", {
  id: integer("id").primaryKey(),
  slug: text("slug").notNull().unique(), // we love random words
  name: text("name"),

  joinCode: text("join_code").notNull().unique(),
  stripeId: text("stripe_id", { length: 256 }).unique(),
  subscriptionId: text("subscription_id"),
  plan: text("plan", { enum: workspacePlans }),
  endsAt: integer("ends_at", { mode: "timestamp" }),
  paidUntil: integer("paid_until", { mode: "timestamp" }),
  limits: text("limits").default("{}").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
});

export const workspaceRelations = relations(workspace, ({ many }) => ({
  usersToWorkspaces: many(usersToWorkspaces),
}));
