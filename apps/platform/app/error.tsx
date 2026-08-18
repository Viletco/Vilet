"use client";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold">The platform could not load.</h1>
        <p className="mt-4 text-[var(--muted)]">
          No access change was made. Try the request again.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-[var(--accent)] px-5 py-3 font-semibold"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
