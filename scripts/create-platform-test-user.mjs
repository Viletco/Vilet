import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import {
  loadPlatformEnvironment,
  parseBootstrapArguments,
  validateBootstrapTarget,
} from "./lib/platform-bootstrap.mjs";

const options = parseBootstrapArguments(process.argv.slice(2));
if (options.environment !== "staging")
  throw new Error("Test identities may be created only in staging.");
if (options.apply)
  throw new Error("The staging test-identity command does not use --apply.");
const environment = loadPlatformEnvironment(
  process.cwd(),
  options.environmentFile,
);
validateBootstrapTarget(options, environment.NEXT_PUBLIC_SUPABASE_URL);

const client = createClient(
  environment.NEXT_PUBLIC_SUPABASE_URL,
  environment.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);
const { data: existing, error: listError } = await client.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});
if (listError) throw new Error("Staging identities could not be inspected.");
const existingUser = existing.users.find(
  (user) => user.email?.toLowerCase() === options.userEmail,
);
if (existingUser) {
  console.log("Approved staging identity already exists: PASS");
  process.exit(0);
}
const { error: createError } = await client.auth.admin.createUser({
  email: options.userEmail,
  email_confirm: true,
  user_metadata: { environment: "staging", purpose: "phase-a-verification" },
});
if (createError) throw new Error("The staging identity could not be created.");
console.log(
  "Approved staging identity created without tenant privileges: PASS",
);
