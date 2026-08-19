import Link from "next/link";

const items = [
  ["Dashboard", ""],
  ["Training", "/training"],
  ["Playbook", "/playbook"],
  ["My leads", "/leads"],
  ["Commissions", "/commissions"],
  ["Sales assistant", "/assistant"],
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
    <nav
      aria-label="Partner Hub"
      className="border-border mb-7 flex gap-1 overflow-x-auto border-b pb-2"
    >
      {items.map(([label, path]) => {
        const key = path.slice(1) || "dashboard";
        return (
          <Link
            key={label}
            href={`${base}${path}`}
            aria-current={current === key ? "page" : undefined}
            className={`shrink-0 rounded-lg px-3 py-2 text-[12.5px] font-medium ${current === key ? "text-foreground bg-white/[0.06]" : "text-muted-foreground hover:text-foreground"}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export const partnerCard = "border-border bg-card/40 rounded-2xl border p-5";
