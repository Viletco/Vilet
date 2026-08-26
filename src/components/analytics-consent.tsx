"use client";

import { useEffect, useState } from "react";

const storageKey = "vilet.analytics-consent.v1";
type Choice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function activate(measurementId: string) {
  if (document.querySelector(`script[data-vilet-ga="${measurementId}"]`))
    return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.dataset.viletGa = measurementId;
  document.head.append(script);
}

export function AnalyticsConsent({
  measurementId,
}: {
  measurementId?: string;
}) {
  const [choice, setChoice] = useState<Choice | null | "loading">("loading");
  useEffect(() => {
    if (!measurementId) return;
    const saved = window.localStorage.getItem(storageKey) as Choice | null;
    if (saved === "granted") activate(measurementId);
    const timer = window.setTimeout(() => setChoice(saved), 0);
    return () => window.clearTimeout(timer);
  }, [measurementId]);
  if (!measurementId || choice === "loading" || choice) return null;
  const decide = (value: Choice) => {
    window.localStorage.setItem(storageKey, value);
    setChoice(value);
    if (value === "granted") activate(measurementId);
  };
  return (
    <aside
      role="dialog"
      aria-label="Analytics preference"
      className="border-border bg-background/95 fixed right-4 bottom-4 z-[100] max-w-sm border p-5 shadow-2xl backdrop-blur-xl sm:right-6 sm:bottom-6"
    >
      <p className="text-sm font-semibold">Help improve Vilét</p>
      <p className="text-muted-foreground mt-2 text-xs leading-5">
        Allow privacy-conscious website analytics so Vilét can understand
        aggregate traffic and page performance. No advertising or cross-site
        profiling.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => decide("granted")}
          className="bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold"
        >
          Allow analytics
        </button>
        <button
          onClick={() => decide("denied")}
          className="border-border border px-4 py-2 text-xs font-semibold"
        >
          Decline
        </button>
      </div>
    </aside>
  );
}
