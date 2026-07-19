import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/dev/"] },
    sitemap: "https://vilet.co/sitemap.xml",
    host: "https://vilet.co",
  };
}
