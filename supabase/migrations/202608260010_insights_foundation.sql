begin;

create table public.insights_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  provider text not null check (provider in ('google_analytics')),
  display_name text not null check (char_length(display_name) between 1 and 120),
  external_property_id text not null check (external_property_id ~ '^[0-9]+$'),
  status text not null default 'active' check (status in ('active','paused','error')),
  last_synced_at timestamptz,
  last_error_code text,
  created_by_user_id uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, provider, external_property_id)
);

create table public.insights_sync_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  source_id uuid not null references public.insights_sources(id) on delete cascade,
  initiated_by_user_id uuid references auth.users(id),
  status text not null check (status in ('running','succeeded','failed')),
  date_from date not null,
  date_to date not null,
  rows_written integer not null default 0 check (rows_written >= 0),
  safe_failure_code text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  check (date_to >= date_from)
);

create table public.insights_metric_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  source_id uuid not null references public.insights_sources(id) on delete cascade,
  metric_date date not null,
  scope text not null check (scope in ('overview','page','channel')),
  dimension_key text not null default '',
  dimension_label text,
  active_users bigint not null default 0 check (active_users >= 0),
  sessions bigint not null default 0 check (sessions >= 0),
  page_views bigint not null default 0 check (page_views >= 0),
  key_events bigint not null default 0 check (key_events >= 0),
  engagement_rate numeric(8,6) not null default 0 check (engagement_rate between 0 and 1),
  average_session_duration numeric(14,3) not null default 0 check (average_session_duration >= 0),
  synced_at timestamptz not null default now(),
  unique (source_id, metric_date, scope, dimension_key)
);

create index insights_sources_org_idx on public.insights_sources(organization_id, status);
create index insights_sync_runs_org_time_idx on public.insights_sync_runs(organization_id, started_at desc);
create index insights_metrics_org_date_idx on public.insights_metric_snapshots(organization_id, metric_date desc);

alter table public.insights_sources enable row level security;
alter table public.insights_sync_runs enable row level security;
alter table public.insights_metric_snapshots enable row level security;

create policy insights_sources_select on public.insights_sources for select to authenticated
  using (private.current_user_has_capability(organization_id, 'insights.access'));
create policy insights_sources_mutate on public.insights_sources for all to authenticated
  using (private.current_user_has_capability(organization_id, 'insights.analytics') and private.current_user_has_org_role(organization_id, array['owner','admin']::public.organization_role[]))
  with check (created_by_user_id = auth.uid() and private.current_user_has_capability(organization_id, 'insights.analytics') and private.current_user_has_org_role(organization_id, array['owner','admin']::public.organization_role[]));

create policy insights_runs_select on public.insights_sync_runs for select to authenticated
  using (private.current_user_has_capability(organization_id, 'insights.access'));
create policy insights_runs_insert on public.insights_sync_runs for insert to authenticated
  with check (initiated_by_user_id = auth.uid() and private.current_user_has_capability(organization_id, 'insights.analytics') and private.current_user_has_org_role(organization_id, array['owner','admin']::public.organization_role[]));
create policy insights_runs_update on public.insights_sync_runs for update to authenticated
  using (initiated_by_user_id = auth.uid() and private.current_user_has_capability(organization_id, 'insights.analytics'))
  with check (initiated_by_user_id = auth.uid() and private.current_user_has_capability(organization_id, 'insights.analytics'));

create policy insights_metrics_select on public.insights_metric_snapshots for select to authenticated
  using (private.current_user_has_capability(organization_id, 'insights.access'));
create policy insights_metrics_mutate on public.insights_metric_snapshots for all to authenticated
  using (private.current_user_has_capability(organization_id, 'insights.analytics') and private.current_user_has_org_role(organization_id, array['owner','admin']::public.organization_role[]))
  with check (private.current_user_has_capability(organization_id, 'insights.analytics') and private.current_user_has_org_role(organization_id, array['owner','admin']::public.organization_role[]));

create function private.insights_validate_tenant() returns trigger language plpgsql security definer set search_path=pg_catalog,public as $$
begin
  if not exists (
    select 1 from public.insights_sources source
    where source.id = new.source_id and source.organization_id = new.organization_id
  ) then
    raise exception 'insights_cross_tenant_source_denied' using errcode='42501';
  end if;
  return new;
end $$;
revoke all on function private.insights_validate_tenant() from public, anon, authenticated;
create trigger insights_runs_tenant before insert or update on public.insights_sync_runs for each row execute function private.insights_validate_tenant();
create trigger insights_metrics_tenant before insert or update on public.insights_metric_snapshots for each row execute function private.insights_validate_tenant();

commit;
