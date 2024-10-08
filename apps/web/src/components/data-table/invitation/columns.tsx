"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { Invitation, WorkspaceRole } from "@dashboardbuddy/db/src/schema";
import { Badge } from "@dashboardbuddy/ui/components/badge";

import { formatDate } from "@/lib/utils";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Invitation>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as WorkspaceRole;
      return (
        <Badge variant={role === "member" ? "outline" : "default"}>
          {row.getValue("role")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "expiresAt",
    header: "Expires at",
    cell: ({ row }) => {
      return <span>{formatDate(row.getValue("expiresAt"))}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <DataTableRowActions row={row} />
        </div>
      );
    },
  },
];
