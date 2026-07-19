import type { ReactNode } from "react";

import { SiteShell } from "@/components/layout";

export default function HomeLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <SiteShell currentPath="/">{children}</SiteShell>;
}
