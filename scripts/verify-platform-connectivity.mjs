import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const environmentPath = path.join(
  process.cwd(),
  "apps",
  "platform",
  ".env.local",
);

const environment = Object.fromEntries(
  fs
    .readFileSync(environmentPath, "utf8")
    .split(/\r?\n/u)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1).trim()];
    }),
);

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

for (const name of required) {
  if (!environment[name]) throw new Error(`${name} is missing.`);
}

const publicClient = createClient(
  environment.NEXT_PUBLIC_SUPABASE_URL,
  environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);
const adminClient = createClient(
  environment.NEXT_PUBLIC_SUPABASE_URL,
  environment.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const [{ data: anonymousCapabilities, error: anonymousError }, adminResult] =
  await Promise.all([
    publicClient.from("capabilities").select("key"),
    adminClient.from("capabilities").select("key", { count: "exact" }),
  ]);

if (anonymousError) {
  throw new Error(
    `The publishable client could not reach Supabase: ${anonymousError.message}`,
  );
}
if ((anonymousCapabilities ?? []).length !== 0) {
  throw new Error("Anonymous access unexpectedly bypassed capability RLS.");
}
if (adminResult.error) {
  throw new Error(
    `The privileged server client could not query Supabase: ${adminResult.error.message}`,
  );
}
if (adminResult.count !== 13) {
  throw new Error(
    `Expected 13 seeded capabilities, received ${adminResult.count ?? "unknown"}.`,
  );
}

console.log("Supabase connectivity: PASS");
console.log("Anonymous capability access denied by RLS: PASS");
console.log("Privileged capability count (13): PASS");
