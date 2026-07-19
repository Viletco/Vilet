import type { ReactNode } from "react";

import { SiteShell } from "@/components/layout";

export default function ContactLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <SiteShell currentPath="/contact">{children}</SiteShell>;
}
