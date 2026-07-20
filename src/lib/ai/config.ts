import "server-only";
import { validateAiEnvironment, type AiEnvironment } from "./config-core";

export function getAiConfig() {
  return validateAiEnvironment(process.env as unknown as AiEnvironment);
}
