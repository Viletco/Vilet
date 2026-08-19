export type PlatformAuthMode = "disabled" | "supabase";

export interface PlatformEnvironment {
  readonly PLATFORM_AUTH_MODE?: string;
  readonly NEXT_PUBLIC_APP_URL?: string;
  readonly NEXT_PUBLIC_SUPABASE_URL?: string;
  readonly NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly SUPABASE_SERVICE_ROLE_KEY?: string;
}

export type PlatformConfig =
  | {
      readonly authMode: "disabled";
      readonly appUrl: URL;
    }
  | {
      readonly authMode: "supabase";
      readonly appUrl: URL;
      readonly supabaseUrl: URL;
      readonly publishableKey: string;
      readonly serviceRoleKey?: string;
    };

const LOCAL_APP_URL = "http://localhost:3001";

function parseUrl(value: string, label: string, allowHttpLocalhost = false) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid absolute URL.`);
  }
  const localHttp =
    allowHttpLocalhost &&
    url.protocol === "http:" &&
    url.hostname === "localhost";
  if (url.protocol !== "https:" && !localHttp)
    throw new Error(`${label} must use HTTPS except on localhost.`);
  if (url.username || url.password || url.search || url.hash)
    throw new Error(
      `${label} must not contain credentials, query parameters, or fragments.`,
    );
  return url;
}

export function validatePlatformEnvironment(
  environment: PlatformEnvironment,
): PlatformConfig {
  const authMode = environment.PLATFORM_AUTH_MODE ?? "disabled";
  if (authMode !== "disabled" && authMode !== "supabase")
    throw new Error("PLATFORM_AUTH_MODE must be disabled or supabase.");

  const appUrl = parseUrl(
    environment.NEXT_PUBLIC_APP_URL ?? LOCAL_APP_URL,
    "NEXT_PUBLIC_APP_URL",
    true,
  );
  if (authMode === "disabled") return { authMode, appUrl };

  if (!environment.NEXT_PUBLIC_SUPABASE_URL)
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required in supabase mode.");
  if (!environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim())
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required in supabase mode.",
    );

  return {
    authMode,
    appUrl,
    supabaseUrl: parseUrl(
      environment.NEXT_PUBLIC_SUPABASE_URL,
      "NEXT_PUBLIC_SUPABASE_URL",
    ),
    publishableKey: environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.trim(),
    serviceRoleKey: environment.SUPABASE_SERVICE_ROLE_KEY?.trim() || undefined,
  };
}

export function resolvePlatformAppUrl(
  configuredAppUrl: URL,
  deployment: { readonly vercelEnv?: string; readonly vercelUrl?: string },
) {
  if (deployment.vercelEnv !== "preview" || !deployment.vercelUrl)
    return configuredAppUrl;
  const previewUrl = parseUrl(`https://${deployment.vercelUrl}`, "VERCEL_URL");
  if (!previewUrl.hostname.endsWith(".vercel.app"))
    throw new Error("VERCEL_URL must be a Vercel preview hostname.");
  return previewUrl;
}
