import { siteNavigation, type SitePath } from "@/content/navigation";
import { cn } from "@/lib/cn";

import { TextLink } from "@/components/ui";

export interface DesktopNavigationProps {
  currentPath?: SitePath;
}

export function DesktopNavigation({ currentPath }: DesktopNavigationProps) {
  return (
    <nav
      aria-label="Primary navigation"
      className="desktop:block hidden justify-self-center"
    >
      <ul className="flex items-center gap-1">
        {siteNavigation.map((item) => {
          const current =
            item.href === currentPath ||
            currentPath?.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <TextLink
                href={item.href}
                variant="navigation"
                aria-current={current ? "page" : undefined}
                className={cn(
                  "vilet-nav-link px-3 py-(--ds-space-sm)",
                  current && "vilet-nav-link--current text-text-primary",
                )}
              >
                {item.label}
              </TextLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
