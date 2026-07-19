import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Box, Code2, Sparkles } from "lucide-react";

import { Container, Divider, Grid, Section, Stack } from "@/components/layout";
import {
  ArrowLink,
  Badge,
  Button,
  ButtonLink,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Disclosure,
  Eyebrow,
  GradientText,
  Heading,
  IconWrapper,
  SectionHeading,
  Text,
  TextLink,
  Wordmark,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Component Preview | Vilét Development",
  description: "Development-only preview of the Vilét component library.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const buttonVariants = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "text",
  "destructive",
] as const;

const badgeVariants = [
  "default",
  "outline",
  "accent",
  "success",
  "warning",
  "danger",
  "ai",
  "featured",
] as const;

function PreviewBlock({
  title,
  children,
}: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <Stack gap="xl">
      <Heading level={2} variant="heading-3">
        {title}
      </Heading>
      {children}
    </Stack>
  );
}

export default function ComponentPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main>
      <Section background="hero" divider>
        <Container>
          <Stack gap="xl">
            <Badge variant="accent" icon={<Code2 className="size-3" />}>
              Development only
            </Badge>
            <Heading level={1} variant="display-lg">
              Component <GradientText>preview</GradientText>
            </Heading>
            <Text variant="body-lg" className="max-w-(--ds-container-reading)">
              An isolated quality-assurance surface for Vilét’s reusable
              interface primitives. This route is unavailable in production.
            </Text>
          </Stack>
        </Container>
      </Section>

      <Section>
        <Container>
          <Stack gap="5xl">
            <PreviewBlock title="Typography">
              <Stack gap="2xl">
                <Heading level={2} variant="display-xl">
                  Display XL
                </Heading>
                <Heading level={3} variant="display-lg">
                  Display Large
                </Heading>
                <Heading level={3} variant="heading-1">
                  Heading One
                </Heading>
                <Heading level={3} variant="heading-2">
                  Heading Two
                </Heading>
                <Heading level={3} variant="heading-3">
                  Heading Three
                </Heading>
                <Heading level={3} variant="heading-4">
                  Heading Four
                </Heading>
                <Text variant="body-lg">
                  Large body text for introductory information.
                </Text>
                <Text>
                  Body text for clear, comfortable reading across interfaces.
                </Text>
                <Text variant="body-sm">
                  Small body text for supporting details.
                </Text>
                <Text variant="caption">CAPTION TEXT</Text>
                <Text as="code" variant="code">
                  const foundation = &quot;reusable&quot;;
                </Text>
              </Stack>
            </PreviewBlock>

            <Divider variant="gradient" />

            <PreviewBlock title="Eyebrows and gradient text">
              <Stack direction="responsive" gap="xl" align="start" wrap>
                <Eyebrow marker>Studio standard</Eyebrow>
                <Eyebrow
                  variant="accent"
                  icon={<Sparkles className="size-3" />}
                >
                  Accent eyebrow
                </Eyebrow>
              </Stack>
              <Heading level={3} variant="heading-2">
                Restrained <GradientText>accent treatment</GradientText>
              </Heading>
            </PreviewBlock>

            <PreviewBlock title="Section heading">
              <SectionHeading
                eyebrow="Reusable composition"
                title="A consistent introduction for future sections"
                description="The composed primitive keeps eyebrow, title, description, width, and responsive spacing aligned with the design system."
              />
            </PreviewBlock>

            <PreviewBlock title="Buttons">
              <Stack direction="responsive" gap="md" align="center" wrap>
                {buttonVariants.map((variant) => (
                  <Button key={variant} variant={variant}>
                    {variant}
                  </Button>
                ))}
              </Stack>
              <Stack direction="responsive" gap="md" align="center" wrap>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="icon" aria-label="Open options">
                  <Sparkles aria-hidden="true" className="size-4" />
                </Button>
                <Button disabled>Disabled</Button>
                <Button loading loadingLabel="Saving changes">
                  Save changes
                </Button>
              </Stack>
            </PreviewBlock>

            <PreviewBlock title="Button and text links">
              <Stack direction="responsive" gap="xl" align="center" wrap>
                <ButtonLink
                  href="#preview"
                  trailingIcon={<ArrowUpRight className="size-4" />}
                >
                  Internal action
                </ButtonLink>
                <ButtonLink
                  href="https://example.com"
                  target="_blank"
                  variant="outline"
                  trailingIcon={<ArrowUpRight className="size-4" />}
                >
                  External example
                </ButtonLink>
                <TextLink href="#preview">Inline link</TextLink>
                <TextLink href="#preview" variant="navigation">
                  Navigation-style link
                </TextLink>
                <ArrowLink href="#preview">Directional link</ArrowLink>
              </Stack>
            </PreviewBlock>

            <PreviewBlock title="Containers and sections">
              <Stack gap="lg">
                <Container
                  width="reading"
                  className="border-border bg-surface rounded-md border py-(--ds-space-lg)"
                >
                  <Text>Reading-width container</Text>
                </Container>
                <Section
                  as="div"
                  spacing="compact"
                  background="surface"
                  divider
                  className="rounded-md"
                >
                  <Container>
                    <Text>Compact section treatment</Text>
                  </Container>
                </Section>
              </Stack>
            </PreviewBlock>

            <PreviewBlock title="Stacks, grids, and dividers">
              <Stack direction="responsive" gap="lg">
                <Badge>Stack item</Badge>
                <Badge>Responsive item</Badge>
                <Divider orientation="vertical" variant="muted" />
                <Badge>Wrapped item</Badge>
              </Stack>
              <Grid columns={3} gap="grid">
                {["One", "Two", "Three"].map((item) => (
                  <Card key={item} padding="sm">
                    <Text strong>{item}</Text>
                  </Card>
                ))}
              </Grid>
              <Stack gap="lg">
                <Divider />
                <Divider variant="muted" />
                <Divider variant="gradient" />
              </Stack>
            </PreviewBlock>

            <PreviewBlock title="Cards">
              <Grid columns={3}>
                <Card>
                  <CardHeader>
                    <CardTitle>Default card</CardTitle>
                    <CardDescription>
                      Neutral content container.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Text variant="body-sm">Content remains composable.</Text>
                  </CardContent>
                  <CardFooter>
                    <TextLink href="#preview">Supporting link</TextLink>
                  </CardFooter>
                </Card>
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Elevated card</CardTitle>
                    <CardDescription>Additional visual depth.</CardDescription>
                  </CardHeader>
                </Card>
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle>Glass card</CardTitle>
                    <CardDescription>Restrained translucency.</CardDescription>
                  </CardHeader>
                </Card>
                <Card variant="interactive">
                  <CardHeader>
                    <CardTitle>Interactive container</CardTitle>
                    <CardDescription>
                      Focus follows its semantic link.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <ArrowLink href="#preview">Review details</ArrowLink>
                  </CardFooter>
                </Card>
                <Card variant="highlight">
                  <CardHeader>
                    <CardTitle>Highlight card</CardTitle>
                    <CardDescription>
                      Accent used with restraint.
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card hover glow={false}>
                  <CardHeader>
                    <CardTitle>Hover option</CardTitle>
                    <CardDescription>
                      Token-driven state treatment.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Grid>
            </PreviewBlock>

            <PreviewBlock title="Badges">
              <Stack direction="horizontal" gap="md" align="center" wrap>
                {badgeVariants.map((variant) => (
                  <Badge
                    key={variant}
                    variant={variant}
                    dot={variant === "success" || variant === "warning"}
                    icon={
                      variant === "ai" ? (
                        <Sparkles className="size-3" />
                      ) : undefined
                    }
                  >
                    {variant}
                  </Badge>
                ))}
              </Stack>
            </PreviewBlock>

            <PreviewBlock title="Icon wrappers">
              <Stack direction="horizontal" gap="lg" align="center" wrap>
                <IconWrapper size="sm">
                  <Box />
                </IconWrapper>
                <IconWrapper variant="accent" shape="circle">
                  <Sparkles />
                </IconWrapper>
                <IconWrapper size="lg" variant="surface">
                  <Code2 />
                </IconWrapper>
                <IconWrapper
                  decorative={false}
                  label="External resource"
                  variant="muted"
                >
                  <ArrowUpRight />
                </IconWrapper>
              </Stack>
            </PreviewBlock>

            <PreviewBlock title="Disclosure">
              <div className="max-w-(--ds-container-reading)">
                <Disclosure
                  id="preview-disclosure-answer"
                  question="Can multiple disclosures remain open?"
                >
                  Yes. Native details and summary elements preserve accessible
                  keyboard behavior without client-side JavaScript.
                </Disclosure>
              </div>
            </PreviewBlock>

            <PreviewBlock title="Vilét wordmark">
              <Stack direction="horizontal" gap="2xl" align="center" wrap>
                <Wordmark size="sm" />
                <Wordmark size="md" />
                <Wordmark size="lg" />
                <Wordmark linked />
              </Stack>
            </PreviewBlock>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
