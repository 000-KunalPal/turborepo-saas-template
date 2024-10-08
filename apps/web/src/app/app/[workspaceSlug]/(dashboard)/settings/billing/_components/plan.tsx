"use client";

import { PricingTable } from "@/components/marketing/pricing/pricing-table";
import { getStripe } from "@/lib/stripe/client";
import {
  createCheckoutSession,
  createUserCustomerPortal,
} from "@/lib/stripecalls";
import type { Workspace, WorkspacePlan } from "@dashboardbuddy/db/src/schema";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const SettingsPlan = ({ workspace }: { workspace: Workspace }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const getCheckoutSession = (plan: WorkspacePlan) => {
    startTransition(async () => {
      // its mutation basically to getCheckoutSession
      const result = await createCheckoutSession({
        workspaceSlug: workspace.slug,
        plan,
      });
      if (!result) return;

      const stripe = await getStripe();
      stripe?.redirectToCheckout({
        sessionId: result.id,
      });
    });
  };

  const getUserCustomerPortal = () => {
    startTransition(async () => {
      // its mutation basically to getUserCustomerPortal
      const url = await createUserCustomerPortal({
        workspaceSlug: workspace.slug,
      });
      if (!url) return;
      router.push(url);
      return;
    });
  };
  return (
    <PricingTable
      currentPlan={workspace.plan}
      isLoading={isPending}
      events={{
        // REMINDER: redirecting to customer portal as a fallback because the free plan has no price
        free: getUserCustomerPortal,
        starter: () => getCheckoutSession("starter"),
        pro: () => getCheckoutSession("pro"),
        team: () => getCheckoutSession("team"),
      }}
    />
  );
};
