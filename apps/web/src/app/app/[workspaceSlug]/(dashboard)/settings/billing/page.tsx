import { Separator } from "@dashboardbuddy/ui/components/separator";
import { Progress } from "@dashboardbuddy/ui/components/progress";
import { getCurrentWorkspaceNumbers, getWorkspace } from "@/lib/databasecalls";
import { SettingsPlan } from "./_components/plan";
import { CustomerPortalButton } from "./_components/customer-portal-button";

export default async function BillingPage() {
  const workspace = await getWorkspace();
  const currentNumbers = await getCurrentWorkspaceNumbers();

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-medium text-lg">
          <span className="capitalize">{workspace.plan}</span> plan
        </h3>
        <CustomerPortalButton workspaceSlug={workspace.slug} />
      </div>
      <div className="grid max-w-lg gap-3">
        {Object.entries(currentNumbers).map(([key, value]) => {
          const limit = workspace.limits[key as keyof typeof currentNumbers];
          const memberlimit = limit === "Unlimited" ? 100 : limit;
          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-muted-foreground">
                <p className="text-sm capitalize">{key.replace("-", " ")}</p>
                <p className="text-xs">
                  <span className="text-foreground">{value}</span> / {limit}
                </p>
              </div>
              <Progress value={(value / memberlimit) * 100} />
            </div>
          );
        })}
      </div>
      <Separator className="my-4" />
      <SettingsPlan workspace={workspace} />
    </div>
  );
}
