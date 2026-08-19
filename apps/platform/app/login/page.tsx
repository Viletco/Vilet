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
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(ellipse_at_top,hsl(262_64%_66%/0.08),transparent_55%)] px-5 py-12">
      <section className="animate-scale-in border-border bg-card/50 w-full max-w-md rounded-2xl border p-7 shadow-2xl shadow-black/30 backdrop-blur-sm">
        <a
          href="https://vilet.co"
          className="inline-flex items-center gap-2 rounded-md font-semibold"
          aria-label="Vilét website"
        >
          <span className="border-border text-primary grid size-8 place-items-center rounded-lg border bg-white/[0.02] text-[11px] font-semibold">
            V
          </span>
          Vilét
        </a>
        <p className="text-primary/80 mt-9 text-[11px] font-semibold tracking-[0.1em] uppercase">
          Vilét account
        </p>
        <h1 className="mt-2 text-[26px] font-semibold tracking-tight">
          Sign in to Vilét.
        </h1>
        <p className="text-muted-foreground mt-3 text-[13.5px] leading-6">
          Enter your account email to open the Vilét application. We&apos;ll
          send a secure, single-use sign-in link—no password required.
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
          <form action={requestMagicLink} className="mt-6">
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
