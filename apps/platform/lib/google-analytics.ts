import "server-only";

import { createSign } from "node:crypto";

interface ServiceAccount {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

interface ReportRow {
  dimensionValues?: { value?: string }[];
  metricValues?: { value?: string }[];
}

function encode(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function credentials(): ServiceAccount {
  const raw = process.env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("INSIGHTS_NOT_CONFIGURED");
  try {
    const parsed = JSON.parse(raw) as ServiceAccount;
    if (!parsed.client_email || !parsed.private_key) throw new Error();
    return parsed;
  } catch {
    throw new Error("INSIGHTS_INVALID_CREDENTIALS");
  }
}

async function accessToken() {
  const account = credentials();
  const now = Math.floor(Date.now() / 1000);
  const header = encode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = encode(
    JSON.stringify({
      iss: account.client_email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: account.token_uri ?? "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const assertion = `${unsigned}.${encode(signer.sign(account.private_key))}`;
  const response = await fetch(
    account.token_uri ?? "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion,
      }),
      cache: "no-store",
    },
  );
  if (!response.ok) throw new Error("INSIGHTS_PROVIDER_AUTH_FAILED");
  const body = (await response.json()) as { access_token?: string };
  if (!body.access_token) throw new Error("INSIGHTS_PROVIDER_AUTH_FAILED");
  return body.access_token;
}

async function report(
  propertyId: string,
  dimensions: string[],
  dateFrom: string,
  dateTo: string,
) {
  const allowedProperty = process.env.GOOGLE_ANALYTICS_PROPERTY_ID?.trim();
  if (!allowedProperty || allowedProperty !== propertyId)
    throw new Error("INSIGHTS_PROPERTY_NOT_ALLOWED");
  const token = await accessToken();
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        dateRanges: [{ startDate: dateFrom, endDate: dateTo }],
        dimensions: dimensions.map((name) => ({ name })),
        metrics: [
          "activeUsers",
          "sessions",
          "screenPageViews",
          "keyEvents",
          "engagementRate",
          "averageSessionDuration",
        ].map((name) => ({ name })),
        limit: "10000",
      }),
      cache: "no-store",
    },
  );
  if (!response.ok) throw new Error("INSIGHTS_PROVIDER_REQUEST_FAILED");
  return ((await response.json()) as { rows?: ReportRow[] }).rows ?? [];
}

function number(value?: string) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export async function fetchGoogleAnalytics(
  propertyId: string,
  dateFrom: string,
  dateTo: string,
) {
  const [overview, pages, channels] = await Promise.all([
    report(propertyId, ["date"], dateFrom, dateTo),
    report(propertyId, ["date", "pagePath", "pageTitle"], dateFrom, dateTo),
    report(
      propertyId,
      ["date", "sessionDefaultChannelGroup"],
      dateFrom,
      dateTo,
    ),
  ]);
  const map = (rows: ReportRow[], scope: "overview" | "page" | "channel") =>
    rows.map((row) => {
      const dimensions = row.dimensionValues ?? [];
      const values = row.metricValues ?? [];
      const rawDate = dimensions[0]?.value ?? "";
      const metricDate = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
      return {
        metric_date: metricDate,
        scope,
        dimension_key:
          scope === "overview" ? "" : (dimensions[1]?.value ?? "(not set)"),
        dimension_label:
          scope === "page"
            ? (dimensions[2]?.value ?? dimensions[1]?.value ?? null)
            : scope === "channel"
              ? (dimensions[1]?.value ?? null)
              : null,
        active_users: Math.round(number(values[0]?.value)),
        sessions: Math.round(number(values[1]?.value)),
        page_views: Math.round(number(values[2]?.value)),
        key_events: Math.round(number(values[3]?.value)),
        engagement_rate: number(values[4]?.value),
        average_session_duration: number(values[5]?.value),
      };
    });
  return [
    ...map(overview, "overview"),
    ...map(pages, "page"),
    ...map(channels, "channel"),
  ];
}
