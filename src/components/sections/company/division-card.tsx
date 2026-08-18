import type { CompanyDivision } from "@/content/company";
import { Card, Badge, Heading, Text, TextLink } from "@/components/ui";
import { Stack } from "@/components/layout";

const statusVariant = {
  available: "success",
  private: "default",
  "in-development": "accent",
  planned: "outline",
} as const;

export function DivisionCard({ division }: { division: CompanyDivision }) {
  return (
    <Card as="article" variant="elevated" padding="lg" className="h-full">
      <Stack gap="xl" className="h-full">
        <Stack gap="md" align="start">
          <Badge variant={statusVariant[division.status]} dot>
            {division.statusLabel}
          </Badge>
          <Heading level={3} variant="heading-2">
            {division.name}
          </Heading>
          <Text>{division.shortDescription}</Text>
        </Stack>
        <ul className="type-body-sm text-text-secondary list-disc space-y-(--ds-space-sm) pl-(--ds-space-xl)">
          {division.capabilities.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>
        <TextLink href={division.href} variant="navigation" className="mt-auto">
          {division.ctaLabel}
        </TextLink>
      </Stack>
    </Card>
  );
}
