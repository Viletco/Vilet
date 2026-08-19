begin;

create type public.growth_prospect_status as enum ('active', 'archived', 'duplicate');
create type public.growth_pipeline_stage as enum ('review', 'qualified', 'outreach_ready', 'contacted', 'replied', 'opportunity', 'won', 'lost', 'disqualified');
create type public.growth_source_type as enum ('manual', 'csv', 'referral', 'discovery', 'provider', 'api');
create type public.growth_import_status as enum ('preview', 'committed', 'failed');

create function private.current_user_has_capability(target_organization_id uuid, required_capability text)
returns boolean language sql stable security definer set search_path = pg_catalog, public
as $$
  select private.current_user_is_active_member(target_organization_id)
    and exists (
      select 1 from public.organization_entitlements e
      where e.organization_id = target_organization_id
        and e.capability_key = required_capability
        and e.revoked_at is null
        and e.starts_at <= now()
        and (e.ends_at is null or e.ends_at > now())
    )
$$;
revoke all on function private.current_user_has_capability(uuid, text) from public;
grant execute on function private.current_user_has_capability(uuid, text) to authenticated;

create table public.growth_import_batches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by_user_id uuid not null references auth.users(id),
  source_type public.growth_source_type not null default 'csv',
  filename text not null check (char_length(filename) between 1 and 255),
  idempotency_key uuid not null,
  row_count integer not null check (row_count between 0 and 500),
  accepted_count integer not null default 0 check (accepted_count >= 0),
  duplicate_count integer not null default 0 check (duplicate_count >= 0),
  rejected_count integer not null default 0 check (rejected_count >= 0),
  status public.growth_import_status not null default 'preview',
  created_at timestamptz not null default now(),
  committed_at timestamptz,
  unique (organization_id, idempotency_key)
);
create index growth_import_batches_org_time_idx on public.growth_import_batches(organization_id, created_at desc);

create table public.growth_prospects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  business_name text not null check (char_length(business_name) between 1 and 200),
  business_name_normalized text not null check (char_length(business_name_normalized) between 1 and 200),
  website_url text check (website_url is null or char_length(website_url) <= 2048),
  domain_normalized text check (domain_normalized is null or domain_normalized ~ '^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$'),
  phone text check (phone is null or char_length(phone) <= 80),
  phone_normalized text check (phone_normalized is null or char_length(phone_normalized) between 7 and 20),
  email_public text check (email_public is null or char_length(email_public) <= 320),
  email_normalized text check (email_normalized is null or email_normalized = lower(email_normalized)),
  industry text check (industry is null or char_length(industry) <= 120),
  city text check (city is null or char_length(city) <= 120),
  region text check (region is null or char_length(region) <= 120),
  country text check (country is null or char_length(country) <= 120),
  source_type public.growth_source_type not null default 'manual',
  source_reference text check (source_reference is null or char_length(source_reference) <= 255),
  source_url text check (source_url is null or char_length(source_url) <= 2048),
  status public.growth_prospect_status not null default 'active',
  pipeline_stage public.growth_pipeline_stage not null default 'review',
  assigned_user_id uuid references auth.users(id) on delete set null,
  estimated_value_minor bigint check (estimated_value_minor is null or estimated_value_minor between 0 and 999999999999),
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  next_action text check (next_action is null or char_length(next_action) <= 240),
  next_action_at timestamptz,
  import_batch_id uuid references public.growth_import_batches(id) on delete set null,
  import_row_fingerprint text check (import_row_fingerprint is null or import_row_fingerprint ~ '^[a-f0-9]{64}$'),
  duplicate_of_id uuid references public.growth_prospects(id) on delete restrict,
  created_by_user_id uuid not null references auth.users(id),
  updated_by_user_id uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  check ((status = 'archived' and archived_at is not null) or status <> 'archived'),
  check ((status = 'duplicate' and duplicate_of_id is not null) or (status <> 'duplicate' and duplicate_of_id is null)),
  check (duplicate_of_id is null or duplicate_of_id <> id)
);
create unique index growth_prospects_active_domain_uidx on public.growth_prospects(organization_id, domain_normalized) where domain_normalized is not null and status = 'active';
create unique index growth_prospects_import_row_uidx on public.growth_prospects(organization_id, import_batch_id, import_row_fingerprint) where import_batch_id is not null;
create index growth_prospects_org_stage_updated_idx on public.growth_prospects(organization_id, status, pipeline_stage, updated_at desc);
create index growth_prospects_org_assignee_idx on public.growth_prospects(organization_id, assigned_user_id) where status = 'active';
create index growth_prospects_org_next_action_idx on public.growth_prospects(organization_id, next_action_at) where status = 'active' and next_action_at is not null;
create index growth_prospects_org_name_idx on public.growth_prospects(organization_id, business_name_normalized);

