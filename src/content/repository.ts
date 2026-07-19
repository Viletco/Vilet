import type { FaqRecord } from "./faq";
import type { ProjectRecord } from "./projects";
import type { ServiceRecord } from "./services";
import type { GlobalSettings } from "./settings";

export interface ContentRepository {
  getSettings(): GlobalSettings;
  getServices(): readonly ServiceRecord[];
  getProjects(): readonly ProjectRecord[];
  getFaqs(): readonly FaqRecord[];
}

export interface ContentSourceAdapter {
  readonly source: string;
  load(): Promise<ContentRepository>;
}
