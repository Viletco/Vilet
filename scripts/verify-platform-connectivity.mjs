import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import { loadPlatformEnvironment } from "./lib/platform-bootstrap.mjs";

const target = {
  environment: "",
  projectRef: "",
  environmentFile: ".env.local",
};
for (const argument of process.argv.slice(2)) {
  if (argument.startsWith("--environment="))
    target.environment = argument.slice("--environment=".length);
  else if (argument.startsWith("--project-ref="))
    target.projectRef = argument.slice("--project-ref=".length);
  else if (argument.startsWith("--credential-file="))
    target.environmentFile = argument.slice("--credential-file=".length);
  else throw new Error(`Unknown connectivity argument: ${argument}`);
}
if (!["staging", "production"].includes(target.environment))
  throw new Error("--environment must be staging or production.");
if (!/^[a-z0-9]{20}$/u.test(target.projectRef))
  throw new Error("--project-ref must be an explicit Supabase project ref.");

const environment = loadPlatformEnvironment(
  process.cwd(),
  target.environmentFile,
);
for (const name of [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
]) {
  if (!environment[name]) throw new Error(`${name} is missing.`);
}
if (
  new URL(environment.NEXT_PUBLIC_SUPABASE_URL).hostname !==
  `${target.projectRef}.supabase.co`
)
  throw new Error("Configured Supabase URL does not match --project-ref.");

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
if (anonymousError)
  throw new Error("The publishable client could not reach Supabase.");
if ((anonymousCapabilities ?? []).length !== 0)
  throw new Error("Anonymous access unexpectedly bypassed capability RLS.");
if (adminResult.error)
  throw new Error("The privileged server client could not query Supabase.");
if (adminResult.count !== 13)
  throw new Error("The seeded capability count is incorrect.");

console.log(`Supabase connectivity (${target.environment}): PASS`);
console.log("Anonymous capability access denied by RLS: PASS");
console.log("Privileged capability count (13): PASS");
