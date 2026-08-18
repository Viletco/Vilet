-- Run against a disposable local Supabase database after applying migrations:
-- supabase test db supabase/tests/phase_a_rls.sql
-- This integration suite is intentionally not claimed as executed until Supabase CLI is configured.
begin;
select plan(5);
select has_table('public', 'organizations', 'organizations exists');
select has_table('public', 'organization_memberships', 'memberships exists');
select has_table('public', 'organization_entitlements', 'entitlements exists');
select is((select relrowsecurity from pg_class where oid = 'public.organizations'::regclass), true, 'organization RLS enabled');
select is((select relrowsecurity from pg_class where oid = 'public.organization_entitlements'::regclass), true, 'entitlement RLS enabled');
select * from finish();
rollback;
