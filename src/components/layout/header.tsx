import type { SitePath } from "@/content/navigation";

import { ButtonLink, Wordmark } from "@/components/ui";

import { Container } from "./container";
import { DesktopNavigation } from "./desktop-navigation";
import { MobileNavigation } from "./mobile-navigation";

export interface HeaderProps {
  currentPath?: SitePath;
}

export function Header({ currentPath }: HeaderProps) {
  return (
    <header className="pointer-events-none sticky top-0 z-(--ds-z-sticky) h-(--ds-header-height) pt-(--ds-space-md)">
      <Container>
        <div className="border-border bg-glass pointer-events-auto flex h-16 items-center justify-between gap-(--ds-space-xl) rounded-xl border px-(--ds-space-lg) shadow-md backdrop-blur-(--ds-glass-blur)">
          <Wordmark linked />
          <div className="flex items-center gap-(--ds-space-xl)">
            <DesktopNavigation currentPath={currentPath} />
            <ButtonLink
              href="/contact"
              size="sm"
              className="laptop:inline-flex hidden"
            >
              Start a project
            </ButtonLink>
            <MobileNavigation currentPath={currentPath} />
          </div>
        </div>
      </Container>
    </header>
  );
}
