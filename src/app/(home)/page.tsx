import type { Metadata } from "next";

import {
  FaqSection,
  FinalCtaSection,
  HeroSection,
  ProcessSection,
  ServicesSection,
  TechnicalApproachSection,
  ValuePropositionSection,
  WhyViletSection,
} from "@/components/sections/home";
import { homepageContent, homepageSectionVisibility } from "@/content/homepage";
import { defaultOpenGraphImages, defaultTwitterImages } from "@/lib/metadata";

const { seo } = homepageContent;

export const metadata: Metadata = {
  title: { absolute: seo.title },
  description: seo.description,
  keywords: [...seo.keywords],
  alternates: { canonical: seo.canonical },
  robots: { index: seo.robots.index, follow: seo.robots.follow },
  openGraph: {
    title: seo.openGraph.title,
    description: seo.openGraph.description,
    type: seo.openGraph.type,
    url: seo.openGraph.url,
    siteName: seo.openGraph.siteName,
    images: defaultOpenGraphImages,
  },
  twitter: {
    card: seo.twitter.card,
    title: seo.twitter.title,
    description: seo.twitter.description,
    images: defaultTwitterImages,
  },
};

export default function Home() {
  if (homepageSectionVisibility.featuredWork || homepageSectionVisibility.trust)
    throw new Error(
      "A newly visible evidence section needs an approved homepage renderer.",
    );
  return (
    <>
      <HeroSection content={homepageContent.hero} />
      <ValuePropositionSection content={homepageContent.valueProposition} />
      <ServicesSection content={homepageContent.services} />
      <ProcessSection content={homepageContent.process} />
      <TechnicalApproachSection content={homepageContent.technicalApproach} />
      <WhyViletSection content={homepageContent.whyVilet} />
      {homepageSectionVisibility.faq && (
        <FaqSection content={homepageContent.faq} />
      )}
      <FinalCtaSection content={homepageContent.finalCta} />
    </>
  );
}
