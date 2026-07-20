import { isIP } from "node:net";

const blockedHostnames = new Set([
  "localhost",
  "localhost.localdomain",
  "metadata.google.internal",
]);

function ipv4Number(address: string) {
  return (
    address
      .split(".")
      .reduce((value, part) => (value << 8) + Number(part), 0) >>> 0
  );
}

export function isPrivateAddress(address: string) {
  const normalized = address.toLowerCase().split("%")[0];
  if (isIP(normalized) === 4) {
    const value = ipv4Number(normalized);
    return [
      ["0.0.0.0", 8],
      ["10.0.0.0", 8],
      ["100.64.0.0", 10],
      ["127.0.0.0", 8],
      ["169.254.0.0", 16],
      ["172.16.0.0", 12],
      ["192.0.0.0", 24],
      ["192.168.0.0", 16],
      ["198.18.0.0", 15],
      ["224.0.0.0", 4],
    ].some(
      ([base, bits]) =>
        value >>> (32 - Number(bits)) ===
        ipv4Number(String(base)) >>> (32 - Number(bits)),
    );
  }
  if (isIP(normalized) === 6)
    return (
      normalized === "::" ||
      normalized === "::1" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      /^fe[89ab]/.test(normalized) ||
      normalized.startsWith("ff") ||
      normalized.startsWith("::ffff:")
    );
  return true;
}

export function parsePublicWebsiteUrl(value: string) {
  if (value.length > 2048) throw new Error("URL is too long.");
  const url = new URL(value);
  if (url.protocol !== "http:" && url.protocol !== "https:")
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  if (url.username || url.password)
    throw new Error("URLs containing credentials are not supported.");
  if (url.port && !["80", "443"].includes(url.port))
    throw new Error("Nonstandard ports are not supported.");
  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
  if (
    !hostname ||
    blockedHostnames.has(hostname) ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".localhost")
  )
    throw new Error("Private or internal destinations are not supported.");
  if (isIP(hostname) && isPrivateAddress(hostname))
    throw new Error("Private or internal destinations are not supported.");
  url.hash = "";
  return url;
}
