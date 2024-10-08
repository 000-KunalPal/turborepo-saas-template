"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@dashboardbuddy/ui/components/button";

export function LoginButton({ className, ...props }: ButtonProps) {
  const session = useSession();

  return (
    <Button asChild className={cn("rounded-full", className)} {...props}>
      {session.status === "authenticated" ? (
        <Link href="/app">Dashboard</Link>
      ) : (
        <Link href="/app/login">Sign In</Link>
      )}
    </Button>
  );
}
