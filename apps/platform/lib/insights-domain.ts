export interface InsightsSource {
  id: string;
  organization_id: string;
  provider: "google_analytics";
  display_name: string;
  external_property_id: string;
  status: "active" | "paused" | "error";
  last_synced_at: string | null;
  last_error_code: string | null;
  created_at: string;
}

export interface InsightsMetricSnapshot {
  metric_date: string;
  scope: "overview" | "page" | "channel";
  dimension_key: string;
  dimension_label: string | null;
  active_users: number;
  sessions: number;
  page_views: number;
  key_events: number;
  engagement_rate: number;
  average_session_duration: number;
}

export interface InsightsSyncRun {
  id: string;
  status: "running" | "succeeded" | "failed";
  rows_written: number;
  safe_failure_code: string | null;
  started_at: string;
  completed_at: string | null;
}

export type InsightsActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};
