begin;

create type public.growth_outreach_status as enum ('draft','review','approved','sending','sent','failed','suppressed','cancelled');

create table public.growth_discovery_runs (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by_user_id uuid not null references auth.users(id), provider text not null, industry text not null, location text not null,
  keywords text, requested_limit integer not null check (requested_limit between 1 and 25), found_count integer not null default 0,
  created_count integer not null default 0, duplicate_count integer not null default 0, qualified_count integer not null default 0,
  needs_contact_count integer not null default 0, failed_count integer not null default 0,
  status text not null check (status in ('running','succeeded','failed')), safe_failure_code text, created_at timestamptz not null default now(), completed_at timestamptz
);
create index growth_discovery_runs_org_time_idx on public.growth_discovery_runs(organization_id, created_at desc);
create unique index growth_prospects_provider_identity_uidx on public.growth_prospects(organization_id,source_type,source_reference) where source_type='provider' and source_reference is not null;

create table public.growth_research (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  prospect_id uuid not null references public.growth_prospects(id) on delete cascade, provider text not null,
  evidence jsonb not null check (jsonb_typeof(evidence)='array'), inference text not null, recommendation text not null,
  evidence_version text not null, generated_at timestamptz not null default now(), unique(organization_id, prospect_id)
);

create table public.growth_scores (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  prospect_id uuid not null references public.growth_prospects(id) on delete cascade,
  fit integer not null check (fit between 0 and 100), need integer not null check (need between 0 and 100),
  potential_value integer not null check (potential_value between 0 and 100), reachability integer not null check (reachability between 0 and 100),
  confidence integer not null check (confidence between 0 and 100), priority_score integer not null check (priority_score between 0 and 100),
  explanation text not null, scoring_version text not null, generated_at timestamptz not null default now(), unique(organization_id, prospect_id)
);

create table public.growth_contacts (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  prospect_id uuid not null references public.growth_prospects(id) on delete cascade, name text, title text,
  email text not null, email_normalized text not null, source_type text not null, source_reference text,
  verification_status text not null check (verification_status in ('verified','likely','unverified','invalid')),
  confidence integer check (confidence between 0 and 100), enriched_at timestamptz not null default now(), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(organization_id, email_normalized)
);
create index growth_contacts_prospect_idx on public.growth_contacts(organization_id, prospect_id);

create table public.growth_suppressions (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  email_normalized text, domain_normalized text, prospect_id uuid references public.growth_prospects(id) on delete cascade,
  reason text not null check (reason in ('manual','unsubscribe','bounce','invalid_email','do_not_contact')),
  source text not null, created_by_user_id uuid references auth.users(id), created_at timestamptz not null default now(),
  check (email_normalized is not null or domain_normalized is not null or prospect_id is not null)
);
create unique index growth_suppressions_email_uidx on public.growth_suppressions(organization_id,email_normalized) where email_normalized is not null;

create table public.growth_outreach_messages (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  prospect_id uuid not null references public.growth_prospects(id) on delete cascade, contact_id uuid not null references public.growth_contacts(id) on delete restrict,
  subject text not null check (char_length(subject) between 1 and 200), body text not null check (char_length(body) between 1 and 5000),
  status public.growth_outreach_status not null default 'draft', generation_version text not null, evidence_references jsonb not null check (jsonb_typeof(evidence_references)='array'),
  idempotency_key text not null, created_by_user_id uuid not null references auth.users(id), approved_by_user_id uuid references auth.users(id),
  approved_at timestamptz, provider_message_id text, sent_at timestamptz, safe_failure_code text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(organization_id,idempotency_key)
);
create index growth_outreach_review_idx on public.growth_outreach_messages(organization_id,status,created_at desc);

alter table public.growth_activities drop constraint growth_activities_event_type_check;
alter table public.growth_activities add constraint growth_activities_event_type_check check (event_type ~ '^(prospect|import|discovery|research|score|contact|outreach)\.[a-z_]+' and char_length(event_type) <= 80);

alter table public.growth_discovery_runs enable row level security;
alter table public.growth_research enable row level security;
alter table public.growth_scores enable row level security;
alter table public.growth_contacts enable row level security;
alter table public.growth_suppressions enable row level security;
alter table public.growth_outreach_messages enable row level security;

