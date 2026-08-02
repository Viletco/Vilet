import type { Metadata } from "next";

import {
  LegalPageBody,
  LegalPageHeader,
  LegalSection,
  legalLinkClasses,
  legalListClasses,
} from "@/components/legal/legal-page";
import { Text } from "@/components/ui";
import { legalConfig, privacyMailto } from "@/config/legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing use of the Vilét website and its features.",
  alternates: { canonical: "https://vilet.co/terms" },
  robots: { index: false, follow: false, nocache: true },
};

export default function TermsPage() {
  return (
    <>
      <LegalPageHeader
        eyebrow={legalConfig.terms.statusLabel}
        title="Terms of Use"
        description="These Terms of Use govern access to and use of the Vilét website and its optional features."
      >
        <Text variant="body-sm">
          <strong className="text-text-primary">Effective date:</strong>{" "}
          {legalConfig.terms.effectiveDate}
          <br />
          <strong className="text-text-primary">Last updated:</strong>{" "}
          {legalConfig.terms.lastUpdated}
        </Text>
      </LegalPageHeader>
      <LegalPageBody>
        <LegalSection id="terms-acceptance" title="Acceptance of the Terms">
          <Text>
            This website is operated by {legalConfig.operatorDescription}. This
            website and its optional features are subject to these Terms. By
            accessing or using the website, you agree to these Terms. If you do
            not agree, do not use the website.
          </Text>
        </LegalSection>

        <LegalSection id="terms-information" title="Website Information">
          <Text>
            Website content is provided for general information about Vilét and
            its services. It is not legal, financial, security, accessibility,
            tax, medical, or other regulated professional advice. Content may be
            incomplete or become outdated.
          </Text>
        </LegalSection>

        <LegalSection id="terms-relationship" title="No Client Relationship">
          <Text>
            Visiting the website, using an interactive feature, or submitting an
            inquiry does not by itself create a client relationship, agreement,
            obligation to accept work, or binding project scope. A client
            relationship would require a separate written agreement accepted by
            the relevant parties.
          </Text>
        </LegalSection>

        <LegalSection
          id="terms-ai-analyzer"
          title="Vilét AI and Website Analyzer"
        >
          <Text>
            Vilét AI and the Website Analyzer are optional features and may be
            unavailable. Output is generated or assembled from limited input and
            may be incomplete, inaccurate, or unsuitable for a particular
            purpose. Visitors remain responsible for independent review and for
            decisions made using any output.
          </Text>
          <Text>
            AI or Analyzer output is not legal, security, accessibility,
            financial, SEO, or other professional certification. Do not submit
            passwords, payment details, confidential client data, credentials,
            or other sensitive information.
          </Text>
        </LegalSection>

        <LegalSection id="terms-use" title="Acceptable and Prohibited Uses">
          <Text>You may not use the website or its features to:</Text>
          <ul className={legalListClasses}>
            <li>Break the law or infringe another person’s rights</li>
            <li>Submit content without authorization</li>
            <li>Probe, disrupt, overload, or bypass website security</li>
            <li>Introduce malicious code or automate abusive requests</li>
            <li>Misrepresent identity, authority, or ownership of a website</li>
            <li>Use output as a false certification or professional opinion</li>
          </ul>
        </LegalSection>

        <LegalSection id="terms-ip" title="Intellectual Property">
          <Text>
            Unless otherwise identified, the website’s original design, text,
            graphics, branding, and code are owned by or licensed for use by
            Vilét. These Terms do not grant ownership of website content or a
            license beyond ordinary viewing and use of the website.
          </Text>
        </LegalSection>

        <LegalSection
          id="terms-third-parties"
          title="Third-Party Services and Links"
        >
          <Text>
            The website may rely on or link to third-party services. Those
            services operate under their own terms and privacy practices. Vilét
            does not control every third-party service, and a link does not by
            itself constitute an endorsement.
          </Text>
        </LegalSection>

        <LegalSection id="terms-availability" title="Availability and Changes">
          <Text>
            Website content and optional features may be changed, suspended, or
            withdrawn. No uninterrupted availability or error-free operation is
            promised.
          </Text>
        </LegalSection>

        <LegalSection id="terms-disclaimers" title="Disclaimers">
          <Text>
            The informational and feature-specific limitations described above
            apply subject to rights and obligations that cannot lawfully be
            excluded.
          </Text>
        </LegalSection>

        <LegalSection id="terms-liability" title="Liability">
          <Text>
            These Terms do not establish a contractual liability cap or exclude
            a category of damages. Rights and obligations remain subject to
            applicable law and any separate written agreement.
          </Text>
        </LegalSection>

        <LegalSection id="terms-governing-law" title="Governing Law">
          <Text>
            These Terms do not select a governing jurisdiction, venue,
            arbitration requirement, or dispute-resolution procedure. Applicable
            law determines those matters unless a separate written agreement
            provides otherwise.
          </Text>
        </LegalSection>

        <LegalSection id="terms-contact" title="Contact">
          <Text>
            Questions about these Terms may be emailed to{" "}
            <a className={legalLinkClasses} href={privacyMailto}>
              {legalConfig.privacyEmail}
            </a>
            .
          </Text>
        </LegalSection>

        <LegalSection id="terms-changes" title="Changes to the Terms">
          <Text>
            These Terms may be revised as the website, services, or legal
            requirements change. The current version identifies its effective
            and last-updated dates above.
          </Text>
        </LegalSection>
      </LegalPageBody>
    </>
  );
}
