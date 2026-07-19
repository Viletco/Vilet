import type { Metadata } from "next";

import { Container, Section, SiteShell, Stack } from "@/components/layout";
import { ButtonLink, Eyebrow, Heading, Text } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false, nocache: true },
};

export default function NotFound() {
  return (
    <SiteShell>
      <Section
        background="hero"
        className="min-h-[calc(100svh-var(--ds-header-height))]"
        aria-labelledby="not-found-heading"
      >
        <Container width="reading">
          <Stack gap="xl" align="start">
            <Eyebrow marker>Error 404</Eyebrow>
            <Heading id="not-found-heading" level={1} variant="heading-1">
              This page could not be found.
            </Heading>
            <Text variant="body-lg">
              The address may be incorrect, or the page may no longer be
              available. Continue from one of the links below.
            </Text>
            <Stack direction="responsive" gap="md">
              <ButtonLink href="/" size="lg">
                Return home
              </ButtonLink>
              <ButtonLink href="/services" size="lg" variant="outline">
                Explore services
              </ButtonLink>
            </Stack>
          </Stack>
        </Container>
      </Section>
    </SiteShell>
  );
}
