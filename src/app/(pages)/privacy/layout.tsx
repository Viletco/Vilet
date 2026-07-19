import type { ReactNode } from "react";

import { SiteShell } from "@/components/layout";

export default function PrivacyLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <SiteShell currentPath="/privacy">{children}</SiteShell>;
}
