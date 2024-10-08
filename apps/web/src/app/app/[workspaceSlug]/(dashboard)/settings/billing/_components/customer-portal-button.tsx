"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@dashboardbuddy/ui/components/button";

import { LoadingAnimation } from "@/components/loading-animation";
import { createUserCustomerPortal } from "@/lib/stripecalls";

interface Props {
  workspaceSlug: string;
}

export function CustomerPortalButton({ workspaceSlug }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const getUserCustomerPortal = () => {
    startTransition(async () => {
      const url = await createUserCustomerPortal({
        workspaceSlug,
      });
      if (!url) return;
      router.push(url);
      return;
    });
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={getUserCustomerPortal}
      disabled={isPending}
    >
      {isPending ? <LoadingAnimation variant="inverse" /> : "Customer Portal"}
    </Button>
  );
}
