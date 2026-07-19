import type { MetadataRoute } from "next";

import { getPublishedProjects, projects } from "@/content";

const origin = "https://vilet.co";
const publicRoutes = [
  "",
  "/services",
  "/work",
  "/about",
  "/process",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...publicRoutes.map((path) => ({ url: `${origin}${path}` })),
    ...getPublishedProjects(projects).map((project) => ({
      url: `${origin}/work/${project.slug}`,
    })),
  ];
}
