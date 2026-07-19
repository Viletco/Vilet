export const iconNames = [
  "accessibility",
  "bot",
  "braces",
  "chart",
  "code",
  "compass",
  "gauge",
  "globe",
  "layers",
  "lock",
  "rocket",
  "search",
  "settings",
  "sparkles",
  "workflow",
] as const;

export type IconName = (typeof iconNames)[number];

export function isIconName(value: string): value is IconName {
  return (iconNames as readonly string[]).includes(value);
}
