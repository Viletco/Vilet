import type { AiMessage, AiResult } from "./types";

export const aiRequestLimits = {
  maxMessages: 8,
  maxUserCharacters: 2000,
  maxAssistantCharacters: 4000,
  maxContextCharacters: 10000,
} as const;

export function validateAiMessages(
  value: unknown,
):
  | { readonly success: true; readonly messages: readonly AiMessage[] }
  | { readonly success: false; readonly result: AiResult } {
  const invalid = (message: string): ReturnType<typeof validateAiMessages> => ({
    success: false,
    result: { status: "validation-failure", message },
  });
  if (!Array.isArray(value) || value.length === 0)
    return invalid("A visitor message is required.");
  if (value.length > aiRequestLimits.maxMessages)
    return invalid(
      "This conversation has reached its context limit. Start a new conversation to continue.",
    );
  let totalCharacters = 0;
  const messages: AiMessage[] = [];
  for (const candidate of value) {
    if (!candidate || typeof candidate !== "object")
      return invalid("The conversation format is invalid.");
    const { role, content } = candidate as Record<string, unknown>;
    if (
      (role !== "user" && role !== "assistant") ||
      typeof content !== "string"
    )
      return invalid("The conversation format is invalid.");
    const normalized = content.trim();
    const limit =
      role === "user"
        ? aiRequestLimits.maxUserCharacters
        : aiRequestLimits.maxAssistantCharacters;
    if (!normalized || normalized.length > limit)
      return invalid(`A ${role} message exceeds the allowed length.`);
    totalCharacters += normalized.length;
    messages.push({ role, content: normalized });
  }
  if (totalCharacters > aiRequestLimits.maxContextCharacters)
    return invalid(
      "This conversation has reached its context limit. Start a new conversation to continue.",
    );
  if (messages.at(-1)?.role !== "user")
    return invalid("A visitor message is required.");
  const userMessages = messages
    .filter(({ role }) => role === "user")
    .map(({ content }) => content.toLowerCase().replace(/\s+/g, " "));
  if (new Set(userMessages).size !== userMessages.length)
    return invalid(
      "That message was already asked in this conversation. Revise it or start a new conversation.",
    );
  return { success: true, messages };
}
