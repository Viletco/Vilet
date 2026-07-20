export const aiAssistantModes = ["disabled", "provider"] as const;
export const aiProviders = ["none", "openai"] as const;
export const aiRateLimitModes = ["memory", "upstash"] as const;
export const aiInsightsModes = ["disabled", "aggregate"] as const;
export const analyzerModes = ["disabled", "enabled"] as const;

export interface AiEnvironment {
  readonly AI_ASSISTANT_MODE?: string;
  readonly AI_PROVIDER?: string;
  readonly AI_PROVIDER_API_KEY?: string;
  readonly AI_PROVIDER_MODEL?: string;
  readonly AI_PROVIDER_TIMEOUT_MS?: string;
  readonly AI_MAX_OUTPUT_TOKENS?: string;
  readonly AI_CHAT_RATE_LIMIT_MODE?: string;
  readonly AI_CHAT_RATE_LIMIT_SALT?: string;
  readonly AI_CHAT_UPSTASH_REDIS_REST_URL?: string;
  readonly AI_CHAT_UPSTASH_REDIS_REST_TOKEN?: string;
  readonly AI_INSIGHTS_MODE?: string;
  readonly AI_WEBSITE_ANALYZER_MODE?: string;
}

export interface AiConfig {
  readonly mode: "disabled" | "provider";
  readonly provider: "none" | "openai";
  readonly apiKey?: string;
  readonly model?: string;
  readonly timeoutMs: number;
  readonly maxOutputTokens: number;
  readonly rateLimit:
    | { readonly mode: "memory"; readonly salt: string }
    | {
        readonly mode: "upstash";
        readonly salt: string;
        readonly url: string;
        readonly token: string;
      };
  readonly insightsMode: "disabled" | "aggregate";
  readonly analyzerMode: "disabled" | "enabled";
}

function required(value: string | undefined, name: string) {
  if (!value?.trim())
    throw new Error(`${name} is required for the selected AI mode.`);
  return value.trim();
}

function integer(
  value: string | undefined,
  fallback: number,
  min: number,
  max: number,
  name: string,
) {
  if (!value?.trim()) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max)
    throw new Error(`${name} must be an integer from ${min} to ${max}.`);
  return parsed;
}

export function validateAiEnvironment(env: AiEnvironment): AiConfig {
  const mode = env.AI_ASSISTANT_MODE?.trim() || "disabled";
  const provider = env.AI_PROVIDER?.trim() || "none";
  const rateMode = env.AI_CHAT_RATE_LIMIT_MODE?.trim() || "memory";
  const insightsMode = env.AI_INSIGHTS_MODE?.trim() || "disabled";
  const analyzerMode = env.AI_WEBSITE_ANALYZER_MODE?.trim() || "disabled";
  if (!aiAssistantModes.includes(mode as never))
    throw new Error("AI_ASSISTANT_MODE must be disabled or provider.");
  if (!aiProviders.includes(provider as never))
    throw new Error("AI_PROVIDER must be none or openai.");
  if (!aiRateLimitModes.includes(rateMode as never))
    throw new Error("AI_CHAT_RATE_LIMIT_MODE must be memory or upstash.");
  if (!aiInsightsModes.includes(insightsMode as never))
    throw new Error("AI_INSIGHTS_MODE must be disabled or aggregate.");
  if (!analyzerModes.includes(analyzerMode as never))
    throw new Error("AI_WEBSITE_ANALYZER_MODE must be disabled or enabled.");
  if (mode === "provider" && provider !== "openai")
    throw new Error("Provider mode requires AI_PROVIDER=openai.");
  if (mode === "disabled" && provider !== "none")
    throw new Error("Disabled mode requires AI_PROVIDER=none.");
  if (insightsMode !== "disabled")
    throw new Error(
      "AI insights infrastructure is not approved; AI_INSIGHTS_MODE must remain disabled.",
    );
  if (analyzerMode === "enabled" && mode !== "provider")
    throw new Error("Website Analyzer requires provider mode.");
  const timeoutMs = integer(
    env.AI_PROVIDER_TIMEOUT_MS,
    15000,
    3000,
    30000,
    "AI_PROVIDER_TIMEOUT_MS",
  );
  const maxOutputTokens = integer(
    env.AI_MAX_OUTPUT_TOKENS,
    600,
    128,
    1200,
    "AI_MAX_OUTPUT_TOKENS",
  );
  const salt =
    rateMode === "upstash"
      ? required(env.AI_CHAT_RATE_LIMIT_SALT, "AI_CHAT_RATE_LIMIT_SALT")
      : env.AI_CHAT_RATE_LIMIT_SALT?.trim() || "local-ai-memory-only";
  const rateLimit =
    rateMode === "upstash"
      ? {
          mode: "upstash" as const,
          salt,
          url: (() => {
            const url = new URL(
              required(
                env.AI_CHAT_UPSTASH_REDIS_REST_URL,
                "AI_CHAT_UPSTASH_REDIS_REST_URL",
              ),
            );
            if (url.protocol !== "https:")
              throw new Error("AI_CHAT_UPSTASH_REDIS_REST_URL must use HTTPS.");
            return url.toString().replace(/\/$/, "");
          })(),
          token: required(
            env.AI_CHAT_UPSTASH_REDIS_REST_TOKEN,
            "AI_CHAT_UPSTASH_REDIS_REST_TOKEN",
          ),
        }
      : { mode: "memory" as const, salt };
  return {
    mode: mode as AiConfig["mode"],
    provider: provider as AiConfig["provider"],
    apiKey:
      mode === "provider"
        ? required(env.AI_PROVIDER_API_KEY, "AI_PROVIDER_API_KEY")
        : undefined,
    model:
      mode === "provider"
        ? required(env.AI_PROVIDER_MODEL, "AI_PROVIDER_MODEL")
        : undefined,
    timeoutMs,
    maxOutputTokens,
    rateLimit,
    insightsMode: "disabled",
    analyzerMode: analyzerMode as AiConfig["analyzerMode"],
  };
}
