import { homepageContent } from "../homepage";
import type { FaqRecord } from "./types";
export const faqs = homepageContent.faq.items.map((item) => ({
  id: item.id,
  slug: item.slug,
  question: item.question,
  answer: item.answer,
  category: item.category,
  keywords: item.searchKeywords,
  featured: item.featured,
  publication: { state: "published" as const },
  eligibleForStructuredData: false,
})) satisfies readonly FaqRecord[];
