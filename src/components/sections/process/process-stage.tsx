import type { ProcessRecord } from "@/content";
import { createElement } from "react";
import { Container, Section, Stack } from "@/components/layout";
import { Eyebrow, Heading, IconWrapper, Text } from "@/components/ui";
import { getIcon } from "@/lib/icon-registry";

export function ProcessStage({
  stage,
  surface = false,
}: {
  readonly stage: ProcessRecord;
  readonly surface?: boolean;
}) {
  const icon = createElement(getIcon(stage.icon));
  return (
    <Section
      id={stage.slug}
      background={surface ? "surface" : "none"}
      divider
      aria-labelledby={`${stage.slug}-heading`}
    >
      <Container>
        <div className="laptop:grid-cols-[0.8fr_1.2fr] grid gap-(--ds-space-4xl)">
          <Stack gap="xl" align="start">
            <div className="flex items-center gap-(--ds-space-md)">
              <Eyebrow variant="accent">
                {String(stage.order).padStart(2, "0")}
              </Eyebrow>
              <IconWrapper variant="surface">{icon}</IconWrapper>
            </div>
            <Heading id={`${stage.slug}-heading`} level={2} variant="heading-1">
              {stage.title}
            </Heading>
            <Text variant="body-lg">{stage.summary}</Text>
          </Stack>
          <Stack gap="2xl">
            <Text variant="body-lg" strong>
              {stage.detailedDescription}
            </Text>
            <div>
              <Heading level={3} variant="heading-4">
                What happens
              </Heading>
              <ul className="type-body text-text-secondary mt-(--ds-space-lg) list-disc space-y-(--ds-space-sm) pl-(--ds-space-xl)">
                {stage.whatHappens.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="tablet:grid-cols-2 grid gap-(--ds-space-xl)">
              <div className="border-divider border-t pt-(--ds-space-lg)">
                <Heading level={3} variant="heading-4">
                  Client involvement
                </Heading>
                <Text className="mt-(--ds-space-md)">
                  {stage.clientInvolvement}
                </Text>
              </div>
              <div className="border-divider border-t pt-(--ds-space-lg)">
                <Heading level={3} variant="heading-4">
                  Output
                </Heading>
                <Text className="mt-(--ds-space-md)">{stage.output}</Text>
              </div>
            </div>
          </Stack>
        </div>
      </Container>
    </Section>
  );
}
