import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001",
  ),
  title: { default: "Vilét Platform", template: "%s | Vilét" },
  description: "The private Vilét application.",
  robots: { index: false, follow: false, nocache: true },
};
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "hsl(250 16% 4.5%)",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
