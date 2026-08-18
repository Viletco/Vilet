import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !email.includes("@"))
  throw new Error("A valid test email is required.");

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

const client = createClient(
  environment.NEXT_PUBLIC_SUPABASE_URL,
  environment.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const { data: existing, error: listError } = await client.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});
if (listError) throw listError;

const existingUser = existing.users.find(
  (user) => user.email?.toLowerCase() === email,
);

if (existingUser) {
  console.log("Approved staging identity already exists: PASS");
  process.exit(0);
}

const { error: createError } = await client.auth.admin.createUser({
  email,
  email_confirm: true,
  user_metadata: { environment: "staging", purpose: "phase-a-verification" },
});
if (createError) throw createError;

console.log(
  "Approved staging identity created without tenant privileges: PASS",
);
