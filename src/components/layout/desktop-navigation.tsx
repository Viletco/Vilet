import {
  aiNavigationItem,
  siteNavigation,
  type SitePath,
} from "@/content/navigation";
import { cn } from "@/lib/cn";

import { TextLink } from "@/components/ui";

export interface DesktopNavigationProps {
  currentPath?: SitePath;
  showAi?: boolean;
}

export function DesktopNavigation({
  currentPath,
  showAi = false,
}: DesktopNavigationProps) {
  const navigation = showAi
    ? [...siteNavigation, aiNavigationItem]
    : siteNavigation;

  return (
    <nav aria-label="Primary navigation" className="laptop:block hidden">
      <ul className="flex items-center gap-(--ds-space-xl)">
        {navigation.map((item) => {
          const current = item.href === currentPath;

          return (
            <li key={item.href}>
              <TextLink
                href={item.href}
                variant="navigation"
                aria-current={current ? "page" : undefined}
                className={cn(current && "text-text-primary")}
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
