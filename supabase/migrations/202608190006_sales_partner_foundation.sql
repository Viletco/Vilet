begin;

insert into public.capabilities(key, product, description, status) values
  ('partner.access','partner','Access the restricted Sales Partner Hub','active'),
  ('sales.enablement','partner','Manage sales enablement policy and partner operations','active')
on conflict (key) do update set description=excluded.description, status=excluded.status;

create type public.sales_partner_status as enum ('invited','onboarding','training','active','paused','terminated');
create type public.partner_attribution_status as enum ('pending_review','accepted','rejected','conflict','superseded');
create type public.commission_rule_type as enum ('percentage','fixed','tiered','product_specific');
create type public.commission_status as enum ('pending','earned','paid','reversed','disputed');

create table public.sales_partners (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  status public.sales_partner_status not null default 'onboarding',
  terms_accepted_at timestamptz,
  activated_at timestamptz,
  paused_at timestamptz,
  terminated_at timestamptz,
  created_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id,user_id)
);

create table public.sales_training_progress (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  partner_id uuid not null references public.sales_partners(id) on delete cascade,
  module_key text not null,
  lesson_key text not null,
  completed_at timestamptz,
  last_viewed_at timestamptz not null default now(),
  knowledge_check_score integer check (knowledge_check_score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(partner_id,module_key,lesson_key),
  unique(id,organization_id)
);

create table public.partner_lead_attributions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  partner_id uuid not null references public.sales_partners(id) on delete restrict,
  prospect_id uuid not null references public.growth_prospects(id) on delete restrict,
  source text not null default 'partner_submission',
  relationship_context text not null,
  status public.partner_attribution_status not null default 'pending_review',
  conflict_reason text,
  reviewed_by_user_id uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id,partner_id,prospect_id),
  unique(id,organization_id)
);

create table public.commission_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  name text not null,
  version integer not null check (version > 0),
  rule_type public.commission_rule_type not null,
  configuration jsonb not null default '{}'::jsonb,
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  effective_from timestamptz not null,
  effective_to timestamptz,
  approved_by_user_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique(organization_id,name,version),
  unique(id,organization_id)
);

create table public.commission_ledger (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  partner_id uuid not null references public.sales_partners(id) on delete restrict,
  attribution_id uuid not null references public.partner_lead_attributions(id) on delete restrict,
  commission_rule_id uuid not null references public.commission_rules(id) on delete restrict,
  prospect_id uuid not null references public.growth_prospects(id) on delete restrict,
  status public.commission_status not null,
  basis_minor bigint not null check (basis_minor >= 0),
  amount_minor bigint not null check (amount_minor >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  rule_snapshot jsonb not null,
  event_key text not null,
  earned_at timestamptz,
  paid_at timestamptz,
  reversal_reason text,
  created_by_user_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique(organization_id,event_key),
  unique(id,organization_id)
);

create table public.commission_payouts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  partner_id uuid not null references public.sales_partners(id) on delete restrict,
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  status text not null check (status in ('scheduled','processing','paid','failed','cancelled')),
  external_reference text,
  approved_by_user_id uuid not null references auth.users(id) on delete restrict,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  unique(id,organization_id)
);

create index sales_partners_user_idx on public.sales_partners(user_id,organization_id,status);
create index partner_attribution_prospect_idx on public.partner_lead_attributions(organization_id,prospect_id,status);
create index commission_ledger_partner_idx on public.commission_ledger(organization_id,partner_id,status);

create or replace function private.current_sales_partner(target_organization_id uuid)
returns uuid language sql stable security definer set search_path='' as $$
  select p.id from public.sales_partners p
  where p.organization_id=target_organization_id and p.user_id=auth.uid()
    and p.status in ('onboarding','training','active') limit 1
$$;

create or replace function private.current_user_is_sales_manager(target_organization_id uuid)
returns boolean language sql stable security definer set search_path='' as $$
  select private.current_user_has_org_role(target_organization_id,array['owner','admin']::public.organization_role[])
    and private.current_user_has_capability(target_organization_id,'sales.enablement')
$$;

create or replace function private.validate_partner_tenant()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  if tg_table_name='sales_training_progress' then
    if not exists(select 1 from public.sales_partners p where p.id=new.partner_id and p.organization_id=new.organization_id) then raise exception 'partner_tenant_mismatch' using errcode='23514'; end if;
  elsif tg_table_name='partner_lead_attributions' then
    if not exists(select 1 from public.sales_partners p where p.id=new.partner_id and p.organization_id=new.organization_id) or not exists(select 1 from public.growth_prospects g where g.id=new.prospect_id and g.organization_id=new.organization_id) then raise exception 'partner_attribution_tenant_mismatch' using errcode='23514'; end if;
  elsif tg_table_name='commission_ledger' then
    if not exists(select 1 from public.sales_partners p where p.id=new.partner_id and p.organization_id=new.organization_id) or not exists(select 1 from public.partner_lead_attributions a where a.id=new.attribution_id and a.organization_id=new.organization_id and a.partner_id=new.partner_id and a.prospect_id=new.prospect_id) or not exists(select 1 from public.commission_rules r where r.id=new.commission_rule_id and r.organization_id=new.organization_id) then raise exception 'commission_tenant_mismatch' using errcode='23514'; end if;
  end if;
  return new;
