export const siteNavigation = [
  { label: "Studio", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
  { label: "Vilét AI", href: "/ai" },
] as const;

export const footerNavigation = [
  { label: "Home", href: "/" },
  ...siteNavigation,
  { label: "Process", href: "/process" },
] as const;

export type SitePath =
  (typeof footerNavigation)[number]["href"] | "/privacy" | "/terms";
