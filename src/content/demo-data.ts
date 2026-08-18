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
    { label: "Organic search", value: "38%", change: "+8.2%", width: "78%" },
    { label: "Direct", value: "27%", change: "+2.1%", width: "56%" },
    { label: "Paid search", value: "21%", change: "−3.4%", width: "44%" },
    { label: "Referral", value: "14%", change: "+1.7%", width: "30%" },
  ],
  signals: [
    {
      label: "Organic traffic",
      detail: "Growth across high-intent pages",
      status: "Opportunity",
    },
    {
      label: "Checkout conversion",
      detail: "Below the previous 30-day period",
      status: "Review",
    },
    {
      label: "Paid acquisition",
      detail: "Cost per qualified lead increased",
      status: "Watch",
    },
    {
      label: "Website uptime",
      detail: "No incidents detected in sample period",
      status: "Healthy",
    },
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
    { label: "Open opportunities", value: "18", detail: "6 need review" },
    { label: "Automation runs", value: "1,284", detail: "99.2% successful" },
    { label: "Pipeline", value: "$142k", detail: "+9.8% this period" },
  ],
  stages: [
    { label: "New lead", status: "complete" },
    { label: "Enrich record", status: "complete" },
    { label: "Assign owner", status: "complete" },
    { label: "Send follow-up", status: "active" },
    { label: "Update CRM", status: "queued" },
  ],
  activity: [
    {
      name: "Website inquiry",
      owner: "Jordan",
      status: "Qualified",
      updated: "8m ago",
    },
    {
      name: "Software consultation",
      owner: "Avery",
      status: "Discovery",
      updated: "24m ago",
    },
    {
      name: "Workflow review",
      owner: "Morgan",
      status: "New",
      updated: "1h ago",
    },
    {
      name: "Portal requirements",
      owner: "Jordan",
      status: "Proposal",
      updated: "3h ago",
    },
  ],
} as const;
