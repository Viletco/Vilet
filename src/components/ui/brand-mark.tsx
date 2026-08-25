import Image from "next/image";
import { cn } from "@/lib/cn";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("vilet-brand-mark", className)} aria-hidden="true">
      <Image
        src="/brand/vilet-mark-source.png"
        alt=""
        width={1254}
        height={1254}
        priority
        className="vilet-brand-mark__image"
      />
    </span>
  );
}
