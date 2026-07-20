"use server";

import { headers } from "next/headers";
import { deriveConnectionIdentifier } from "@/lib/contact";
import { getAiConfig } from "@/lib/ai/config";
import { formatApprovedKnowledge } from "@/lib/ai/knowledge";
import { AI_SYSTEM_POLICY, preflightGuidance } from "@/lib/ai/policy";
import { createAiProvider } from "@/lib/ai/provider";
import { checkAiLimit, hashAiConnection } from "@/lib/ai/rate-limit";
import { validateAiMessages } from "@/lib/ai/request-contract";
import type { AiMessage, AiResult } from "@/lib/ai/types";

export async function requestAiGuidance(
  messages: readonly AiMessage[],
): Promise<AiResult> {
  const config = getAiConfig();
  if (config.mode === "disabled")
    return {
      status: "configuration-unavailable",
      message:
        "Vilét AI is not active yet. No message was sent or stored. You can still use the Contact page.",
    };
  const validation = validateAiMessages(messages);
  if (!validation.success) return validation.result;
  const latest = validation.messages.at(-1)!;
  const preflight = preflightGuidance(latest.content);
  if (preflight === "unsafe")
    return {
      status: "unsafe-request",
      message:
        "Vilét AI cannot help with requests for sensitive data or attempts to override its safety rules.",
    };
  if (preflight) return { status: "success", guidance: preflight };
  try {
    const identifier = deriveConnectionIdentifier(await headers());
    const key = hashAiConnection(identifier, config.rateLimit.salt);
    if (!(await checkAiLimit("chat", key, config)))
      return {
        status: "rate-limited",
        message:
          "Too many AI requests were received from this connection. Please wait before trying again.",
      };
    const provider = createAiProvider(config);
    if (!provider)
      return {
        status: "configuration-unavailable",
        message: "Vilét AI is not configured. No message was sent or stored.",
      };
    return await provider.generate({
      messages: validation.messages,
      knowledge: formatApprovedKnowledge(),
      policy: AI_SYSTEM_POLICY,
    });
  } catch {
    return {
      status: "unexpected-failure",
      message:
        "Vilét AI is temporarily unavailable. Your message was not sent to Vilét.",
    };
  }
}
