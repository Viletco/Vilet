import type { Metadata } from "next";
import { ProcessStage } from "@/components/sections/process";
import { Container, Grid, Section, Stack } from "@/components/layout";
import {
  ButtonLink,
  Card,
  Eyebrow,
  FaqList,
  Heading,
  SectionHeading,
  Text,
  TextLink,
} from "@/components/ui";
import {
  faqs,
  getFaqsBySlugs,
  getPublishedProcess,
  processRecords,
} from "@/content";
import { defaultOpenGraphImages } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Learn how Vilét approaches discovery, planning, design, development, launch, and continued improvement.",
  alternates: { canonical: "https://vilet.co/process" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Process | Vilét",
    description:
      "Learn how Vilét approaches discovery, planning, design, development, launch, and continued improvement.",
    url: "https://vilet.co/process",
    type: "website",
    images: defaultOpenGraphImages,
  },
};

const viletResponsibilities = [
  "Lead discovery and technical planning",
  "Explain recommendations and tradeoffs",
  "Build and validate the approved solution",
  "Communicate progress and blockers",
  "Document important implementation details",
] as const;
const clientResponsibilities = [
  "Provide accurate business information",
  "Assign a clear decision-maker",
  "Supply required content and access",
  "Review work within agreed review windows",
  "Consolidate feedback",
  "Approve scope and release decisions",
] as const;
const projectVariables = [
  "Project complexity",
  "Content readiness",
  "Number of stakeholders",
  "Required integrations",
  "Existing technical constraints",
  "Approval speed",
  "Media and asset needs",
  "Security or compliance considerations",
  "Ongoing support requirements",
] as const;
const checkpoints = [
  "Alignment with the approved goals",
  "Content clarity",
  "Responsive behavior",
  "Keyboard accessibility",
  "Readable contrast",
  "Performance foundations",
  "Functional behavior",
  "Link and route validation",
  "Error and empty states",
  "Production configuration",
  "Handoff and ownership",
] as const;
const processFaqSlugs = [
  "project-timeline",
  "project-cost",
  "support-after-launch",
  "business-fit",
] as const;

