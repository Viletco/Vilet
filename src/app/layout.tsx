import type { Metadata, Viewport } from "next";

import "@/styles/globals.css";
import { defaultOpenGraphImages, defaultTwitterImages } from "@/lib/metadata";

export const metadata: Metadata = {
  metadataBase: new URL("https://vilet.co"),
  title: {
    default: "Vilét — Building what's next.",
    template: "%s | Vilét",
  },
  description: "Official website for Vilét. Building what's next.",
  applicationName: "Vilét",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vilet.co",
    siteName: "Vilét",
    title: "Vilét — Building what's next.",
    description: "Official website for Vilét. Building what's next.",
    images: defaultOpenGraphImages,
  },
  twitter: {
    card: "summary",
    title: "Vilét — Building what's next.",
    description: "Official website for Vilét. Building what's next.",
    images: defaultTwitterImages,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/apple-icon",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          id="shell-behavior"
          dangerouslySetInnerHTML={{
            __html: `if ("scrollRestoration" in history) history.scrollRestoration = "auto";
document.addEventListener("click", function (event) {
  var link = event.target.closest && event.target.closest("[data-skip-link]");
  if (!link) return;
  var target = document.querySelector(link.getAttribute("href"));
  if (!target) return;
  event.preventDefault();
  history.pushState(null, "", link.getAttribute("href"));
  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
