import type { MediaAsset, SeoMetadata } from "../shared";
import type { SitePath } from "../navigation";

export interface SocialProfile {
  readonly label: string;
  readonly url: `https://${string}`;
}
export interface LegalLink {
  readonly label: string;
  readonly href: SitePath;
}
export interface GlobalSettings {
  readonly brandName: string;
  readonly codeName: string;
  readonly domain: string;
  readonly tagline: string;
  readonly businessDescription: string;
  readonly contactLinks: readonly [];
  readonly socialProfiles: readonly SocialProfile[];
  readonly defaultSeo: SeoMetadata;
  readonly brandMedia: readonly MediaAsset[];
  readonly legalLinks: readonly LegalLink[];
  readonly footer: {
    readonly showNavigation: boolean;
    readonly showTagline: boolean;
  };
}
