import Link from "next/link";
import {
  Bot,
  BookOpen,
  CircleDollarSign,
  GraduationCap,
  LayoutDashboard,
  UsersRound,
} from "lucide-react";

const items = [
  ["Dashboard", "", LayoutDashboard],
  ["Training", "/training", GraduationCap],
  ["Playbook", "/playbook", BookOpen],
  ["My leads", "/leads", UsersRound],
  ["Commissions", "/commissions", CircleDollarSign],
  ["Sales assistant", "/assistant", Bot],
] as const;

export function PartnerNav({
  slug,
  current,
}: {
  slug: string;
  current: string;
}) {
  const base = `/o/${slug}/partner`;
  return (
    <div className="partner-nav-shell mb-7">
      <div className="hidden border-r border-white/[0.06] px-4 py-3 sm:block">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase">
          Partner Hub
        </p>
        <p className="text-muted-foreground mt-0.5 text-[10px]">
          Sales workspace
        </p>
      </div>
      <nav
        aria-label="Partner Hub"
        className="vilet-scroll flex gap-1 overflow-x-auto p-2"
      >
        {items.map(([label, path, Icon]) => {
          const key = path.slice(1) || "dashboard";
          return (
            <Link
              key={label}
              href={`${base}${path}`}
              aria-current={current === key ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium transition ${current === key ? "bg-primary/12 text-foreground ring-primary/20 ring-1" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"}`}
            >
              <Icon aria-hidden="true" size={14} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export const partnerCard =
  "border-border bg-card/55 rounded-2xl border p-5 shadow-[0_14px_50px_-34px_rgba(139,92,246,0.45)]";
