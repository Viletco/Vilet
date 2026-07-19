export function isInternalHref(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

export function getSafeRel(target?: string, rel?: string) {
  if (target !== "_blank") return rel;

  const values = new Set([
    ...(rel?.split(" ") ?? []),
    "noopener",
    "noreferrer",
  ]);
  return [...values].join(" ");
}
