import { isIconName } from "./icons";
import { siteNavigation } from "./navigation";
import type {
  CallToActionContent,
  ContentImage,
  ContentLink,
  FeaturedProjectContent,
  HomepageContent,
  ImageSource,
  SeoContent,
} from "./content-types";

export type ValidationCode =
  | "duplicate-id"
  | "duplicate-slug"
  | "empty-array"
  | "invalid-icon"
  | "invalid-image"
  | "invalid-link"
  | "invalid-metadata"
  | "missing-field"
  | "unapproved-content";

export interface ValidationIssue {
  readonly code: ValidationCode;
  readonly path: string;
  readonly message: string;
}

export interface ContentValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ValidationIssue[];
}

export interface HomepageSectionVisibility {
  readonly featuredWork: boolean;
  readonly trust: boolean;
  readonly faq: boolean;
}

const validImageExtensions = [
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
];

function isBlank(value: string) {
  return value.trim().length === 0;
}

function issue(
  issues: ValidationIssue[],
  code: ValidationCode,
  path: string,
  message: string,
) {
  issues.push({ code, path, message });
}

function requireText(issues: ValidationIssue[], value: string, path: string) {
  if (isBlank(value))
    issue(issues, "missing-field", path, "Required text cannot be empty.");
}

function validateProductionCopy(
  issues: ValidationIssue[],
  entries: readonly { readonly value: string; readonly path: string }[],
) {
  const forbidden = /\[|\]|coming soon|placeholder|foundation initialized/i;

  for (const entry of entries) {
    if (forbidden.test(entry.value)) {
      issue(
        issues,
        "unapproved-content",
        entry.path,
        "Approved production copy cannot contain placeholders or editorial markers.",
      );
    }
  }
}

function validateUniqueValues(
  issues: ValidationIssue[],
  entries: readonly { readonly value: string; readonly path: string }[],
  code: "duplicate-id" | "duplicate-slug",
) {
  const seen = new Map<string, string>();

  for (const entry of entries) {
    const normalized = entry.value.trim().toLowerCase();
    const existing = seen.get(normalized);

    if (existing) {
      issue(
        issues,
        code,
        entry.path,
        `Value duplicates ${existing}: ${entry.value}`,
      );
    } else {
      seen.set(normalized, entry.path);
    }
  }
}

function isValidHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function validateInternalHref(href: string) {
  const [pathname, hash] = href.split("#", 2);
  const knownRoute = siteNavigation.some((item) => item.href === pathname);
  const caseStudyRoute = /^\/work\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pathname);
  const validHash =
    hash === undefined || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(hash);

  return (knownRoute || caseStudyRoute) && validHash;
}

function validateLink(
  issues: ValidationIssue[],
  link: ContentLink,
  path: string,
) {
  if (link.kind === "internal" && !validateInternalHref(link.href)) {
    issue(
      issues,
      "invalid-link",
      `${path}.href`,
      `Unknown or malformed internal route: ${link.href}`,
    );
  }

  if (
    (link.kind === "external" || link.kind === "schedule") &&
    !isValidHttpsUrl(link.href)
  ) {
    issue(
      issues,
      "invalid-link",
      `${path}.href`,
      "External links must use a valid HTTPS URL.",
    );
  }

  if (
    link.kind === "email" &&
    !/^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/.test(link.href)
  ) {
    issue(
      issues,
      "invalid-link",
      `${path}.href`,
      "Email links must contain a valid address.",
    );
  }
}

function validateCta(
  issues: ValidationIssue[],
  cta: CallToActionContent,
  path: string,
) {
  requireText(issues, cta.label, `${path}.label`);
  validateLink(issues, cta.link, `${path}.link`);
}

function validateImageSource(
  issues: ValidationIssue[],
  source: ImageSource,
  path: string,
) {
  if (source.kind === "local") {
    const normalized = source.src.toLowerCase().split("?")[0];
    const validExtension = validImageExtensions.some((extension) =>
      normalized.endsWith(extension),
    );

    if (source.src.includes("..") || !validExtension) {
      issue(
        issues,
        "invalid-image",
        `${path}.src`,
        "Local images must use an absolute public path and a supported image extension.",
      );
    }
  }

  if (source.kind === "remote" && !isValidHttpsUrl(source.src)) {
    issue(
      issues,
      "invalid-image",
      `${path}.src`,
      "Remote images must use HTTPS.",
    );
  }

  if (source.kind === "cms") {
    requireText(issues, source.assetId, `${path}.assetId`);
    if (source.deliveryUrl && !isValidHttpsUrl(source.deliveryUrl)) {
      issue(
        issues,
        "invalid-image",
        `${path}.deliveryUrl`,
        "CMS delivery URLs must use HTTPS.",
      );
    }
  }
}

