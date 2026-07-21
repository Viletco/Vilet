import assert from "node:assert/strict";
import test from "node:test";
import {
  isPrivateAddress,
  parsePublicWebsiteUrl,
} from "../../src/lib/ai/url-security.ts";

test("allows conventional public HTTP and HTTPS URLs", () => {
  assert.equal(
    parsePublicWebsiteUrl("https://example.com/path#fragment").toString(),
    "https://example.com/path",
  );
});

test("blocks non-HTTP protocols, credentials, and nonstandard ports", () => {
  for (const url of [
    "file:///etc/passwd",
    "ftp://example.com",
    "https://user:pass@example.com",
    "https://example.com:8080",
  ])
    assert.throws(() => parsePublicWebsiteUrl(url));
});

test("blocks localhost and internal hostname forms", () => {
  for (const url of [
    "http://localhost",
    "http://service.internal",
    "http://test.local",
  ])
    assert.throws(() => parsePublicWebsiteUrl(url));
});

test("blocks private, loopback, link-local, metadata, and mapped addresses", () => {
  for (const address of [
    "127.0.0.1",
    "10.0.0.1",
    "172.16.0.1",
    "192.168.1.1",
    "169.254.169.254",
    "::1",
    "fd00::1",
    "fe80::1",
    "::ffff:127.0.0.1",
  ])
    assert.equal(isPrivateAddress(address), true, address);
});

test("recognizes representative public addresses", () => {
  assert.equal(isPrivateAddress("8.8.8.8"), false);
  assert.equal(isPrivateAddress("2606:4700:4700::1111"), false);
});
