import type { SitePath } from "@/content/navigation";

import { ButtonLink, Wordmark } from "@/components/ui";

import { Container } from "./container";
import { DesktopNavigation } from "./desktop-navigation";
import { MobileNavigation } from "./mobile-navigation";

export interface HeaderProps {
  currentPath?: SitePath;
  showAi?: boolean;
}

export function Header({ currentPath, showAi = false }: HeaderProps) {
  return (
    <header className="border-divider bg-glass sticky top-0 z-(--ds-z-sticky) h-(--ds-header-height) border-b backdrop-blur-(--ds-glass-blur)">
      <Container className="flex h-full items-center justify-between gap-(--ds-space-xl)">
        <Wordmark linked />
        <div className="flex items-center gap-(--ds-space-xl)">
          <DesktopNavigation currentPath={currentPath} showAi={showAi} />
          <ButtonLink
            href="/contact"
            size="sm"
            className="laptop:inline-flex hidden"
          >
            Let&apos;s Talk
          </ButtonLink>
          <MobileNavigation currentPath={currentPath} showAi={showAi} />
        </div>
      </Container>
    </header>
  );
}
