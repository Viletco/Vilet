export interface DemoMetric {
  readonly label: string;
  readonly value: string;
  readonly change: string;
  readonly direction: "up" | "steady";
}

export const illustrativeBusinessData = {
  disclosure: "Concept preview · Illustrative data",
  period: "Last 30 days",
  metrics: [
    { label: "Revenue", value: "$84.2k", change: "+12.4%", direction: "up" },
    { label: "Conversion", value: "4.8%", change: "+0.6 pts", direction: "up" },
    { label: "Qualified leads", value: "126", change: "+18", direction: "up" },
    { label: "Uptime", value: "99.99%", change: "Stable", direction: "steady" },
  ],
  chart: {
    label:
      "Illustrative revenue trend, increasing from approximately $58,000 to $84,200 over six periods.",
    points: "8,82 54,70 100,75 146,47 192,55 238,26 284,34 330,12",
    area: "8,82 54,70 100,75 146,47 192,55 238,26 284,34 330,12 330,104 8,104",
    labels: ["May 6", "May 13", "May 20", "May 27", "Jun 3", "Jun 10"],
  },
  channels: [
    { label: "Organic search", value: "38%", width: "78%" },
    { label: "Direct", value: "27%", width: "56%" },
    { label: "Paid search", value: "21%", width: "44%" },
  ],
  insight: {
    changed:
      "Paid search traffic increased, while its conversion rate declined.",
    matters: "Acquisition became less efficient even as total sessions grew.",
    action: "Review the paid campaign landing page before increasing spend.",
  },
} as const;

export const illustrativeWorkflowData = {
  disclosure: "Example interface · Sample workflow",
  title: "Lead operations",
  summary: [
    { label: "Open opportunities", value: "18" },
    { label: "Automation runs", value: "1,284" },
    { label: "Pipeline", value: "$142k" },
  ],
  stages: [
    { label: "New lead", status: "complete" },
    { label: "Enrich record", status: "complete" },
    { label: "Assign owner", status: "complete" },
    { label: "Send follow-up", status: "active" },
    { label: "Update CRM", status: "queued" },
  ],
  activity: [
    { name: "Website inquiry", owner: "Jordan", status: "Qualified" },
    { name: "Software consultation", owner: "Avery", status: "Discovery" },
    { name: "Workflow review", owner: "Morgan", status: "New" },
  ],
} as const;
