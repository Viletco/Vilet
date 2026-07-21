export const siteNavigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/contact" },
] as const;

export const aiNavigationItem = { label: "Vilét AI", href: "/ai" } as const;

export type SitePath =
  | (typeof siteNavigation)[number]["href"]
  | typeof aiNavigationItem.href
  | "/privacy";
