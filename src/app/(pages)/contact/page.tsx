import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { Container, Grid, Section, Stack } from "@/components/layout";
import { Card, Eyebrow, Heading, SectionHeading, Text } from "@/components/ui";
import { getPublishedServices, services } from "@/content";
import { defaultOpenGraphImages } from "@/lib/metadata";

import { submitContact } from "./actions";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Vilét to discuss websites, software, automation, and digital systems.",
  alternates: { canonical: "https://vilet.co/contact" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Contact | Vilét",
    description:
      "Get in touch with Vilét to discuss websites, software, automation, and digital systems.",
    url: "https://vilet.co/contact",
    type: "website",
    images: defaultOpenGraphImages,
  },
};

const usefulContext = [
  "The business or user problem behind the request",
  "Who will use the result and what they need to accomplish",
  "Known constraints, dependencies, or important dates",
  "Who owns decisions and feedback for the project",
  "Any existing content, systems, or research that may be relevant",
] as const;

const nextSteps = [
  {
    title: "Review the context",
    body: "The details are considered together so the problem, audience, and constraints are understood before a solution is proposed.",
  },
  {
    title: "Clarify what is unknown",
    body: "A first conversation can focus on unanswered questions, practical fit, and the information needed to choose a direction.",
  },
  {
    title: "Define a useful starting point",
    body: "If the engagement is a fit, the next recommendation should reflect the actual need rather than a predetermined package.",
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <Section background="hero" aria-labelledby="contact-heading">
        <Container>
          <Stack gap="xl" align="start">
            <Eyebrow marker>Contact</Eyebrow>
            <Heading
              id="contact-heading"
              level={1}
              variant="display-lg"
              className="max-w-5xl"
            >
              Let&apos;s talk about your project.
            </Heading>
            <Text variant="body-lg" className="max-w-(--ds-container-reading)">
              Tell Vilét about your business, your goals, and the problem
              you&apos;re trying to solve. Every conversation starts with
              understanding the challenge before recommending a solution.
            </Text>
          </Stack>
        </Container>
      </Section>

      <Section aria-labelledby="project-details-heading">
        <Container>
          <div className="laptop:grid-cols-[0.7fr_1.3fr] grid gap-(--ds-space-4xl)">
            <Stack gap="xl" align="start">
              <SectionHeading
                titleId="project-details-heading"
                eyebrow="Project details"
                title="Share the useful context."
                description="A complete brief is not required. Clear information about the problem and desired outcome is the best place to begin."
              />
              <Card variant="elevated">
                <Heading level={3} variant="heading-4">
                  Delivery status
                </Heading>
                <Text className="mt-(--ds-space-sm)">
                  The form currently validates submissions without sending or
                  storing them. Delivery will be enabled only after an approved
                  provider is connected.
                </Text>
              </Card>
            </Stack>
            <ContactForm
              action={submitContact}
              services={getPublishedServices(services)}
            />
          </div>
        </Container>
      </Section>

      <Section
        background="surface"
        divider
        aria-labelledby="expectations-heading"
      >
        <Container>
          <div className="laptop:grid-cols-[0.8fr_1.2fr] grid gap-(--ds-space-4xl)">
            <SectionHeading
              titleId="expectations-heading"
              eyebrow="Project expectations"
              title="Useful context makes the first conversation more productive."
              description="Focus on what is known today. Open questions can remain open until discovery provides better evidence."
            />
            <ul className="type-body text-text-secondary list-disc space-y-(--ds-space-md) pl-(--ds-space-xl)">
              {usefulContext.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="response-heading">
        <Container>
          <Stack gap="3xl">
            <SectionHeading
              titleId="response-heading"
              eyebrow="What happens next"
              title="A thoughtful first response."
              description="The initial review is intended to understand the request, identify unanswered questions, and decide whether a conversation is the right next step."
            />
            <Grid as="ol" columns={3}>
              {nextSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="border-divider border-t pt-(--ds-space-xl)"
                >
                  <Eyebrow variant="accent">
                    {String(index + 1).padStart(2, "0")}
                  </Eyebrow>
                  <Heading
                    level={3}
                    variant="heading-4"
                    className="mt-(--ds-space-md)"
                  >
                    {step.title}
                  </Heading>
                  <Text className="mt-(--ds-space-md)">{step.body}</Text>
                </li>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>

      <Section
        background="surface"
        divider
        spacing="compact"
        aria-labelledby="privacy-heading"
      >
        <Container width="reading">
          <Heading id="privacy-heading" level={2} variant="heading-3">
            Keep sensitive information private.
          </Heading>
          <Text className="mt-(--ds-space-md)">
            Share only project-relevant context. Never include passwords,
            credentials, private customer data, or confidential access details
            in this form.
          </Text>
        </Container>
      </Section>
    </>
  );
}
