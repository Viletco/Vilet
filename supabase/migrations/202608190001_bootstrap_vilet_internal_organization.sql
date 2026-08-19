begin;

create unique index if not exists organization_entitlements_active_internal_unique
on public.organization_entitlements (organization_id, capability_key)
where source_type = 'internal'
  and revoked_at is null
  and ends_at is null;

create or replace function public.bootstrap_vilet_owner(target_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  internal_organization public.organizations%rowtype;
  existing_membership public.organization_memberships%rowtype;
  existing_administrator public.platform_administrators%rowtype;
  capability record;
  membership_id uuid;
  entitlement_id uuid;
  organization_created integer := 0;
  membership_created integer := 0;
  administrator_created integer := 0;
  entitlements_created integer := 0;
  expected_capabilities constant text[] := array[
    'studio.access',
    'studio.projects',
    'studio.project_admin',
    'growth.access',
    'growth.prospecting',
    'growth.outreach',
    'growth.pipeline',
    'insights.access',
    'insights.analytics',
    'insights.seo',
    'ai.access',
    'billing.manage',
    'support.access'
  ];
begin
  if auth.role() <> 'service_role' then
    raise exception 'The Vilét owner bootstrap requires the service role.';
  end if;

  if target_user_id is null or not exists (
    select 1 from auth.users where id = target_user_id
  ) then
    raise exception 'The target authentication user does not exist.';
  end if;

  if (
    select count(*)
    from public.capabilities
    where key = any(expected_capabilities)
      and status = 'active'
  ) <> cardinality(expected_capabilities) then
    raise exception 'The active capability catalog is incomplete.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('vilet.bootstrap.owner', 0));

  select * into internal_organization
  from public.organizations
  where slug = 'vilet'
  for update;

  if internal_organization.id is null then
    insert into public.organizations (name, slug, kind, status)
    values ('Vilét', 'vilet', 'internal', 'active')
    returning * into internal_organization;
    organization_created := 1;

    insert into public.audit_events (
      organization_id,
      actor_user_id,
      action,
      target_type,
      target_id,
      metadata
    ) values (
      internal_organization.id,
      target_user_id,
      'platform.internal_organization.created',
      'organization',
      internal_organization.id::text,
      jsonb_build_object('mechanism', 'controlled_cli', 'phase', 'B')
    );
  elsif internal_organization.name <> 'Vilét'
    or internal_organization.kind <> 'internal'
    or internal_organization.status <> 'active' then
    raise exception 'The vilet organization exists with conflicting protected attributes.';
  end if;

  select * into existing_membership
  from public.organization_memberships
  where organization_id = internal_organization.id
    and user_id = target_user_id
  for update;

  if existing_membership.id is null then
    insert into public.organization_memberships (
      organization_id,
      user_id,
      role,
      status,
      joined_at
    ) values (
      internal_organization.id,
      target_user_id,
      'owner',
      'active',
      now()
    ) returning id into membership_id;
    membership_created := 1;

    insert into public.audit_events (
      organization_id,
      actor_user_id,
      action,
      target_type,
      target_id,
      metadata
    ) values (
      internal_organization.id,
      target_user_id,
      'organization.owner_membership.granted',
      'organization_membership',
      membership_id::text,
      jsonb_build_object('role', 'owner', 'status', 'active', 'mechanism', 'controlled_cli')
    );
  elsif existing_membership.role <> 'owner'
    or existing_membership.status <> 'active' then
    raise exception 'The target user has a conflicting Vilét membership requiring manual review.';
  end if;

  select * into existing_administrator
  from public.platform_administrators
  where user_id = target_user_id
  for update;

  if existing_administrator.user_id is null then
    insert into public.platform_administrators (
      user_id,
      granted_by_user_id
    ) values (
      target_user_id,
      target_user_id
    );
    administrator_created := 1;

    insert into public.audit_events (
      organization_id,
      actor_user_id,
      action,
      target_type,
      target_id,
      metadata
    ) values (
      internal_organization.id,
      target_user_id,
      'platform.administrator.granted',
      'platform_administrator',
      target_user_id::text,
      jsonb_build_object('mechanism', 'controlled_cli', 'phase', 'B')
    );
  elsif existing_administrator.revoked_at is not null then
    raise exception 'The target user has a revoked platform-administrator grant requiring manual review.';
  end if;

  for capability in
    select key from public.capabilities
    where key = any(expected_capabilities)
    order by key
  loop
    if not exists (
      select 1
      from public.organization_entitlements
      where organization_id = internal_organization.id
        and capability_key = capability.key
        and source_type = 'internal'
        and revoked_at is null
        and ends_at is null
    ) then
      insert into public.organization_entitlements (
        organization_id,
        capability_key,
        source_type,
        source_reference,
        granted_by_user_id,
        metadata
      ) values (
        internal_organization.id,
        capability.key,
        'internal',
        'vilet-owner-bootstrap',
        target_user_id,
        jsonb_build_object('mechanism', 'controlled_cli', 'phase', 'B')
      ) returning id into entitlement_id;
      entitlements_created := entitlements_created + 1;

      insert into public.audit_events (
        organization_id,
        actor_user_id,
        action,
        target_type,
        target_id,
        metadata
      ) values (
        internal_organization.id,
        target_user_id,
        'organization.internal_entitlement.granted',
        'organization_entitlement',
        entitlement_id::text,
        jsonb_build_object('capability', capability.key, 'source_type', 'internal', 'mechanism', 'controlled_cli')
      );
    end if;
  end loop;

  if organization_created + membership_created + administrator_created + entitlements_created > 0 then
    insert into public.audit_events (
      organization_id,
      actor_user_id,
      action,
      target_type,
      target_id,
      metadata
    ) values (
      internal_organization.id,
      target_user_id,
      'platform.owner_bootstrap.completed',
      'organization',
      internal_organization.id::text,
      jsonb_build_object(
        'organization_created', organization_created,
        'membership_created', membership_created,
        'administrator_created', administrator_created,
        'entitlements_created', entitlements_created,
        'mechanism', 'controlled_cli'
      )
    );
  end if;

  return jsonb_build_object(
    'organization', 'vilet',
    'organization_created', organization_created,
    'membership_created', membership_created,
    'administrator_created', administrator_created,
    'entitlements_created', entitlements_created,
    'changed', organization_created + membership_created + administrator_created + entitlements_created > 0
  );
end;
$$;

revoke all on function public.bootstrap_vilet_owner(uuid) from public;
revoke all on function public.bootstrap_vilet_owner(uuid) from anon;
revoke all on function public.bootstrap_vilet_owner(uuid) from authenticated;
grant execute on function public.bootstrap_vilet_owner(uuid) to service_role;

commit;
