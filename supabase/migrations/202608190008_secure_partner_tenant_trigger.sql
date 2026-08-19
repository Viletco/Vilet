begin;

alter function private.validate_partner_tenant() security definer;

revoke all on function private.validate_partner_tenant() from public, anon, authenticated;

commit;
