type PlatformEventLevel = "info" | "warn" | "error";

interface PlatformEventDetails {
  readonly reason?: string;
  readonly route?: string;
  readonly status?: number;
}

export function recordPlatformEvent(
  level: PlatformEventLevel,
  event: string,
  details: PlatformEventDetails = {},
) {
  const entry = JSON.stringify({
    scope: "vilet-platform",
    event,
    ...details,
  });
  if (level === "error") console.error(entry);
  else if (level === "warn") console.warn(entry);
  else console.info(entry);
}
