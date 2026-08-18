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
