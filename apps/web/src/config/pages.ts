import type { ValidIcon } from "@/components/icons";

export type Page = {
  title: string;
  subtitle?: string;
  description: string;
  href: string;
  icon: ValidIcon;
  disabled?: boolean;
  segment: string;
  children?: Page[];
};

export const settingsPagesConfig: Page[] = [
  {
    title: "General",
    description: "General settings for the workspace.",
    href: "/settings/general",
    icon: "cog",
    segment: "general",
  },
  {
    title: "Team",
    description: "Team settings for the workspace.",
    href: "/settings/team",
    icon: "users",
    segment: "team",
  },
  {
    title: "Billing",
    description: "Billing settings for the workspace.",
    href: "/settings/billing",
    icon: "credit-card",
    segment: "billing",
  },
  {
    title: "Appearance",
    description: "Appearance settings for the workspace.",
    href: "/settings/appearance",
    icon: "sun",
    segment: "appearance",
  },
  {
    title: "User",
    description: "Profile settings for the user.",
    href: "/settings/user",
    icon: "user",
    segment: "user",
  },
];

export type PageId = (typeof pagesConfig)[number]["segment"];

export const pagesConfig = [
  {
    title: "Dashboard",
    description: "Your dashboard",
    href: "/dashboard",
    icon: "layout-dashboard",
    segment: "dashboard",
  },

  {
    title: "Settings",
    description: "Your workspace settings",
    href: "/settings/general",
    icon: "cog",
    segment: "settings",
    children: settingsPagesConfig,
  },
] as const satisfies readonly Page[];

export function getPageBySegment(
  segment: string | string[],
  currentPage: readonly Page[] = pagesConfig
): Page | undefined {
  if (typeof segment === "string") {
    const page = currentPage.find((page) => page.segment === segment);
    return page;
  }
  if (Array.isArray(segment) && segment.length > 0) {
    const [firstSegment, ...restSegments] = segment;
    const childPage = currentPage.find((page) => page.segment === firstSegment);
    if (childPage?.children) {
      return getPageBySegment(restSegments, childPage.children);
    }
    return childPage;
  }
  return undefined;
}
