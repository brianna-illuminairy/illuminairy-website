-- Fix call_score contribution: Gemini returns overall 0-100, not 0-10.
-- Max call component stays 60 (overall 100 → 60 points).

create or replace function recompute_lead_score(p_lead_id uuid) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_call_score integer := 0;
  v_call_count integer := 0;
  v_attended_count integer := 0;
  v_recent_email_in integer := 0;
  v_recent_email_out integer := 0;
  v_engagement integer := 0;
  v_recency integer := 0;
  v_total integer := 0;
  v_breakdown jsonb;
  v_last_activity timestamptz;
  v_overall numeric := 0;
begin
  select coalesce((call_score->>'overall')::numeric, 0)
    into v_overall
    from lead_calls
   where lead_id = p_lead_id
     and call_status in ('attended','qualified','closed')
     and call_score is not null
   order by call_at desc
   limit 1;

  v_call_score := least(60, greatest(0, round(v_overall * 0.6)::integer));

  select count(*), count(*) filter (where call_status in ('attended','qualified','closed'))
    into v_call_count, v_attended_count
    from lead_calls
   where lead_id = p_lead_id;

  select count(*) filter (where direction = 'inbound' and sent_at >= now() - interval '14 days'),
         count(*) filter (where direction = 'outbound' and sent_at >= now() - interval '14 days')
    into v_recent_email_in, v_recent_email_out
    from lead_emails
   where lead_id = p_lead_id;

  v_engagement := least(25, v_recent_email_in * 5 + v_recent_email_out * 1);

  select greatest(updated_at, coalesce(last_activity_at, updated_at))
    into v_last_activity
    from leads
   where id = p_lead_id;

  if v_last_activity is null then
    v_recency := 0;
  else
    v_recency := greatest(0, 15 - extract(day from (now() - v_last_activity))::integer / 2);
  end if;

  v_total := least(100, v_call_score + v_engagement + v_recency);

  v_breakdown := jsonb_build_object(
    'call_score', v_call_score,
    'engagement', v_engagement,
    'recency', v_recency,
    'attended_count', v_attended_count,
    'recent_email_in', v_recent_email_in,
    'recent_email_out', v_recent_email_out
  );

  update leads
     set lead_score_current = v_total,
         lead_score_updated_at = now()
   where id = p_lead_id;

  insert into lead_score_history (lead_id, score, breakdown, reason)
  values (p_lead_id, v_total, v_breakdown, 'recompute');

  return v_total;
end;
$$;
