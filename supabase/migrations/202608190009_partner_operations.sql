begin;

create type public.sales_partner_invitation_status as enum ('pending','accepted','expired','revoked');

create table public.sales_partner_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  target_email text not null,
  intended_role public.organization_role not null default 'member',
  status public.sales_partner_invitation_status not null default 'pending',
  token_hash bytea not null,
  created_by_user_id uuid not null references auth.users(id) on delete restrict,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  check (intended_role not in ('owner','admin')),
  unique(organization_id,target_email,status)
);

create table public.sales_assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  partner_id uuid not null references public.sales_partners(id) on delete cascade,
  assessment_key text not null,
  question_version text not null,
  answers jsonb not null,
  score integer check (score between 0 and 100),
  result_label text not null default 'provisional',
  submitted_at timestamptz not null default now(),
  reviewed_by_user_id uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz
);

create table public.partner_notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  partner_id uuid not null references public.sales_partners(id) on delete cascade,
  event_type text not null,
  title text not null,
  body text not null,
  target_path text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.sales_partner_invitations enable row level security;
alter table public.sales_assessment_attempts enable row level security;
alter table public.partner_notifications enable row level security;

create policy partner_invitations_manager_only on public.sales_partner_invitations for all to authenticated
  using (private.current_user_is_sales_manager(organization_id))
  with check (private.current_user_is_sales_manager(organization_id));
create policy assessment_select_own_or_manager on public.sales_assessment_attempts for select to authenticated
  using (partner_id=private.current_sales_partner(organization_id) or private.current_user_is_sales_manager(organization_id));
create policy assessment_insert_own on public.sales_assessment_attempts for insert to authenticated
  with check (partner_id=private.current_sales_partner(organization_id) and reviewed_by_user_id is null and reviewed_at is null);
create policy assessment_review_manager on public.sales_assessment_attempts for update to authenticated
  using (private.current_user_is_sales_manager(organization_id))
  with check (private.current_user_is_sales_manager(organization_id));
create policy notification_select_own_or_manager on public.partner_notifications for select to authenticated
  using (partner_id=private.current_sales_partner(organization_id) or private.current_user_is_sales_manager(organization_id));
create policy notification_mark_read_own on public.partner_notifications for update to authenticated
  using (partner_id=private.current_sales_partner(organization_id))
  with check (partner_id=private.current_sales_partner(organization_id));
create policy notification_manage on public.partner_notifications for all to authenticated
  using (private.current_user_is_sales_manager(organization_id))
  with check (private.current_user_is_sales_manager(organization_id));

revoke all on public.sales_partner_invitations,public.sales_assessment_attempts,public.partner_notifications from anon;
grant select,insert,update on public.sales_partner_invitations,public.sales_assessment_attempts,public.partner_notifications to authenticated;

commit;