function validateImage(
  issues: ValidationIssue[],
  image: ContentImage,
  path: string,
) {
  requireText(issues, image.id, `${path}.id`);
  validateImageSource(issues, image.source, `${path}.source`);

  if (!Number.isInteger(image.width) || image.width <= 0) {
    issue(
      issues,
      "invalid-image",
      `${path}.width`,
      "Image width must be a positive integer.",
    );
  }

  if (!Number.isInteger(image.height) || image.height <= 0) {
    issue(
      issues,
      "invalid-image",
      `${path}.height`,
      "Image height must be a positive integer.",
    );
  }

  if (image.focalPoint) {
    for (const coordinate of [image.focalPoint.x, image.focalPoint.y]) {
      if (coordinate < 0 || coordinate > 1) {
        issue(
          issues,
          "invalid-image",
          `${path}.focalPoint`,
          "Focal-point coordinates must be between 0 and 1.",
        );
        break;
      }
    }
  }
}

function validateSeo(issues: ValidationIssue[], seo: SeoContent) {
  requireText(issues, seo.title, "seo.title");
  requireText(issues, seo.description, "seo.description");

  if (seo.title.length > 60) {
    issue(
      issues,
      "invalid-metadata",
      "seo.title",
      "SEO titles should not exceed 60 characters.",
    );
  }

  if (seo.description.length < 50 || seo.description.length > 160) {
    issue(
      issues,
      "invalid-metadata",
      "seo.description",
      "SEO descriptions should contain 50 to 160 characters.",
    );
  }

  if (!isValidHttpsUrl(seo.canonical)) {
    issue(
      issues,
      "invalid-metadata",
      "seo.canonical",
      "Canonical URLs must use HTTPS.",
    );
  }

  if (!isValidHttpsUrl(seo.openGraph.url)) {
    issue(
      issues,
      "invalid-metadata",
      "seo.openGraph.url",
      "Open Graph URLs must use HTTPS.",
    );
  }

  requireText(issues, seo.openGraph.title, "seo.openGraph.title");
  requireText(issues, seo.openGraph.description, "seo.openGraph.description");
  requireText(issues, seo.twitter.title, "seo.twitter.title");
  requireText(issues, seo.twitter.description, "seo.twitter.description");
}

function collectImages(content: HomepageContent) {
  const images: { readonly image: ContentImage; readonly path: string }[] = [];

  if (content.hero.visual.kind === "image") {
    images.push({
      image: content.hero.visual.image,
      path: "hero.visual.image",
    });
  } else if (content.hero.visual.kind === "video") {
    images.push({
      image: content.hero.visual.poster,
      path: "hero.visual.poster",
    });
  } else if (
    content.hero.visual.kind === "cms-media" &&
    content.hero.visual.fallback
  ) {
    images.push({
      image: content.hero.visual.fallback,
      path: "hero.visual.fallback",
    });
  }

  content.featuredWork.projects.forEach((project, projectIndex) => {
    project.images.forEach((image, imageIndex) => {
      images.push({
        image,
        path: `featuredWork.projects[${projectIndex}].images[${imageIndex}]`,
      });
    });
  });

  content.process.steps.forEach((step, index) => {
    if (step.illustration) {
      images.push({
        image: step.illustration,
        path: `process.steps[${index}].illustration`,
      });
    }
  });

  content.trust.items.forEach((item, index) => {
    if (item.kind === "logo") {
      images.push({ image: item.image, path: `trust.items[${index}].image` });
    }
  });

  content.seo.openGraph.images.forEach((image, index) => {
    images.push({ image, path: `seo.openGraph.images[${index}]` });
  });
  content.seo.twitter.images.forEach((image, index) => {
    images.push({ image, path: `seo.twitter.images[${index}]` });
  });

  return images;
}

export function getPublishedFeaturedProjects(
  projects: readonly FeaturedProjectContent[],
) {
  return projects.filter(
    (project) =>
      project.featured &&
      project.publication.state === "published" &&
      project.publication.publish,
  );
}

export function getHomepageSectionVisibility(
  content: HomepageContent,
): HomepageSectionVisibility {
  return {
    featuredWork:
      getPublishedFeaturedProjects(content.featuredWork.projects).length > 0,
    trust: content.trust.items.some((item) => item.status === "approved"),
    faq: content.faq.items.length > 0,
  };
}

