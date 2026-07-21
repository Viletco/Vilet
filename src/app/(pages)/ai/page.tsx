import type { Metadata } from "next";
import { AiWorkspace } from "@/components/ai/ai-workspace";
import { Container, Section, SiteShell, Stack } from "@/components/layout";
import { ButtonLink, Eyebrow, Heading, Text } from "@/components/ui";
import { getAiConfig } from "@/lib/ai/config";

export const metadata: Metadata = {
  title: "Vilét AI",
  description:
    "Ask about Vilét’s published services, process, and practical digital opportunities.",
  alternates: { canonical: "https://vilet.co/ai" },
  robots: { index: false, follow: false },
};

export default function AiPage() {
  const config = getAiConfig();
  return (
    <SiteShell>
      <Section background="hero" aria-labelledby="ai-heading">
        <Container>
          <Stack gap="xl" align="start">
            <Eyebrow marker>Vilét AI</Eyebrow>
            <Heading
              id="ai-heading"
              level={1}
              variant="display-lg"
              className="max-w-5xl"
            >
              A thoughtful starting point for digital decisions.
            </Heading>
            <Text variant="body-lg" className="max-w-(--ds-container-reading)">
              Ask about Vilét’s services, process, or how websites, automation,
              and custom software could support your business.
            </Text>
          </Stack>
        </Container>
      </Section>
      <Section>
        <Container>
          {config.mode === "provider" ? (
            <AiWorkspace analyzerEnabled={config.analyzerMode === "enabled"} />
          ) : (
            <div className="border-border bg-card tablet:p-12 mx-auto max-w-3xl rounded-xl border p-8">
              <Heading level={2} variant="heading-2">
                Vilét AI is not active yet.
              </Heading>
              <Text className="mt-4">
                The experience is prepared, but no AI provider is enabled and no
                message will be sent or stored. Activation requires owner,
                privacy, model, rate-limit, and cost approval.
              </Text>
              <ButtonLink href="/contact" className="mt-6">
                Use the Contact page
              </ButtonLink>
            </div>
          )}
        </Container>
      </Section>
    </SiteShell>
  );
}
