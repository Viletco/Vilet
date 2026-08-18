import { Container, Grid, Section, Stack } from "@/components/layout";
import {
  ButtonLink,
  Card,
  Eyebrow,
  Heading,
  SectionHeading,
  Text,
} from "@/components/ui";
import { companyDivisions, partnerProgram } from "@/content/company";

import { DivisionCard } from "./division-card";

export function CompanyArchitectureSection() {
  return (
    <Section background="surface" divider aria-labelledby="company-heading">
      <Container>
        <Stack gap="3xl">
          <SectionHeading
            titleId="company-heading"
            eyebrow="What Vilét builds"
            title="One company. Services today, products for what comes next."
            description="Vilét is a technology company building useful digital systems. Studio is available for client work now; Insights is the first product direction being developed for the future."
          />
          <Grid columns={2}>
            {companyDivisions.map((division) => (
              <DivisionCard key={division.id} division={division} />
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}

export function PartnerPreviewSection() {
  return (
    <Section aria-labelledby="partner-preview-heading">
      <Container>
        <Card variant="highlight" padding="lg">
          <div className="laptop:grid-cols-[0.8fr_1.2fr] grid gap-(--ds-space-3xl)">
            <Stack gap="lg" align="start">
              <Eyebrow variant="accent">Partner ecosystem</Eyebrow>
              <Heading
                id="partner-preview-heading"
                level={2}
                variant="heading-1"
              >
                Create opportunities together.
              </Heading>
            </Stack>
            <Stack gap="xl" align="start">
              <Text variant="body-lg">{partnerProgram.description}</Text>
              <Text>
                The program is not yet a self-service platform. Participation,
                eligibility, and terms are confirmed directly before any
                referral.
              </Text>
              <ButtonLink href="/partners" variant="outline">
                Explore the partner program
              </ButtonLink>
            </Stack>
          </div>
        </Card>
      </Container>
    </Section>
  );
}

export function VisionSection() {
  return (
    <Section spacing="compact" aria-labelledby="vision-heading">
      <Container width="reading">
        <Stack gap="xl" align="start">
          <Eyebrow variant="accent">Long-term direction</Eyebrow>
          <Heading id="vision-heading" level={2} variant="heading-1">
            Build systems that create room for others to grow.
          </Heading>
          <Text variant="body-lg">
            Vilét is being built to create useful technology, stronger
            businesses, and practical ways for talented people and partners to
            participate in that progress. The ambition is long-term; the work
            remains grounded in what can be delivered well today.
          </Text>
        </Stack>
      </Container>
    </Section>
  );
}
