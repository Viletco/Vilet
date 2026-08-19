import { requireCapability, createPlatformServerClient } from "@vilet/auth";
import { NextResponse } from "next/server";
import {
  isStrongDuplicate,
  previewGrowthCsv,
} from "../../../../../../lib/growth-domain";
import { recordPlatformEvent } from "../../../../../../lib/safe-events";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ organizationSlug: string }> },
) {
  const { organizationSlug } = await params;
  const context = await requireCapability(
    organizationSlug,
    "growth.prospecting",
  );
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File))
      return NextResponse.json(
        { error: "Choose a CSV file." },
        { status: 400 },
      );
    const rows = previewGrowthCsv(await file.text());
    const candidates = rows.flatMap((row) =>
      row.candidate && !row.error ? [row.candidate] : [],
    );
    const db = await createPlatformServerClient();
    if (!db) throw new Error("DATABASE");
    const domains = candidates.flatMap((candidate) =>
      candidate.domain_normalized ? [candidate.domain_normalized] : [],
    );
    const names = candidates.map(
      (candidate) => candidate.business_name_normalized,
    );
    const select =
      "domain_normalized, business_name_normalized, city, region, phone_normalized, email_normalized";
    const baseQuery = () =>
      db
        .from("growth_prospects")
        .select(select)
        .eq("organization_id", context.organizationId)
        .eq("status", "active");
    const [domainMatches, nameMatches] = await Promise.all([
      domains.length
        ? baseQuery()
            .in("domain_normalized", [...new Set(domains)])
            .limit(500)
        : Promise.resolve({ data: [] }),
      names.length
        ? baseQuery()
            .in("business_name_normalized", [...new Set(names)])
            .limit(500)
        : Promise.resolve({ data: [] }),
    ]);
    const existing = [
      ...(domainMatches.data ?? []),
      ...(nameMatches.data ?? []),
    ];
    const output = rows.map((row) => ({
      ...row,
      duplicateExisting: row.candidate
        ? existing.some((item) => isStrongDuplicate(row.candidate!, item))
        : false,
    }));
    const accepted = output.flatMap((row) =>
      row.candidate && !row.error && !row.duplicateExisting
        ? [row.candidate]
        : [],
    );
    return NextResponse.json({ rows: output, accepted });
  } catch (error) {
    const reason =
      error instanceof Error &&
      [
        "CSV_SIZE",
        "CSV_ROWS",
        "CSV_EMPTY",
        "CSV_QUOTE",
        "CSV_NAME_HEADER",
      ].includes(error.message)
        ? error.message.toLowerCase()
        : "invalid_csv";
    recordPlatformEvent("warn", "growth.import.preview_failed", {
      route: `/o/${organizationSlug}/growth/import/preview`,
      reason,
    });
    const messages: Record<string, string> = {
      csv_size: "The CSV exceeds 512 KB.",
      csv_rows: "The CSV exceeds 500 rows.",
      csv_empty: "The CSV has no data rows.",
      csv_quote: "The CSV contains an unclosed quoted field.",
      csv_name_header: "Add a Business name or Name column.",
    };
    return NextResponse.json(
      { error: messages[reason] ?? "The CSV could not be validated." },
      { status: 400 },
    );
  }
}
