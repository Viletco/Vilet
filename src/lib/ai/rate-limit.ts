import "server-only";
import { createHash } from "node:crypto";
import type { AiConfig } from "./config-core";

const memory = new Map<string, number[]>();
export const aiPolicies = {
  chat: { limit: 20, windowMs: 30 * 60_000 },
  analyzer: { limit: 3, windowMs: 60 * 60_000 },
  summary: { limit: 5, windowMs: 60 * 60_000 },
} as const;

export function hashAiConnection(identifier: string, salt: string) {
  return createHash("sha256")
    .update(salt)
    .update("\0")
    .update(identifier)
    .digest("hex");
}

export function checkMemoryAiLimit(
  kind: keyof typeof aiPolicies,
  key: string,
  now = Date.now(),
) {
  const policy = aiPolicies[kind];
  const active = (memory.get(`${kind}:${key}`) ?? []).filter(
    (time) => time > now - policy.windowMs,
  );
  if (active.length >= policy.limit) return false;
  active.push(now);
  memory.set(`${kind}:${key}`, active);
  return true;
}

export async function checkAiLimit(
  kind: keyof typeof aiPolicies,
  key: string,
  config: AiConfig,
) {
  if (config.rateLimit.mode === "memory") return checkMemoryAiLimit(kind, key);
  const policy = aiPolicies[kind];
  const response = await fetch(`${config.rateLimit.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.rateLimit.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", `ai:${kind}:${key}`],
      ["PEXPIRE", `ai:${kind}:${key}`, String(policy.windowMs), "NX"],
    ]),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) return false;
  const data = (await response.json()) as readonly [{ result?: number }];
  return typeof data[0]?.result === "number" && data[0].result <= policy.limit;
}
