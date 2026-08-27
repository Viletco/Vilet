import { platformLoginUrl, type SitePath } from "@/content/navigation";

import { ButtonLink, TextLink, Wordmark } from "@/components/ui";

import { Container } from "./container";
import { DesktopNavigation } from "./desktop-navigation";
import { MobileNavigation } from "./mobile-navigation";

export interface HeaderProps {
  currentPath?: SitePath;
}

export function Header({ currentPath }: HeaderProps) {
  return (
    <header className="vilet-header sticky top-0 z-(--ds-z-sticky) h-(--ds-header-height)">
      <Container className="h-full">
        <div className="desktop:grid desktop:grid-cols-[minmax(12rem,1fr)_auto_minmax(12rem,1fr)] desktop:gap-(--ds-space-xl) flex h-full items-center justify-between">
          <div className="flex min-w-0 items-center justify-start gap-4">
            <Wordmark linked />
            <span className="vilet-coordinate text-text-muted desktop:block hidden border-l border-white/10 pl-4">
              Building what&apos;s next
            </span>
          </div>
          <DesktopNavigation currentPath={currentPath} />
          <div className="flex min-w-0 items-center justify-end gap-(--ds-space-lg)">
            <TextLink
              href={platformLoginUrl}
              variant="navigation"
              className="desktop:inline-flex hidden py-(--ds-space-sm)"
            >
              Log In
            </TextLink>
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
