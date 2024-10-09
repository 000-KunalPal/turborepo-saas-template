import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@dashboardbuddy/ui/components/alert";
import { searchParamsCache } from "./search-params";
import { AlertTriangle, Check } from "lucide-react";
import { Separator } from "@dashboardbuddy/ui/components/separator";
import Link from "next/link";
import { acceptInvitationViaLink } from "@/lib/databasecalls";

export default async function InvitePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { joinCode } = searchParamsCache.parse(searchParams);
  const { message, data, status } = joinCode
    ? await acceptInvitationViaLink({ joinCode })
    : {
        message: "Unavailable invitation token.",
        data: undefined,
        status: "error",
      };

  return (
    <div className="mx-auto flex h-full max-w-xl flex-1 flex-col items-center justify-center gap-4">
      <h1 className="font-semibold text-2xl">Invitation</h1>
      <Alert variant={status === "error" ? "destructive" : "default"}>
        {status === "error" ? (
          <AlertTriangle className="h-4 w-4" />
        ) : (
          <Check className="h-4 w-4" />
        )}
        <AlertTitle>
          {status === "error" ? "Something went wrong" : "Ready to go"}
        </AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <Separator className="my-4" />
      <Link
        href={data ? `/${data.slug}/dashboard` : "/dashboard"}
        className="text-primary hover:underline"
      >
        {data ? "Go to Dashboard" : "Go Back to Workspace"}
      </Link>
    </div>
  );
}
