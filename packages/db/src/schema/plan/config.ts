import type { WorkspacePlan } from "../workspaces/validation";
import type { Limits } from "./schema";

export const allPlans: Record<
  WorkspacePlan,
  {
    title: "Hobby" | "Starter" | "Growth" | "Pro";
    description: string;
    price: number;
    limits: Limits;
  }
> = {
  free: {
    title: "Hobby",
    description: "For personal projects",
    price: 0,
    limits: {
      members: 1,
    },
  },
  starter: {
    title: "Starter",
    description: "For small projects",
    price: 30,
    limits: {
      members: "Unlimited",
    },
  },
  team: {
    title: "Growth",
    description: "For small teams",
    price: 100,
    limits: {
      members: "Unlimited",
    },
  },
  pro: {
    title: "Pro",
    description: "For bigger teams",
    price: 300,
    limits: {
      members: "Unlimited",
    },
  },
};
