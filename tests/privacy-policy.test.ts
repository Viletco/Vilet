import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const page = readFileSync(
  new URL("../src/app/(pages)/privacy/page.tsx", import.meta.url),
  "utf8",
);
const contactForm = readFileSync(
  new URL("../src/components/forms/contact-form.tsx", import.meta.url),
  "utf8",
);

test("privacy policy has required public structure and dates", () => {
  assert.equal((page.match(/level=\{1\}/g) ?? []).length, 1);
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
    assert.match(page, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("privacy policy excludes internal and unsupported claims", () => {
  assert.doesNotMatch(page, /starter notice/i);
  assert.doesNotMatch(page, /src\/|docs\/|config\/|\.env/i);
  assert.doesNotMatch(page, /placeholder/i);
  assert.doesNotMatch(page, /\b\d+\s+(days?|months?|years?)\b/i);
  assert.doesNotMatch(
    page,
    /GDPR compliant|CCPA compliant|(?:is|remains|will be) completely secure/i,
  );
  assert.doesNotMatch(page, /caidensloan|privacy@vilet\.co/i);
});

test("operational claims follow validated configuration", () => {
  assert.match(page, /getContactConfig\(\)/);
  assert.match(page, /getAiConfig\(\)/);
  assert.match(page, /deliveryEnabled \?/);
  assert.match(page, /aiEnabled \?/);
  assert.match(page, /analyzerEnabled \?/);
  assert.match(page, /robots: \{ index: false/);
});

test("contact and handoff disclosures match the implementation", () => {
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
  assert.match(page, /does not currently request a phone number/);
  assert.match(contactForm, /sessionStorage\.removeItem\("vilet-ai-handoff"\)/);
  assert.match(
    page,
    /removes that summary from\s+session storage after reading it/,
  );
});
