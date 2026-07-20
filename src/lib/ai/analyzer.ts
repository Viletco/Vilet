import "server-only";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { isPrivateAddress, parsePublicWebsiteUrl } from "./url-security";

const MAX_RESPONSE_BYTES = 1_000_000;
const MAX_REDIRECTS = 3;

async function validateResolvedDestination(url: URL) {
  const addresses = isIP(url.hostname)
    ? [{ address: url.hostname }]
    : await lookup(url.hostname, { all: true, verbatim: true });
  if (
    addresses.length === 0 ||
    addresses.some(({ address }) => isPrivateAddress(address))
  )
    throw new Error(
      "The destination resolves to a private or unsupported network address.",
    );
}

export async function fetchPublicHomepage(value: string) {
  let url = parsePublicWebsiteUrl(value);
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    await validateResolvedDestination(url);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(url, {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "User-Agent": "ViletWebsiteAnalyzer/1.0 (+https://vilet.co)",
        },
      });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location || redirect === MAX_REDIRECTS)
          throw new Error("The website redirected too many times.");
        url = parsePublicWebsiteUrl(new URL(location, url).toString());
        continue;
      }
      const type = response.headers.get("content-type")?.split(";")[0]?.trim();
      if (!type || !["text/html", "application/xhtml+xml"].includes(type))
        throw new Error("The website did not return supported HTML content.");
      const declaredLength = Number(response.headers.get("content-length"));
      if (
        Number.isFinite(declaredLength) &&
        declaredLength > MAX_RESPONSE_BYTES
      )
        throw new Error("The website response is too large to analyze safely.");
      if (!response.body)
        throw new Error("The website returned no readable content.");
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        size += chunk.byteLength;
        if (size > MAX_RESPONSE_BYTES) {
          await reader.cancel();
          throw new Error(
            "The website response is too large to analyze safely.",
          );
        }
        chunks.push(chunk);
      }
      return {
        finalUrl: url.toString(),
        html: new TextDecoder().decode(Buffer.concat(chunks)),
        fetchedAt: new Date().toISOString(),
      };
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error("The website could not be safely retrieved.");
}
