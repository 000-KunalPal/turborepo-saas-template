"use client";

import { useSession } from "next-auth/react";

import { Input } from "@dashboardbuddy/ui/components/input";
import { Label } from "@dashboardbuddy/ui/components/label";

import Loading from "./loading";

export default function UserPage() {
  const session = useSession();

  if (!session.data?.user) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid max-w-sm gap-3">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="fullname">Full name</Label>
          <Input id="fullname" value={`${session.data.user?.name}`} disabled />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={`${session.data.user?.email}`}
            disabled
          />
        </div>
      </div>
    </div>
  );
}
