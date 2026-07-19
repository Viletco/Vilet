import { homepageContent } from "../homepage";
import type { GlobalSettings } from "./types";

export const globalSettings = {
  brandName: "Vilét",
  codeName: "vilet",
  domain: "vilet.co",
  tagline: "Building what's next.",
  businessDescription:
    "Vilét is a premium digital studio that builds modern websites, AI automation, custom software, and digital products.",
  contactLinks: [],
  socialProfiles: [],
  defaultSeo: homepageContent.seo,
  brandMedia: [],
  legalLinks: [{ label: "Privacy", href: "/privacy" }],
  footer: { showNavigation: true, showTagline: true },
} as const satisfies GlobalSettings;
