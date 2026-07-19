import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout";
export default function ProcessLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <SiteShell currentPath="/process">{children}</SiteShell>;
}
