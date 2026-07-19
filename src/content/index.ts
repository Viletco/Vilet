import { aboutContent, validateAbout } from "./about";
import { faqs, validateFaqs } from "./faq";
import {
  homepageContent,
  homepageSectionVisibility,
  portfolioFeaturedProjects,
  publishedFeaturedProjects,
} from "./homepage";
import { processRecords, validateProcess } from "./process";
import { projects, validateProjects } from "./projects";
import { services, validateServices } from "./services";
import { globalSettings, validateSettings } from "./settings";

validateAbout(aboutContent);
validateSettings(globalSettings);
validateServices(services);
validateProcess(processRecords);
validateFaqs(faqs);
validateProjects(projects);

export {
  aboutContent,
  faqs,
  globalSettings,
  homepageContent,
  homepageSectionVisibility,
  portfolioFeaturedProjects,
  processRecords,
  projects,
  publishedFeaturedProjects,
  services,
};
export * from "./about";
export type { ContentRepository, ContentSourceAdapter } from "./repository";
export * from "./faq";
export * from "./process";
export * from "./projects";
export * from "./services";
export * from "./settings";
