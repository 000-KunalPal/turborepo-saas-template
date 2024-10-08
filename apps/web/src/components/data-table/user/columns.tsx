"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { User, WorkspaceRole } from "@dashboardbuddy/db/src/schema";
import { Badge } from "@dashboardbuddy/ui/components/badge";

import { formatDate } from "@/lib/utils";
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<User & { role: WorkspaceRole }>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return (
        <div>
          <p>{row.original.name}</p>
          <p className="text-muted-foreground">{row.getValue("email")}</p>
        </div>
      );
    },
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
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      return <span>{formatDate(row.getValue("createdAt"))}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const role = row.original.role;
      if (role === "owner") return null;
      return (
        <div className="text-right">
          <DataTableRowActions row={row} />
        </div>
      );
    },
  },
];
