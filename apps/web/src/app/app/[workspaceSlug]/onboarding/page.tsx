import { Header } from "@/components/dashboard/header";
import { WorkspaceForm } from "@/components/forms/workspace-form";
import { getWorkspace } from "@/lib/databasecalls";
import { Button } from "@dashboardbuddy/ui/components/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Description } from "./_components/description";

export default async function Onboarding({
  params,
}: {
  params: { workspaceSlug: string };
}) {
  const { workspaceSlug } = params;

  const workspace = await getWorkspace();
  const allBoards = [];

  if (!workspace.name) {
    return (
      <div className="flex h-full w-full flex-col gap-6 md:gap-8">
        <Header
          title="Get Started"
          description="Name your workspace"
          actions={
            <Button variant="link" className="text-muted-foreground" asChild>
              <Link href={`/app/${workspaceSlug}/dashboard`}>Skip</Link>
            </Button>
          }
        />
        <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-3 md:gap-8">
          <div className="flex flex-col md:col-span-2">
            <WorkspaceForm defaultValues={{ name: "" }} />
          </div>
          <div className="hidden h-full md:col-span-1 md:block">
            <Description step="workspace" />
          </div>
        </div>
      </div>
    );
  }
  if (allBoards.length === 0) {
    return (
      <div className="flex h-full w-full flex-col gap-6 md:gap-8">
        <Header
          title="Get Started"
          description="Create your first status page."
          actions={
            <Button variant="link" className="text-muted-foreground">
              <Link href={`/app/${workspaceSlug}/dashboard`}>Skip</Link>
            </Button>
          }
        />
        <div className="flex flex-1 flex-col gap-6 md:grid md:grid-cols-3 md:gap-8">
          <div className="flex flex-col md:col-span-2">
            Create your first board
          </div>
          <div className="hidden h-full md:col-span-1 md:block">
            <Description step="board" />
          </div>
        </div>
      </div>
    );
  }

  return redirect(`app/${workspaceSlug}/dashboard`);
}
