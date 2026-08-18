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
import { companyDivisions } from "@/content";
import { ProductDemo } from "@/components/sections/product-demo";
import { defaultOpenGraphImages } from "@/lib/metadata";

const insights = companyDivisions.find((item) => item.slug === "insights")!;
const questions = [
  "What changed?",
  "Why does it matter?",
  "What is driving the result?",
  "Where is the business losing momentum?",
  "What deserves attention next?",
] as const;
const areas = [
  "Revenue",
  "Sales",
  "Marketing",
  "SEO",
  "Website",
  "Customers",
  "Operations",
] as const;
const plannedSources = [
  "Analytics and search platforms",
  "Commerce and payment systems",
  "CRM and sales tools",
  "Advertising and marketing platforms",
  "Website performance and uptime services",
] as const;

export const metadata: Metadata = {
  title: "Vilét Insights",
  description:
    "Explore the vision for Vilét Insights, a business intelligence product in development to turn scattered data into clear explanations and next actions.",
  alternates: { canonical: "https://vilet.co/insights" },
  openGraph: {
    title: "Vilét Insights | In development",
    description:
      "A future business intelligence product designed to explain what changed, why it matters, and what to do next.",
    url: "https://vilet.co/insights",
    type: "website",
    images: defaultOpenGraphImages,
  },
};

export default function InsightsPage() {
  return (
    <>
      <Section background="hero" aria-labelledby="insights-heading">
        <Container>
          <div className="laptop:grid-cols-[1.08fr_0.92fr] grid items-center gap-(--ds-space-4xl)">
            <Stack gap="xl" align="start">
              <Badge variant="accent" dot>
                {insights.statusLabel}
              </Badge>
              <Eyebrow>Vilét Insights</Eyebrow>
              <Heading id="insights-heading" level={1} variant="display-lg">
                A clearer way to understand what is happening across your
                business.
              </Heading>
              <Text
                variant="body-lg"
                className="max-w-(--ds-container-reading)"
              >
                Vilét Insights is being developed to connect scattered business
                data, explain meaningful changes, and surface practical next
                actions.
              </Text>
            </Stack>
            <ProductDemo variant="insights" />
          </div>
        </Container>
      </Section>
      <Section aria-labelledby="insights-problem-heading">
        <Container>
          <div className="laptop:grid-cols-[0.8fr_1.2fr] grid gap-(--ds-space-4xl)">
            <SectionHeading
              titleId="insights-problem-heading"
              eyebrow="The problem"
              title="Important context is spread across disconnected tools."
            />
            <Stack gap="xl">
              <Text variant="body-lg">
                Analytics, revenue, sales, search, advertising, customer, and
                website systems each show part of the picture. Understanding the
                whole business still requires manual comparison and
                interpretation.
              </Text>
              <Text>
                The product vision is not another collection of charts. It is an
                intelligence layer that helps turn signals into explanations.
              </Text>
            </Stack>
          </div>
        </Container>
      </Section>
      <Section
        background="surface"
        divider
        aria-labelledby="intelligence-heading"
      >
        <Container>
          <Stack gap="3xl">
            <SectionHeading
              titleId="intelligence-heading"
              eyebrow="Intelligence layer"
              title="Move from data to decisions."
              description="The long-term goal is to help operators answer the questions behind the numbers."
            />
            <Grid columns={3}>
              {questions.map((question) => (
                <Card key={question} as="article" variant="elevated">
                  <Heading level={3} variant="heading-4">
                    {question}
                  </Heading>
                </Card>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>
      <Section aria-labelledby="areas-heading">
        <Container>
          <Stack gap="3xl">
            <SectionHeading
              titleId="areas-heading"
              eyebrow="Potential areas"
              title="A connected view of the business."
              description="These are product directions under consideration, not currently available features."
            />
            <Grid columns={4}>
              {areas.map((area) => (
                <Card key={area}>
                  <Heading level={3} variant="heading-4">
                    {area}
                  </Heading>
                </Card>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>
      <Section
        background="surface"
        divider
        aria-labelledby="integrations-heading"
      >
        <Container>
          <div className="laptop:grid-cols-[0.8fr_1.2fr] grid gap-(--ds-space-4xl)">
            <SectionHeading
              titleId="integrations-heading"
              eyebrow="Planned integration model"
              title="Connect to the systems a business already uses."
              description="Specific providers and availability will be confirmed as development progresses."
            />
            <ul className="type-body text-text-secondary list-disc space-y-(--ds-space-md) pl-(--ds-space-xl)">
              {plannedSources.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
      <Section
        spacing="compact"
        className="pb-(--ds-section-space)"
        aria-labelledby="insights-cta-heading"
      >
        <Container>
          <Card variant="highlight" padding="lg">
            <Stack gap="xl" align="center" className="text-center">
              <Badge variant="accent" dot>
                In development
              </Badge>
              <Heading
                id="insights-cta-heading"
                level={2}
                variant="heading-1"
                align="center"
              >
                Interested in the direction?
              </Heading>
              <Text className="max-w-(--ds-container-reading) text-center">
                There is no public product or self-service waitlist yet. You can
                share the reporting problems you want a future platform to
                solve.
              </Text>
              <ButtonLink href="/contact">Discuss Vilét Insights</ButtonLink>
            </Stack>
          </Card>
        </Container>
      </Section>
    </>
  );
}