end $$;

create trigger sales_partner_updated_at before update on public.sales_partners for each row execute function private.set_updated_at();
create trigger sales_training_updated_at before update on public.sales_training_progress for each row execute function private.set_updated_at();
create trigger partner_attribution_updated_at before update on public.partner_lead_attributions for each row execute function private.set_updated_at();
create trigger sales_training_tenant before insert or update on public.sales_training_progress for each row execute function private.validate_partner_tenant();
create trigger partner_attribution_tenant before insert or update on public.partner_lead_attributions for each row execute function private.validate_partner_tenant();
create trigger commission_ledger_tenant before insert or update on public.commission_ledger for each row execute function private.validate_partner_tenant();

alter table public.sales_partners enable row level security;
alter table public.sales_training_progress enable row level security;
alter table public.partner_lead_attributions enable row level security;
alter table public.commission_rules enable row level security;
alter table public.commission_ledger enable row level security;
alter table public.commission_payouts enable row level security;

create policy sales_partners_select_own_or_manager on public.sales_partners for select to authenticated using (user_id=auth.uid() or private.current_user_is_sales_manager(organization_id));
create policy sales_partners_manage on public.sales_partners for all to authenticated using (private.current_user_is_sales_manager(organization_id)) with check (private.current_user_is_sales_manager(organization_id));
create policy training_select_own_or_manager on public.sales_training_progress for select to authenticated using (partner_id=private.current_sales_partner(organization_id) or private.current_user_is_sales_manager(organization_id));
create policy training_mutate_own on public.sales_training_progress for all to authenticated using (partner_id=private.current_sales_partner(organization_id)) with check (partner_id=private.current_sales_partner(organization_id) and private.current_user_has_capability(organization_id,'partner.access'));
create policy attribution_select_own_or_manager on public.partner_lead_attributions for select to authenticated using (partner_id=private.current_sales_partner(organization_id) or private.current_user_is_sales_manager(organization_id));
create policy attribution_insert_own on public.partner_lead_attributions for insert to authenticated with check (partner_id=private.current_sales_partner(organization_id) and status='pending_review' and reviewed_by_user_id is null and reviewed_at is null and private.current_user_has_capability(organization_id,'partner.access'));
create policy attribution_manage on public.partner_lead_attributions for update to authenticated using (private.current_user_is_sales_manager(organization_id)) with check (private.current_user_is_sales_manager(organization_id));
create policy commission_rules_select_partner on public.commission_rules for select to authenticated using (private.current_sales_partner(organization_id) is not null or private.current_user_is_sales_manager(organization_id));
create policy commission_rules_manage on public.commission_rules for all to authenticated using (private.current_user_is_sales_manager(organization_id)) with check (private.current_user_is_sales_manager(organization_id));
create policy commission_ledger_select_own_or_manager on public.commission_ledger for select to authenticated using (partner_id=private.current_sales_partner(organization_id) or private.current_user_is_sales_manager(organization_id));
create policy commission_ledger_manage on public.commission_ledger for all to authenticated using (private.current_user_is_sales_manager(organization_id)) with check (private.current_user_is_sales_manager(organization_id));
create policy commission_payouts_select_own_or_manager on public.commission_payouts for select to authenticated using (partner_id=private.current_sales_partner(organization_id) or private.current_user_is_sales_manager(organization_id));
create policy commission_payouts_manage on public.commission_payouts for all to authenticated using (private.current_user_is_sales_manager(organization_id)) with check (private.current_user_is_sales_manager(organization_id));

-- Partners receive a deliberately narrow projection of their attributed leads.
create view public.partner_own_leads with (security_invoker=true) as
select a.organization_id,a.partner_id,a.id attribution_id,a.status attribution_status,a.submitted_at,
       p.id prospect_id,p.business_name,p.website_url,p.industry,p.city,p.region,
       case p.pipeline_stage when 'review' then 'submitted' when 'qualified' then 'qualified'
         when 'outreach_ready' then 'in_progress' when 'contacted' then 'in_progress'
         when 'replied' then 'in_progress' when 'opportunity' then 'in_progress'
         when 'won' then 'won' when 'lost' then 'lost' when 'disqualified' then 'lost' else 'under_review' end partner_status
from public.partner_lead_attributions a join public.growth_prospects p on p.id=a.prospect_id and p.organization_id=a.organization_id;

create or replace function public.list_partner_own_leads(target_organization_id uuid)
returns table(attribution_id uuid, attribution_status public.partner_attribution_status, submitted_at timestamptz,
  prospect_id uuid, business_name text, website_url text, industry text, city text, region text, partner_status text)
