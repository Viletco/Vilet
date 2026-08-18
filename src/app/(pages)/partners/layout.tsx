import type { ReactNode } from "react";

import { SiteShell } from "@/components/layout";

export default function PartnersLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <SiteShell currentPath="/partners">{children}</SiteShell>;
}
