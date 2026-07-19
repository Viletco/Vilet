import {
  Accessibility,
  Bot,
  Braces,
  ChartNoAxesCombined,
  Code2,
  Compass,
  Gauge,
  Globe2,
  Layers3,
  LockKeyhole,
  Rocket,
  Search,
  Settings2,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import type { IconName } from "@/content/icons";

export const iconRegistry = {
  accessibility: Accessibility,
  bot: Bot,
  braces: Braces,
  chart: ChartNoAxesCombined,
  code: Code2,
  compass: Compass,
  gauge: Gauge,
  globe: Globe2,
  layers: Layers3,
  lock: LockKeyhole,
  rocket: Rocket,
  search: Search,
  settings: Settings2,
  sparkles: Sparkles,
  workflow: Workflow,
} as const satisfies Record<IconName, LucideIcon>;

export function getIcon(name: IconName): LucideIcon {
  return iconRegistry[name];
}
