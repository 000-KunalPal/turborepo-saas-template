import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { WorkspaceClientCookie } from "../workspace-client-cookie";
import { getUserWorkspaces } from "@/lib/databasecalls";
import { AppHeader } from "@/components/layout/header/app-header";

export default async function AppLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { workspaceSlug: string };
}) {
  const { workspaceSlug } = params;
  const workspaces = await getUserWorkspaces();

  if (workspaces.length === 0) return notFound();
  if (workspaces.find((w) => w.slug === workspaceSlug) === undefined)
    return notFound();

  return (
    <div className="container relative mx-auto flex min-h-screen w-full flex-col items-center justify-center gap-6 p-4">
      <AppHeader />
      <main className="z-10 flex w-full flex-1 flex-col items-start justify-center">
        {children}
      </main>
      <WorkspaceClientCookie {...{ workspaceSlug }} />
    </div>
  );
}
