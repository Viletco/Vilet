import type { ReactNode } from "react";

import { SiteShell } from "@/components/layout";

export default function TermsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <SiteShell currentPath="/terms">{children}</SiteShell>;
}