export default function ProcessPage() {
  const stages = getPublishedProcess(processRecords);
  const processFaqs = getFaqsBySlugs(faqs, processFaqSlugs);
  return (
    <>
      <Section background="hero" aria-labelledby="process-page-heading">
        <Container>
          <Stack gap="xl" align="start">
            <Eyebrow marker>Process</Eyebrow>
            <Heading
              id="process-page-heading"
              level={1}
              variant="display-lg"
              className="max-w-5xl"
            >
              A clear process for thoughtful digital work.
            </Heading>
            <Text variant="body-lg" className="max-w-(--ds-container-reading)">
              Vilét uses a focused, collaborative process to clarify the
              problem, define the right solution, build with care, and prepare
              the work for long-term use.
            </Text>
            <Stack direction="responsive" gap="md">
              <ButtonLink href="/contact" size="lg">
                Start a project
              </ButtonLink>
              <ButtonLink href="/services" size="lg" variant="outline">
                Explore services
              </ButtonLink>
            </Stack>
          </Stack>
        </Container>
      </Section>
      <Section spacing="compact" aria-labelledby="process-overview-heading">
        <Container>
          <Heading id="process-overview-heading" level={2} variant="heading-3">
            Process overview
          </Heading>
          <Grid
            as="ol"
            columns={4}
            className="laptop:grid-cols-2 desktop:grid-cols-4 mt-(--ds-space-2xl)"
          >
            {stages.map((stage) => (
              <li
                key={stage.id}
                className="border-divider border-t pt-(--ds-space-lg)"
              >
                <Eyebrow variant="accent" className="flex">
                  {String(stage.order).padStart(2, "0")}
                </Eyebrow>
                <TextLink
                  href={`#${stage.slug}`}
                  variant="navigation"
                  className="type-heading-4 mt-(--ds-space-md) inline-block"
                >
                  {stage.title}
                </TextLink>
                <Text variant="body-sm" className="mt-(--ds-space-md)">
                  {stage.summary}
                </Text>
              </li>
            ))}
          </Grid>
        </Container>
      </Section>
      {stages.map((stage, index) => (
        <ProcessStage key={stage.id} stage={stage} surface={index % 2 === 1} />
      ))}
      <Section aria-labelledby="collaboration-heading">
        <Container>
          <Stack gap="4xl">
            <SectionHeading
              titleId="collaboration-heading"
              eyebrow="Collaboration"
              title="Clear collaboration keeps the work moving."
              description="Vilét provides the strategy, design, development, and technical guidance. The client provides business knowledge, timely decisions, accurate content, and access to the people or systems required for the project."
            />
            <Grid columns={2}>
              <div className="border-divider border-t pt-(--ds-space-xl)">
                <Heading level={3} variant="heading-3">
                  Vilét
                </Heading>
                <ul className="type-body text-text-secondary mt-(--ds-space-lg) list-disc space-y-(--ds-space-sm) pl-(--ds-space-xl)">
                  {viletResponsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="border-divider border-t pt-(--ds-space-xl)">
                <Heading level={3} variant="heading-3">
                  Client
                </Heading>
                <ul className="type-body text-text-secondary mt-(--ds-space-lg) list-disc space-y-(--ds-space-sm) pl-(--ds-space-xl)">
                  {clientResponsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </Grid>
          </Stack>
        </Container>
      </Section>
      <Section background="surface" divider aria-labelledby="variables-heading">
        <Container>
          <div className="laptop:grid-cols-[0.9fr_1.1fr] grid gap-(--ds-space-4xl)">
            <SectionHeading
              titleId="variables-heading"
              eyebrow="Project variables"
              title="The structure stays clear. The details adapt."
              description="The same core stages apply across engagements, but the depth of discovery, number of review cycles, technical requirements, and launch preparation depend on the project."
            />
            <Stack gap="xl">
              <ul className="type-body text-text-secondary tablet:grid-cols-2 grid list-disc gap-(--ds-space-md) pl-(--ds-space-xl)">
                {projectVariables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Card variant="elevated">
                <Text>
                  These variables are why a responsible timeline is defined
                  after the work is understood rather than published as a fixed
                  promise.
                </Text>
              </Card>
            </Stack>
          </div>
        </Container>
      </Section>
      <Section aria-labelledby="checkpoints-heading">
        <Container>
          <Stack gap="3xl">
            <SectionHeading
              titleId="checkpoints-heading"
              eyebrow="Quality checkpoints"
              title="Review continues throughout delivery."
              description="The work is checked against the approved direction as it moves from planning toward production."
            />
            <Grid as="ol" columns={3}>
              {checkpoints.map((item, index) => (
                <li
                  key={item}
                  className="border-divider border-t pt-(--ds-space-lg)"
                >
                  <Eyebrow variant="accent">
                    {String(index + 1).padStart(2, "0")}
                  </Eyebrow>
                  <Heading
                    level={3}
                    variant="heading-4"
                    className="mt-(--ds-space-md)"
                  >
                    {item}
                  </Heading>
                </li>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>
      <Section
        background="surface"
        divider
        aria-labelledby="process-faq-heading"
      >
        <Container width="reading">
          <Stack gap="3xl">
            <SectionHeading
              titleId="process-faq-heading"
              eyebrow="Process questions"
              title="Practical context before the work begins."
            />
            <FaqList items={processFaqs} />
          </Stack>
        </Container>
      </Section>
      <Section
        spacing="compact"
        className="pb-(--ds-section-space)"
        aria-labelledby="process-cta-heading"
      >
        <Container>
          <Card variant="highlight" padding="lg">
            <Stack gap="xl" align="center" className="text-center">
              <Eyebrow variant="accent">Next step</Eyebrow>
              <Heading
                id="process-cta-heading"
                level={2}
                variant="heading-1"
                align="center"
              >
                Start with the problem, not the solution.
              </Heading>
              <Text
                variant="body-lg"
                className="max-w-(--ds-container-reading) text-center"
              >
                Share what you are trying to improve, what is currently getting
                in the way, and what a successful outcome would look like.
              </Text>
              <Stack direction="responsive" gap="md">
                <ButtonLink href="/contact" size="lg">
                  Start your project
                </ButtonLink>
                <ButtonLink href="/services" size="lg" variant="outline">
                  Explore services
                </ButtonLink>
              </Stack>
            </Stack>
          </Card>
        </Container>
      </Section>
    </>
  );
}
