begin;

alter function public.commit_growth_csv_import(uuid, uuid, text, jsonb)
  security definer;

revoke all on function public.commit_growth_csv_import(uuid, uuid, text, jsonb) from public;
grant execute on function public.commit_growth_csv_import(uuid, uuid, text, jsonb) to authenticated;

commit;
