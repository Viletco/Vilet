export interface LegalConfiguration {
  readonly brandName: "Vilét";
  readonly operatorName: "Caiden Sloan";
  readonly operatorDescription: "Caiden Sloan, doing business as Vilét";
  readonly privacyEmail: `${string}@vilet.co`;
  readonly privacyPolicy: {
    readonly effectiveDate: string;
    readonly lastUpdated: string;
  };
  readonly terms: {
    readonly approvedForNavigation: true;
    readonly statusLabel: "Legal";
    readonly effectiveDate: string;
    readonly lastUpdated: string;
  };
}

// The effective date remains the policy's original date. Substantive wording
// changed on August 2, 2026, so only lastUpdated advances for the policy.
export const legalConfig = {
  brandName: "Vilét",
  operatorName: "Caiden Sloan",
  operatorDescription: "Caiden Sloan, doing business as Vilét",
  privacyEmail: "privacy@vilet.co",
  privacyPolicy: {
    effectiveDate: "July 28, 2026",
    lastUpdated: "August 2, 2026",
  },
  terms: {
    approvedForNavigation: true,
    statusLabel: "Legal",
    effectiveDate: "August 2, 2026",
    lastUpdated: "August 2, 2026",
  },
} as const satisfies LegalConfiguration;

export const privacyMailto = `mailto:${legalConfig.privacyEmail}` as const;
