import type { ReactNode } from "react";

import type { SitePath } from "@/content/navigation";

import { Footer } from "./footer";
import { Header } from "./header";
import { SkipLink } from "./skip-link";

export interface SiteShellProps {
  currentPath?: SitePath;
  children: ReactNode;
}

export function SiteShell({ currentPath, children }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Header currentPath={currentPath} />
      <main
        id="main-content"
        data-route={currentPath ?? "unmatched"}
        tabIndex={-1}
        className="flex-1 scroll-mt-(--ds-header-height)"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
