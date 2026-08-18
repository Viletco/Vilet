import type { ReactNode } from "react";

import { SiteShell } from "@/components/layout";

export default function InsightsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <SiteShell currentPath="/insights">{children}</SiteShell>;
}
