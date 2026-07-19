import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyLayout } from "@/components/sections/work";
import {
  getProjectBySlug,
  getProjectNavigation,
  getPublishedProjects,
  getRelatedProjects,
  getServiceById,
  projects,
  services,
  toProjectSummary,
} from "@/content";

export const dynamicParams = false;
export function generateStaticParams() {
  return getPublishedProjects(projects).map((project) => ({
    slug: project.slug,
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(projects, slug);
  if (!project?.seo) return {};
  return {
    title: { absolute: project.seo.title },
    description: project.seo.description,
    alternates: { canonical: project.seo.canonical },
    robots: {
      index: project.seo.robots.index,
      follow: project.seo.robots.follow,
    },
    openGraph: {
      title: project.seo.openGraph.title,
      description: project.seo.openGraph.description,
      url: project.seo.openGraph.url,
      type: "website",
      images: project.seo.openGraph.images.flatMap((image) => {
        const url =
          image.url ??
          (image.source.kind === "local" || image.source.kind === "remote"
            ? image.source.src
            : image.source.deliveryUrl);
        return url
          ? [{ url, width: image.width, height: image.height, alt: image.alt }]
          : [];
      }),
    },
  };
}
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(projects, slug);
  if (!project) notFound();
  const serviceLabels = project.serviceIds
    .map((id) => getServiceById(services, id)?.title)
    .filter((label): label is string => Boolean(label));
  const relatedProjects = getRelatedProjects(projects, project).map(
    (related) => ({
      project: toProjectSummary(related),
      serviceLabels: related.serviceIds
        .map((id) => getServiceById(services, id)?.title)
        .filter((label): label is string => Boolean(label)),
    }),
  );
  const selectedNavigation = getProjectNavigation(projects, project);
  const navigation = {
    previous: selectedNavigation.previous
      ? toProjectSummary(selectedNavigation.previous)
      : undefined,
    next: selectedNavigation.next
      ? toProjectSummary(selectedNavigation.next)
      : undefined,
  };
  return (
    <CaseStudyLayout
      project={project}
      serviceLabels={serviceLabels}
      relatedProjects={relatedProjects}
      navigation={navigation}
    />
  );
}
