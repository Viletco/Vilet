import "server-only";

import { createClient } from "@supabase/supabase-js";
import {
  validatePlatformEnvironment,
  type PlatformEnvironment,
} from "@vilet/shared-config";

export function createPlatformAdminClient(
  environment: PlatformEnvironment = process.env as PlatformEnvironment,
) {
  const config = validatePlatformEnvironment(environment);
  if (config.authMode !== "supabase" || !config.serviceRoleKey)
    throw new Error(
      "The Supabase service role is unavailable. Privileged database access is disabled.",
    );

  return createClient(config.supabaseUrl.href, config.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
