import { z } from "zod";

export const limits = z.object({
  members: z.literal("Unlimited").or(z.number()),
});

export type Limits = z.infer<typeof limits>;