create table public.growth_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  prospect_id uuid not null references public.growth_prospects(id) on delete cascade,
  source_type public.growth_source_type not null,
  external_identifier text,
  source_url text,
  import_batch_id uuid references public.growth_import_batches(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create unique index growth_sources_external_uidx on public.growth_sources(organization_id, source_type, external_identifier) where external_identifier is not null;
create index growth_sources_prospect_idx on public.growth_sources(organization_id, prospect_id, created_at desc);

create table public.growth_prospect_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  prospect_id uuid not null references public.growth_prospects(id) on delete cascade,
  author_user_id uuid not null references auth.users(id),
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index growth_notes_prospect_time_idx on public.growth_prospect_notes(organization_id, prospect_id, created_at desc);

create table public.growth_activities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  prospect_id uuid references public.growth_prospects(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null check (event_type ~ '^(prospect|import)\.[a-z_]+$' and char_length(event_type) <= 80),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  occurred_at timestamptz not null default now()
);
create index growth_activities_prospect_time_idx on public.growth_activities(organization_id, prospect_id, occurred_at desc);
create index growth_activities_org_time_idx on public.growth_activities(organization_id, occurred_at desc);

create function private.growth_validate_assignment() returns trigger language plpgsql security definer set search_path = pg_catalog, public
as $$
begin
  if tg_op = 'UPDATE' and (
    old.pipeline_stage is distinct from new.pipeline_stage or
    old.assigned_user_id is distinct from new.assigned_user_id or
    old.estimated_value_minor is distinct from new.estimated_value_minor or
    old.currency is distinct from new.currency or
    old.next_action is distinct from new.next_action or
    old.next_action_at is distinct from new.next_action_at
  ) and not private.current_user_has_capability(new.organization_id, 'growth.pipeline')
  then raise exception 'growth_pipeline_access_denied' using errcode = '42501'; end if;
  if new.assigned_user_id is not null and not exists (
    select 1 from public.organization_memberships m
    where m.organization_id = new.organization_id and m.user_id = new.assigned_user_id and m.status = 'active'
  ) then raise exception 'invalid_growth_assignee' using errcode = '23514'; end if;
  if new.duplicate_of_id is not null and not exists (
    select 1 from public.growth_prospects p
    where p.id = new.duplicate_of_id and p.organization_id = new.organization_id
  ) then raise exception 'invalid_growth_duplicate_target' using errcode = '23514'; end if;
  new.updated_at = now();
  new.updated_by_user_id = coalesce(auth.uid(), new.updated_by_user_id);
  return new;
end $$;

create function private.growth_record_prospect_activity() returns trigger language plpgsql security definer set search_path = pg_catalog, public
as $$
declare event_key text; event_metadata jsonb := '{}'::jsonb;
begin
  if tg_op = 'INSERT' then
    event_key := 'prospect.created';
    event_metadata := jsonb_build_object('stage', new.pipeline_stage, 'source', new.source_type);
  elsif old.status is distinct from new.status then
    event_key := case when new.status = 'duplicate' then 'prospect.marked_duplicate' when new.status = 'archived' then 'prospect.archived' else 'prospect.updated' end;
    event_metadata := jsonb_build_object('from_status', old.status, 'to_status', new.status);
  elsif old.pipeline_stage is distinct from new.pipeline_stage then
    event_key := 'prospect.stage_changed'; event_metadata := jsonb_build_object('from_stage', old.pipeline_stage, 'to_stage', new.pipeline_stage);
  elsif old.assigned_user_id is distinct from new.assigned_user_id then
    event_key := 'prospect.assigned'; event_metadata := jsonb_build_object('assigned', new.assigned_user_id is not null);
  elsif old.estimated_value_minor is distinct from new.estimated_value_minor or old.currency is distinct from new.currency then
    event_key := 'prospect.value_changed'; event_metadata := jsonb_build_object('currency', new.currency, 'has_value', new.estimated_value_minor is not null);
  elsif old.next_action is distinct from new.next_action or old.next_action_at is distinct from new.next_action_at then
    event_key := 'prospect.next_action_changed'; event_metadata := jsonb_build_object('has_action', new.next_action is not null, 'has_date', new.next_action_at is not null);
  else event_key := 'prospect.updated';
  end if;
  insert into public.growth_activities(organization_id, prospect_id, actor_user_id, event_type, metadata)
  values (new.organization_id, new.id, auth.uid(), event_key, event_metadata);
  return new;
end $$;

create function private.growth_record_note_activity() returns trigger language plpgsql security definer set search_path = pg_catalog, public
as $$ begin
  insert into public.growth_activities(organization_id, prospect_id, actor_user_id, event_type, metadata)
  values (new.organization_id, new.prospect_id, auth.uid(), 'prospect.note_added', '{}'::jsonb);
  return new;
end $$;

create function private.growth_record_initial_source() returns trigger language plpgsql security definer set search_path = pg_catalog, public
as $$ begin
  insert into public.growth_sources(organization_id, prospect_id, source_type, external_identifier, source_url, import_batch_id, created_by_user_id)
  values (new.organization_id, new.id, new.source_type, new.source_reference, new.source_url, new.import_batch_id, auth.uid());
  return new;
end $$;

create trigger growth_prospect_validate_assignment before insert or update on public.growth_prospects for each row execute function private.growth_validate_assignment();
create trigger growth_prospect_activity after insert or update on public.growth_prospects for each row execute function private.growth_record_prospect_activity();
create trigger growth_prospect_source after insert on public.growth_prospects for each row execute function private.growth_record_initial_source();
create trigger growth_note_updated_at before update on public.growth_prospect_notes for each row execute function private.set_updated_at();
create trigger growth_note_activity after insert on public.growth_prospect_notes for each row execute function private.growth_record_note_activity();

alter table public.growth_import_batches enable row level security;
alter table public.growth_prospects enable row level security;
alter table public.growth_sources enable row level security;
alter table public.growth_prospect_notes enable row level security;
alter table public.growth_activities enable row level security;

create policy growth_import_select on public.growth_import_batches for select to authenticated using (private.current_user_has_capability(organization_id, 'growth.prospecting'));
create policy growth_import_insert on public.growth_import_batches for insert to authenticated with check (created_by_user_id = auth.uid() and private.current_user_has_capability(organization_id, 'growth.prospecting'));
create policy growth_import_update on public.growth_import_batches for update to authenticated using (created_by_user_id = auth.uid() and private.current_user_has_capability(organization_id, 'growth.prospecting')) with check (created_by_user_id = auth.uid() and private.current_user_has_capability(organization_id, 'growth.prospecting'));

create policy growth_prospect_select on public.growth_prospects for select to authenticated using (private.current_user_has_capability(organization_id, 'growth.access'));
create policy growth_prospect_insert on public.growth_prospects for insert to authenticated with check (created_by_user_id = auth.uid() and updated_by_user_id = auth.uid() and private.current_user_has_capability(organization_id, 'growth.prospecting'));
create policy growth_prospect_update on public.growth_prospects for update to authenticated using (private.current_user_has_capability(organization_id, 'growth.prospecting')) with check (private.current_user_has_capability(organization_id, 'growth.prospecting'));

create policy growth_source_select on public.growth_sources for select to authenticated using (private.current_user_has_capability(organization_id, 'growth.access'));
create policy growth_source_insert on public.growth_sources for insert to authenticated with check (created_by_user_id = auth.uid() and private.current_user_has_capability(organization_id, 'growth.prospecting'));
create policy growth_note_select on public.growth_prospect_notes for select to authenticated using (private.current_user_has_capability(organization_id, 'growth.access'));
create policy growth_note_insert on public.growth_prospect_notes for insert to authenticated with check (author_user_id = auth.uid() and private.current_user_has_capability(organization_id, 'growth.prospecting'));
create policy growth_note_update on public.growth_prospect_notes for update to authenticated using (author_user_id = auth.uid() and private.current_user_has_capability(organization_id, 'growth.prospecting')) with check (author_user_id = auth.uid() and private.current_user_has_capability(organization_id, 'growth.prospecting'));
create policy growth_activity_select on public.growth_activities for select to authenticated using (private.current_user_has_capability(organization_id, 'growth.access'));

create function public.commit_growth_csv_import(
  target_organization_id uuid,
  import_idempotency_key uuid,
  import_filename text,
  import_rows jsonb
) returns jsonb language plpgsql security definer set search_path = pg_catalog, public
as $$
declare v_batch_id uuid; v_inserted_prospect_id uuid; row_data jsonb; v_inserted_count integer := 0; v_duplicate_count integer := 0; row_total integer;
begin
  if not private.current_user_has_capability(target_organization_id, 'growth.prospecting') then raise exception 'growth_access_denied' using errcode = '42501'; end if;
  if jsonb_typeof(import_rows) <> 'array' then raise exception 'invalid_import_rows' using errcode = '22023'; end if;
  row_total := jsonb_array_length(import_rows);
  if row_total < 1 or row_total > 500 then raise exception 'invalid_import_row_count' using errcode = '22023'; end if;
  select batches.id into v_batch_id from public.growth_import_batches as batches where batches.organization_id = target_organization_id and batches.idempotency_key = import_idempotency_key;
  if v_batch_id is not null then
    return (select jsonb_build_object('batch_id', batches.id, 'accepted_count', batches.accepted_count, 'duplicate_count', batches.duplicate_count, 'rejected_count', batches.rejected_count, 'status', batches.status) from public.growth_import_batches as batches where batches.id = v_batch_id);
  end if;
  insert into public.growth_import_batches(organization_id, created_by_user_id, filename, idempotency_key, row_count)
  values (target_organization_id, auth.uid(), import_filename, import_idempotency_key, row_total) returning id into v_batch_id;
  for row_data in select value from jsonb_array_elements(import_rows) loop
    begin
      insert into public.growth_prospects(
        organization_id, business_name, business_name_normalized, website_url, domain_normalized, phone, phone_normalized,
        email_public, email_normalized, industry, city, region, country, source_type, pipeline_stage, import_batch_id,
        import_row_fingerprint, created_by_user_id, updated_by_user_id
      ) values (
        target_organization_id, row_data->>'business_name', row_data->>'business_name_normalized', nullif(row_data->>'website_url',''),
        nullif(row_data->>'domain_normalized',''), nullif(row_data->>'phone',''), nullif(row_data->>'phone_normalized',''),
        nullif(row_data->>'email_public',''), nullif(row_data->>'email_normalized',''), nullif(row_data->>'industry',''),
        nullif(row_data->>'city',''), nullif(row_data->>'region',''), nullif(row_data->>'country',''), 'csv', 'review', batch_id,
        row_data->>'fingerprint', auth.uid(), auth.uid()
      ) returning id into v_inserted_prospect_id;
      if nullif(row_data->>'initial_note', '') is not null then
        insert into public.growth_prospect_notes(organization_id, prospect_id, author_user_id, body)
        values (target_organization_id, v_inserted_prospect_id, auth.uid(), left(row_data->>'initial_note', 4000));
      end if;
      v_inserted_count := v_inserted_count + 1;
    exception when unique_violation then v_duplicate_count := v_duplicate_count + 1;
    end;
  end loop;
  update public.growth_import_batches set accepted_count = v_inserted_count, duplicate_count = v_duplicate_count,
    rejected_count = row_total - v_inserted_count - v_duplicate_count, status = 'committed', committed_at = now() where id = v_batch_id;
  insert into public.growth_activities(organization_id, actor_user_id, event_type, metadata)
  values (target_organization_id, auth.uid(), 'import.committed', jsonb_build_object('accepted_count', v_inserted_count, 'duplicate_count', v_duplicate_count));
  return jsonb_build_object('batch_id', v_batch_id, 'accepted_count', v_inserted_count, 'duplicate_count', v_duplicate_count, 'rejected_count', row_total - v_inserted_count - v_duplicate_count, 'status', 'committed');
end $$;
revoke all on function public.commit_growth_csv_import(uuid, uuid, text, jsonb) from public;
grant execute on function public.commit_growth_csv_import(uuid, uuid, text, jsonb) to authenticated;

commit;
