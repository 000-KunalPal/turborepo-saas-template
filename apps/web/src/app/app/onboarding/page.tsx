import { auth } from "@/lib/auth";
import { getWorkspace } from "@/lib/databasecalls";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session) redirect("/app/login");

  const workspace = await getWorkspace();
  if (!workspace) return redirect("/app/login");

  return redirect(`/app/${workspace.slug}/onboarding`);
}
