import type { Metadata } from "next";

import { Container, Section, Stack } from "@/components/layout";
import { Eyebrow, Heading, Text } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "A starter notice describing current Vilét website data handling.",
  alternates: { canonical: "https://vilet.co/privacy" },
  robots: { index: false, follow: false, nocache: true },
};

const sections = [
  {
    title: "Information submitted through the contact form",
    body: "The form asks for contact details and project context so an inquiry can be understood. Do not submit passwords, credentials, private customer data, or unrelated sensitive information.",
  },
  {
    title: "Current delivery behavior",
    body: "Message delivery is currently disabled. The form validates entries and applies abuse controls, but it does not currently send or retain inquiry content. If delivery is activated, the approved email provider will process the information needed to deliver the inquiry.",
  },
  {
    title: "Abuse prevention",
    body: "The form uses a honeypot, a minimum completion time, short-lived duplicate checks, and rate limiting. Connection information and normalized submission data are converted to one-way hashes for these controls; full inquiry content is not stored by the rate limiter.",
  },
  {
    title: "Analytics, cookies, and advertising",
    body: "The website currently has no analytics, advertising pixels, third-party embeds, or advertising-cookie system. A cookie banner has therefore not been added. This notice must be reviewed if that implementation changes.",
  },
  {
    title: "Retention and service providers",
    body: "When contact delivery is enabled, inquiry content may be retained by the selected delivery provider and receiving mailbox according to their configured behavior. No specific retention period is promised in this starter notice.",
  },
  {
    title: "Vilét AI",
    body: "Vilét AI and website analysis are currently disabled. When explicitly activated, current-tab messages may be sent to the approved AI provider to generate guidance, but transcripts are not stored by this website by default. A project summary is placed in session storage only when a visitor explicitly chooses to transfer it to Contact, and it is removed when read. Website analysis would temporarily retrieve limited public HTML after authorization confirmation and would not retain the fetched page. Provider processing and retention require separate owner and legal review before activation.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <Section background="hero" aria-labelledby="privacy-page-heading">
        <Container width="reading">
          <Stack gap="xl" align="start">
            <Eyebrow marker>Privacy</Eyebrow>
            <Heading id="privacy-page-heading" level={1} variant="heading-1">
              How this website currently handles information.
            </Heading>
            <Text variant="body-lg">
              This starter notice describes the website as currently built. It
              remains subject to owner and legal review before launch.
            </Text>
          </Stack>
        </Container>
      </Section>
      <Section>
        <Container width="reading">
          <Stack gap="3xl">
            {sections.map((section) => (
              <section
                key={section.title}
                aria-labelledby={`privacy-${section.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              >
                <Heading
                  id={`privacy-${section.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  level={2}
                  variant="heading-3"
                >
                  {section.title}
                </Heading>
                <Text className="mt-(--ds-space-md)">{section.body}</Text>
              </section>
            ))}
          </Stack>
        </Container>
      </Section>
    </>
  );
}
