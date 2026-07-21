import { readFile } from "node:fs/promises";

const decisionStatuses = new Set([
  "unresolved",
  "approved",
  "rejected",
  "deferred",
  "not-required",
]);
const registryUrl = new URL("../config/launch-decisions.json", import.meta.url);

function fail(message) {
  console.error(`Launch readiness check failed: ${message}`);
  process.exitCode = 1;
}

function hasEnvironmentVariable(name) {
  return (
    typeof process.env[name] === "string" && process.env[name].trim() !== ""
  );
}

function checkEnvironment() {
  const deliveryMode = process.env.CONTACT_DELIVERY_MODE ?? "disabled";
  const rateLimitMode = process.env.CONTACT_RATE_LIMIT_MODE ?? "memory";
  const issues = [];
  if (!["disabled", "resend"].includes(deliveryMode))
    issues.push("CONTACT_DELIVERY_MODE has an unsupported mode");
  if (!["memory", "upstash"].includes(rateLimitMode))
    issues.push("CONTACT_RATE_LIMIT_MODE has an unsupported mode");
  if (deliveryMode === "resend") {
    for (const name of [
      "RESEND_API_KEY",
      "CONTACT_FROM_EMAIL",
      "CONTACT_FORM_RECIPIENT",
    ]) {
      if (!hasEnvironmentVariable(name)) issues.push(`${name} is missing`);
    }
  }
  if (rateLimitMode === "upstash") {
    for (const name of [
      "UPSTASH_REDIS_REST_URL",
      "UPSTASH_REDIS_REST_TOKEN",
      "CONTACT_RATE_LIMIT_SALT",
    ]) {
      if (!hasEnvironmentVariable(name)) issues.push(`${name} is missing`);
    }
  }
  const aiMode = process.env.AI_ASSISTANT_MODE ?? "disabled";
  const aiProvider = process.env.AI_PROVIDER ?? "none";
  const aiRateMode = process.env.AI_CHAT_RATE_LIMIT_MODE ?? "memory";
  const analyzerMode = process.env.AI_WEBSITE_ANALYZER_MODE ?? "disabled";
  if (!["disabled", "provider"].includes(aiMode))
    issues.push("AI_ASSISTANT_MODE has an unsupported mode");
  if (!["none", "openai"].includes(aiProvider))
    issues.push("AI_PROVIDER has an unsupported provider");
  if (!["memory", "upstash"].includes(aiRateMode))
    issues.push("AI_CHAT_RATE_LIMIT_MODE has an unsupported mode");
  if (!["disabled", "enabled"].includes(analyzerMode))
    issues.push("AI_WEBSITE_ANALYZER_MODE has an unsupported mode");
  if (aiMode === "disabled" && aiProvider !== "none")
    issues.push("disabled AI requires AI_PROVIDER=none");
  if (aiMode === "provider")
    for (const name of ["AI_PROVIDER_API_KEY", "AI_PROVIDER_MODEL"])
      if (!hasEnvironmentVariable(name)) issues.push(`${name} is missing`);
  if (aiRateMode === "upstash")
    for (const name of [
      "AI_CHAT_RATE_LIMIT_SALT",
      "AI_CHAT_UPSTASH_REDIS_REST_URL",
      "AI_CHAT_UPSTASH_REDIS_REST_TOKEN",
    ])
      if (!hasEnvironmentVariable(name)) issues.push(`${name} is missing`);
  if (analyzerMode === "enabled" && aiMode !== "provider")
    issues.push("Website Analyzer requires provider AI mode");
  return { aiMode, analyzerMode, deliveryMode, issues, rateLimitMode };
}

async function main() {
  const decisions = JSON.parse(await readFile(registryUrl, "utf8"));
  if (!Array.isArray(decisions)) {
    fail("the decision registry is not an array");
    return;
  }
  const ids = new Set();
  const structuralIssues = [];
  for (const [index, decision] of decisions.entries()) {
    if (
      typeof decision !== "object" ||
      decision === null ||
      Array.isArray(decision)
    ) {
      structuralIssues.push(`entry ${index + 1} is not an object`);
      continue;
    }
    if (typeof decision.id !== "string" || decision.id.trim() === "")
      structuralIssues.push(`entry ${index + 1} has no id`);
    else if (ids.has(decision.id))
      structuralIssues.push(`decision '${decision.id}' is duplicated`);
    else ids.add(decision.id);
    if (typeof decision.label !== "string" || decision.label.trim() === "")
      structuralIssues.push(`entry ${index + 1} has no label`);
    if (!decisionStatuses.has(decision.status))
      structuralIssues.push(
        `decision '${decision.id ?? index + 1}' has an invalid status`,
      );
    if (typeof decision.requiredForLaunch !== "boolean")
      structuralIssues.push(
        `decision '${decision.id ?? index + 1}' has no launch requirement flag`,
      );
  }
  if (structuralIssues.length > 0) {
    for (const issue of structuralIssues) fail(issue);
    return;
  }
  const environment = checkEnvironment();
  const aiDecisionIds = new Set([
    "ai-provider-approval",
    "ai-model-approval",
    "ai-privacy-legal-approval",
    "ai-public-launch-approval",
    "ai-indexing-approval",
    "ai-rate-limit-policy",
    "website-analyzer-availability",
    "website-analyzer-authorization-wording",
    "ai-session-storage-decision",
    "ai-cost-ceiling",
    "ai-emergency-disable-owner",
  ]);
  const blocking = decisions.filter(
    ({ requiredForLaunch, status }) =>
      requiredForLaunch && status !== "approved" && status !== "not-required",
  );
  const aiBlocking =
    environment.aiMode === "provider"
      ? decisions.filter(
          ({ id, status }) =>
            aiDecisionIds.has(id) &&
            status !== "approved" &&
            status !== "not-required",
        )
      : [];
  const recommended = decisions.filter(
    ({ requiredForLaunch, status }) =>
      !requiredForLaunch && status === "unresolved",
  );
  console.log(
    `Launch decisions: ${decisions.length} tracked, ${blocking.length + aiBlocking.length} blocking.`,
  );
  if (blocking.length > 0 || aiBlocking.length > 0) {
    console.log("Required decisions still blocking production:");
    for (const decision of [...blocking, ...aiBlocking])
      console.log(`- ${decision.label} [${decision.id}]`);
  }
  if (recommended.length > 0)
    console.log(
      `Recommended or optional unresolved decisions: ${recommended.length}.`,
    );
  console.log(
    `Contact modes: delivery=${environment.deliveryMode}, rate-limit=${environment.rateLimitMode}.`,
  );
  console.log(
    `AI modes: assistant=${environment.aiMode}, analyzer=${environment.analyzerMode}.`,
  );
  if (environment.issues.length > 0) {
    console.error("Environment configuration issues:");
    for (const issue of environment.issues) console.error(`- ${issue}`);
  }
  if (
    blocking.length > 0 ||
    aiBlocking.length > 0 ||
    environment.issues.length > 0
  ) {
    process.exitCode = 1;
    console.error(
      "Launch readiness: BLOCKED. No secret values were inspected or printed.",
    );
    return;
  }
  console.log(
    "Launch readiness: READY. No secret values were inspected or printed.",
  );
}

main().catch((error) =>
  fail(error instanceof Error ? error.message : "unknown error"),
);
