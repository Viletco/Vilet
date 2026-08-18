import type { Metadata } from "next";
import { Container, Grid, Section, Stack } from "@/components/layout";
import {
  Badge,
  ButtonLink,
  Card,
  Eyebrow,
  Heading,
  SectionHeading,
  Text,
} from "@/components/ui";
import { partnerProgram } from "@/content";
import { defaultOpenGraphImages } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Studio Partners",
  description:
    "Learn about the Vilét Studio Partner Program being developed for qualified business referrals.",
  alternates: { canonical: "https://vilet.co/partners" },
  openGraph: {
    title: "Partner with Vilét Studio",
    description:
      "A partner program in development for people who introduce businesses that need better digital systems.",
    url: "https://vilet.co/partners",
    type: "website",
    images: defaultOpenGraphImages,
  },
};

export default function PartnersPage() {
  return (
    <>
      <Section background="hero" aria-labelledby="partners-heading">
        <Container>
          <Stack gap="xl" align="start">
            <Badge variant="accent" dot>
              {partnerProgram.statusLabel}
            </Badge>
            <Eyebrow marker>Vilét Studio Partners</Eyebrow>
            <Heading
              id="partners-heading"
              level={1}
              variant="display-lg"
              className="max-w-5xl"
            >
              Create valuable introductions. Build opportunities together.
            </Heading>
            <Text variant="body-lg" className="max-w-(--ds-container-reading)">
              {partnerProgram.description}
            </Text>
          </Stack>
        </Container>
      </Section>
      <Section aria-labelledby="partner-process-heading">
        <Container>
          <Stack gap="3xl">
            <SectionHeading
              titleId="partner-process-heading"
              eyebrow="How it is intended to work"
              title="A clear path from introduction to delivery."
              description="The operating details and eligibility terms are still being finalized. No referral is accepted until Vilét confirms the arrangement directly."
            />
            <Grid as="ol" columns={3}>
              {partnerProgram.steps.map((step, index) => (
                <Card as="li" key={step.title} variant="elevated">
                  <Eyebrow variant="accent">
                    {String(index + 1).padStart(2, "0")}
                  </Eyebrow>
                  <Heading
                    level={3}
                    variant="heading-3"
                    className="mt-(--ds-space-md)"
                  >
                    {step.title}
                  </Heading>
                  <Text className="mt-(--ds-space-md)">{step.body}</Text>
                </Card>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>
      <Section
        background="surface"
        divider
        aria-labelledby="partner-fit-heading"
      >
        <Container>
          <div className="laptop:grid-cols-[0.8fr_1.2fr] grid gap-(--ds-space-4xl)">
            <SectionHeading
              titleId="partner-fit-heading"
              eyebrow="Who it is for"
              title="People who understand a business and can recognize a real need."
            />
            <ul className="type-body text-text-secondary list-disc space-y-(--ds-space-md) pl-(--ds-space-xl)">
              {partnerProgram.audiences.map((audience) => (
                <li key={audience}>{audience}</li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
      <Section aria-labelledby="partner-platform-heading">
        <Container>
          <div className="laptop:grid-cols-[0.8fr_1.2fr] grid gap-(--ds-space-4xl)">
            <SectionHeading
              titleId="partner-platform-heading"
              eyebrow="Future infrastructure"
              title="A dedicated partner platform is part of the direction."
              description="The following capabilities are planned concepts, not live functionality."
            />
            <Grid columns={2}>
              {partnerProgram.futurePlatform.map((item) => (
                <Card key={item}>
                  <Heading level={3} variant="heading-4">
                    {item}
                  </Heading>
                </Card>
              ))}
            </Grid>
          </div>
        </Container>
      </Section>
      <Section
        spacing="compact"
        className="pb-(--ds-section-space)"
        aria-labelledby="partners-cta-heading"
      >
        <Container>
          <Card variant="highlight" padding="lg">
            <Stack gap="xl" align="center" className="text-center">
              <Heading
                id="partners-cta-heading"
                level={2}
                variant="heading-1"
                align="center"
              >
                Interested in partnering with Vilét?
              </Heading>
              <Text className="max-w-(--ds-container-reading) text-center">
                Start with a direct conversation. Vilét will confirm fit,
                eligibility, and terms before accepting referrals.
              </Text>
              <ButtonLink href="/contact">Discuss a partnership</ButtonLink>
            </Stack>
          </Card>
        </Container>
      </Section>
    </>
  );
}
