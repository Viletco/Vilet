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
        <div className="laptop:grid-cols-[1.45fr_0.7fr_0.7fr_0.7fr] grid gap-(--ds-space-3xl)">
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
            <Text variant="body-lg" strong>
              {stage.summary}
            </Text>
            <Text>{stage.detailedDescription}</Text>
          </Stack>
          <div>
            <Eyebrow>What happens</Eyebrow>
            <ul className="type-body text-text-secondary mt-(--ds-space-lg) space-y-(--ds-space-sm)">
              {stage.whatHappens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Client involvement</Eyebrow>
            <Text className="mt-(--ds-space-lg)">
              {stage.clientInvolvement}
            </Text>
          </div>
          <div>
            <Eyebrow>Output</Eyebrow>
            <Text className="mt-(--ds-space-lg)">{stage.output}</Text>
          </div>
        </div>
      </Container>
    </Section>
  );
}
