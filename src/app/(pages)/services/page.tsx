import type { Metadata } from "next";
import { ServiceDetail } from "@/components/sections/services";
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
  getPublishedServices,
  services,
} from "@/content";
import { defaultOpenGraphImages } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Vilét services for web design and development, AI automation, custom software, and ongoing digital support.",
  alternates: { canonical: "https://vilet.co/services" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Services | Vilét",
    description:
      "Explore Vilét services for web design and development, AI automation, custom software, and ongoing digital support.",
    url: "https://vilet.co/services",
    type: "website",
    images: defaultOpenGraphImages,
  },
};

const fitIndicators = [
  "The current website or workflow is limiting the business",
  "Quality and long-term maintainability matter",
  "The project has a clear owner and decision-maker",
  "The business is open to discovery before implementation",
  "The solution may need to evolve after launch",
] as const;
const principles = [
  "Clarity before complexity",
  "Business goals before features",
  "Accessibility from the beginning",
  "Maintainable systems over fragile shortcuts",
  "Direct communication",
  "Deliberate use of AI and automation",
] as const;
const serviceFaqSlugs = [
  "business-fit",
  "templates",
  "website-redesign",
  "support-after-launch",
  "project-cost",
  "project-timeline",
  "ai-automation-internal-tools",
] as const;

export default function ServicesPage() {
  const visibleServices = getPublishedServices(services);
  const serviceFaqs = getFaqsBySlugs(faqs, serviceFaqSlugs);
  return (
    <>
      <Section background="hero" aria-labelledby="services-page-heading">
        <Container>
          <Stack gap="xl" align="start">
            <Eyebrow marker>Services</Eyebrow>
            <Heading
              id="services-page-heading"
              level={1}
              variant="display-lg"
              className="max-w-5xl"
            >
              Digital solutions built around how your business works.
            </Heading>
            <Text variant="body-lg" className="max-w-(--ds-container-reading)">
              Vilét combines strategy, design, development, and automation to
              create focused digital systems that improve how businesses present
              themselves, serve customers, and operate behind the scenes.
            </Text>
            <Stack direction="responsive" gap="md">
              <ButtonLink href="/contact" size="lg">
                Start a project
              </ButtonLink>
              <ButtonLink href="/process" size="lg" variant="outline">
                See how we work
              </ButtonLink>
            </Stack>
          </Stack>
        </Container>
      </Section>
      <Section spacing="compact" aria-labelledby="service-overview-heading">
        <Container>
          <Heading id="service-overview-heading" level={2} variant="heading-3">
            Service overview
          </Heading>
          <Grid as="ol" columns={4} className="mt-(--ds-space-2xl)">
            {visibleServices.map((service, index) => (
              <li
                key={service.id}
                className="border-divider border-t pt-(--ds-space-lg)"
              >
                <Eyebrow variant="accent" className="flex">
                  {String(index + 1).padStart(2, "0")}
                </Eyebrow>
                <TextLink
                  href={`#${service.slug}`}
                  variant="navigation"
                  className="type-heading-4 mt-(--ds-space-md) inline-block"
                >
                  {service.title}
                </TextLink>
              </li>
            ))}
          </Grid>
        </Container>
      </Section>
      {visibleServices.map((service, index) => (
        <ServiceDetail
          key={service.id}
          service={service}
          number={index + 1}
          surface={index % 2 === 1}
        />
      ))}
      <Section aria-labelledby="fit-heading">
        <Container>
          <div className="laptop:grid-cols-[0.9fr_1.1fr] grid gap-(--ds-space-4xl)">
            <SectionHeading
              titleId="fit-heading"
              eyebrow="Engagement fit"
              title="A strong fit when the problem deserves more than a quick template."
              description="Vilét is best suited for businesses that value thoughtful execution, clear communication, and a digital foundation designed around real goals rather than the fastest possible handoff."
            />
            <Stack gap="2xl">
              <ul className="type-body text-text-secondary list-disc space-y-(--ds-space-md) pl-(--ds-space-xl)">
                {fitIndicators.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Card variant="elevated">
                <Text>
                  Vilét may not be the right fit for projects seeking the lowest
                  possible price, an immediate same-day build, or a
                  predetermined solution without room for discovery.
                </Text>
              </Card>
            </Stack>
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
              eyebrow="Across every service"
              title="Principles that guide the work."
              description="The right deliverable changes by engagement. The standards used to shape it remain consistent."
            />
            <Grid as="ol" columns={3}>
              {principles.map((item, index) => (
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
      <Section aria-labelledby="services-faq-heading">
        <Container width="reading">
          <Stack gap="3xl">
            <SectionHeading
              titleId="services-faq-heading"
              eyebrow="Service questions"
              title="Useful context before choosing a direction."
            />
            <FaqList items={serviceFaqs} />
          </Stack>
        </Container>
      </Section>
      <Section
        spacing="compact"
        className="pb-(--ds-section-space)"
        aria-labelledby="services-cta-heading"
      >
        <Container>
          <Card variant="highlight" padding="lg">
            <Stack gap="xl" align="center" className="text-center">
              <Eyebrow variant="accent">Start a conversation</Eyebrow>
              <Heading
                id="services-cta-heading"
                level={2}
                variant="heading-1"
                align="center"
              >
                Not sure which service fits?
              </Heading>
              <Text
                variant="body-lg"
                className="max-w-(--ds-container-reading) text-center"
              >
                Share the goal, challenge, or workflow you are trying to
                improve. Vilét can help define the right starting point before
                recommending a solution.
              </Text>
              <Stack direction="responsive" gap="md">
                <ButtonLink href="/contact" size="lg">
                  Start your project
                </ButtonLink>
                <ButtonLink href="/process" size="lg" variant="outline">
                  View the process
                </ButtonLink>
              </Stack>
            </Stack>
          </Card>
        </Container>
      </Section>
    </>
  );
}
