import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="text-center">
        <p className="font-mono text-xs tracking-[0.18em] text-[var(--accent)] uppercase">
          Not found
        </p>
        <h1 className="mt-4 text-3xl font-semibold">
          This platform area is unavailable.
        </h1>
        <Link
          href="/"
          className="mt-6 inline-block text-[var(--muted)] underline"
        >
          Return to the platform
        </Link>
      </div>
    </main>
  );
}
