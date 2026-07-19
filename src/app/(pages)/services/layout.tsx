import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout";
export default function ServicesLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <SiteShell currentPath="/services">{children}</SiteShell>;
}
