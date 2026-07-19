import Image from "next/image";

import type { ProjectRecord, ProjectSummary } from "@/content/projects";
import { Container, Grid, Section, Stack } from "@/components/layout";
import {
  ArrowLink,
  ButtonLink,
  Eyebrow,
  Heading,
  ProjectCard,
  Text,
} from "@/components/ui";

function sourceFor(media: ProjectRecord["media"][number]) {
  if (media.source.kind === "local" || media.source.kind === "remote")
    return media.source.src;
  return media.source.deliveryUrl;
}

export interface CaseStudyLayoutProps {
  readonly project: ProjectRecord;
  readonly serviceLabels: readonly string[];
  readonly relatedProjects: readonly {
    readonly project: ProjectSummary;
    readonly serviceLabels: readonly string[];
  }[];
  readonly navigation: {
    readonly previous?: ProjectSummary;
    readonly next?: ProjectSummary;
  };
}

export function CaseStudyLayout({
  project,
  serviceLabels,
  relatedProjects,
  navigation,
}: CaseStudyLayoutProps) {
  const heroSource = project.heroMedia
    ? sourceFor(project.heroMedia)
    : undefined;
  return (
    <>
      <Section background="hero" aria-labelledby="case-study-title">
        <Container>
          <Stack gap="xl" align="start">
            <Eyebrow marker>{project.projectType}</Eyebrow>
            <Heading id="case-study-title" level={1} variant="display-lg">
              {project.title}
            </Heading>
            <Text variant="body-lg" className="max-w-(--ds-container-reading)">
              {project.summary}
            </Text>
          </Stack>
        </Container>
      </Section>
      <Section aria-labelledby="overview-heading">
        <Container>
          <div className="laptop:grid-cols-[1fr_2fr] grid gap-(--ds-space-4xl)">
            <Stack gap="lg">
              <Heading id="overview-heading" level={2} variant="heading-3">
                Project overview
              </Heading>
              <Text>{project.safeClientLabel}</Text>
              <Text>{project.industry}</Text>
              {project.timelineLabel && <Text>{project.timelineLabel}</Text>}
              {project.year && <Text>{project.year}</Text>}
              {serviceLabels.length > 0 && (
                <ul className="type-body text-text-secondary">
                  {serviceLabels.map((label) => (
                    <li key={label}>{label}</li>
                  ))}
                </ul>
              )}
            </Stack>
            <Stack gap="3xl">
              {[
                ["Challenge", project.challenge],
                ["Strategy", project.strategy],
                ["Solution", project.solution],
                ["Outcome", project.outcome],
              ].map(([title, body]) => (
                <section
                  key={title}
                  aria-labelledby={`${title.toLowerCase()}-heading`}
                >
                  <Heading
                    id={`${title.toLowerCase()}-heading`}
                    level={2}
                    variant="heading-2"
                  >
                    {title}
                  </Heading>
                  <Text variant="body-lg" className="mt-(--ds-space-lg)">
                    {body}
                  </Text>
                </section>
              ))}
            </Stack>
          </div>
        </Container>
      </Section>
      {project.heroMedia && heroSource && (
        <Section spacing="compact">
          <Container>
            <figure>
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                <Image
                  src={heroSource}
                  alt={project.heroMedia.alt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              {project.heroMedia.caption && (
                <figcaption className="type-body-sm text-text-muted mt-(--ds-space-sm)">
                  {project.heroMedia.caption}
                </figcaption>
              )}
            </figure>
          </Container>
        </Section>
      )}
      {project.gallery.length > 0 && (
        <Section aria-labelledby="gallery-heading">
          <Container>
            <Heading id="gallery-heading" level={2} variant="heading-2">
              Project gallery
            </Heading>
            <Grid columns={2} className="mt-(--ds-space-3xl)">
              {project.gallery.map((media) => {
                const src = sourceFor(media);
                return src ? (
                  <figure key={media.id}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                      <Image
                        src={src}
                        alt={media.alt}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    {media.caption && (
                      <figcaption className="type-body-sm text-text-muted mt-(--ds-space-sm)">
                        {media.caption}
                      </figcaption>
                    )}
                  </figure>
                ) : null;
              })}
            </Grid>
          </Container>
        </Section>
      )}
      {project.metrics.length > 0 && (
        <Section background="surface" aria-labelledby="metrics-heading">
          <Container>
            <Heading id="metrics-heading" level={2} variant="heading-2">
              Verified outcomes
            </Heading>
            <Grid columns={3} className="mt-(--ds-space-3xl)">
              {project.metrics.map((metric) => (
                <article key={metric.id}>
                  <Heading level={3} variant="heading-3">
                    {metric.value}
                    {metric.unit}
                  </Heading>
                  <Text strong>{metric.label}</Text>
                  <Text variant="body-sm">{metric.context}</Text>
                </article>
              ))}
            </Grid>
          </Container>
        </Section>
      )}
      {project.testimonials.map((item) => (
        <Section key={item.id} aria-labelledby={`testimonial-${item.id}`}>
          <Container width="reading">
            <Heading
              id={`testimonial-${item.id}`}
              level={2}
              variant="heading-3"
            >
              Client perspective
            </Heading>
            <blockquote className="type-body-lg text-text-primary mt-(--ds-space-xl)">
              “{item.quote}”
            </blockquote>
            <Text className="mt-(--ds-space-md)">
              {item.person}
              {item.role ? `, ${item.role}` : ""}
            </Text>
          </Container>
        </Section>
      ))}
      {project.credits.length > 0 && (
        <Section spacing="compact" aria-labelledby="credits-heading">
          <Container width="reading">
            <Heading id="credits-heading" level={2} variant="heading-3">
              Project credits
            </Heading>
            <dl className="mt-(--ds-space-xl) space-y-(--ds-space-md)">
              {project.credits.map((credit) => (
                <div
                  key={`${credit.label}-${credit.name}`}
                  className="grid grid-cols-[1fr_2fr] gap-(--ds-space-lg)"
                >
                  <dt className="type-body-sm text-text-muted">
                    {credit.label}
                  </dt>
                  <dd className="type-body text-text-primary">{credit.name}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </Section>
      )}
      {relatedProjects.length > 0 && (
        <Section background="surface" aria-labelledby="related-heading">
          <Container>
            <Heading id="related-heading" level={2} variant="heading-2">
              Related work
            </Heading>
            <Grid columns={2} className="mt-(--ds-space-3xl)">
              {relatedProjects.map((item) => (
                <ProjectCard
                  key={item.project.id}
                  project={item.project}
                  serviceLabels={item.serviceLabels}
                />
              ))}
            </Grid>
          </Container>
        </Section>
      )}
      {(navigation.previous || navigation.next) && (
        <Section spacing="compact" aria-label="Project navigation">
          <Container>
            <div className="tablet:flex-row flex flex-col justify-between gap-(--ds-space-xl)">
              {navigation.previous ? (
                <ArrowLink
                  href={`/work/${navigation.previous.slug}`}
                  direction="left"
                >
                  {navigation.previous.title}
                </ArrowLink>
              ) : (
                <span />
              )}
              {navigation.next && (
                <ArrowLink href={`/work/${navigation.next.slug}`}>
                  {navigation.next.title}
                </ArrowLink>
              )}
            </div>
          </Container>
        </Section>
      )}
      <Section spacing="compact">
        <Container>
          <Stack align="center" gap="lg">
            <Heading level={2} variant="heading-2" align="center">
              Build what’s next with Vilét.
            </Heading>
            <ButtonLink href="/contact" size="lg">
              Start a project
            </ButtonLink>
          </Stack>
        </Container>
      </Section>
    </>
  );
}
