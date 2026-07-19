import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout";
export default function AboutLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <SiteShell currentPath="/about">{children}</SiteShell>;
}
