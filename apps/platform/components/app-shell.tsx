import Link from "next/link";
import type { OrganizationContext } from "@vilet/authorization";
import { destinationHref, visibleDestinations } from "../lib/platform-products";

function Navigation({ context }: { context: OrganizationContext }) {
  return (
    <nav aria-label="Organization navigation" className="space-y-1">
      {visibleDestinations(context).map((destination) => (
        <Link
          key={destination.key}
          href={destinationHref(context.organizationSlug, destination)}
          className="group flex min-h-11 items-center justify-between rounded-lg px-3 text-sm text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
        >
          <span>{destination.label}</span>
          {destination.status !== "available" && (
            <span className="text-[0.625rem] tracking-[0.12em] text-[var(--quiet)] uppercase">
              {destination.status === "coming_soon"
                ? "Soon"
                : destination.status}
            </span>
          )}
        </Link>
      ))}
      {context.platformAdministrator && (
        <Link
          href="/admin"
          className="flex min-h-11 items-center rounded-lg px-3 text-sm text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
        >
          Platform admin
        </Link>
      )}
    </nav>
  );
}

export function AppShell({
  context,
  userEmail,
  children,
}: {
  context: OrganizationContext;
  userEmail: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="hidden min-h-screen border-r border-[var(--border)] bg-[var(--sidebar)] p-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <Link
          href={`/o/${context.organizationSlug}`}
          className="flex items-center gap-3 rounded-lg"
        >
          <span className="grid size-9 place-items-center rounded-lg border border-[var(--border)] font-mono text-sm text-[var(--accent)]">
            V
          </span>
          <span className="text-lg font-semibold tracking-[-0.04em]">
            Vilét
          </span>
        </Link>
        <div className="mt-8 border-y border-[var(--border)] py-4">
          <p className="truncate text-sm font-medium">
            {context.organizationName}
          </p>
          <p className="mt-1 text-xs text-[var(--quiet)] capitalize">
            {context.organizationKind} organization
          </p>
        </div>
        <div className="mt-5 flex-1 overflow-y-auto">
          <Navigation context={context} />
        </div>
        <div className="border-t border-[var(--border)] pt-4">
          <p className="truncate text-xs text-[var(--muted)]">{userEmail}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-[var(--quiet)] capitalize">
              {context.role}
            </span>
            <form action="/logout" method="post">
              <button className="min-h-10 rounded-lg px-3 text-xs text-[var(--muted)] hover:bg-[var(--elevated)] hover:text-[var(--text)]">
                Log out
              </button>
            </form>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-[var(--border)] bg-[color:rgb(8_9_11/92%)] px-5 backdrop-blur-xl lg:hidden">
          <Link
            href={`/o/${context.organizationSlug}`}
            className="font-semibold tracking-[-0.04em]"
          >
            Vilét
          </Link>
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
              Menu
            </summary>
            <div className="absolute right-0 mt-3 w-[min(20rem,calc(100vw-2.5rem))] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xl">
              <p className="px-3 pb-3 text-xs text-[var(--quiet)]">
                {context.organizationName}
              </p>
              <Navigation context={context} />
              <form
                action="/logout"
                method="post"
                className="mt-3 border-t border-[var(--border)] pt-3"
              >
                <button className="min-h-11 w-full rounded-lg px-3 text-left text-sm text-[var(--muted)] hover:bg-[var(--elevated)]">
                  Log out
                </button>
              </form>
            </div>
          </details>
        </header>
        <main
          id="main-content"
          className="mx-auto w-full max-w-[86rem] px-5 py-8 sm:px-8 sm:py-12 xl:px-12"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
