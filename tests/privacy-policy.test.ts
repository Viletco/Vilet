import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

function source(path: string) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

const privacyPage = source("src/app/(pages)/privacy/page.tsx");
const termsPage = source("src/app/(pages)/terms/page.tsx");
const legalConfig = source("src/config/legal.ts");
const contactPage = source("src/app/(pages)/contact/page.tsx");
const contactForm = source("src/components/forms/contact-form.tsx");
const footerSettings = source("src/content/settings/content.ts");
const sitemap = source("src/app/sitemap.ts");
const robots = source("src/app/robots.ts");
const legalPageComponents = source("src/components/legal/legal-page.tsx");

test("privacy policy has required public structure and dates", () => {
  assert.equal((legalPageComponents.match(/level=\{1\}/g) ?? []).length, 1);
  assert.equal((privacyPage.match(/level=\{1\}/g) ?? []).length, 0);
  assert.equal((termsPage.match(/level=\{1\}/g) ?? []).length, 0);
  for (const text of [
    "Privacy Policy",
    "Effective date:",
    "Last updated:",
    "Information We Collect",
    "How We Use Information",
    "Contact Form and Email Delivery",
    "Communication Preferences",
    "Spam and Abuse Prevention",
    "Cookies, Browser Storage, Analytics, and Advertising",
    "Vilét AI",
    "Website Analyzer",
    "Service Providers",
    "Data Retention",
    "Your Choices and Privacy Requests",
    "Security",
    "Children’s Privacy",
    "Changes to This Policy",
    "Contact Vilét About Privacy",
  ])
    assert.match(
      privacyPage,
      new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );

  assert.match(legalConfig, /effectiveDate: "July 28, 2026"/);
  assert.match(legalConfig, /lastUpdated: "August 2, 2026"/);
});

test("privacy contact is centralized and conditional", () => {
  assert.match(legalConfig, /privacyEmail: "privacy@vilet\.co"/);
  assert.match(privacyPage, /privacyMailto/);
  assert.doesNotMatch(privacyPage, /privacy@vilet\.co/);
  assert.match(privacyPage, /deliveryEnabled &&/);
  assert.match(privacyPage, /mailbox or forwarding address\s+must be verified/);
});

test("privacy policy identifies the operator without unsupported claims or personal email", () => {
  const publicSources = `${privacyPage}\n${termsPage}\n${legalConfig}`;
  assert.match(legalConfig, /operatorName: "Caiden Sloan"/);
  assert.match(
    legalConfig,
    /operatorDescription: "Caiden Sloan, doing business as Vilét"/,
  );
  assert.doesNotMatch(publicSources, /starter notice|placeholder/i);
  assert.doesNotMatch(publicSources, /gmail\.com/i);
  assert.doesNotMatch(
    publicSources,
    /GDPR compliant|CCPA compliant|(?:is|remains|will be) completely secure/i,
  );
  assert.doesNotMatch(
    publicSources,
    /LLC|Corporation|Incorporated|sole propriet/i,
  );
});

test("operational claims follow validated configuration", () => {
  assert.match(privacyPage, /getContactConfig\(\)/);
  assert.match(privacyPage, /getAiConfig\(\)/);
  assert.match(privacyPage, /deliveryEnabled \?/);
  assert.match(privacyPage, /!aiEnabled &&/);
  assert.match(privacyPage, /!analyzerEnabled &&/);
  assert.match(privacyPage, /robots: \{ index: false/);
  assert.match(contactPage, /getContactConfig\(\)/);
  assert.match(contactPage, /deliveryEnabled\s+\?/);
});

test("retention and form disclosures match implementation", () => {
  for (const field of [
    "name",
    "company",
    "email",
    "website",
    "serviceId",
    "projectSummary",
    "goals",
    "budgetRange",
    "timeline",
    "preferredContactMethod",
  ])
    assert.match(contactForm, new RegExp(`name="${field}"`));

  assert.doesNotMatch(contactForm, /name="phone"/);
  assert.match(privacyPage, /does not request a phone number/);
  assert.match(contactForm, /sessionStorage\.removeItem\("vilet-ai-handoff"\)/);
  assert.match(privacyPage, /rate-limit identifiers expire after 15 minutes/);
  assert.match(privacyPage, /identifiers expire after 5 minutes/);
});

test("approved Terms is navigable but remains non-indexed until indexing authorization", () => {
  for (const text of [
    "Effective date:",
    "Last updated:",
    "Acceptance of the Terms",
    "No Client Relationship",
    "Vilét AI and Website Analyzer",
    "Acceptable and Prohibited Uses",
    "Intellectual Property",
    "Third-Party Services and Links",
    "Liability",
    "Governing Law",
    "Changes to the Terms",
  ])
    assert.match(
      `${termsPage}\n${legalConfig}`,
      new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );

  assert.match(termsPage, /robots: \{ index: false/);
  assert.match(legalConfig, /approvedForNavigation: true/);
  assert.match(footerSettings, /approvedForNavigation/);
  assert.doesNotMatch(
    termsPage,
    /draft|pending legal review|attorney review required/i,
  );
  assert.doesNotMatch(sitemap, /\/terms/);
  assert.match(robots, /"\/terms"/);
});
