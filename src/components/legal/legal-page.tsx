import type { ReactNode } from "react";

import { Container, Section, Stack } from "@/components/layout";
import { Eyebrow, Heading, Text } from "@/components/ui";

export const legalListClasses =
  "type-body text-text-secondary list-disc space-y-(--ds-space-sm) pl-(--ds-space-xl)";
export const legalLinkClasses =
  "text-accent rounded-sm underline decoration-current underline-offset-4 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:outline-none";

export function LegalPageHeader({
  eyebrow,
  title,
  description,
  children,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}>) {
  return (
    <Section background="hero" aria-labelledby="legal-page-heading">
      <Container width="reading">
        <Stack gap="xl" align="start">
          <Eyebrow marker>{eyebrow}</Eyebrow>
          <Heading id="legal-page-heading" level={1} variant="heading-1">
            {title}
          </Heading>
          <Text variant="body-lg">{description}</Text>
          {children}
        </Stack>
      </Container>
    </Section>
  );
}

export function LegalPageBody({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Section>
      <Container width="reading">
        <Stack gap="3xl">{children}</Stack>
      </Container>
    </Section>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: Readonly<{ id: string; title: string; children: ReactNode }>) {
  return (
    <section aria-labelledby={id}>
      <Heading id={id} level={2} variant="heading-3">
        {title}
      </Heading>
      <Stack gap="md" className="mt-(--ds-space-md)">
        {children}
      </Stack>
    </section>
  );
}
