import fs from "node:fs";
import path from "node:path";

export const internalCapabilityKeys = Object.freeze([
  "studio.access",
  "studio.projects",
  "studio.project_admin",
  "growth.access",
  "growth.prospecting",
  "growth.outreach",
  "growth.pipeline",
  "insights.access",
  "insights.analytics",
  "insights.seo",
  "ai.access",
  "billing.manage",
  "support.access",
]);

export function loadPlatformEnvironment(cwd = process.cwd()) {
  const environmentPath = path.join(cwd, "apps", "platform", ".env.local");
  if (!fs.existsSync(environmentPath))
    throw new Error("apps/platform/.env.local is required.");
  return Object.fromEntries(
    fs
      .readFileSync(environmentPath, "utf8")
      .split(/\r?\n/u)
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator), line.slice(separator + 1).trim()];
      }),
  );
}

export function parseBootstrapArguments(argumentsList) {
  const options = {
    apply: false,
    environment: "",
    projectRef: "",
    userId: "",
    userEmail: "",
    productionConfirmation: "",
  };
  for (const argument of argumentsList) {
    if (argument === "--apply") options.apply = true;
    else if (argument.startsWith("--environment="))
      options.environment = argument.slice("--environment=".length);
    else if (argument.startsWith("--project-ref="))
      options.projectRef = argument.slice("--project-ref=".length);
    else if (argument.startsWith("--user-id="))
      options.userId = argument.slice("--user-id=".length);
    else if (argument.startsWith("--user-email="))
      options.userEmail = argument.slice("--user-email=".length).toLowerCase();
    else if (argument.startsWith("--confirm-production="))
      options.productionConfirmation = argument.slice(
        "--confirm-production=".length,
      );
    else throw new Error(`Unknown bootstrap argument: ${argument}`);
  }
  return options;
}

export function validateBootstrapTarget(options, supabaseUrl) {
  if (!["staging", "production"].includes(options.environment))
    throw new Error("--environment must be staging or production.");
  if (!/^[a-z0-9]{20}$/u.test(options.projectRef))
    throw new Error("--project-ref must be an explicit Supabase project ref.");
  if (Boolean(options.userId) === Boolean(options.userEmail))
    throw new Error("Provide exactly one of --user-id or --user-email.");
  if (
    options.userId &&
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(
      options.userId,
    )
  )
    throw new Error("--user-id must be a UUID.");
  if (
    options.userEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(options.userEmail)
  )
    throw new Error("--user-email must be a valid email address.");
  const hostname = new URL(supabaseUrl).hostname;
  if (hostname !== `${options.projectRef}.supabase.co`)
    throw new Error(
      "The configured Supabase URL does not match --project-ref.",
    );
  if (
    options.environment === "production" &&
    (!options.apply || options.productionConfirmation !== options.projectRef)
  )
    throw new Error(
      "Production apply requires --confirm-production matching --project-ref.",
    );
}

export function summarizeBootstrapState(state) {
  return {
    organizationReady:
      state.organization?.name === "Vilét" &&
      state.organization?.slug === "vilet" &&
      state.organization?.kind === "internal" &&
      state.organization?.status === "active",
    membershipReady:
      state.membership?.role === "owner" &&
      state.membership?.status === "active",
    platformAdministratorReady: Boolean(
      state.administrator && !state.administrator.revoked_at,
    ),
    entitlementCount: state.entitlements?.length ?? 0,
    auditCount: state.auditCount ?? 0,
  };
}