create policy growth_discovery_all on public.growth_discovery_runs for all to authenticated using (private.current_user_has_capability(organization_id,'growth.prospecting')) with check (created_by_user_id=auth.uid() and private.current_user_has_capability(organization_id,'growth.prospecting'));
create policy growth_research_all on public.growth_research for all to authenticated using (private.current_user_has_capability(organization_id,'growth.prospecting')) with check (private.current_user_has_capability(organization_id,'growth.prospecting'));
create policy growth_scores_all on public.growth_scores for all to authenticated using (private.current_user_has_capability(organization_id,'growth.prospecting')) with check (private.current_user_has_capability(organization_id,'growth.prospecting'));
create policy growth_contacts_select on public.growth_contacts for select to authenticated using (private.current_user_has_capability(organization_id,'growth.access'));
create policy growth_contacts_mutate on public.growth_contacts for all to authenticated using (private.current_user_has_capability(organization_id,'growth.prospecting')) with check (private.current_user_has_capability(organization_id,'growth.prospecting'));
create policy growth_suppressions_all on public.growth_suppressions for all to authenticated using (private.current_user_has_capability(organization_id,'growth.outreach')) with check (private.current_user_has_capability(organization_id,'growth.outreach'));
create policy growth_outreach_all on public.growth_outreach_messages for all to authenticated using (private.current_user_has_capability(organization_id,'growth.outreach')) with check (private.current_user_has_capability(organization_id,'growth.outreach'));

create function private.growth_validate_lead_engine_tenant() returns trigger language plpgsql security definer set search_path=pg_catalog,public as $$
begin
  if tg_table_name in ('growth_research','growth_scores','growth_contacts','growth_suppressions','growth_outreach_messages')
    and new.prospect_id is not null
    and not exists (select 1 from public.growth_prospects p where p.id=new.prospect_id and p.organization_id=new.organization_id)
  then raise exception 'growth_cross_tenant_prospect_denied' using errcode='42501'; end if;
  if tg_table_name='growth_outreach_messages'
    and not exists (select 1 from public.growth_contacts c where c.id=new.contact_id and c.prospect_id=new.prospect_id and c.organization_id=new.organization_id)
  then raise exception 'growth_cross_tenant_contact_denied' using errcode='42501'; end if;
  return new;
end $$;
revoke all on function private.growth_validate_lead_engine_tenant() from public,anon,authenticated;
create trigger growth_research_tenant before insert or update on public.growth_research for each row execute function private.growth_validate_lead_engine_tenant();
create trigger growth_scores_tenant before insert or update on public.growth_scores for each row execute function private.growth_validate_lead_engine_tenant();
create trigger growth_contacts_tenant before insert or update on public.growth_contacts for each row execute function private.growth_validate_lead_engine_tenant();
create trigger growth_suppressions_tenant before insert or update on public.growth_suppressions for each row execute function private.growth_validate_lead_engine_tenant();
create trigger growth_outreach_tenant before insert or update on public.growth_outreach_messages for each row execute function private.growth_validate_lead_engine_tenant();

create function private.growth_record_lead_engine_activity() returns trigger language plpgsql security definer set search_path=pg_catalog,public as $$
declare event_key text; target_prospect uuid; safe_metadata jsonb := '{}'::jsonb;
begin
  target_prospect := case when tg_table_name='growth_discovery_runs' then null else new.prospect_id end;
  if tg_table_name='growth_discovery_runs' then event_key := case when new.status='running' then 'discovery.started' else 'discovery.completed' end; safe_metadata := jsonb_build_object('status',new.status,'found_count',new.found_count,'created_count',new.created_count);
  elsif tg_table_name='growth_research' then event_key := 'research.completed'; safe_metadata := jsonb_build_object('evidence_version',new.evidence_version);
  elsif tg_table_name='growth_scores' then event_key := 'score.completed'; safe_metadata := jsonb_build_object('priority_score',new.priority_score,'scoring_version',new.scoring_version);
  elsif tg_table_name='growth_contacts' then event_key := 'contact.enriched'; safe_metadata := jsonb_build_object('verification_status',new.verification_status);
  elsif tg_table_name='growth_outreach_messages' then
    if tg_op='INSERT' then event_key := 'outreach.generated';
    elsif old.status is distinct from new.status then event_key := 'outreach.' || new.status::text;
    else event_key := 'outreach.edited'; end if;
    safe_metadata := jsonb_build_object('status',new.status,'generation_version',new.generation_version);
  end if;
  insert into public.growth_activities(organization_id,prospect_id,actor_user_id,event_type,metadata) values(new.organization_id,target_prospect,auth.uid(),event_key,safe_metadata);
  return new;
end $$;
create trigger growth_discovery_activity after insert or update of status on public.growth_discovery_runs for each row execute function private.growth_record_lead_engine_activity();
create trigger growth_research_activity after insert on public.growth_research for each row execute function private.growth_record_lead_engine_activity();
create trigger growth_score_activity after insert on public.growth_scores for each row execute function private.growth_record_lead_engine_activity();
create trigger growth_contact_activity after insert on public.growth_contacts for each row execute function private.growth_record_lead_engine_activity();
create trigger growth_outreach_activity after insert or update of status,subject,body on public.growth_outreach_messages for each row execute function private.growth_record_lead_engine_activity();

commit;
