import type { Metadata } from "next";
import { Container, Grid, Section, Stack } from "@/components/layout";
import {
  ButtonLink,
  Eyebrow,
  Heading,
  ProjectCard,
  Text,
} from "@/components/ui";
import {
  getPublishedProjects,
  getServiceById,
  projects,
  services,
  toProjectSummary,
} from "@/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Explore verified Vilét projects and case studies as they become available.",
  alternates: { canonical: "https://vilet.co/work" },
  robots: { index: true, follow: true },
};

export default function WorkPage() {
  const published = getPublishedProjects(projects);
  if (published.length === 0)
    return (
      <Section
        background="hero"
        className="min-h-[calc(100svh-var(--ds-header-height))]"
        aria-labelledby="work-heading"
      >
        <Container width="reading">
          <Stack gap="xl" align="start">
            <Eyebrow marker>Selected work</Eyebrow>
            <Heading id="work-heading" level={1} variant="heading-1">
              Case studies are being prepared.
            </Heading>
            <Text variant="body-lg">
              Vilét is building its initial portfolio with the same care applied
              to client work. Verified projects and detailed case studies will
              appear here as they become available.
            </Text>
            <Stack direction="responsive" gap="md">
              <ButtonLink href="/contact" size="lg">
                Start a project
              </ButtonLink>
              <ButtonLink href="/services" size="lg" variant="outline">
                Explore our services
              </ButtonLink>
            </Stack>
          </Stack>
        </Container>
      </Section>
    );
  return (
    <Section aria-labelledby="work-heading">
      <Container>
        <Stack gap="4xl">
          <div>
            <Eyebrow marker>Selected work</Eyebrow>
            <Heading
              id="work-heading"
              level={1}
              variant="heading-1"
              className="mt-(--ds-space-lg)"
            >
              Verified projects and case studies.
            </Heading>
          </div>
          <Grid columns={2}>
            {published.map((project) => (
              <ProjectCard
                key={project.id}
                project={toProjectSummary(project)}
                serviceLabels={project.serviceIds
                  .map((id) => getServiceById(services, id)?.title)
                  .filter((label): label is string => Boolean(label))}
              />
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}
