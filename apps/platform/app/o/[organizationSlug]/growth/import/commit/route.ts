import { requireCapability, createPlatformServerClient } from "@vilet/auth";
import { NextResponse } from "next/server";
import {
  buildGrowthCandidate,
  CSV_MAX_ROWS,
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
    const body = (await request.json()) as {
      filename?: unknown;
      idempotencyKey?: unknown;
      rows?: unknown;
    };
    if (
      typeof body.filename !== "string" ||
      body.filename.length > 255 ||
      typeof body.idempotencyKey !== "string" ||
      !/^[0-9a-f-]{36}$/iu.test(body.idempotencyKey) ||
      !Array.isArray(body.rows) ||
      body.rows.length < 1 ||
      body.rows.length > CSV_MAX_ROWS
    )
      throw new Error("INVALID_REQUEST");
    const rows = body.rows.map((row) =>
      buildGrowthCandidate(row as Record<string, unknown>),
    );
    if (rows.some((row) => !row)) throw new Error("INVALID_ROWS");
    const db = await createPlatformServerClient();
    if (!db) throw new Error("DATABASE");
    const { data, error } = await db.rpc("commit_growth_csv_import", {
      target_organization_id: context.organizationId,
      import_idempotency_key: body.idempotencyKey,
      import_filename: body.filename,
      import_rows: rows,
    });
    if (error) throw new Error("DATABASE");
    return NextResponse.json(data);
  } catch (error) {
    const reason =
      error instanceof Error ? error.message.toLowerCase() : "unknown";
    recordPlatformEvent("error", "growth.import.commit_failed", {
      route: `/o/${organizationSlug}/growth/import/commit`,
      reason,
    });
    return NextResponse.json(
      { error: "The import could not be committed safely." },
      { status: 400 },
    );
  }
}
