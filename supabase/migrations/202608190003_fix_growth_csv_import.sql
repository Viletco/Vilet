begin;

create or replace function public.commit_growth_csv_import(
  target_organization_id uuid,
  import_idempotency_key uuid,
  import_filename text,
  import_rows jsonb
) returns jsonb language plpgsql security definer set search_path = pg_catalog, public
as $$
declare v_batch_id uuid; v_inserted_prospect_id uuid; row_data jsonb; v_inserted_count integer := 0; v_duplicate_count integer := 0; row_total integer;
begin
  if not private.current_user_has_capability(target_organization_id, 'growth.prospecting') then raise exception 'growth_access_denied' using errcode = '42501'; end if;
  if jsonb_typeof(import_rows) <> 'array' then raise exception 'invalid_import_rows' using errcode = '22023'; end if;
  row_total := jsonb_array_length(import_rows);
  if row_total < 1 or row_total > 500 then raise exception 'invalid_import_row_count' using errcode = '22023'; end if;
  select batches.id into v_batch_id from public.growth_import_batches as batches where batches.organization_id = target_organization_id and batches.idempotency_key = import_idempotency_key;
  if v_batch_id is not null then
    return (select jsonb_build_object('batch_id', batches.id, 'accepted_count', batches.accepted_count, 'duplicate_count', batches.duplicate_count, 'rejected_count', batches.rejected_count, 'status', batches.status) from public.growth_import_batches as batches where batches.id = v_batch_id);
  end if;
  insert into public.growth_import_batches(organization_id, created_by_user_id, filename, idempotency_key, row_count)
  values (target_organization_id, auth.uid(), import_filename, import_idempotency_key, row_total) returning id into v_batch_id;
  for row_data in select value from jsonb_array_elements(import_rows) loop
    begin
      insert into public.growth_prospects(
        organization_id, business_name, business_name_normalized, website_url, domain_normalized, phone, phone_normalized,
        email_public, email_normalized, industry, city, region, country, source_type, pipeline_stage, import_batch_id,
        import_row_fingerprint, created_by_user_id, updated_by_user_id
      ) values (
        target_organization_id, row_data->>'business_name', row_data->>'business_name_normalized', nullif(row_data->>'website_url',''),
        nullif(row_data->>'domain_normalized',''), nullif(row_data->>'phone',''), nullif(row_data->>'phone_normalized',''),
        nullif(row_data->>'email_public',''), nullif(row_data->>'email_normalized',''), nullif(row_data->>'industry',''),
        nullif(row_data->>'city',''), nullif(row_data->>'region',''), nullif(row_data->>'country',''), 'csv', 'review', v_batch_id,
        row_data->>'fingerprint', auth.uid(), auth.uid()
      ) returning id into v_inserted_prospect_id;
      if nullif(row_data->>'initial_note', '') is not null then
        insert into public.growth_prospect_notes(organization_id, prospect_id, author_user_id, body)
        values (target_organization_id, v_inserted_prospect_id, auth.uid(), left(row_data->>'initial_note', 4000));
      end if;
      v_inserted_count := v_inserted_count + 1;
    exception when unique_violation then v_duplicate_count := v_duplicate_count + 1;
    end;
  end loop;
  update public.growth_import_batches set accepted_count = v_inserted_count, duplicate_count = v_duplicate_count,
    rejected_count = row_total - v_inserted_count - v_duplicate_count, status = 'committed', committed_at = now() where id = v_batch_id;
  insert into public.growth_activities(organization_id, actor_user_id, event_type, metadata)
  values (target_organization_id, auth.uid(), 'import.committed', jsonb_build_object('accepted_count', v_inserted_count, 'duplicate_count', v_duplicate_count));
  return jsonb_build_object('batch_id', v_batch_id, 'accepted_count', v_inserted_count, 'duplicate_count', v_duplicate_count, 'rejected_count', row_total - v_inserted_count - v_duplicate_count, 'status', 'committed');
end $$;

revoke all on function public.commit_growth_csv_import(uuid, uuid, text, jsonb) from public;
grant execute on function public.commit_growth_csv_import(uuid, uuid, text, jsonb) to authenticated;

commit;
