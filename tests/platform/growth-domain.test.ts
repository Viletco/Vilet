import assert from "node:assert/strict";
import test from "node:test";
import {
  buildGrowthCandidate,
  CSV_MAX_ROWS,
  isStrongDuplicate,
  normalizeBusinessName,
  normalizeDomain,
  normalizeEmail,
  normalizePhone,
  previewGrowthCsv,
} from "../../apps/platform/lib/growth-domain.ts";

test("domain normalization handles protocol, www, paths, case, and conservative subdomains", () => {
  assert.equal(
    normalizeDomain("HTTPS://WWW.Example.COM/path?q=1#top"),
    "example.com",
  );
  assert.equal(normalizeDomain("http://example.com/"), "example.com");
  assert.equal(normalizeDomain("shop.example.com/path"), "shop.example.com");
  assert.equal(normalizeDomain("javascript:alert(1)"), null);
  assert.equal(normalizeDomain("localhost"), null);
});

test("business, email, and phone normalization is deterministic and conservative", () => {
  assert.equal(normalizeBusinessName("  Acme, LLC  "), "acme");
  assert.equal(normalizeBusinessName("A & B Studio"), "a and b studio");
  assert.equal(normalizeEmail(" Sales@Example.COM "), "sales@example.com");
  assert.equal(normalizeEmail("invalid"), null);
  assert.equal(normalizePhone("+1 (212) 555-0100"), "+12125550100");
  assert.equal(normalizePhone("123"), null);
});

test("strong duplicate signals remain tenant-local inputs and ambiguous names do not merge", () => {
  const candidate = buildGrowthCandidate({
    business_name: "Acme",
    website: "https://www.acme.com",
    city: "Boston",
  })!;
  assert.equal(
    isStrongDuplicate(candidate, {
      domain_normalized: "acme.com",
      business_name_normalized: "different",
      city: null,
      region: null,
      phone_normalized: null,
      email_normalized: null,
    }),
    true,
  );
  assert.equal(
    isStrongDuplicate(candidate, {
      domain_normalized: null,
      business_name_normalized: "acme",
      city: "Portland",
      region: null,
      phone_normalized: null,
      email_normalized: null,
    }),
    false,
  );
  assert.equal(
    isStrongDuplicate(candidate, {
      domain_normalized: null,
      business_name_normalized: "acme",
      city: "Boston",
      region: null,
      phone_normalized: null,
      email_normalized: null,
    }),
    true,
  );
});

test("CSV preview validates rows, quotes, duplicates, and limits without writing", () => {
  const preview = previewGrowthCsv(
    'Business name,Website,City\n"Acme, Inc",https://www.acme.com,Boston\nAcme Duplicate,http://acme.com/path,Boston\nBroken,,',
  );
  assert.equal(preview.length, 3);
  assert.equal(preview[0]?.candidate?.domain_normalized, "acme.com");
  assert.equal(preview[1]?.duplicateInFile, true);
  assert.equal(preview[2]?.candidate?.business_name, "Broken");
  assert.throws(
    () => previewGrowthCsv("Website\nhttps://example.com"),
    /CSV_NAME_HEADER/u,
  );
  assert.throws(
    () =>
      previewGrowthCsv(
        `Name\n${Array.from({ length: CSV_MAX_ROWS + 1 }, (_, index) => `Business ${index}`).join("\n")}`,
      ),
    /CSV_ROWS/u,
  );
  assert.throws(() => previewGrowthCsv('Name\n"unclosed'), /CSV_QUOTE/u);
});
