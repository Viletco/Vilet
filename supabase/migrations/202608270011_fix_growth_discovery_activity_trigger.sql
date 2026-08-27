begin;

create or replace function private.growth_record_lead_engine_activity()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  event_key text;
  target_prospect uuid;
  safe_metadata jsonb := '{}'::jsonb;
begin
  if tg_table_name = 'growth_discovery_runs' then
    target_prospect := null;
    event_key := case
      when new.status = 'running' then 'discovery.started'
      else 'discovery.completed'
    end;
    safe_metadata := jsonb_build_object(
      'status', new.status,
      'found_count', new.found_count,
      'created_count', new.created_count
    );
  else
    target_prospect := new.prospect_id;

    if tg_table_name = 'growth_research' then
      event_key := 'research.completed';
      safe_metadata := jsonb_build_object('evidence_version', new.evidence_version);
    elsif tg_table_name = 'growth_scores' then
      event_key := 'score.completed';
      safe_metadata := jsonb_build_object(
        'priority_score', new.priority_score,
        'scoring_version', new.scoring_version
      );
    elsif tg_table_name = 'growth_contacts' then
      event_key := 'contact.enriched';
      safe_metadata := jsonb_build_object(
        'verification_status', new.verification_status
      );
    elsif tg_table_name = 'growth_outreach_messages' then
      if tg_op = 'INSERT' then
        event_key := 'outreach.generated';
      elsif old.status is distinct from new.status then
        event_key := 'outreach.' || new.status::text;
      else
        event_key := 'outreach.edited';
      end if;

      safe_metadata := jsonb_build_object(
        'status', new.status,
        'generation_version', new.generation_version
      );
    end if;
  end if;

  insert into public.growth_activities (
    organization_id,
    prospect_id,
    actor_user_id,
    event_type,
    metadata
  ) values (
    new.organization_id,
    target_prospect,
    auth.uid(),
    event_key,
    safe_metadata
  );

  return new;
end
$$;

commit;
