-- Read-only verification for the Phase A account foundation.

with checks as (
  select 'phase_a_tables_exist'::text as check_name, 8::bigint as expected, count(*)::bigint as actual
  from pg_class tables
  join pg_namespace schemas on schemas.oid = tables.relnamespace
  where schemas.nspname = 'public' and tables.relkind = 'r'
    and tables.relname = any (array['profiles','organizations','organization_memberships','organization_invitations','platform_administrators','capabilities','organization_entitlements','audit_events'])

  union all

  select 'phase_a_tables_with_rls', 8, count(*)
  from pg_class tables
  join pg_namespace schemas on schemas.oid = tables.relnamespace
  where schemas.nspname = 'public' and tables.relkind = 'r' and tables.relrowsecurity
    and tables.relname = any (array['profiles','organizations','organization_memberships','organization_invitations','platform_administrators','capabilities','organization_entitlements','audit_events'])

  union all

  select 'phase_a_rls_policies', 13, count(*)
  from pg_policy policies
  join pg_class tables on tables.oid = policies.polrelid
  join pg_namespace schemas on schemas.oid = tables.relnamespace
  where schemas.nspname = 'public'
    and tables.relname = any (array['profiles','organizations','organization_memberships','organization_invitations','platform_administrators','capabilities','organization_entitlements','audit_events'])

  union all

  select 'private_authorization_helpers', 3, count(*)
  from pg_proc routines
  join pg_namespace schemas on schemas.oid = routines.pronamespace
  where schemas.nspname = 'private'
    and routines.proname = any (array['current_user_is_active_member','current_user_has_org_role','current_user_is_platform_administrator'])

  union all

  select 'seeded_capabilities', 13, count(*)
  from public.capabilities
)
select check_name, expected, actual,
  case when expected = actual then 'PASS' else 'FAIL' end as result
from checks
order by check_name;
