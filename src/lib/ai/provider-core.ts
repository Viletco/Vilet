import type { AiGuidance, AiResult } from "./types";

export function isGuidance(value: unknown): value is AiGuidance {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.answer === "string" &&
    candidate.answer.length > 0 &&
    candidate.answer.length <= 4000 &&
    (candidate.relevantService === undefined ||
      candidate.relevantService === null ||
      typeof candidate.relevantService === "string") &&
    (candidate.limitation === undefined ||
      candidate.limitation === null ||
      typeof candidate.limitation === "string") &&
    typeof candidate.nextStep === "string" &&
    candidate.nextStep.length <= 1000 &&
    Array.isArray(candidate.sources) &&
    candidate.sources.length <= 5 &&
    candidate.sources.every((source) =>
      ["Services", "Process", "FAQ", "Contact", "About"].includes(
        String(source),
      ),
    )
  );
}

export function normalizeProviderResponse(
  status: number,
  payload: unknown,
): AiResult {
  if (status === 429)
    return {
      status: "rate-limited",
      message:
        "Vilét AI is receiving too many requests. Please try again later.",
    };
  if (status < 200 || status >= 300)
    return {
      status: "provider-unavailable",
      message:
        "Vilét AI is temporarily unavailable. Your message was not delivered to Vilét.",
    };
  const data = payload as {
    output?: readonly {
      content?: readonly { type?: string; text?: string }[];
    }[];
  };
  const outputText = data?.output
    ?.flatMap((item) => item.content ?? [])
    .find((item) => item.type === "output_text")?.text;
  if (!outputText)
    return {
      status: "validation-failure",
      message:
        "Vilét AI could not produce a safe response. Please use the Contact page.",
    };
  try {
    const parsed: unknown = JSON.parse(outputText);
    return isGuidance(parsed)
      ? { status: "success", guidance: parsed }
      : {
          status: "validation-failure",
          message:
            "Vilét AI could not produce a safe response. Please use the Contact page.",
        };
  } catch {
    return {
      status: "validation-failure",
      message:
        "Vilét AI could not produce a safe response. Please use the Contact page.",
    };
  }
}

export function normalizeProviderError(error: unknown): AiResult {
  return error instanceof Error && error.name === "AbortError"
    ? {
        status: "timeout",
        message: "Vilét AI took too long to respond. Please try again.",
      }
    : {
        status: "provider-unavailable",
        message:
          "Vilét AI is temporarily unavailable. Please use the Contact page.",
      };
}
