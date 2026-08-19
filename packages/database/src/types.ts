export type Json =
  | string
  | number
  | boolean
  | null
  | { readonly [key: string]: Json | undefined }
  | readonly Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          slug: string;
          name: string;
          kind: "internal" | "customer";
          status: "active" | "suspended" | "archived";
          created_at: string;
          updated_at: string;
        };
      };
      organization_memberships: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: "owner" | "admin" | "member" | "billing" | "viewer";
          status: "invited" | "active" | "suspended";
          joined_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      platform_administrators: {
        Row: {
          user_id: string;
          granted_by_user_id: string | null;
          granted_at: string;
          revoked_at: string | null;
        };
      };
      capabilities: {
        Row: {
          key: string;
          product: string;
          description: string;
          status: "active" | "planned";
          created_at: string;
        };
      };
      organization_entitlements: {
        Row: {
          id: string;
          organization_id: string;
          capability_key: string;
          source_type: "internal" | "manual" | "subscription" | "trial";
          source_reference: string | null;
          starts_at: string;
          ends_at: string | null;
          revoked_at: string | null;
          granted_by_user_id: string | null;
          metadata: Json;
          created_at: string;
        };
      };
      growth_prospects: {
        Row: {
          id: string;
          organization_id: string;
          business_name: string;
          business_name_normalized: string;
          website_url: string | null;
          domain_normalized: string | null;
          phone: string | null;
          phone_normalized: string | null;
          email_public: string | null;
          email_normalized: string | null;
          industry: string | null;
          city: string | null;
          region: string | null;
          country: string | null;
          source_type:
            "manual" | "csv" | "referral" | "discovery" | "provider" | "api";
          status: "active" | "archived" | "duplicate";
          pipeline_stage:
            | "review"
            | "qualified"
            | "outreach_ready"
            | "contacted"
            | "replied"
            | "opportunity"
            | "won"
            | "lost"
            | "disqualified";
          assigned_user_id: string | null;
          estimated_value_minor: number | null;
          currency: string;
          next_action: string | null;
          next_action_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      growth_import_batches: {
        Row: {
          id: string;
          organization_id: string;
          created_by_user_id: string;
          filename: string;
          row_count: number;
          accepted_count: number;
          duplicate_count: number;
          rejected_count: number;
          status: "preview" | "committed" | "failed";
          created_at: string;
          committed_at: string | null;
        };
      };
      growth_sources: {
        Row: {
          id: string;
          organization_id: string;
          prospect_id: string;
          source_type:
            "manual" | "csv" | "referral" | "discovery" | "provider" | "api";
          source_url: string | null;
          external_identifier: string | null;
          import_batch_id: string | null;
          created_by_user_id: string;
          created_at: string;
        };
      };
      growth_prospect_notes: {
        Row: {
          id: string;
          organization_id: string;
          prospect_id: string;
          author_user_id: string;
          body: string;
          created_at: string;
          updated_at: string;
        };
      };
      growth_activities: {
        Row: {
          id: string;
          organization_id: string;
          prospect_id: string | null;
          actor_user_id: string | null;
          event_type: string;
          metadata: Json;
          occurred_at: string;
        };
      };
      growth_discovery_runs: {
        Row: {
          id: string;
          organization_id: string;
          created_by_user_id: string;
          provider: string;
          industry: string;
          location: string;
          keywords: string | null;
          requested_limit: number;
          found_count: number;
          created_count: number;
          duplicate_count: number;
          qualified_count: number;
          needs_contact_count: number;
          failed_count: number;
          status: string;
          safe_failure_code: string | null;
          created_at: string;
          completed_at: string | null;
        };
      };
      growth_research: {
        Row: {
          id: string;
          organization_id: string;
          prospect_id: string;
          provider: string;
          evidence: Json;
          inference: string;
          recommendation: string;
          evidence_version: string;
          generated_at: string;
        };
      };
      growth_scores: {
        Row: {
          id: string;
          organization_id: string;
          prospect_id: string;
          fit: number;
          need: number;
          potential_value: number;
          reachability: number;
          confidence: number;
          priority_score: number;
          explanation: string;
          scoring_version: string;
          generated_at: string;
        };
      };
      growth_contacts: {
        Row: {
          id: string;
          organization_id: string;
          prospect_id: string;
          name: string | null;
          title: string | null;
          email: string;
          email_normalized: string;
          source_type: string;
          source_reference: string | null;
          verification_status: string;
          confidence: number | null;
          enriched_at: string;
          created_at: string;
          updated_at: string;
        };
      };
      growth_suppressions: {
        Row: {
          id: string;
          organization_id: string;
          email_normalized: string | null;
          domain_normalized: string | null;
          prospect_id: string | null;
          reason: string;
          source: string;
          created_by_user_id: string | null;
          created_at: string;
        };
      };
      growth_outreach_messages: {
        Row: {
          id: string;
          organization_id: string;
          prospect_id: string;
          contact_id: string;
          subject: string;
          body: string;
          status:
            | "draft"
            | "review"
            | "approved"
            | "sending"
            | "sent"
            | "failed"
            | "suppressed"
            | "cancelled";
          generation_version: string;
          evidence_references: Json;
          idempotency_key: string;
          created_by_user_id: string;
          approved_by_user_id: string | null;
          approved_at: string | null;
          provider_message_id: string | null;
          sent_at: string | null;
          safe_failure_code: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type Membership =
  Database["public"]["Tables"]["organization_memberships"]["Row"];
