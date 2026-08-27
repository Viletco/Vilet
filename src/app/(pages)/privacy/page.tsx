import type { Metadata } from "next";
import Link from "next/link";

import {
  LegalPageBody,
  LegalPageHeader,
  LegalSection,
  legalLinkClasses,
  legalListClasses,
} from "@/components/legal/legal-page";
import { Text } from "@/components/ui";
import { legalConfig, privacyMailto } from "@/config/legal";
import { getAiConfig } from "@/lib/ai/config";
import { getContactConfig } from "@/lib/contact/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Vilét handles information submitted through this website.",
  alternates: { canonical: "https://vilet.co/privacy" },
  robots: { index: false, follow: false, nocache: true },
};

export default function PrivacyPage() {
  const contactConfig = getContactConfig();
  const aiConfig = getAiConfig();
  const deliveryEnabled = contactConfig.delivery.mode === "resend";
  const aiEnabled = aiConfig.mode === "provider";
  const analyzerEnabled = aiConfig.analyzerMode === "enabled";

  return (
    <>
      <LegalPageHeader
        eyebrow="Privacy"
        title="Privacy Policy"
        description={`This Privacy Policy explains how Vilét collects, uses, processes, and protects information submitted through this website. ${legalConfig.operatorDescription} operates this website and is referred to below as “Vilét,” “we,” “us,” or “our.”`}
      >
        <Text variant="body-sm">
          <strong className="text-text-primary">Effective date:</strong>{" "}
          {legalConfig.privacyPolicy.effectiveDate}
          <br />
          <strong className="text-text-primary">Last updated:</strong>{" "}
          {legalConfig.privacyPolicy.lastUpdated}
        </Text>
      </LegalPageHeader>

      <LegalPageBody>
        <LegalSection id="privacy-information" title="Information We Collect">
          <Text>
            When the Contact form is enabled and you submit it, Vilét collects
            the information you provide. Depending on your choices, that may
            include:
          </Text>
          <ul className={legalListClasses}>
            <li>Your name, company or organization, and email address</li>
            <li>An optional website address</li>
            <li>The service you are interested in</li>
            <li>Your project description and business goals</li>
            <li>Optional budget-range and timeline preferences</li>
            <li>
              Your preferred contact method: email or a video call arranged by
              email
            </li>
          </ul>
          <Text>
            Vilét and its hosting or infrastructure providers may also process
            limited technical information needed to operate and secure the
            website. This may include an IP address or connection-derived
            information, request timestamps, browser or device information,
            requested pages or routes, server and security logs, and identifiers
            used for rate limiting, spam prevention, or duplicate detection.
            This operational processing is separate from analytics, advertising,
            and cross-site tracking.
          </Text>
        </LegalSection>

        <LegalSection id="privacy-use" title="How We Use Information">
          <Text>Vilét may use submitted information to:</Text>
          <ul className={legalListClasses}>
            <li>Review, understand, and respond to inquiries</li>
            <li>Ask follow-up questions and evaluate requested services</li>
            <li>Prepare preliminary project summaries</li>
            <li>Manage written project communication</li>
            <li>Detect spam, abuse, automated requests, and duplicates</li>
            <li>Maintain the security and reliability of the website</li>
            <li>Comply with applicable legal obligations when required</li>
          </ul>
          <Text>
            Vilét does not currently sell personal information or use
            Contact-form information for targeted advertising, mailing-list
            enrollment, or advertising automation.
          </Text>
        </LegalSection>

        <LegalSection
          id="privacy-contact-delivery"
          title="Contact Form and Email Delivery"
        >
          <Text>
            Contact-form information is collected and delivered only when the
            form is enabled. The form validates entries, applies abuse controls,
            and clearly indicates whether delivery is available and whether a
            submission succeeded.
          </Text>
          {deliveryEnabled ? (
            <Text>
              The form is enabled. Submitted information is sent through Resend
              to the configured receiving mailbox. Resend, the receiving
              mailbox, backups, and related business records may retain the
              inquiry according to applicable settings and business needs.
              Replies may use the submitted email address as the Reply-To
              address.
            </Text>
          ) : (
            <Text>
              The form is not enabled at this time. Validation and abuse
              controls may run, but the website does not send the inquiry or
              claim that it was delivered.
            </Text>
          )}
        </LegalSection>

        <LegalSection
          id="privacy-communication"
          title="Communication Preferences"
        >
          <Text>
            Email is Vilét’s default communication method. The Contact form,
            when enabled, allows you to choose email or a video call arranged by
            email. It does not request a phone number. Contact details are used
            to respond to and manage the inquiry, not to enroll visitors in SMS
            marketing, a mailing list, or advertising.
          </Text>
        </LegalSection>

        <LegalSection
          id="privacy-abuse-prevention"
          title="Spam and Abuse Prevention"
        >
          <Text>
            Vilét uses server-side validation, a hidden honeypot field, minimum
            completion-time checks, duplicate-request detection, and rate
            limiting to protect the website. Limited connection-derived and
            submission-derived identifiers are processed using salted one-way
            hashing. The abuse-prevention system does not store full inquiry
            content.
          </Text>
        </LegalSection>

        <LegalSection
          id="privacy-storage"
          title="Cookies, Browser Storage, Analytics, and Advertising"
        >
          <Text>
            Vilét may offer optional, consent-gated Google Analytics measurement
            to understand aggregate traffic, page performance, and key events.
            Analytics does not load unless you select “Allow analytics.” Vilét
            disables advertising personalization and Google signals in this
            configuration. Declining is remembered in this browser and does not
            limit access to the website.
          </Text>
          <Text>
            The analytics preference is stored locally in your browser. You can
            clear the preference through your browser’s site-data controls.
            Ordinary hosting and security logs are not used for cross-site
            advertising tracking.
          </Text>
          <Text>
            A preliminary project summary is placed in browser session storage
            only when you explicitly transfer it from Vilét AI to Contact. The
            Contact page removes it after reading it. If it is never transferred
            to Contact, the browser ordinarily removes session-storage data when
            that tab session ends. This data is not used for advertising or
            cross-site tracking.
          </Text>
        </LegalSection>

        <LegalSection id="privacy-ai" title="Vilét AI">
          <Text>
            Vilét AI processes user input only when the feature is enabled and
            an AI provider is configured. When active, messages from the current
            browser tab may be sent to that provider to generate guidance about
            Vilét’s services, project scoping, or business technology.
          </Text>
          <Text>
            Vilét does not add complete chat transcripts to a persistent
            application database by default. Current-page conversation state is
            temporary, but an active AI provider may process and retain input
            according to its own agreements and privacy practices.
          </Text>
          {!aiEnabled && (
            <Text>
              Vilét AI is not active, so this website does not send AI messages
              to a provider.
            </Text>
          )}
          <Text>
            Do not submit passwords, payment details, health information,
            credentials, confidential client data, or other sensitive
            information. Vilét AI does not provide legal, financial, medical, or
            other formal professional advice.
          </Text>
        </LegalSection>

        <LegalSection id="privacy-analyzer" title="Website Analyzer">
          <Text>
            The Website Analyzer processes a submitted URL only when the feature
            is enabled. Before use, a visitor must confirm ownership of or
            authorization to analyze the website. When active, the Analyzer may
            temporarily retrieve limited publicly available HTML for the
            requested analysis.
          </Text>
          <Text>
            It does not log into private pages, request passwords, or
            intentionally access internal networks. Retrieved HTML is held only
            in application memory for the request and is not written to an
            application database by default.
          </Text>
          {!analyzerEnabled && (
            <Text>
              The Website Analyzer is not active, so this website does not
              retrieve submitted websites.
            </Text>
          )}
          <Text>
            Analyzer output is informational and is not a complete security,
            legal, SEO, or accessibility certification.
          </Text>
        </LegalSection>

        <LegalSection id="privacy-providers" title="Service Providers">
          <Text>
            Vilét uses Vercel for website hosting and infrastructure. Depending
            on which services are configured and active, Vilét may also use
            Resend for contact-form email delivery, Upstash for rate limiting
            and abuse prevention, an approved AI provider for Vilét AI, and
            domain or infrastructure providers. Website Analyzer retrieval and
            any related AI processing use only the providers configured for
            those functions.
          </Text>
          <Text>
            These providers may process information as needed to deliver their
            configured services and according to applicable agreements and their
            own privacy practices. A provider does not receive feature-specific
            information from a feature that is disabled.
          </Text>
        </LegalSection>

        <LegalSection id="privacy-retention" title="Data Retention">
          <Text>
            Contact rate-limit identifiers expire after 15 minutes, and
            duplicate-submission identifiers expire after 5 minutes. These
            controls store hashed identifiers and counters rather than full
            inquiry content.
          </Text>
          <Text>
            AI conversation state remains in the current page and is not added
            to a persistent Vilét transcript database by default. Session
            handoff data is removed after the Contact page reads it and
            otherwise ordinarily lasts only for the browser-tab session.
            Analyzer HTML is processed in memory for the request and is not
            persistently stored by the application by default. Active providers
            may have their own retention practices.
          </Text>
          <Text>
            Email-delivered inquiries may remain with Resend, the receiving
            mailbox, backups, or Vilét’s business records according to
            applicable settings and business needs. Other information may be
            retained as reasonably necessary for an established client
            relationship, legal obligations, disputes, security, or enforcement
            of agreements. No universal fixed retention period is promised.
          </Text>
        </LegalSection>

        <LegalSection
          id="privacy-choices"
          title="Your Choices and Privacy Requests"
        >
          <Text>
            Depending on where you live, you may have certain rights regarding
            personal information. You may ask whether Vilét retains information
            about you, request correction of inaccurate information, or request
            deletion where applicable. Requests will be reviewed and handled as
            required by applicable law.
          </Text>
        </LegalSection>

        <LegalSection id="privacy-security" title="Security">
          <Text>
            Vilét uses safeguards supported by this website’s implementation,
            including server-side validation, rate limiting, honeypot and timing
            checks, duplicate detection, salted one-way hashing, secret
            separation, HTTPS hosting, data minimization, and deletion of
            session handoff data after it is read. No method of internet
            transmission or electronic storage can be guaranteed to be
            completely secure.
          </Text>
        </LegalSection>

        <LegalSection id="privacy-children" title="Children’s Privacy">
          <Text>
            This website and Vilét’s services are intended for businesses and
            adults and are not intended for use by anyone under 18. Vilét does
            not knowingly collect personal information from children. A parent
            or guardian who believes a child submitted information may contact
            Vilét to request review and deletion where appropriate.
          </Text>
        </LegalSection>

        <LegalSection id="privacy-changes" title="Changes to This Policy">
          <Text>
            Vilét may update this Privacy Policy when its website, services,
            providers, or information practices change. The policy will display
            an updated “Last updated” date when substantive public wording
            changes.
          </Text>
        </LegalSection>

        <LegalSection id="privacy-contact" title="Contact Vilét About Privacy">
          <Text>
            Email privacy requests to{" "}
            <a className={legalLinkClasses} href={privacyMailto}>
              {legalConfig.privacyEmail}
            </a>
            . Do not include passwords, credentials, or unrelated sensitive
            information. The availability of this mailbox or forwarding address
            must be verified before public launch.
          </Text>
          {deliveryEnabled && (
            <Text>
              You may also use the{" "}
              <Link className={legalLinkClasses} href="/contact">
                Contact page
              </Link>
              . The form will clearly indicate whether your message was
              delivered.
            </Text>
          )}
        </LegalSection>
      </LegalPageBody>
    </>
  );
}
