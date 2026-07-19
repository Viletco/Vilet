import Image from "next/image";

import type { MediaAsset } from "@/content/shared";
import type { ProjectSummary } from "@/content/projects";

import { ArrowLink } from "./arrow-link";
import { Card } from "./card";
import { Heading } from "./heading";
import { Text } from "./text";

function getMediaSource(media: MediaAsset) {
  if (media.source.kind === "local" || media.source.kind === "remote")
    return media.source.src;
  return media.source.deliveryUrl;
}

export interface ProjectCardProps {
  readonly project: ProjectSummary;
  readonly serviceLabels: readonly string[];
}

export function ProjectCard({ project, serviceLabels }: ProjectCardProps) {
  const mediaSource = project.heroMedia
    ? getMediaSource(project.heroMedia)
    : undefined;
  return (
    <Card
      as="article"
      variant="interactive"
      padding="none"
      className="group overflow-hidden"
    >
      {project.heroMedia && mediaSource ? (
        <div className="bg-surface relative aspect-[4/3] overflow-hidden">
          <Image
            src={mediaSource}
            alt={project.heroMedia.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="border-divider bg-surface aspect-[4/3] border-b"
        />
      )}
      <div className="p-(--ds-space-xl)">
        <Text variant="caption" strong>
          {project.industry || project.projectType}
        </Text>
        <Heading level={2} variant="heading-3" className="mt-(--ds-space-sm)">
          {project.title}
        </Heading>
        <Text className="mt-(--ds-space-md)">{project.summary}</Text>
        {serviceLabels.length > 0 && (
          <ul
            aria-label="Services"
            className="text-text-muted type-body-sm mt-(--ds-space-lg) flex flex-wrap gap-(--ds-space-sm)"
          >
            {serviceLabels.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        )}
        <ArrowLink
          href={`/work/${project.slug}`}
          aria-label={`View case study: ${project.title}`}
          className="mt-(--ds-space-xl)"
        >
          View case study
        </ArrowLink>
      </div>
    </Card>
  );
}
