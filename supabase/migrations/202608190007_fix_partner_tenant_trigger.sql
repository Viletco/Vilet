begin;

create or replace function private.validate_partner_tenant()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  if tg_table_name='sales_training_progress' then
    if not exists(select 1 from public.sales_partners p where p.id=new.partner_id and p.organization_id=new.organization_id) then
      raise exception 'partner_tenant_mismatch' using errcode='23514';
    end if;
  elsif tg_table_name='partner_lead_attributions' then
    if not exists(select 1 from public.sales_partners p where p.id=new.partner_id and p.organization_id=new.organization_id)
      or not exists(select 1 from public.growth_prospects g where g.id=new.prospect_id and g.organization_id=new.organization_id) then
      raise exception 'partner_attribution_tenant_mismatch' using errcode='23514';
    end if;
  elsif tg_table_name='commission_ledger' then
    if not exists(select 1 from public.sales_partners p where p.id=new.partner_id and p.organization_id=new.organization_id)
      or not exists(select 1 from public.partner_lead_attributions a where a.id=new.attribution_id and a.organization_id=new.organization_id and a.partner_id=new.partner_id and a.prospect_id=new.prospect_id)
      or not exists(select 1 from public.commission_rules r where r.id=new.commission_rule_id and r.organization_id=new.organization_id) then
      raise exception 'commission_tenant_mismatch' using errcode='23514';
    end if;
  end if;
  return new;
end $$;

commit;