language sql stable security definer set search_path='' as $$
  select a.id,a.status,a.submitted_at,p.id,p.business_name,p.website_url,p.industry,p.city,p.region,
    case p.pipeline_stage when 'review' then 'submitted' when 'qualified' then 'qualified'
      when 'outreach_ready' then 'in_progress' when 'contacted' then 'in_progress'
      when 'replied' then 'in_progress' when 'opportunity' then 'in_progress'
      when 'won' then 'won' when 'lost' then 'lost' when 'disqualified' then 'lost' else 'under_review' end
  from public.partner_lead_attributions a
  join public.growth_prospects p on p.id=a.prospect_id and p.organization_id=a.organization_id
  where a.organization_id=target_organization_id
    and a.partner_id=private.current_sales_partner(target_organization_id)
    and private.current_user_has_capability(target_organization_id,'partner.access')
$$;

create or replace function public.submit_partner_lead(
  target_organization_id uuid, submitted_business_name text, submitted_website_url text,
  submitted_industry text, submitted_city text, submitted_region text,
  submitted_relationship_context text, submission_key uuid
) returns jsonb language plpgsql security definer set search_path='' as $$
declare
  partner uuid := private.current_sales_partner(target_organization_id);
  normalized_name text := lower(regexp_replace(trim(submitted_business_name),'\s+',' ','g'));
  normalized_domain text;
  prospect uuid;
  attribution uuid;
  attribution_state public.partner_attribution_status := 'pending_review';
  prospect_created boolean := false;
begin
  if partner is null or not private.current_user_has_capability(target_organization_id,'partner.access') then
    raise exception 'partner_access_denied' using errcode='42501';
  end if;
  if length(trim(submitted_business_name)) < 2 or length(trim(submitted_relationship_context)) < 10 then
    raise exception 'partner_lead_invalid' using errcode='22023';
  end if;
  if submitted_website_url is not null and trim(submitted_website_url) <> '' then
    normalized_domain := lower(regexp_replace(regexp_replace(trim(submitted_website_url),'^https?://',''),'^(www\.)?([^/]+).*$','\2'));
  end if;
  select p.id into prospect from public.growth_prospects p
    where p.organization_id=target_organization_id and p.status='active'
      and ((normalized_domain is not null and p.domain_normalized=normalized_domain) or
           (normalized_domain is null and p.business_name_normalized=normalized_name))
    order by p.created_at limit 1;
  if prospect is null then
    insert into public.growth_prospects(organization_id,business_name,business_name_normalized,
      website_url,domain_normalized,industry,city,region,source_type,pipeline_stage,created_by_user_id,updated_by_user_id)
    values(target_organization_id,trim(submitted_business_name),normalized_name,nullif(trim(submitted_website_url),''),
      normalized_domain,nullif(trim(submitted_industry),''),nullif(trim(submitted_city),''),nullif(trim(submitted_region),''),
      'referral','review',auth.uid(),auth.uid()) returning id into prospect;
    prospect_created := true;
  else
    attribution_state := 'conflict';
  end if;
  if exists(select 1 from public.partner_lead_attributions a where a.organization_id=target_organization_id and a.prospect_id=prospect) then
    attribution_state := 'conflict';
  end if;
  insert into public.partner_lead_attributions(organization_id,partner_id,prospect_id,relationship_context,status,conflict_reason)
  values(target_organization_id,partner,prospect,trim(submitted_relationship_context),attribution_state,
    case when attribution_state='conflict' then 'Existing prospect or attribution requires owner review.' end)
  on conflict (organization_id,partner_id,prospect_id) do update set updated_at=now()
  returning id into attribution;
  insert into public.audit_events(organization_id,actor_user_id,action,target_type,target_id,metadata)
  values(target_organization_id,auth.uid(),'partner.lead_submitted','partner_lead_attribution',attribution::text,
    jsonb_build_object('prospect_id',prospect,'attribution_status',attribution_state,'prospect_created',prospect_created,'submission_key',submission_key));
  return jsonb_build_object('attribution_id',attribution,'prospect_id',prospect,'status',attribution_state,'prospect_created',prospect_created);
end $$;

revoke all on function public.list_partner_own_leads(uuid) from public,anon;
revoke all on function public.submit_partner_lead(uuid,text,text,text,text,text,text,uuid) from public,anon;
grant execute on function public.list_partner_own_leads(uuid) to authenticated;
grant execute on function public.submit_partner_lead(uuid,text,text,text,text,text,text,uuid) to authenticated;

revoke all on public.sales_partners,public.sales_training_progress,public.partner_lead_attributions,public.commission_rules,public.commission_ledger,public.commission_payouts from anon;
grant select,insert,update on public.sales_partners,public.sales_training_progress,public.partner_lead_attributions,public.commission_rules,public.commission_ledger,public.commission_payouts to authenticated;
grant select on public.partner_own_leads to authenticated;

commit;
