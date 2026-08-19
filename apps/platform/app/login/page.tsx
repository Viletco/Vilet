import { redirect } from "next/navigation";
import { getPlatformConfig, getVerifiedUser } from "@vilet/auth";
import { requestMagicLink } from "./actions";

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
  return (
    <main className="grid min-h-screen place-items-center px-5 py-12">
      <section className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl">
        <a
          href="https://vilet.co"
          className="inline-flex items-center gap-2 rounded-md font-semibold"
          aria-label="Vilét website"
        >
          <span className="grid size-8 place-items-center rounded-lg border border-[var(--border)] font-mono text-sm text-[var(--accent)]">
            V
          </span>
          Vilét
        </a>
        <p className="mt-10 font-mono text-xs tracking-[0.18em] text-[var(--accent)] uppercase">
          Vilét account
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
          Sign in to Vilét.
        </h1>
        <p className="mt-4 leading-7 text-[var(--muted)]">
          Enter your account email to open the Vilét application. We&apos;ll
          send a secure, single-use sign-in link—no password required.
        </p>
        {unavailable ? (
          <div className="mt-7 rounded-xl border border-[var(--border)] p-4 text-sm leading-6 text-[var(--muted)]">
            <strong className="block text-[var(--text)]">
              Sign-in is temporarily unavailable.
            </strong>
            Please try again later or contact Vilét if you need help accessing
            your account.
          </div>
        ) : (
          <form action={requestMagicLink} className="mt-7">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 text-[var(--text)]"
            />
            <button
              type="submit"
              className="mt-4 h-12 w-full rounded-lg bg-[var(--accent)] px-5 font-semibold text-white"
            >
              Send secure login link
            </button>
          </form>
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
