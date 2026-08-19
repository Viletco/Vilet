"use client";

import { useState } from "react";
import { fieldClass, primaryButton, secondaryButton } from "./growth-nav";

interface PreviewRow {
  row: number;
  error: string | null;
  duplicateExisting: boolean;
  candidate: {
    business_name: string;
    domain_normalized: string | null;
    city: string | null;
  } | null;
}

export function CsvImport({ slug }: { slug: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [payload, setPayload] = useState<unknown[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [filename, setFilename] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState("");
  async function preview() {
    if (!file) return;
    setBusy(true);
    setMessage("");
    const body = new FormData();
    body.set("file", file);
    const response = await fetch(`/o/${slug}/growth/import/preview`, {
      method: "POST",
      body,
    });
    const result = (await response.json()) as {
      rows?: PreviewRow[];
      accepted?: unknown[];
      error?: string;
    };
    setBusy(false);
    if (!response.ok) {
      setMessage(result.error ?? "The file could not be previewed.");
      return;
    }
    setRows(result.rows ?? []);
    setPayload(result.accepted ?? []);
    setFilename(file.name);
    setIdempotencyKey(crypto.randomUUID());
  }
  async function commit() {
    setBusy(true);
    const response = await fetch(`/o/${slug}/growth/import/commit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        filename,
        idempotencyKey,
        rows: payload,
      }),
    });
    const result = (await response.json()) as {
      accepted_count?: number;
      duplicate_count?: number;
      error?: string;
    };
    setBusy(false);
    if (!response.ok) {
      setMessage(result.error ?? "The import could not be committed.");
      return;
    }
    setMessage(
      `Import complete: ${result.accepted_count ?? 0} added, ${result.duplicate_count ?? 0} duplicates skipped.`,
    );
    setRows([]);
    setPayload([]);
  }
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
      <h2 className="text-lg font-semibold">Import CSV</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Up to 500 rows or 512 KB. Nothing is written until you confirm the
        preview.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="grid flex-1 gap-2 text-sm font-medium">
          <span>CSV file</span>
          <input
            className={`${fieldClass} py-2`}
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>
        <button
          type="button"
          className={secondaryButton}
          disabled={!file || busy}
          onClick={preview}
        >
          {busy ? "Working…" : "Preview import"}
        </button>
      </div>
      {message && (
        <p role="status" className="mt-4 text-sm text-[var(--accent-light)]">
          {message}
        </p>
      )}
      {rows.length > 0 && (
        <div className="mt-6">
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <ul className="divide-y divide-[var(--border)]">
              {rows.slice(0, 20).map((row) => (
                <li
                  key={row.row}
                  className="grid gap-1 p-3 text-sm sm:grid-cols-[4rem_1fr_1fr]"
                >
                  <span className="text-[var(--quiet)]">Row {row.row}</span>
                  <span>{row.candidate?.business_name ?? "Invalid row"}</span>
                  <span
                    className={
                      row.error || row.duplicateExisting
                        ? "text-amber-300"
                        : "text-emerald-300"
                    }
                  >
                    {row.error ??
                      (row.duplicateExisting ? "Existing duplicate" : "Ready")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-xs text-[var(--quiet)]">
            Showing up to 20 of {rows.length} rows. {payload.length} valid
            unique rows will be committed.
          </p>
          <button
            type="button"
            className={`${primaryButton} mt-4`}
            disabled={!payload.length || busy}
            onClick={commit}
          >
            Confirm import
          </button>
        </div>
      )}
    </section>
  );
}
