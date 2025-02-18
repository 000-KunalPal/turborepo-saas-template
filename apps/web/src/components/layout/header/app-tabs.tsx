"use client";

import { useParams, useSelectedLayoutSegment } from "next/navigation";

import { TabsContainer, TabsLink } from "@/components/dashboard/tabs-link";
import { pagesConfig } from "@/config/pages";

export function AppTabs() {
  const params = useParams();
  const selectedSegment = useSelectedLayoutSegment();

  if (!params?.workspaceSlug) return null;

  return (
    <div className="-mb-3">
      <TabsContainer>
        {pagesConfig.map(({ title, segment, href }) => {
          const active = segment === selectedSegment;
          return (
            <TabsLink
              key={segment}
              active={active}
              href={`/app/${params?.workspaceSlug}${href}`}
              prefetch={false}
              className="relative"
            >
              {title}
            </TabsLink>
          );
        })}
      </TabsContainer>
    </div>
  );
}
