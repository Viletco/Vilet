import "server-only";
import type { AiConfig } from "./config-core";
import {
  normalizeProviderError,
  normalizeProviderResponse,
} from "./provider-core";
import type { AiProvider, AiResult } from "./types";

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
          store: false,
          reasoning: { effort: "minimal" },
          instructions: `${input.policy}\nApproved knowledge:\n${input.knowledge}`,
          input: input.messages,
          max_output_tokens: this.config.maxOutputTokens,
          text: {
            verbosity: "low",
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
      return normalizeProviderResponse(response.status, await response.json());
    } catch (error) {
      return normalizeProviderError(error);
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
