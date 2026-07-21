"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  aiNavigationItem,
  siteNavigation,
  type SitePath,
} from "@/content/navigation";
import { cn } from "@/lib/cn";

import { Button, ButtonLink, TextLink } from "@/components/ui";

import { Container } from "./container";

export interface MobileNavigationProps {
  currentPath?: SitePath;
  showAi?: boolean;
}

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNavigation({
  currentPath,
  showAi = false,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigation = showAi
    ? [...siteNavigation, aiNavigationItem]
    : siteNavigation;

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    const firstFocusable = panel?.querySelector<HTMLElement>(focusableSelector);

    document.body.style.overflow = "hidden";
    firstFocusable?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = [
        ...panel.querySelectorAll<HTMLElement>(focusableSelector),
      ].filter((element) => !element.hasAttribute("disabled"));
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (
        !panelRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
      trigger?.focus();
    };
  }, [open]);

  return (
    <div className="laptop:hidden">
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </Button>

      <div
        data-mobile-navigation-overlay
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "bg-overlay fixed inset-0 top-(--ds-header-height) z-(--ds-z-overlay) overflow-hidden opacity-0 transition-opacity duration-(--ds-motion-modal) ease-(--ds-ease-standard) motion-reduce:transition-none",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none",
        )}
      >
        <div
          ref={panelRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={cn(
            "border-border bg-background ml-auto h-full w-(--ds-mobile-menu-width) overflow-y-auto border-l py-(--ds-space-2xl) shadow-lg transition-transform duration-(--ds-motion-modal) ease-(--ds-ease-emphasized) motion-reduce:transition-none",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <Container>
            <nav aria-label="Mobile primary navigation">
              <ul className="flex flex-col gap-(--ds-space-sm)">
                {navigation.map((item) => {
                  const current = item.href === currentPath;

                  return (
                    <li key={item.href}>
                      <TextLink
                        href={item.href}
                        variant="navigation"
                        aria-current={current ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "type-heading-4 block rounded-md px-(--ds-space-md) py-(--ds-space-lg)",
                          current && "bg-surface text-text-primary",
                        )}
                      >
                        {item.label}
                      </TextLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <ButtonLink
              href="/contact"
              fullWidth
              className="mt-(--ds-space-2xl)"
              onClick={() => setOpen(false)}
            >
              Let&apos;s Talk
            </ButtonLink>
          </Container>
        </div>
      </div>
    </div>
  );
}
