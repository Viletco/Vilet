"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  ChevronDown,
  CreditCard,
  ExternalLink,
  Gauge,
  Headphones,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  X,
} from "lucide-react";
import type { ProductStatus } from "../lib/platform-products";
import { ProductStatusBadge } from "./page-frame";

export interface ShellDestination {
  key: string;
  label: string;
  href: string;
  status: ProductStatus;
}

const icons = {
  overview: LayoutDashboard,
  studio: BriefcaseBusiness,
  growth: Gauge,
  partner: GraduationCap,
  insights: BarChart3,
  ai: Bot,
  billing: CreditCard,
  support: Headphones,
  settings: Settings,
  admin: ShieldCheck,
} as const;

function isActive(pathname: string, item: ShellDestination) {
  return item.key === "overview"
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function Navigation({
  destinations,
  onNavigate,
}: {
  destinations: ShellDestination[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const primary = destinations.filter(({ key }) =>
    ["overview", "studio", "growth", "partner", "insights", "ai"].includes(key),
  );
  const account = destinations.filter(
    ({ key }) => !primary.some((item) => item.key === key),
  );
  const group = (label: string, items: ShellDestination[]) =>
    items.length ? (
      <div>
        <p className="mb-2 px-3 text-[10.5px] font-semibold tracking-[0.08em] text-[hsl(240_6%_44%)] uppercase">
          {label}
        </p>
        <div className="space-y-0.5">
          {items.map((item) => {
            const active = isActive(pathname, item);
            const Icon = icons[item.key as keyof typeof icons] ?? Sparkles;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`group flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors duration-150 ${active ? "text-foreground bg-white/[0.055]" : "hover:text-foreground text-[hsl(240_6%_66%)] hover:bg-white/[0.03]"}`}
              >
                <Icon
                  aria-hidden="true"
                  className={active ? "text-primary" : "text-[hsl(240_6%_52%)]"}
                  size={17}
                  strokeWidth={active ? 2.2 : 1.9}
                />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.status !== "available" && (
                  <ProductStatusBadge status={item.status} compact />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    ) : null;
  return (
    <nav aria-label="Organization navigation" className="flex flex-col gap-6">
      {group("Workspace", primary)}
      {group("Account", account)}
    </nav>
  );
}

function AccountMenu({
  organizationSlug,
  userEmail,
  role,
  platformAdministrator,
}: {
  organizationSlug: string;
  userEmail: string;
  role: string;
  platformAdministrator: boolean;
}) {
  return (
    <details className="group/account relative">
      <summary className="flex w-full cursor-pointer list-none items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-white/[0.04]">
        <span className="from-primary/25 to-primary/5 text-primary ring-primary/20 grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[11px] font-semibold ring-1">
          {userEmail.slice(0, 1).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="text-foreground block truncate text-[12.5px] font-medium">
            {userEmail}
          </span>
          <span className="text-muted-foreground block text-[10.5px] capitalize">
            {role}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          size={14}
          className="text-muted-foreground transition group-open/account:rotate-180"
        />
      </summary>
      <div className="animate-scale-in border-border bg-popover absolute right-0 bottom-[calc(100%+0.5rem)] left-0 z-40 rounded-xl border p-1.5 shadow-2xl shadow-black/30">
        <Link
          className="account-link"
          href={`/o/${organizationSlug}/settings/general`}
        >
          <Settings size={15} /> Settings
        </Link>
        {platformAdministrator && (
          <Link className="account-link" href="/admin">
            <ShieldCheck size={15} /> Platform Admin
          </Link>
        )}
        <a className="account-link" href="https://vilet.co">
          <ExternalLink size={15} /> Visit vilet.co
        </a>
        <form
          action="/logout"
          method="post"
          className="border-border/60 mt-1 border-t pt-1"
        >
          <button className="account-link w-full">
            <LogOut size={15} /> Log out
          </button>
        </form>
      </div>
    </details>
  );
}

function Brand({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <span className="border-border text-primary grid size-8 place-items-center rounded-lg border bg-white/[0.02] text-[11px] font-semibold">
        V
      </span>
      <span className="text-[15px] font-semibold tracking-tight">Vilét</span>
    </Link>
  );
}

export function AppShellClient({
  organizationSlug,
  organizationName,
  organizationKind,
  userEmail,
  role,
  platformAdministrator,
  destinations,
  children,
}: {
  organizationSlug: string;
  organizationName: string;
  organizationKind: string;
  userEmail: string;
  role: string;
  platformAdministrator: boolean;
  destinations: ShellDestination[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);
  const home = `/o/${organizationSlug}`;
  const account = (
    <AccountMenu
      organizationSlug={organizationSlug}
      userEmail={userEmail}
      role={role}
      platformAdministrator={platformAdministrator}
    />
  );
  return (
    <div className="bg-background text-foreground min-h-screen">
      <aside className="border-border bg-sidebar fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r lg:flex">
        <div className="flex h-16 items-center px-5">
          <Brand href={home} />
        </div>
        <div className="border-border/50 border-y px-5 py-3.5">
          <p className="truncate text-[12.5px] font-medium">
            {organizationName}
          </p>
          <p className="text-muted-foreground mt-0.5 text-[10.5px] capitalize">
            {organizationKind} organization
          </p>
        </div>
        <div className="vilet-scroll flex-1 overflow-y-auto px-3 py-5">
          <Navigation destinations={destinations} />
        </div>
        <div className="border-border/50 border-t p-3">{account}</div>
      </aside>
      <div className="lg:pl-60">
        <header className="border-border bg-background/85 sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4 backdrop-blur-xl lg:hidden">
          <Brand href={home} />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-platform-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="border-border text-muted-foreground hover:text-foreground grid size-9 place-items-center rounded-lg border bg-white/[0.02]"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </header>
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/60"
              onClick={() => setOpen(false)}
            />
            <aside
              id="mobile-platform-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Platform navigation"
              className="animate-slide-up border-border bg-sidebar absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col border-r shadow-2xl"
            >
              <div className="border-border/50 flex h-14 items-center justify-between border-b px-4">
                <Brand href={home} />
                <button
                  type="button"
                  aria-label="Close menu"
                  className="text-muted-foreground hover:text-foreground grid size-9 place-items-center rounded-lg hover:bg-white/[0.04]"
                  onClick={() => setOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="border-border/50 border-b px-4 py-3.5">
                <p className="truncate text-[12.5px] font-medium">
                  {organizationName}
                </p>
                <p className="text-muted-foreground text-[10.5px] capitalize">
                  {role}
                </p>
              </div>
              <div className="vilet-scroll flex-1 overflow-y-auto px-3 py-5">
                <Navigation
                  destinations={destinations}
                  onNavigate={() => setOpen(false)}
                />
              </div>
              <div className="border-border/50 border-t p-3">{account}</div>
            </aside>
          </div>
        )}
        <main
          id="main-content"
          className="animate-fade-in mx-auto min-h-[calc(100vh-3.5rem)] w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:min-h-screen lg:px-10 lg:py-9"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
