"use client";

import { useEffect } from "react";

export function WorkspaceClientCookie({
  workspaceSlug,
}: {
  workspaceSlug: string;
}) {
  useEffect(() => {
    if (document) {
      document.cookie = `workspace-slug=${workspaceSlug}; path=/`;
    }
  }, [workspaceSlug]);
  return null;
}
