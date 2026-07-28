import type { Metadata } from "next";
import Link from "next/link";

import { Container, Section, Stack } from "@/components/layout";
import { Eyebrow, Heading, Text } from "@/components/ui";
import { getAiConfig } from "@/lib/ai/config";
import { getContactConfig } from "@/lib/contact/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Vilét handles information submitted through this website.",
  alternates: { canonical: "https://vilet.co/privacy" },
  robots: { index: false, follow: false, nocache: true },
};

const POLICY_DATE = "July 28, 2026";
const listClasses =
  "type-body text-text-secondary list-disc space-y-(--ds-space-sm) pl-(--ds-space-xl)";
const linkClasses =
  "text-accent underline decoration-current underline-offset-4 hover:text-text-primary";

function PolicySection({
  id,
  title,
  children,
}: Readonly<{
  id: string;
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <section aria-labelledby={id}>
      <Heading id={id} level={2} variant="heading-3">
        {title}
      </Heading>
      <Stack gap="md" className="mt-(--ds-space-md)">
        {children}
      </Stack>
    </section>
  );
}

export default function PrivacyPage() {
  const contactConfig = getContactConfig();
  const aiConfig = getAiConfig();
  const deliveryEnabled = contactConfig.delivery.mode === "resend";
  const aiEnabled = aiConfig.mode === "provider";
  const analyzerEnabled = aiConfig.analyzerMode === "enabled";

  return (
    <>
      <Section background="hero" aria-labelledby="privacy-page-heading">
        <Container width="reading">
          <Stack gap="xl" align="start">
            <Eyebrow marker>Privacy</Eyebrow>
            <Heading id="privacy-page-heading" level={1} variant="heading-1">
              Privacy Policy
            </Heading>
            <Text variant="body-lg">
              This Privacy Policy explains how Vilét collects, uses, processes,
              and protects information submitted through this website. Vilét
              operates this website and is referred to below as “Vilét,” “we,”
              “us,” or “our.”
            </Text>
            <Text variant="body-sm">
              <strong className="text-text-primary">Effective date:</strong>{" "}
              {POLICY_DATE}
              <br />
              <strong className="text-text-primary">Last updated:</strong>{" "}
              {POLICY_DATE}
            </Text>
          </Stack>
        </Container>
      </Section>

      <Section>
        <Container width="reading">
          <Stack gap="3xl">
            <PolicySection
              id="privacy-information"
              title="Information We Collect"
            >
              <Text>
                When you use the Contact form, we collect the information you
                provide. Depending on your choices, that may include:
              </Text>
              <ul className={listClasses}>
                <li>Your name, company or organization, and email address</li>
                <li>An optional website address</li>
                <li>The service you are interested in</li>
                <li>Your project description and business goals</li>
                <li>Optional budget-range and timeline preferences</li>
                <li>
                  Your preferred contact method: email or a video call arranged
                  by email
                </li>
              </ul>
              <Text>
                We may also process limited technical and submission-derived
                identifiers to detect spam, excessive requests, automated
                activity, or duplicate submissions.
              </Text>
            </PolicySection>

            <PolicySection id="privacy-use" title="How We Use Information">
              <Text>We use submitted information to:</Text>
              <ul className={listClasses}>
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
                Contact-form information for targeted advertising.
              </Text>
            </PolicySection>

            <PolicySection
              id="privacy-contact-delivery"
              title="Contact Form and Email Delivery"
            >
              {deliveryEnabled ? (
                <>
                  <Text>
                    Contact-form entries are validated and checked by abuse
                    controls before being sent through our configured email
                    provider to the approved receiving mailbox.
                  </Text>
                  <Text>
                    The email provider and receiving mailbox may retain the
                    inquiry according to their settings and privacy practices.
                    Replies may use the email address you submitted as the
                    Reply-To address.
                  </Text>
                </>
              ) : (
                <>
                  <Text>
                    Contact-form delivery is currently disabled. Entries are
                    validated and abuse controls may run, but the website does
                    not send the inquiry or claim that it was delivered.
                  </Text>
                  <Text>
                    Inquiry content is not retained by Vilét’s email-delivery
                    system while delivery is disabled.
                  </Text>
                </>
              )}
            </PolicySection>

            <PolicySection
              id="privacy-communication"
              title="Communication Preferences"
            >
              <Text>
                Email is Vilét’s default communication method. You may choose
                email or a video call arranged by email as your preference. The
                Contact form does not currently request a phone number.
              </Text>
              <Text>
                Contact details are used to respond to and manage the inquiry.
                Vilét does not currently use inquiry information to enroll
                visitors in a mailing list or for advertising.
              </Text>
            </PolicySection>

            <PolicySection
              id="privacy-abuse-prevention"
              title="Spam and Abuse Prevention"
            >
              <Text>
                Vilét uses validation, a hidden honeypot field, minimum
                completion-time checks, duplicate-request detection, and rate
                limiting to protect the website from spam and abuse. Limited
                connection-derived and submission-derived identifiers may be
                processed using one-way hashing. The abuse-prevention system
                does not retain the full inquiry content.
              </Text>
            </PolicySection>

            <PolicySection
              id="privacy-storage"
              title="Cookies, Browser Storage, Analytics, and Advertising"
            >
              <Text>
                No analytics or advertising pixels are currently enabled, and
                the public website does not currently use a targeted-advertising
                cookie system. A cookie banner is therefore not currently
                displayed.
              </Text>
              <Text>
                A preliminary project summary may be placed in your browser’s
                session storage only after you explicitly transfer it from Vilét
                AI to Contact. The Contact page removes that summary from
                session storage after reading it. It is not used for advertising
                or cross-site tracking.
              </Text>
            </PolicySection>

            <PolicySection id="privacy-ai" title="Vilét AI">
              {aiEnabled ? (
                <>
                  <Text>
                    Vilét AI is enabled in this environment. Messages from the
                    current browser tab may be sent to the configured AI
                    provider to generate guidance about Vilét’s services,
                    project scoping, or business technology.
                  </Text>
                  <Text>
                    Vilét does not persist complete chat transcripts by default,
                    and current-page conversation state is temporary. Provider
                    processing and retention may also be governed by the
                    provider’s own privacy practices.
                  </Text>
                </>
              ) : (
                <Text>
                  Vilét AI is currently disabled in this environment and does
                  not send messages to an AI provider.
                </Text>
              )}
              <Text>
                Do not submit passwords, payment details, health information,
                credentials, confidential client data, or other sensitive
                information. Vilét AI does not provide legal, financial,
                medical, or other formal professional advice.
              </Text>
            </PolicySection>

            <PolicySection id="privacy-analyzer" title="Website Analyzer">
              {analyzerEnabled ? (
                <>
                  <Text>
                    The Website Analyzer is enabled in this environment. Before
                    use, a visitor must confirm ownership of or authorization to
                    analyze the submitted website. The Analyzer may temporarily
                    retrieve limited publicly available HTML for the requested
                    analysis.
                  </Text>
                  <Text>
                    It does not log into private pages, request passwords, or
                    intentionally access internal networks. Vilét does not
                    retain the fetched page after processing by default.
                  </Text>
                </>
              ) : (
                <Text>
                  The Website Analyzer is currently disabled in this environment
                  and does not retrieve submitted websites.
                </Text>
              )}
              <Text>
                Any Analyzer output is informational and is not a complete
                security, legal, SEO, or accessibility certification.
              </Text>
            </PolicySection>

            <PolicySection id="privacy-providers" title="Service Providers">
              <Text>
                Vilét may use service providers for website hosting, email
                delivery, rate limiting and abuse prevention, AI processing, and
                domain or infrastructure services. A provider is involved only
                when its relevant service is configured and active.
              </Text>
              <Text>
                These providers may process information as needed to provide the
                relevant service, subject to their own terms and privacy
                practices.
              </Text>
            </PolicySection>

            <PolicySection id="privacy-retention" title="Data Retention">
              <Text>
                Vilét retains personal information only for as long as
                reasonably necessary for the purpose for which it was collected,
                to maintain appropriate business records, resolve disputes,
                enforce agreements, or satisfy applicable legal requirements.
                Retention may vary by information type, service provider, and
                whether a project relationship is established.
              </Text>
              <Text>
                Abuse-prevention identifiers are short-lived. Current-page AI
                conversation state is not persistently stored by Vilét, and
                Contact handoff data in session storage is removed after being
                read. Email-delivered inquiries may remain with the delivery
                provider or receiving mailbox according to their settings.
              </Text>
            </PolicySection>

            <PolicySection
              id="privacy-choices"
              title="Your Choices and Privacy Requests"
            >
              <Text>
                Depending on where you live, you may have certain rights
                regarding personal information. You may ask whether Vilét
                retains information about you, request correction of inaccurate
                information, or request deletion where applicable. Requests will
                be reviewed and handled as required by applicable law.
              </Text>
            </PolicySection>

            <PolicySection id="privacy-security" title="Security">
              <Text>
                Vilét uses reasonable administrative and technical safeguards
                designed to protect information, including server-side
                validation, abuse prevention, secret separation, data
                minimization, and HTTPS hosting. However, no method of
                transmission over the internet or electronic storage can be
                guaranteed to be completely secure.
              </Text>
            </PolicySection>

            <PolicySection id="privacy-children" title="Children’s Privacy">
              <Text>
                This website and Vilét’s services are intended for businesses
                and adults and are not directed to children under 13. Vilét does
                not knowingly collect personal information from children under
                13. If you believe a child has submitted personal information,
                contact Vilét so the situation can be reviewed and the
                information deleted where appropriate.
              </Text>
            </PolicySection>

            <PolicySection id="privacy-changes" title="Changes to This Policy">
              <Text>
                Vilét may update this Privacy Policy when its website, services,
                providers, or information practices change. The revised policy
                will display an updated effective date.
              </Text>
            </PolicySection>

            <PolicySection
              id="privacy-contact"
              title="Contact Vilét About Privacy"
            >
              <Text>
                To contact Vilét about this policy or a privacy request, use the{" "}
                <Link className={linkClasses} href="/contact">
                  Contact page
                </Link>
                . The form will clearly state whether your message was
                delivered. Do not include passwords, credentials, or unrelated
                sensitive information.
              </Text>
            </PolicySection>
          </Stack>
        </Container>
      </Section>
    </>
  );
}