export function validateHomepageContent(
  content: HomepageContent,
): ContentValidationResult {
  const issues: ValidationIssue[] = [];

  if (content.status === "approved") {
    const visibility = getHomepageSectionVisibility(content);
    const requiredStatuses = [
      [content.hero.status, "hero.status"],
      [content.valueProposition.status, "valueProposition.status"],
      [content.services.status, "services.status"],
      [content.process.status, "process.status"],
      [content.technicalApproach.status, "technicalApproach.status"],
      [content.whyVilet.status, "whyVilet.status"],
      [content.finalCta.status, "finalCta.status"],
      [content.seo.status, "seo.status"],
      ...(visibility.faq ? [[content.faq.status, "faq.status"]] : []),
    ] as const;

    for (const [status, path] of requiredStatuses) {
      if (status !== "approved") {
        issue(
          issues,
          "unapproved-content",
          path,
          "Visible homepage sections must be approved before production.",
        );
      }
    }

    validateProductionCopy(issues, [
      { value: content.hero.headline, path: "hero.headline" },
      { value: content.hero.supportingCopy, path: "hero.supportingCopy" },
      {
        value: content.valueProposition.headline,
        path: "valueProposition.headline",
      },
      { value: content.valueProposition.body, path: "valueProposition.body" },
      { value: content.services.headline, path: "services.headline" },
      { value: content.services.body, path: "services.body" },
      { value: content.process.headline, path: "process.headline" },
      { value: content.process.body, path: "process.body" },
      {
        value: content.technicalApproach.headline,
        path: "technicalApproach.headline",
      },
      { value: content.technicalApproach.body, path: "technicalApproach.body" },
      { value: content.whyVilet.headline, path: "whyVilet.headline" },
      { value: content.whyVilet.body, path: "whyVilet.body" },
      { value: content.finalCta.headline, path: "finalCta.headline" },
      { value: content.finalCta.body, path: "finalCta.body" },
      { value: content.seo.title, path: "seo.title" },
      { value: content.seo.description, path: "seo.description" },
      ...content.valueProposition.pillars.flatMap((item, index) => [
        { value: item.title, path: `valueProposition.pillars[${index}].title` },
        {
          value: item.summary,
          path: `valueProposition.pillars[${index}].summary`,
        },
      ]),
      ...content.services.items.flatMap((item, index) => [
        { value: item.title, path: `services.items[${index}].title` },
        { value: item.summary, path: `services.items[${index}].summary` },
        ...item.features.map((value, featureIndex) => ({
          value,
          path: `services.items[${index}].features[${featureIndex}]`,
        })),
      ]),
      ...content.process.steps.flatMap((item, index) => [
        { value: item.title, path: `process.steps[${index}].title` },
        { value: item.summary, path: `process.steps[${index}].summary` },
        ...item.deliverables.map((value, deliverableIndex) => ({
          value,
          path: `process.steps[${index}].deliverables[${deliverableIndex}]`,
        })),
      ]),
      ...content.technicalApproach.items.flatMap((item, index) => [
        { value: item.title, path: `technicalApproach.items[${index}].title` },
        {
          value: item.summary,
          path: `technicalApproach.items[${index}].summary`,
        },
      ]),
      ...content.whyVilet.items.flatMap((item, index) => [
        { value: item.title, path: `whyVilet.items[${index}].title` },
        { value: item.summary, path: `whyVilet.items[${index}].summary` },
      ]),
      ...content.faq.items.flatMap((item, index) => [
        { value: item.question, path: `faq.items[${index}].question` },
        ...(item.answer.format === "rich-text"
          ? []
          : [
              {
                value: item.answer.value,
                path: `faq.items[${index}].answer.value`,
              },
            ]),
      ]),
    ]);
  }

  requireText(issues, content.locale, "locale");
  requireText(issues, content.hero.headline, "hero.headline");
  requireText(issues, content.hero.supportingCopy, "hero.supportingCopy");
  validateCta(issues, content.hero.primaryCta, "hero.primaryCta");
  validateCta(issues, content.hero.secondaryCta, "hero.secondaryCta");

  requireText(
    issues,
    content.valueProposition.headline,
    "valueProposition.headline",
  );
  requireText(issues, content.valueProposition.body, "valueProposition.body");
  requireText(issues, content.services.headline, "services.headline");
  requireText(issues, content.services.body, "services.body");
  requireText(issues, content.process.headline, "process.headline");
  requireText(issues, content.process.body, "process.body");
  requireText(
    issues,
    content.technicalApproach.headline,
    "technicalApproach.headline",
  );
  requireText(issues, content.technicalApproach.body, "technicalApproach.body");
  requireText(issues, content.whyVilet.headline, "whyVilet.headline");
  requireText(issues, content.whyVilet.body, "whyVilet.body");
  requireText(issues, content.finalCta.headline, "finalCta.headline");
  requireText(issues, content.finalCta.body, "finalCta.body");
  validateCta(issues, content.finalCta.primaryButton, "finalCta.primaryButton");
  if (content.finalCta.secondaryButton) {
    validateCta(
      issues,
      content.finalCta.secondaryButton,
      "finalCta.secondaryButton",
    );
  }
  if (content.finalCta.schedulingLink) {
    validateLink(
      issues,
      content.finalCta.schedulingLink,
      "finalCta.schedulingLink",
    );
  }

  const requiredArrays = [
    [content.valueProposition.pillars, "valueProposition.pillars"],
    [content.services.items, "services.items"],
    [content.process.steps, "process.steps"],
    [content.technicalApproach.items, "technicalApproach.items"],
    [content.whyVilet.items, "whyVilet.items"],
  ] as const;

  for (const [values, path] of requiredArrays) {
    if (values.length === 0) {
      issue(
        issues,
        "empty-array",
        path,
        "Required section collections cannot be empty.",
      );
    }
  }

  const idEntries = [
    ...content.valueProposition.pillars.map((item, index) => ({
      value: item.id,
      path: `valueProposition.pillars[${index}].id`,
    })),
    ...content.services.items.map((item, index) => ({
      value: item.id,
      path: `services.items[${index}].id`,
    })),
    ...content.featuredWork.projects.map((item, index) => ({
      value: item.id,
      path: `featuredWork.projects[${index}].id`,
    })),
    ...content.process.steps.map((item, index) => ({
      value: item.id,
      path: `process.steps[${index}].id`,
    })),
    ...content.technicalApproach.items.map((item, index) => ({
      value: item.id,
      path: `technicalApproach.items[${index}].id`,
    })),
    ...content.whyVilet.items.map((item, index) => ({
      value: item.id,
      path: `whyVilet.items[${index}].id`,
    })),
    ...content.trust.items.map((item, index) => ({
      value: item.id,
      path: `trust.items[${index}].id`,
    })),
    ...content.faq.items.map((item, index) => ({
      value: item.id,
      path: `faq.items[${index}].id`,
    })),
  ];
  validateUniqueValues(issues, idEntries, "duplicate-id");

  const slugEntries = [
    ...content.services.items.map((item, index) => ({
      value: item.slug,
      path: `services.items[${index}].slug`,
    })),
    ...content.featuredWork.projects.map((item, index) => ({
      value: item.slug,
      path: `featuredWork.projects[${index}].slug`,
    })),
    ...content.faq.items.map((item, index) => ({
      value: item.slug,
      path: `faq.items[${index}].slug`,
    })),
  ];
  validateUniqueValues(issues, slugEntries, "duplicate-slug");

  content.services.items.forEach((service, index) => {
    requireText(issues, service.title, `services.items[${index}].title`);
    requireText(issues, service.summary, `services.items[${index}].summary`);
    if (!isIconName(service.icon)) {
      issue(
        issues,
        "invalid-icon",
        `services.items[${index}].icon`,
        "Unknown icon name.",
      );
    }
    validateCta(issues, service.cta, `services.items[${index}].cta`);
  });

  content.process.steps.forEach((step, index) => {
    requireText(issues, step.summary, `process.steps[${index}].summary`);
    if (!isIconName(step.icon)) {
      issue(
        issues,
        "invalid-icon",
        `process.steps[${index}].icon`,
        "Unknown icon name.",
      );
    }
  });

  content.technicalApproach.items.forEach((item, index) => {
    requireText(
      issues,
      item.summary,
      `technicalApproach.items[${index}].summary`,
    );
    if (!isIconName(item.icon)) {
      issue(
        issues,
        "invalid-icon",
        `technicalApproach.items[${index}].icon`,
        "Unknown icon name.",
      );
    }
  });

  content.featuredWork.projects.forEach((project, index) => {
    validateLink(
      issues,
      project.projectUrl,
      `featuredWork.projects[${index}].projectUrl`,
    );
    if (
      project.publication.state === "published" &&
      project.images.length === 0
    ) {
      issue(
        issues,
        "empty-array",
        `featuredWork.projects[${index}].images`,
        "Published projects require at least one image.",
      );
    }
  });

  content.faq.items.forEach((item, index) => {
    requireText(issues, item.question, `faq.items[${index}].question`);
    if (item.answer.format !== "rich-text") {
      requireText(
        issues,
        item.answer.value,
        `faq.items[${index}].answer.value`,
      );
    }
  });

  const images = collectImages(content);
  images.forEach(({ image, path }) => validateImage(issues, image, path));
  validateUniqueValues(
    issues,
    images.map(({ image, path }) => ({ value: image.id, path: `${path}.id` })),
    "duplicate-id",
  );

  validateSeo(issues, content.seo);

  return { valid: issues.length === 0, issues };
}

export function assertValidHomepageContent(content: HomepageContent) {
  const result = validateHomepageContent(content);

  if (!result.valid) {
    const details = result.issues
      .map((entry) => `${entry.code} at ${entry.path}: ${entry.message}`)
      .join("\n");
    throw new Error(`Invalid homepage content:\n${details}`);
  }

  return content;
}
