export interface GrowthDiscoveryQueryInput {
  industry: string;
  location: string;
  keywords: string | null;
}

export function hunterDiscoveryQueries(
  input: GrowthDiscoveryQueryInput,
): string[] {
  const base = `${input.industry} located in ${input.location}`;
  const keywords = input.keywords
    ?.split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  if (!keywords?.length) return [base];

  return [
    `${base}. Prefer businesses matching any of these characteristics: ${keywords.join(", ")}.`,
    base,
  ];
}
