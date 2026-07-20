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
  return { deliveryMode, issues, rateLimitMode };
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
  const blocking = decisions.filter(
    ({ requiredForLaunch, status }) =>
      requiredForLaunch && status !== "approved" && status !== "not-required",
  );
  const recommended = decisions.filter(
    ({ requiredForLaunch, status }) =>
      !requiredForLaunch && status === "unresolved",
  );
  const environment = checkEnvironment();
  console.log(
    `Launch decisions: ${decisions.length} tracked, ${blocking.length} blocking.`,
  );
  if (blocking.length > 0) {
    console.log("Required decisions still blocking production:");
    for (const decision of blocking)
      console.log(`- ${decision.label} [${decision.id}]`);
  }
  if (recommended.length > 0)
    console.log(
      `Recommended or optional unresolved decisions: ${recommended.length}.`,
    );
  console.log(
    `Contact modes: delivery=${environment.deliveryMode}, rate-limit=${environment.rateLimitMode}.`,
  );
  if (environment.issues.length > 0) {
    console.error("Environment configuration issues:");
    for (const issue of environment.issues) console.error(`- ${issue}`);
  }
  if (blocking.length > 0 || environment.issues.length > 0) {
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
