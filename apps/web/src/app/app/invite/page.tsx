import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@dashboardbuddy/ui/components/alert";
import { Separator } from "@dashboardbuddy/ui/components/separator";

import { Icons } from "@/components/icons";

import { searchParamsCache } from "./search-params";
import { acceptInvitation, getWorkspace } from "@/lib/databasecalls";
import Link from "next/link";

const AlertTriangle = Icons["alert-triangle"];

export default async function InvitePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { token } = searchParamsCache.parse(searchParams);
  const { message, data } = token
    ? await acceptInvitation({ token })
    : { message: "Unavailable invitation token.", data: undefined };

  const workspace = await getWorkspace();

  if (!data) {
    return (
      <div className="mx-auto flex h-full max-w-xl flex-1 flex-col items-center justify-center gap-4">
        <h1 className="font-semibold text-2xl">Invitation</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        <Separator className="my-4" />
        <p className="text-muted-foreground">Dashboard</p>
        <Link href={`/${workspace.slug}/dashboard`}>Go Back to Workspace</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full max-w-xl flex-1 flex-col items-center justify-center gap-4">
      <h1 className="font-semibold text-2xl">Invitation</h1>
      <Alert>
        <Icons.check className="h-4 w-4" />
        <AlertTitle>Ready to go</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <Link href={"/"}>GO to Home</Link>
    </div>
  );
}
