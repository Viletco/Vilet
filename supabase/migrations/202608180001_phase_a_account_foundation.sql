begin;

create extension if not exists pgcrypto;
create schema if not exists private;

create type public.organization_kind as enum ('internal', 'customer');
create type public.organization_status as enum ('active', 'suspended', 'archived');
create type public.organization_role as enum ('owner', 'admin', 'member', 'billing', 'viewer');
create type public.membership_status as enum ('invited', 'active', 'suspended');
create type public.capability_status as enum ('active', 'planned');
create type public.entitlement_source as enum ('internal', 'manual', 'subscription', 'trial');

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) between 1 and 120),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) between 2 and 63),
  name text not null check (char_length(name) between 1 and 160),
  kind public.organization_kind not null default 'customer',
  status public.organization_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.organization_role not null,
  status public.membership_status not null default 'invited',
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id),
  check ((status = 'active' and joined_at is not null) or status <> 'active')
);
create index organization_memberships_user_active_idx on public.organization_memberships(user_id, organization_id) where status = 'active';

create table public.organization_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email_normalized text not null check (email_normalized = lower(email_normalized)),
  role public.organization_role not null,
  token_hash text not null unique check (char_length(token_hash) >= 43),
  invited_by_user_id uuid not null references auth.users(id),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
create index organization_invitations_org_idx on public.organization_invitations(organization_id, created_at desc);

create table public.platform_administrators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_by_user_id uuid references auth.users(id),
  granted_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table public.capabilities (
  key text primary key check (key ~ '^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$'),
  product text not null check (product ~ '^[a-z][a-z0-9_]*$'),
  description text not null,
  status public.capability_status not null default 'active',
  created_at timestamptz not null default now()
);

create table public.organization_entitlements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  capability_key text not null references public.capabilities(key),
  source_type public.entitlement_source not null,
  source_reference text,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  revoked_at timestamptz,
  granted_by_user_id uuid references auth.users(id),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at)
);
create index organization_entitlements_active_idx on public.organization_entitlements(organization_id, capability_key, starts_at, ends_at) where revoked_at is null;

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) between 3 and 160),
  target_type text not null check (char_length(target_type) between 1 and 80),
  target_id text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  occurred_at timestamptz not null default now()
);
create index audit_events_org_time_idx on public.audit_events(organization_id, occurred_at desc);

create function private.current_user_is_active_member(target_organization_id uuid)
returns boolean language sql stable security definer set search_path = pg_catalog, public
as $$ select exists (select 1 from public.organization_memberships m where m.organization_id = target_organization_id and m.user_id = auth.uid() and m.status = 'active') $$;

create function private.current_user_has_org_role(target_organization_id uuid, allowed_roles public.organization_role[])
returns boolean language sql stable security definer set search_path = pg_catalog, public
as $$ select exists (select 1 from public.organization_memberships m where m.organization_id = target_organization_id and m.user_id = auth.uid() and m.status = 'active' and m.role = any(allowed_roles)) $$;

create function private.current_user_is_platform_administrator()
returns boolean language sql stable security definer set search_path = pg_catalog, public
as $$ select exists (select 1 from public.platform_administrators a where a.user_id = auth.uid() and a.revoked_at is null) $$;

revoke all on function private.current_user_is_active_member(uuid) from public;
revoke all on function private.current_user_has_org_role(uuid, public.organization_role[]) from public;
revoke all on function private.current_user_is_platform_administrator() from public;
grant usage on schema private to authenticated;
grant execute on function private.current_user_is_active_member(uuid) to authenticated;
grant execute on function private.current_user_has_org_role(uuid, public.organization_role[]) to authenticated;
grant execute on function private.current_user_is_platform_administrator() to authenticated;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.organization_invitations enable row level security;
alter table public.platform_administrators enable row level security;
alter table public.capabilities enable row level security;
alter table public.organization_entitlements enable row level security;
alter table public.audit_events enable row level security;

create policy profiles_select_self on public.profiles for select to authenticated using (user_id = auth.uid());
create policy profiles_insert_self on public.profiles for insert to authenticated with check (user_id = auth.uid());
create policy profiles_update_self on public.profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy organizations_select_member on public.organizations for select to authenticated using (private.current_user_is_active_member(id));
create policy organizations_update_admin on public.organizations for update to authenticated using (private.current_user_has_org_role(id, array['owner','admin']::public.organization_role[])) with check (private.current_user_has_org_role(id, array['owner','admin']::public.organization_role[]));

create policy memberships_select_org on public.organization_memberships for select to authenticated using (private.current_user_is_active_member(organization_id));
create policy memberships_insert_admin on public.organization_memberships for insert to authenticated with check (private.current_user_has_org_role(organization_id, array['owner','admin']::public.organization_role[]));
create policy memberships_update_admin on public.organization_memberships for update to authenticated using (private.current_user_has_org_role(organization_id, array['owner','admin']::public.organization_role[])) with check (private.current_user_has_org_role(organization_id, array['owner','admin']::public.organization_role[]));
create policy memberships_delete_owner on public.organization_memberships for delete to authenticated using (private.current_user_has_org_role(organization_id, array['owner']::public.organization_role[]));

-- Invitations, entitlement mutations, platform administration, and audit insertion
-- intentionally have no authenticated write policy. They require reviewed server-side
-- operations using the service role and must append an audit event.
create policy platform_admin_select_self on public.platform_administrators for select to authenticated using (user_id = auth.uid() and revoked_at is null);
create policy capabilities_select_authenticated on public.capabilities for select to authenticated using (true);
create policy entitlements_select_member on public.organization_entitlements for select to authenticated using (private.current_user_is_active_member(organization_id));
create policy audit_select_admin on public.audit_events for select to authenticated using (organization_id is not null and private.current_user_has_org_role(organization_id, array['owner','admin']::public.organization_role[]));

create function private.set_updated_at() returns trigger language plpgsql set search_path = pg_catalog
as $$ begin new.updated_at = now(); return new; end $$;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger organizations_set_updated_at before update on public.organizations for each row execute function private.set_updated_at();
create trigger memberships_set_updated_at before update on public.organization_memberships for each row execute function private.set_updated_at();

create function private.create_profile_for_auth_user() returns trigger language plpgsql security definer set search_path = pg_catalog, public
as $$ begin insert into public.profiles(user_id) values (new.id) on conflict do nothing; return new; end $$;
create trigger auth_user_created after insert on auth.users for each row execute function private.create_profile_for_auth_user();

insert into public.capabilities(key, product, description) values
('studio.access','studio','Access the Studio client area'),
('studio.projects','studio','View organization Studio projects'),
('studio.project_admin','studio','Administer organization Studio projects'),
('growth.access','growth','Access Vilét Growth'),
('growth.prospecting','growth','Use prospecting capabilities'),
('growth.outreach','growth','Use approved outreach capabilities'),
('growth.pipeline','growth','Use Growth pipeline capabilities'),
('insights.access','insights','Access Vilét Insights'),
('insights.analytics','insights','Use analytics capabilities'),
('insights.seo','insights','Use search visibility capabilities'),
('ai.access','ai','Access Vilét AI'),
('billing.manage','billing','Manage organization billing'),
('support.access','support','Access Vilét support');

commit;
