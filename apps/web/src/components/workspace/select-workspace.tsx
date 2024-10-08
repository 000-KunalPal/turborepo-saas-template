"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import type { Workspace } from "@dashboardbuddy/db/src/schema";
import { Button } from "@dashboardbuddy/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@dashboardbuddy/ui/components/dropdown-menu";
import { Skeleton } from "@dashboardbuddy/ui/components/skeleton";
import { getUserWorkspaces } from "@/lib/databasecalls";

export function SelectWorkspace() {
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([]);
  const [active, setActive] = React.useState<string>();
  const pathname = usePathname();

  React.useEffect(() => {
    if (pathname?.split("/")?.[2] && workspaces.length > 0) {
      setActive(pathname?.split("/")?.[2]);
    }
  }, [pathname, workspaces]);

  React.useEffect(() => {
    async function fetchWorkspaces() {
      const _workspaces = await getUserWorkspaces();
      setWorkspaces(_workspaces);
    }
    fetchWorkspaces();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-between"
        >
          {active ? (
            <span className="truncate">{active}</span>
          ) : (
            <Skeleton className="h-5 w-full" />
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
      >
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((workspace) => (
          <DropdownMenuItem key={workspace.id} asChild>
            <a
              href={`/app/${workspace.slug}/dashboard`}
              className="justify-between"
            >
              <span className="truncate">{workspace.slug}</span>
              {active === workspace.slug ? (
                <Check className="ml-2 h-4 w-4" />
              ) : null}
            </a>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={`/app/${active}/settings/team`}
            className="flex items-center justify-between"
          >
            Invite Members
            <Plus className="ml-2 h-4 w-4" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
