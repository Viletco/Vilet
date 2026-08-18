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
    <header className="border-divider bg-background/95 sticky top-0 z-(--ds-z-sticky) h-(--ds-header-height) border-b backdrop-blur-(--ds-glass-blur)">
      <Container className="h-full">
        <div className="desktop:grid desktop:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] desktop:gap-(--ds-space-xl) flex h-full items-center justify-between">
          <div className="flex min-w-0 justify-start">
            <Wordmark linked />
          </div>
          <DesktopNavigation currentPath={currentPath} />
          <div className="flex min-w-0 items-center justify-end">
            <ButtonLink
              href="/contact"
              size="sm"
              className="desktop:inline-flex hidden"
            >
              Discuss a project
            </ButtonLink>
            <MobileNavigation currentPath={currentPath} />
          </div>
        </div>
      </Container>
    </header>
  );
}
