begin;

drop policy if exists memberships_insert_admin on public.organization_memberships;
drop policy if exists memberships_update_admin on public.organization_memberships;

create policy memberships_insert_manager
on public.organization_memberships
for insert
to authenticated
with check (
  private.current_user_has_org_role(
    organization_id,
    array['owner']::public.organization_role[]
  )
  or (
    private.current_user_has_org_role(
      organization_id,
      array['admin']::public.organization_role[]
    )
    and role = any (
      array['member','billing','viewer']::public.organization_role[]
    )
  )
);

create policy memberships_update_manager
on public.organization_memberships
for update
to authenticated
using (
  private.current_user_has_org_role(
    organization_id,
    array['owner']::public.organization_role[]
  )
  or (
    private.current_user_has_org_role(
      organization_id,
      array['admin']::public.organization_role[]
    )
    and role = any (
      array['member','billing','viewer']::public.organization_role[]
    )
  )
)
with check (
  private.current_user_has_org_role(
    organization_id,
    array['owner']::public.organization_role[]
  )
  or (
    private.current_user_has_org_role(
      organization_id,
      array['admin']::public.organization_role[]
    )
    and role = any (
      array['member','billing','viewer']::public.organization_role[]
    )
  )
);

commit;
