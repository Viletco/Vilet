import "server-only";
import type { AiConfig } from "./config-core";
import type { AiGuidance, AiProvider, AiResult } from "./types";

function isGuidance(value: unknown): value is AiGuidance {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.answer === "string" &&
    candidate.answer.length <= 4000 &&
    typeof candidate.nextStep === "string" &&
    Array.isArray(candidate.sources) &&
    candidate.sources.every((source) =>
      ["Services", "Process", "FAQ", "Contact", "About"].includes(
        String(source),
      ),
    )
  );
}

class OpenAiProvider implements AiProvider {
  readonly type = "openai" as const;
  constructor(
    private readonly config: AiConfig & { apiKey: string; model: string },
  ) {}
  async generate(
    input: Parameters<AiProvider["generate"]>[0],
  ): Promise<AiResult> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);
    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.config.model,
          instructions: `${input.policy}\nApproved knowledge:\n${input.knowledge}`,
          input: input.messages,
          max_output_tokens: this.config.maxOutputTokens,
          text: {
            format: {
              type: "json_schema",
              name: "vilet_guidance",
              strict: true,
              schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                  answer: { type: "string" },
                  relevantService: { type: ["string", "null"] },
                  limitation: { type: ["string", "null"] },
                  nextStep: { type: "string" },
                  sources: {
                    type: "array",
                    items: {
                      type: "string",
                      enum: ["Services", "Process", "FAQ", "Contact", "About"],
                    },
                  },
                },
                required: [
                  "answer",
                  "relevantService",
                  "limitation",
                  "nextStep",
                  "sources",
                ],
              },
            },
          },
        }),
        signal: controller.signal,
      });
      if (response.status === 429)
        return {
          status: "rate-limited",
          message:
            "Vilét AI is receiving too many requests. Please try again later.",
        };
      if (!response.ok)
        return {
          status: "provider-unavailable",
          message:
            "Vilét AI is temporarily unavailable. Your message was not delivered to Vilét.",
        };
      const data = (await response.json()) as {
        output?: readonly {
          content?: readonly { type?: string; text?: string }[];
        }[];
      };
      const outputText = data.output
        ?.flatMap((item) => item.content ?? [])
        .find((item) => item.type === "output_text")?.text;
      const parsed = outputText ? JSON.parse(outputText) : null;
      return isGuidance(parsed)
        ? { status: "success", guidance: parsed }
        : {
            status: "validation-failure",
            message:
              "Vilét AI could not produce a safe response. Please use the Contact page.",
          };
    } catch (error) {
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
    } finally {
      clearTimeout(timer);
    }
  }
}

export function createAiProvider(config: AiConfig): AiProvider | null {
  if (
    config.mode !== "provider" ||
    config.provider !== "openai" ||
    !config.apiKey ||
    !config.model
  )
    return null;
  return new OpenAiProvider(
    config as AiConfig & { apiKey: string; model: string },
  );
}
