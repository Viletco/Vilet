import { aboutContent, validateAbout } from "./about";
import {
  companyDivisions,
  futureProductAreas,
  partnerProgram,
} from "./company";
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
  companyDivisions,
  faqs,
  futureProductAreas,
  globalSettings,
  homepageContent,
  homepageSectionVisibility,
  portfolioFeaturedProjects,
  processRecords,
  partnerProgram,
  projects,
  publishedFeaturedProjects,
  services,
};
export * from "./about";
export * from "./company";
export type { ContentRepository, ContentSourceAdapter } from "./repository";
export * from "./faq";
export * from "./process";
export * from "./projects";
export * from "./services";
export * from "./settings";
