import type { ServiceRecord } from "@/content";
import { Container, Section, Stack } from "@/components/layout";
import { ArrowLink, Eyebrow, Heading, Text } from "@/components/ui";

export function ServiceDetail({
  service,
  number,
  surface = false,
}: {
  readonly service: ServiceRecord;
  readonly number: number;
  readonly surface?: boolean;
}) {
  return (
    <Section
      id={service.slug}
      background={surface ? "surface" : "none"}
      divider
      aria-labelledby={`${service.slug}-heading`}
    >
      <Container>
        <div className="laptop:grid-cols-[1.25fr_0.75fr_0.75fr] grid gap-(--ds-space-3xl)">
          <Stack gap="xl" align="start">
            <div className="border-divider flex w-full items-center gap-(--ds-space-md) border-b pb-(--ds-space-sm)">
              <Eyebrow variant="accent">
                {String(number).padStart(2, "0")}
              </Eyebrow>
            </div>
            <Heading
              id={`${service.slug}-heading`}
              level={2}
              variant="heading-1"
            >
              {service.title}
            </Heading>
            <Text variant="body-lg" strong>
              {service.detailedSummary}
            </Text>
            <Text>{service.shortSummary}</Text>
            <ArrowLink href="/contact">Discuss this service</ArrowLink>
          </Stack>
          <div>
            <Eyebrow>Best suited for</Eyebrow>
            <ul className="type-body text-text-secondary mt-(--ds-space-lg) space-y-(--ds-space-sm)">
              {service.bestSuitedFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Typical engagement areas</Eyebrow>
            <ul className="type-body text-text-secondary mt-(--ds-space-lg) space-y-(--ds-space-sm)">
              {service.typicalEngagementAreas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Text
              strong
              className="border-divider mt-(--ds-space-xl) border-t pt-(--ds-space-lg)"
            >
              {service.outcomeStatement}
            </Text>
          </div>
        </div>
      </Container>
    </Section>
  );
}
