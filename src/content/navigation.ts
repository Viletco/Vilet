export const siteNavigation = [
  { label: "Studio", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Insights", href: "/insights" },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const platformLoginUrl = "https://app.vilet.co/login";

export const footerNavigation = [
  { label: "Home", href: "/" },
  { label: "Studio", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Process", href: "/process" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
  { label: "Vilét AI", href: "/ai" },
] as const;

export type SitePath =
  (typeof footerNavigation)[number]["href"] | "/privacy" | "/terms";
