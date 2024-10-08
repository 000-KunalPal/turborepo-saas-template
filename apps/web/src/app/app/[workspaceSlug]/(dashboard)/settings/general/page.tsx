import { Separator } from "@dashboardbuddy/ui/components/separator";

import { WorkspaceForm } from "@/components/forms/workspace-form";
import { CopyToClipboardButton } from "./_components/copy-to-clipboard-button";
import { getWorkspace } from "@/lib/databasecalls";

export default async function GeneralPage() {
  const data = await getWorkspace();

  return (
    <div className="flex flex-col gap-8">
      <WorkspaceForm defaultValues={{ name: data.name ?? "" }} />
      <Separator />
      <div className="flex flex-col gap-2">
        <p>Workspace Slug</p>
        <p className="text-muted-foreground text-sm">
          The unique identifier for your workspace.
        </p>
        <div>
          <CopyToClipboardButton variant="outline" size="sm">
            {data.slug}
          </CopyToClipboardButton>
        </div>
      </div>
    </div>
  );
}
