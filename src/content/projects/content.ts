import type { ProjectRecord } from "./types";

// Approved projects only. Keep this collection empty until evidence and media are approved.
export const projects = [] as const satisfies readonly ProjectRecord[];
