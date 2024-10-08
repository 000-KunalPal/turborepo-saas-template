"use client";

import { Image, Slash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import { SelectWorkspace } from "@/components/workspace/select-workspace";
import { notEmpty } from "@/lib/utils";

export function Breadcrumbs() {
  const params = useParams();
  const pathname = usePathname();
  const currentPathname = pathname.split("/").pop();
  const breadcrumbs = [currentPathname].filter(notEmpty);

  return (
    <div className="flex items-center">
      <Link href="/app" className="shrink-0">
        <Image />
      </Link>
      <Slash className="-rotate-12 mr-0.5 ml-2.5 h-4 w-4 text-muted-foreground" />
      {params.workspaceSlug ? (
        <div className="w-40">
          <SelectWorkspace />
        </div>
      ) : null}

      {breadcrumbs.map((breadcrumb) => (
        <Fragment key={breadcrumb}>
          <Slash className="-rotate-12 mr-2.5 ml-0.5 h-4 w-4 text-muted-foreground" />
          <p className="rounded-md font-medium text-primary text-sm">
            {breadcrumb}
          </p>
        </Fragment>
      ))}
    </div>
  );
}
