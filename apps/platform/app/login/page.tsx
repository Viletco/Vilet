import { redirect } from "next/navigation";
import { getPlatformConfig, getVerifiedUser } from "@vilet/auth";
import { requestMagicLink, signInWithPassword } from "./actions";
import { BrandMark } from "../../components/brand-mark";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (await getVerifiedUser()) redirect("/");
  const query = await searchParams;
  const config = getPlatformConfig();
  const unavailable =
    config.authMode === "disabled" || query.configuration === "unavailable";
  const passwordSelected = query.method === "password";
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_80%_15%,hsl(266_100%_66%/0.14),transparent_45%)] px-5 py-12">
      <div
        aria-hidden="true"
        className="via-primary/70 absolute inset-x-0 bottom-[18%] h-px -rotate-6 bg-gradient-to-r from-transparent to-transparent"
      />
      <section className="animate-scale-in command-surface w-full max-w-md p-7 sm:p-9">
        <a
          href="https://vilet.co"
          className="inline-flex items-center gap-2 rounded-md font-semibold"
          aria-label="Vilét website"
        >
          <BrandMark className="h-9 w-10" />
          Vilét
        </a>
        <p className="text-primary/80 mt-9 text-[11px] font-semibold tracking-[0.1em] uppercase">
          Vilét account
        </p>
        <h1 className="vilet-product-title mt-3 text-[30px]">
          Sign in to Vilét.
        </h1>
        <p className="text-muted-foreground mt-3 text-[13.5px] leading-6">
          Use your password or request a secure, single-use sign-in link.
        </p>
        {unavailable ? (
          <div className="border-border text-muted-foreground mt-6 rounded-xl border bg-white/[0.02] p-4 text-[13px] leading-6">
            <strong className="text-foreground block">
              Sign-in is temporarily unavailable.
            </strong>
            Please try again later or contact Vilét if you need help accessing
            your account.
          </div>
        ) : (
          <div className="mt-6">
            <div
              className="border-border grid grid-cols-2 border-b"
              role="tablist"
              aria-label="Sign-in method"
            >
              <a
                href="/login?method=password"
                role="tab"
                aria-selected={passwordSelected}
                className={`border-b-2 px-3 py-3 text-center text-[12px] font-semibold ${passwordSelected ? "border-primary text-foreground" : "text-muted-foreground border-transparent"}`}
              >
                Password
              </a>
              <a
                href="/login?method=magic-link"
                role="tab"
                aria-selected={!passwordSelected}
                className={`border-b-2 px-3 py-3 text-center text-[12px] font-semibold ${!passwordSelected ? "border-primary text-foreground" : "text-muted-foreground border-transparent"}`}
              >
                Magic link
              </a>
            </div>

            {passwordSelected ? (
              <form action={signInWithPassword} className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="password-email"
                    className="text-[12.5px] font-medium"
                  >
                    Email address
                  </label>
                  <input
                    id="password-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    className="border-input bg-background text-foreground mt-2 h-11 w-full rounded-lg border px-3 text-[13px]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="text-[12.5px] font-medium"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="border-input bg-background text-foreground mt-2 h-11 w-full rounded-lg border px-3 text-[13px]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground h-11 w-full rounded-lg px-5 text-[12.5px] font-semibold transition hover:brightness-110"
                >
                  Sign in
                </button>
              </form>
            ) : (
              <form action={requestMagicLink} className="mt-5">
                <label htmlFor="email" className="text-[12.5px] font-medium">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="border-input bg-background text-foreground mt-2 h-11 w-full rounded-lg border px-3 text-[13px]"
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground mt-3 h-11 w-full rounded-lg px-5 text-[12.5px] font-semibold transition hover:brightness-110"
                >
                  Send secure login link
                </button>
              </form>
            )}
          </div>
        )}
        {query.sent === "1" && (
          <p role="status" className="mt-5 text-sm text-emerald-400">
            Check your inbox for the secure login link.
          </p>
        )}
        {query.error && (
          <p role="alert" className="mt-5 text-sm text-rose-400">
            {query.error === "invalid-email"
              ? "Enter a valid email address and try again."
              : query.error === "missing-password"
                ? "Enter your password and try again."
                : query.error === "invalid-credentials"
                  ? "The email address or password is incorrect."
                  : query.error === "rate-limited"
                    ? "Too many sign-in emails were requested. Wait about an hour, then request one new link."
                    : query.error === "missing-callback-code"
                      ? "That sign-in link is incomplete. Return to this page and request a new link."
                      : query.error === "invalid-callback"
                        ? "That sign-in link is invalid or has expired. Request a new link to continue."
                        : "We could not send a sign-in link right now. Wait a moment and try again."}
          </p>
        )}
      </section>
    </main>
  );
}
