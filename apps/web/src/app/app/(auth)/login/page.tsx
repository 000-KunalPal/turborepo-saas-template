import Link from "next/link";
import { Icons } from "@/components/icons";
import { signIn } from "@/lib/auth";
import { searchParamsCache } from "./search-params";
import { Button } from "@dashboardbuddy/ui/components/button";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { redirectTo } = searchParamsCache.parse(searchParams);

  return (
    <>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-semibold text-3xl tracking-tight">Sign In</h1>
        <p className="text-muted-foreground text-sm">
          Get started now. No credit card required.
        </p>
      </div>
      <div className="grid gap-3">
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo });
          }}
          className="w-full"
        >
          <Button type="submit" className="w-full">
            Signin with GitHub <Icons.github className="ml-2 h-4 w-4" />
          </Button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo });
          }}
          className="w-full"
        >
          <Button type="submit" className="w-full" variant="outline">
            Signin with Google <Icons.google className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
      <p className="px-8 text-center text-muted-foreground text-sm">
        By clicking continue, you agree to our{" "}
        <Link
          href="/legal/terms"
          className="underline underline-offset-4 hover:text-primary hover:no-underline"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/legal/privacy"
          className="underline underline-offset-4 hover:text-primary hover:no-underline"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
}
