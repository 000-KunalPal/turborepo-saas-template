import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { allPlans } from "../plan/config";
import { limits } from "../plan/schema";
import { workspacePlans, workspaceRole } from "./constants";
import { workspace } from "./workspace";

export const workspacePlanSchema = z.enum(workspacePlans);
export const workspaceRoleSchema = z.enum(workspaceRole);

/**
 * Workspace schema with limits and plan
 * If not available in the db, the limits will be taken from the workspace plan
 */
const selectWorkspaceSchemaDevelopment = createSelectSchema(workspace)
  .extend({
    limits: z.string().transform((val) => {
      const parsed = JSON.parse(val);
      const result = limits.partial().safeParse(parsed);
      if (result.error) return {};
      return result.data;
    }),
    plan: z
      .enum(workspacePlans)
      .nullable()
      .default("free")
      .transform((val) => val ?? "free"),
  })
  .transform((val) => {
    return {
      ...val,
      limits: limits.parse({ ...allPlans[val.plan].limits, ...val.limits }),
    };
  });

/**
 * Workspace schema with limits and plan
 * The limits for paid users have to be defined within the db otherwise, fallbacks to free plan limits
 */
const selectWorkspaceSchemaProduction = createSelectSchema(workspace).extend({
  limits: z.string().transform((val) => {
    const parsed = JSON.parse(val);
    const result = limits.safeParse(parsed);
    if (result.error) {
      // Fallback to default limits
      return limits.parse({
        ...allPlans.free.limits,
      });
    }

    return result.data;
  }),
  plan: z
    .enum(workspacePlans)
    .nullable()
    .default("free")
    .transform((val) => val ?? "free"),
});

export const selectWorkspaceSchema =
  process.env.NODE_ENV === "development"
    ? selectWorkspaceSchemaDevelopment
    : selectWorkspaceSchemaProduction;

export const insertWorkspaceSchema = createSelectSchema(workspace);

export type Workspace = z.infer<typeof selectWorkspaceSchema>;
export type WorkspacePlan = z.infer<typeof workspacePlanSchema>;
export type WorkspaceRole = z.infer<typeof workspaceRoleSchema>;
