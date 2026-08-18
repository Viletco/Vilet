import { homepageContent } from "../homepage";
import { legalConfig } from "../../config/legal";
import type { GlobalSettings } from "./types";

export const globalSettings = {
  brandName: "Vilét",
  codeName: "vilet",
  domain: "vilet.co",
  tagline: "Building what's next.",
  businessDescription:
    "Vilét is a technology company building digital products, software, automation, and systems for modern businesses.",
  contactLinks: [],
  socialProfiles: [],
  defaultSeo: homepageContent.seo,
  brandMedia: [],
  legalLinks: [
    { label: "Privacy", href: "/privacy" },
    ...(legalConfig.terms.approvedForNavigation
      ? [{ label: "Terms", href: "/terms" } as const]
      : []),
  ],
  footer: { showNavigation: true, showTagline: true },
} as const satisfies GlobalSettings;
