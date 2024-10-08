import { Limits } from "@dashboardbuddy/db/src/schema/plan/schema";

export const pricingTableConfig: Record<
  string,
  {
    label: string;
    features: { value: keyof Limits; label: string; badge?: string }[];
  }
> = {
  members: {
    label: "Members",
    features: [
      {
        value: "members",
        label: "Number of members",
      },
    ],
  },
};
