import type { Metadata } from "next";
import { Container, Grid, Section, Stack } from "@/components/layout";
import {
  ButtonLink,
  Card,
  Eyebrow,
  FaqList,
  Heading,
  SectionHeading,
  Text,
} from "@/components/ui";
import { aboutContent, faqs, getFaqsBySlugs } from "@/content";
import { defaultOpenGraphImages } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Vilét's philosophy, approach, and commitment to thoughtful digital design, software, and automation.",
  alternates: { canonical: "https://vilet.co/about" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "About | Vilét",
    description:
      "Learn about Vilét's philosophy, approach, and commitment to thoughtful digital design, software, and automation.",
    url: "https://vilet.co/about",
    type: "website",
    images: defaultOpenGraphImages,
  },
};

export default function AboutPage() {
  const aboutFaqs = getFaqsBySlugs(faqs, aboutContent.faqSlugs);
  return (
    <>
      <Section background="hero" aria-labelledby="about-heading">
        <Container>
          <Stack gap="xl" align="start">
            <Eyebrow marker>{aboutContent.hero.eyebrow}</Eyebrow>
            <Heading
              id="about-heading"
              level={1}
              variant="display-lg"
              className="max-w-5xl"
            >
              {aboutContent.hero.title}
            </Heading>
            <Text variant="body-lg" className="max-w-(--ds-container-reading)">
              {aboutContent.hero.body}
            </Text>
            <Stack direction="responsive" gap="md">
              <ButtonLink href="/contact" size="lg">
                Start a project
              </ButtonLink>
              <ButtonLink href="/process" size="lg" variant="outline">
                See the process
              </ButtonLink>
            </Stack>
          </Stack>
        </Container>
      </Section>
      <Section aria-labelledby="philosophy-heading">
        <Container>
          <div className="laptop:grid-cols-[0.8fr_1.2fr] grid gap-(--ds-space-4xl)">
            <Eyebrow variant="accent">Philosophy</Eyebrow>
            <div>
              <Heading id="philosophy-heading" level={2} variant="heading-1">
                {aboutContent.philosophy.title}
              </Heading>
              <Text
                variant="body-lg"
                className="mt-(--ds-space-xl) max-w-(--ds-container-reading)"
              >
                {aboutContent.philosophy.body}
              </Text>
            </div>
          </div>
        </Container>
      </Section>
      <Section
        background="surface"
        divider
        aria-labelledby="principles-heading"
      >
        <Container>
          <Stack gap="3xl">
            <SectionHeading
              titleId="principles-heading"
              eyebrow="Principles"
              title="Standards that shape the work."
            />
            <Grid as="ol" columns={3}>
              {aboutContent.principles.map((principle, index) => (
                <li
                  key={principle}
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
                    {principle}
                  </Heading>
                </li>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>
      <Section aria-labelledby="collaboration-heading">
        <Container>
          <Stack gap="3xl">
            <SectionHeading
              titleId="collaboration-heading"
              eyebrow="How Vilét works"
              title="Collaboration connects each stage."
              description="Discovery, planning, design, development, validation, launch, and support are treated as connected decisions rather than isolated handoffs."
            />
            <Grid columns={2}>
              {aboutContent.collaboration.map((item) => (
                <article
                  key={item.title}
                  className="border-divider border-t pt-(--ds-space-xl)"
                >
                  <Heading level={3} variant="heading-3">
                    {item.title}
                  </Heading>
                  <Text className="mt-(--ds-space-md)">{item.body}</Text>
                </article>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>
      <Section
        background="surface"
        divider
        aria-labelledby="technology-heading"
      >
        <Container>
          <div className="laptop:grid-cols-[0.8fr_1.2fr] grid gap-(--ds-space-4xl)">
            <SectionHeading
              titleId="technology-heading"
              eyebrow="Technology approach"
              title="Technical choices should earn their place."
              description="The purpose of the foundation is dependable use and responsible evolution—not a longer list of tools."
            />
            <Stack gap="xl">
              {aboutContent.technology.map((item) => (
                <article
                  key={item.title}
                  className="border-divider border-t pt-(--ds-space-xl)"
                >
                  <Heading level={3} variant="heading-4">
                    {item.title}
                  </Heading>
                  <Text className="mt-(--ds-space-md)">{item.body}</Text>
                </article>
              ))}
            </Stack>
          </div>
        </Container>
      </Section>
      <Section aria-labelledby="working-together-heading">
        <Container>
          <div className="laptop:grid-cols-[0.9fr_1.1fr] grid gap-(--ds-space-4xl)">
            <SectionHeading
              titleId="working-together-heading"
              eyebrow="Working together"
              title={aboutContent.workingTogether.title}
              description={aboutContent.workingTogether.body}
            />
            <Card variant="elevated">
              <ul className="type-body text-text-secondary list-disc space-y-(--ds-space-md) pl-(--ds-space-xl)">
                {aboutContent.workingTogether.indicators.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </Section>
      <Section background="surface" divider aria-labelledby="about-faq-heading">
        <Container width="reading">
          <Stack gap="3xl">
            <SectionHeading
              titleId="about-faq-heading"
              eyebrow="Common questions"
              title="Context for working with Vilét."
            />
            <FaqList items={aboutFaqs} />
          </Stack>
        </Container>
      </Section>
      <Section
        spacing="compact"
        className="pb-(--ds-section-space)"
        aria-labelledby="about-cta-heading"
      >
        <Container>
          <Card variant="highlight" padding="lg">
            <Stack gap="xl" align="center" className="text-center">
              <Heading
                id="about-cta-heading"
                level={2}
                variant="heading-1"
                align="center"
              >
                {aboutContent.finalCta.title}
              </Heading>
              <Text
                variant="body-lg"
                className="max-w-(--ds-container-reading) text-center"
              >
                {aboutContent.finalCta.body}
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
          </Card>
        </Container>
      </Section>
    </>
  );
}
