import { createFileRoute } from "@tanstack/react-router";

import { PlatformApp, PAGES, TABS, type Page, type Tab } from "../features/platform/PlatformApp";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: typeof search.tab === "string" ? search.tab : undefined,
    page: typeof search.page === "string" ? search.page : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
    job: typeof search.job === "string" ? search.job : undefined,
  }),
  head: () => ({
    meta: [
      { title: "丝路电商人才平台 — 湖北跨境电商人才培训与就业平台" },
      { name: "description", content: "湖北省跨境电商人才一站式培训、认证与就业平台。" },
    ],
  }),
  component: Index,
});

function Index() {
  const search = Route.useSearch() as { tab?: string; page?: string; q?: string; job?: string };
  const initialTab = TABS.includes(search.tab as Tab) ? (search.tab as Tab) : "home";
  const initialPage = PAGES.includes(search.page as Page) ? (search.page as Page) : "index";
  const initialQuery = typeof search.q === "string" ? search.q : "";
  const initialJobId = typeof search.job === "string" ? search.job : "";

  return (
    <PlatformApp
      initialTab={initialTab}
      initialPage={initialPage}
      initialQuery={initialQuery}
      initialJobId={initialJobId}
    />
  );
}
