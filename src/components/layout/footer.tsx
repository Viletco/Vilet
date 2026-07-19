import { globalSettings } from "@/content";
import { siteNavigation } from "@/content/navigation";

import { Text, TextLink, Wordmark } from "@/components/ui";

import { Container } from "./container";
import { Divider } from "./divider";
import { Stack } from "./stack";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-divider bg-surface border-t">
      <Container className="py-(--ds-space-4xl)">
        <div className="tablet:grid-cols-[1.5fr_1fr] grid gap-(--ds-space-3xl)">
          <Stack gap="md" align="start">
            <Wordmark />
            <Text>Building what&apos;s next.</Text>
          </Stack>

          <nav aria-label="Footer navigation">
            <Stack as="ul" gap="md" align="start">
              {siteNavigation.map((item) => (
                <li key={item.href}>
                  <TextLink href={item.href} variant="navigation">
                    {item.label}
                  </TextLink>
                </li>
              ))}
            </Stack>
          </nav>
        </div>

        <Divider variant="muted" className="my-(--ds-space-2xl)" />

        <Text variant="body-sm" muted>
          © {year} Vilét. All rights reserved.
        </Text>
        {globalSettings.legalLinks.map((item) => (
          <TextLink key={item.href} href={item.href} variant="navigation">
            {item.label}
          </TextLink>
        ))}
      </Container>
    </footer>
  );
}
