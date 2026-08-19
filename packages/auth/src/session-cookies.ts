export const PLATFORM_SESSION_COOKIE_MAX_AGE_SECONDS = 90 * 24 * 60 * 60;

type SessionCookieOptions = {
  domain?: string;
  maxAge?: number;
  path?: string;
  sameSite?: boolean | "lax" | "strict" | "none";
  secure?: boolean;
  [key: string]: unknown;
};

export type SessionCookieWrite = {
  name: string;
  value: string;
  options: SessionCookieOptions;
};

/**
 * Keep Supabase session cookies persistent and host-only. Supabase remains the
 * authority for session validity; this only prevents the browser from dropping
 * a still-valid rotating refresh session when it closes.
 */
export function applyPlatformSessionCookiePolicy<T extends SessionCookieWrite>(
  values: readonly T[],
): T[] {
  return values.map((entry) => {
    const options = { ...entry.options };

    // Deliberately omit Domain so Preview, app.vilet.co, and vilet.co cannot
    // share authentication state.
    delete options.domain;

    // Supabase uses Max-Age=0 for stale chunks, logout, and invalid sessions.
    // Never turn a deletion into a persistent cookie.
    if (options.maxAge !== 0) {
      options.maxAge = PLATFORM_SESSION_COOKIE_MAX_AGE_SECONDS;
    }

    return { ...entry, options };
  });
}
