import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout";
export default function WorkLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <SiteShell currentPath="/work">{children}</SiteShell>;
}
