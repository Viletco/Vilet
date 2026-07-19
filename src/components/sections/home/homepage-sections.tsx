import type {
  FAQContent,
  FinalCtaContent,
  HeroContent,
  ProcessContent,
  ServicesContent,
  TechnicalApproachContent,
  ValuePropositionContent,
  WhyViletContent,
} from "@/content/content-types";
import { Container, Divider, Grid, Section, Stack } from "@/components/layout";
import {
  ArrowLink,
  ButtonLink,
  Card,
  Disclosure,
  Eyebrow,
  Heading,
  IconWrapper,
  SectionHeading,
  Text,
} from "@/components/ui";
import { getIcon } from "@/lib/icon-registry";

export function HeroSection({ content }: { content: HeroContent }) {
  return (
    <Section
      background="hero"
      spacing="compact"
      aria-labelledby="hero-heading"
      className="laptop:py-(--ds-section-space)"
    >
      <Container>
        <div className="laptop:grid-cols-[1.15fr_0.85fr] laptop:gap-(--ds-space-4xl) grid items-center gap-(--ds-space-3xl)">
          <Stack gap="xl" align="start">
            {content.eyebrow && <Eyebrow marker>{content.eyebrow}</Eyebrow>}
            <Heading
              id="hero-heading"
              level={1}
              variant="display-lg"
              className="max-w-3xl"
            >
              {content.headline}
            </Heading>
            <Text variant="body-lg" className="max-w-(--ds-container-reading)">
              {content.supportingCopy}
            </Text>
            <Stack direction="responsive" gap="md" align="start">
              <ButtonLink
                href={content.primaryCta.link.href}
                size="lg"
                aria-label={content.primaryCta.accessibleLabel}
              >
                {content.primaryCta.label}
              </ButtonLink>
              <ButtonLink
                href={content.secondaryCta.link.href}
                size="lg"
                variant="outline"
              >
                {content.secondaryCta.label}
              </ButtonLink>
            </Stack>
            {content.note && (
              <div className="border-divider border-l pl-(--ds-space-md)">
                <Text variant="body-sm" muted>
                  {content.note}
                </Text>
              </div>
            )}
          </Stack>
          {content.visual.kind === "abstract" && (
            <div
              aria-hidden="true"
              className="border-border bg-surface-elevated shadow-glow-soft laptop:aspect-square relative mx-auto aspect-[2/1] w-full max-w-2xl overflow-hidden rounded-lg border opacity-90"
            >
              <div className="border-accent/20 absolute inset-(--ds-space-xl) rounded-lg border bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[3rem_3rem]" />
              <div className="border-accent/30 bg-accent/10 absolute top-1/4 right-1/4 size-1/2 rounded-full border blur-sm" />
              <div className="border-accent/50 bg-surface shadow-glow-soft absolute inset-1/3 rounded-lg border" />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

export function ValuePropositionSection({
  content,
}: {
  content: ValuePropositionContent;
}) {
  return (
    <Section aria-labelledby="value-heading">
      <Container>
        <div className="laptop:grid-cols-[0.9fr_1.1fr] grid gap-(--ds-space-4xl)">
          <SectionHeading
            titleId="value-heading"
            eyebrow={content.eyebrow}
            title={content.headline}
            description={content.body}
          />
          <Stack as="ol" gap="none">
            {content.pillars.map((item, index) => (
              <li
                key={item.id}
                className="border-divider grid grid-cols-[auto_1fr] gap-(--ds-space-lg) border-t py-(--ds-space-xl)"
              >
                <Eyebrow variant="accent">
                  {String(index + 1).padStart(2, "0")}
                </Eyebrow>
                <Stack gap="sm">
                  <Heading level={3} variant="heading-4">
                    {item.title}
                  </Heading>
                  <Text>{item.summary}</Text>
                </Stack>
              </li>
            ))}
          </Stack>
        </div>
      </Container>
    </Section>
  );
}

export function ServicesSection({ content }: { content: ServicesContent }) {
  return (
    <Section
      id="services"
      background="surface"
      divider
      aria-labelledby="services-heading"
    >
      <Container>
        <Stack gap="4xl">
          <SectionHeading
            titleId="services-heading"
            eyebrow={content.eyebrow}
            title={content.headline}
            description={content.body}
          />
          <Grid columns={2}>
            {content.items.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <Card as="article" key={item.id} variant="elevated">
                  <Stack gap="lg" align="start" className="h-full">
                    <IconWrapper variant="accent">
                      <Icon />
                    </IconWrapper>
                    <Heading level={3} variant="heading-3">
                      {item.title}
                    </Heading>
                    <Text>{item.summary}</Text>
                    <ul className="type-body-sm text-text-secondary space-y-(--ds-space-sm)">
                      {item.features.map((feature) => (
                        <li key={feature} className="flex gap-(--ds-space-sm)">
                          <span
                            aria-hidden="true"
                            className="bg-accent mt-[0.65em] size-1.5 shrink-0 rounded-full"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <ArrowLink className="mt-auto" href={item.cta.link.href}>
                      {item.cta.label}
                    </ArrowLink>
                  </Stack>
                </Card>
              );
            })}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}

export function ProcessSection({ content }: { content: ProcessContent }) {
  return (
    <Section aria-labelledby="process-heading">
      <Container>
        <Stack gap="4xl">
          <SectionHeading
            titleId="process-heading"
            eyebrow={content.eyebrow}
            title={content.headline}
            description={content.body}
          />
          <Grid
            as="ol"
            columns={4}
            className="laptop:grid-cols-2 desktop:grid-cols-4"
          >
            {content.steps.map((step, index) => {
              const Icon = getIcon(step.icon);
              return (
                <li
                  key={step.id}
                  className="border-divider border-t pt-(--ds-space-xl)"
                >
                  <Stack gap="lg" align="start">
                    <div className="flex w-full items-center justify-between">
                      <IconWrapper variant="surface">
                        <Icon />
                      </IconWrapper>
                      <Eyebrow variant="accent">
                        {String(index + 1).padStart(2, "0")}
                      </Eyebrow>
                    </div>
                    <Heading level={3} variant="heading-4">
                      {step.title}
                    </Heading>
                    <Text>{step.summary}</Text>
                    <ul className="type-body-sm text-text-muted space-y-(--ds-space-xs)">
                      {step.deliverables.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Stack>
                </li>
              );
            })}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}

export function TechnicalApproachSection({
  content,
}: {
  content: TechnicalApproachContent;
}) {
  return (
    <Section background="surface" divider aria-labelledby="technical-heading">
      <Container>
        <Stack gap="4xl">
          <SectionHeading
            titleId="technical-heading"
            eyebrow={content.eyebrow}
            title={content.headline}
            description={content.body}
          />
          <Grid columns={3}>
            {content.items.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <Stack
                  as="article"
                  key={item.id}
                  gap="md"
                  align="start"
                  className="border-divider border-t pt-(--ds-space-xl)"
                >
                  <IconWrapper variant="muted">
                    <Icon />
                  </IconWrapper>
                  <Heading level={3} variant="heading-4">
                    {item.title}
                  </Heading>
                  <Text>{item.summary}</Text>
                </Stack>
              );
            })}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}

export function WhyViletSection({ content }: { content: WhyViletContent }) {
  return (
    <Section aria-labelledby="why-heading">
      <Container>
        <div className="laptop:grid-cols-2 grid gap-(--ds-space-4xl)">
          <SectionHeading
            titleId="why-heading"
            eyebrow={content.eyebrow}
            title={content.headline}
            description={content.body}
          />
          <Stack gap="xl">
            {content.items.map((item, index) => {
              const Icon = item.icon ? getIcon(item.icon) : null;
              return (
                <div key={item.id}>
                  {index > 0 && <Divider className="mb-(--ds-space-xl)" />}
                  <div className="grid grid-cols-[auto_1fr] gap-(--ds-space-lg)">
                    {Icon && (
                      <IconWrapper variant="accent">
                        <Icon />
                      </IconWrapper>
                    )}
                    <Stack gap="sm">
                      <Heading level={3} variant="heading-4">
                        {item.title}
                      </Heading>
                      <Text>{item.summary}</Text>
                    </Stack>
                  </div>
                </div>
              );
            })}
          </Stack>
        </div>
      </Container>
    </Section>
  );
}

export function FaqSection({ content }: { content: FAQContent }) {
  return (
    <Section
      id="faq"
      background="surface"
      divider
      aria-labelledby="faq-heading"
    >
      <Container width="reading">
        <Stack gap="3xl">
          <SectionHeading
            titleId="faq-heading"
            eyebrow={content.eyebrow}
            title={content.headline}
            description={content.body}
          />
          <div>
            {content.items.map((item) => {
              if (item.answer.format === "rich-text")
                throw new Error(`FAQ ${item.id} needs a rich-text renderer.`);
              return (
                <Disclosure
                  key={item.id}
                  id={`answer-${item.id}`}
                  question={item.question}
                >
                  {item.answer.value}
                </Disclosure>
              );
            })}
          </div>
        </Stack>
      </Container>
    </Section>
  );
}

export function FinalCtaSection({ content }: { content: FinalCtaContent }) {
  return (
    <Section
      spacing="compact"
      className="pb-(--ds-section-space)"
      aria-labelledby="final-cta-heading"
    >
      <Container>
        <Card
          variant="highlight"
          padding="lg"
          className="relative overflow-hidden py-(--ds-space-4xl)"
        >
          <div
            aria-hidden="true"
            className="bg-accent/10 absolute -top-1/2 left-1/2 aspect-square w-1/2 -translate-x-1/2 rounded-full blur-3xl"
          />
          <Stack gap="xl" align="center" className="relative text-center">
            {content.eyebrow && (
              <Eyebrow variant="accent">{content.eyebrow}</Eyebrow>
            )}
            <Heading
              id="final-cta-heading"
              level={2}
              variant="heading-1"
              align="center"
            >
              {content.headline}
            </Heading>
            <Text
              variant="body-lg"
              className="max-w-(--ds-container-reading) text-center"
            >
              {content.body}
            </Text>
            <Stack direction="responsive" gap="md" align="center">
              <ButtonLink href={content.primaryButton.link.href} size="lg">
                {content.primaryButton.label}
              </ButtonLink>
              {content.secondaryButton && (
                <ButtonLink
                  href={content.secondaryButton.link.href}
                  size="lg"
                  variant="outline"
                >
                  {content.secondaryButton.label}
                </ButtonLink>
              )}
            </Stack>
          </Stack>
        </Card>
      </Container>
    </Section>
  );
}
