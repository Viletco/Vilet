"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TabNavigation({
  label,
  items,
  className = "",
}: {
  label: string;
  items: readonly { label: string; href: string; exact?: boolean }[];
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <nav
      aria-label={label}
      className={`vilet-scroll border-border/60 flex overflow-x-auto border-b ${className}`}
    >
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`relative min-h-10 shrink-0 px-3 py-2 text-[12.5px] font-medium transition-colors ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {item.label}
            {active && (
              <span
                aria-hidden="true"
                className="bg-primary absolute inset-x-2 -bottom-px h-px"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
