export const deliveryModes = ["disabled", "resend"] as const;
export const rateLimitModes = ["memory", "upstash"] as const;
export const replyToModes = ["submitted-email"] as const;

export interface ContactEnvironment {
  readonly CONTACT_DELIVERY_MODE?: string;
  readonly CONTACT_RATE_LIMIT_MODE?: string;
  readonly RESEND_API_KEY?: string;
  readonly CONTACT_FORM_RECIPIENT?: string;
  readonly CONTACT_FROM_EMAIL?: string;
  readonly CONTACT_REPLY_TO_MODE?: string;
  readonly UPSTASH_REDIS_REST_URL?: string;
  readonly UPSTASH_REDIS_REST_TOKEN?: string;
  readonly CONTACT_RATE_LIMIT_SALT?: string;
}

export type ContactConfig =
  | {
      readonly delivery: { readonly mode: "disabled" };
      readonly rateLimit: { readonly mode: "memory"; readonly salt: string };
    }
  | {
      readonly delivery: { readonly mode: "disabled" };
      readonly rateLimit: {
        readonly mode: "upstash";
        readonly url: string;
        readonly token: string;
        readonly salt: string;
      };
    }
  | {
      readonly delivery: {
        readonly mode: "resend";
        readonly apiKey: string;
        readonly recipient: string;
        readonly from: string;
        readonly replyToMode: "submitted-email";
      };
      readonly rateLimit: { readonly mode: "memory"; readonly salt: string };
    }
  | {
      readonly delivery: {
        readonly mode: "resend";
        readonly apiKey: string;
        readonly recipient: string;
        readonly from: string;
        readonly replyToMode: "submitted-email";
      };
      readonly rateLimit: {
        readonly mode: "upstash";
        readonly url: string;
        readonly token: string;
        readonly salt: string;
      };
    };

function required(value: string | undefined, name: string) {
  if (!value?.trim())
    throw new Error(`${name} is required for the selected contact mode.`);
  return value.trim();
}
function email(value: string | undefined, name: string) {
  const normalized = required(value, name);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized))
    throw new Error(`${name} must be a valid email address.`);
  return normalized;
}

export function validateContactEnvironment(
  env: ContactEnvironment,
): ContactConfig {
  const deliveryMode = env.CONTACT_DELIVERY_MODE?.trim() || "disabled";
  const rateLimitMode = env.CONTACT_RATE_LIMIT_MODE?.trim() || "memory";
  if (!deliveryModes.includes(deliveryMode as never))
    throw new Error("CONTACT_DELIVERY_MODE must be disabled or resend.");
  if (!rateLimitModes.includes(rateLimitMode as never))
    throw new Error("CONTACT_RATE_LIMIT_MODE must be memory or upstash.");

  const salt =
    rateLimitMode === "upstash"
      ? required(env.CONTACT_RATE_LIMIT_SALT, "CONTACT_RATE_LIMIT_SALT")
      : env.CONTACT_RATE_LIMIT_SALT?.trim() || "local-memory-only";
  const rateLimit =
    rateLimitMode === "upstash"
      ? {
          mode: "upstash" as const,
          url: (() => {
            const value = required(
              env.UPSTASH_REDIS_REST_URL,
              "UPSTASH_REDIS_REST_URL",
            );
            const parsed = new URL(value);
            if (parsed.protocol !== "https:")
              throw new Error("UPSTASH_REDIS_REST_URL must use HTTPS.");
            return parsed.toString().replace(/\/$/, "");
          })(),
          token: required(
            env.UPSTASH_REDIS_REST_TOKEN,
            "UPSTASH_REDIS_REST_TOKEN",
          ),
          salt,
        }
      : { mode: "memory" as const, salt };
  const delivery =
    deliveryMode === "resend"
      ? {
          mode: "resend" as const,
          apiKey: required(env.RESEND_API_KEY, "RESEND_API_KEY"),
          recipient: email(
            env.CONTACT_FORM_RECIPIENT,
            "CONTACT_FORM_RECIPIENT",
          ),
          from: email(env.CONTACT_FROM_EMAIL, "CONTACT_FROM_EMAIL"),
          replyToMode: (() => {
            const value =
              env.CONTACT_REPLY_TO_MODE?.trim() || "submitted-email";
            if (!replyToModes.includes(value as never))
              throw new Error("CONTACT_REPLY_TO_MODE must be submitted-email.");
            return "submitted-email" as const;
          })(),
        }
      : { mode: "disabled" as const };
  return { delivery, rateLimit } as ContactConfig;
}
