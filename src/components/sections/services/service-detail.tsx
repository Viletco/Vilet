import type { ServiceRecord } from "@/content";
import { createElement } from "react";
import { Container, Grid, Section, Stack } from "@/components/layout";
import {
  ButtonLink,
  Eyebrow,
  Heading,
  IconWrapper,
  Text,
} from "@/components/ui";
import { getIcon } from "@/lib/icon-registry";

export function ServiceDetail({
  service,
  number,
  surface = false,
}: {
  readonly service: ServiceRecord;
  readonly number: number;
  readonly surface?: boolean;
}) {
  const icon = createElement(getIcon(service.icon));
  return (
    <Section
      id={service.slug}
      background={surface ? "surface" : "none"}
      divider
      aria-labelledby={`${service.slug}-heading`}
    >
      <Container>
        <div className="laptop:grid-cols-[0.85fr_1.15fr] grid gap-(--ds-space-4xl)">
          <Stack gap="xl" align="start">
            <div className="flex items-center gap-(--ds-space-md)">
              <Eyebrow variant="accent">
                {String(number).padStart(2, "0")}
              </Eyebrow>
              <IconWrapper variant="accent">{icon}</IconWrapper>
            </div>
            <Heading
              id={`${service.slug}-heading`}
              level={2}
              variant="heading-1"
            >
              {service.title}
            </Heading>
            <Text variant="body-lg">{service.shortSummary}</Text>
            <ButtonLink href="/contact" variant="outline">
              Discuss this service
            </ButtonLink>
          </Stack>
          <Stack gap="2xl">
            <Text variant="body-lg" strong>
              {service.detailedSummary}
            </Text>
            <Grid columns={2}>
              <div>
                <Heading level={3} variant="heading-4">
                  Best suited for
                </Heading>
                <ul className="type-body text-text-secondary mt-(--ds-space-lg) list-disc space-y-(--ds-space-sm) pl-(--ds-space-xl)">
                  {service.bestSuitedFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Heading level={3} variant="heading-4">
                  Typical engagement areas
                </Heading>
                <ul className="type-body text-text-secondary mt-(--ds-space-lg) list-disc space-y-(--ds-space-sm) pl-(--ds-space-xl)">
                  {service.typicalEngagementAreas.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </Grid>
            <div className="border-accent/40 border-l pl-(--ds-space-lg)">
              <Text strong>{service.outcomeStatement}</Text>
            </div>
          </Stack>
        </div>
      </Container>
    </Section>
  );
}
