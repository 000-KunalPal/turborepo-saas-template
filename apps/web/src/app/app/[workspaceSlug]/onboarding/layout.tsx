import type { ReactNode } from "react";

import { WorkspaceClientCookie } from "../workspace-client-cookie";
import { AppHeader } from "@/components/layout/header/app-header";
import { Shell } from "@/components/dashboard/shell";

export default async function AppLayout({
  params,
  children,
}: {
  params: { workspaceSlug: string };
  children: ReactNode;
}) {
  const { workspaceSlug } = params;
  return (
    <div className="container relative mx-auto flex min-h-screen w-full flex-col items-center justify-center gap-6 p-4">
      <AppHeader />
      <div className="flex w-full flex-1 gap-6 lg:gap-8">
        <main className="z-10 flex w-full flex-1 flex-col items-start justify-center">
          <Shell className="relative flex-1">{children}</Shell>
        </main>
      </div>
      <WorkspaceClientCookie {...{ workspaceSlug }} />
    </div>
  );
}
