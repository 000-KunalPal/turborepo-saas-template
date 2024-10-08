import { NextResponse } from "next/server";

import { db, eq } from "@dashboardbuddy/db";
import {
  user,
  workspace,
  usersToWorkspaces,
} from "@dashboardbuddy/db/src/schema";

import { auth } from "@/lib/auth";

const publicAppPaths = [
  "/app/sign-in",
  "/app/sign-up",
  "/app/login",
  "/app/invite",
  "/app/onboarding",
];

export default auth(async (req) => {
  const url = req.nextUrl.clone();

  if (url.pathname.includes("api/trpc")) {
    return NextResponse.next();
  }
  const pathname = req.nextUrl.pathname;

  const isPublicAppPath = publicAppPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (!req.auth && pathname.startsWith("/app/invite")) {
    return NextResponse.redirect(
      new URL(
        `/app/login?redirectTo=${encodeURIComponent(req.nextUrl.href)}`,
        req.url
      )
    );
  }

  if (!req.auth && pathname.startsWith("/app") && !isPublicAppPath) {
    return NextResponse.redirect(
      new URL(
        `/app/login?redirectTo=${encodeURIComponent(req.nextUrl.href)}`,
        req.url
      )
    );
  }

  if (req.auth?.user?.id) {
    if (pathname.startsWith("/app") && !isPublicAppPath) {
      const workspaceSlug = req.nextUrl.pathname.split("/")?.[2];
      const hasWorkspaceSlug = !!workspaceSlug && workspaceSlug.trim() !== "";

      const allowedWorkspaces = await db
        .select()
        .from(usersToWorkspaces)
        .innerJoin(user, eq(user.id, usersToWorkspaces.userId))
        .innerJoin(workspace, eq(workspace.id, usersToWorkspaces.workspaceId))
        .where(eq(user.id, Number.parseInt(req.auth.user.id)))
        .all();

      if (hasWorkspaceSlug) {
        const hasAccessToWorkspace = allowedWorkspaces.find(
          ({ workspace }) => workspace.slug === workspaceSlug
        );
        if (hasAccessToWorkspace) {
          const workspaceCookie = req.cookies.get("workspace-slug")?.value;
          const hasChanged = workspaceCookie !== workspaceSlug;
          if (hasChanged) {
            const response = NextResponse.redirect(url);
            response.cookies.set("workspace-slug", workspaceSlug);
            return response;
          }
        } else {
          return NextResponse.redirect(new URL("/app", req.url));
        }
      } else {
        if (allowedWorkspaces[0] && allowedWorkspaces.length > 0) {
          const firstWorkspace = allowedWorkspaces[0].workspace;
          const { slug } = firstWorkspace;
          return NextResponse.redirect(
            new URL(`/app/${slug}/dashboard`, req.url)
          );
        }
      }
    }
  }

  // reset workspace slug cookie if no auth
  if (!req.auth && req.cookies.has("workspace-slug")) {
    const response = NextResponse.next();
    response.cookies.delete("workspace-slug");
    return response;
  }
});

export const config = {
  matcher: [
    "/((?!api|assets|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    "/",
    "/(api/webhook|api/trpc)(.*)",
    "/(!api/checker/:path*|!api/og|!api/ping)",
  ],
};
