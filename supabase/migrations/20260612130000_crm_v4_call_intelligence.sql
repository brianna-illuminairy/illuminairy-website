-- CRM v4 — Call intelligence + lead intelligence layer.
-- See .cursor/plans/crm_v4_call_intelligence_f22636fa.plan.md (Phase 1).
--
-- This single migration adds:
--   * integration_tokens (encrypted OAuth refresh tokens)
--   * call_status enum + extensions to lead_calls
--   * lead_emails (Gmail in/out)
--   * lead_tasks (multi-slot tasks; replaces single next_followup_at, kept in sync via trigger)
--   * calendly_workflows + calendly_workflow_runs
--   * crm_audit_log
--   * lead_score_history (lead_score_current lives on leads)
--   * suppression_list, ooo_periods, quiet_hours_config
--   * pre_call_briefs, sales_script_template, lead_sales_scripts
--   * identity_links, identity_merges
--   * integration_heartbeat
--   * extensions to leads (qualified_at, recovered_from_no_show, meet_link, ...)
--   * Triggers: sync_highlighted_followup, set_recovered_from_no_show,
--     recompute_lead_score, set_awaiting_reply_since.

-- ---------------------------------------------------------------------------
-- 1. Integration tokens (Google OAuth refresh + access; encrypted at rest)
-- ---------------------------------------------------------------------------

create table if not exists integration_tokens (
  id uuid primary key default gen_random_uuid(),
  provider text not null,                 -- 'google'
  owner_email text not null,              -- Workspace user who granted the scopes
  refresh_token_enc text not null,        -- AES-GCM(refresh_token, INTEGRATION_TOKEN_ENC_KEY)
  access_token_enc text,                  -- short-lived; refreshed as needed
  access_token_expires_at timestamptz,
  scopes text[] not null default '{}',
  last_refreshed_at timestamptz,
  last_used_at timestamptz,
  status text not null default 'active',  -- active | revoked | error
  status_detail text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, owner_email)
);

alter table integration_tokens enable row level security;

drop trigger if exists integration_tokens_updated_at on integration_tokens;
create trigger integration_tokens_updated_at before update on integration_tokens
  for each row execute function set_updated_at();

comment on table integration_tokens is
  'OAuth refresh + access tokens for third-party integrations (Google Workspace). Refresh token encrypted with INTEGRATION_TOKEN_ENC_KEY using AES-256-GCM.';

-- ---------------------------------------------------------------------------
-- 2. call_status enum + lead_calls extensions
-- ---------------------------------------------------------------------------

do $$ begin
  if not exists (select 1 from pg_type where typname = 'call_status') then
    create type call_status as enum (
      'booked',
      'confirmed',
      'attended',
      'no_show',
      'rescheduled',
      'canceled',
      'recovered',
      'qualified',
      'closed'
    );
  end if;
end $$;

alter table lead_calls
  add column if not exists call_status call_status not null default 'booked',
  add column if not exists scheduled_start timestamptz,
  add column if not exists scheduled_end timestamptz,
  add column if not exists meet_link text,
  add column if not exists meet_space_code text,
  add column if not exists meet_conference_id text,
  add column if not exists calendar_event_id text,
  add column if not exists calendly_event_uri text,
  add column if not exists calendly_invitee_uri text,
  add column if not exists attendance_source text,    -- 'meet_api' | 'manual' | 'calendly_no_show'
  add column if not exists attendance_decided_at timestamptz,
  add column if not exists attendance_decided_by text, -- 'cron' | 'manual' | 'webhook'
  add column if not exists joined_at timestamptz,
  add column if not exists left_at timestamptz,
  add column if not exists participants jsonb not null default '[]'::jsonb,
  add column if not exists identity_match text,        -- 'exact_email' | 'display_name' | 'ambiguous'
  add column if not exists confidence numeric,         -- 0..1
  add column if not exists calendly_no_show_uri text,
  add column if not exists calendly_no_show_pending_until timestamptz,
  add column if not exists transcript_extracted_at timestamptz,
  add column if not exists notes_doc_url text,
  add column if not exists transcript_doc_url text,
  add column if not exists key_topics jsonb,
  add column if not exists parent_concerns jsonb,
  add column if not exists next_step_decision text,
  add column if not exists call_score jsonb,
  add column if not exists gmail_draft_id text;

create index if not exists lead_calls_call_status_idx on lead_calls (call_status);
create index if not exists lead_calls_pending_no_show_idx
  on lead_calls (calendly_no_show_pending_until)
  where calendly_no_show_pending_until is not null;
create index if not exists lead_calls_scheduled_end_idx
  on lead_calls (scheduled_end)
  where scheduled_end is not null;

comment on column lead_calls.call_status is
  'Call lifecycle: booked -> confirmed -> attended/no_show -> recovered/qualified -> closed.';
comment on column lead_calls.attendance_source is
  'How attendance was decided: meet_api (Google Meet conference participant data), manual (owner override), calendly_no_show (Calendly invitee_no_show webhook).';

-- ---------------------------------------------------------------------------
-- 3. Lead-level call intelligence columns
-- ---------------------------------------------------------------------------

alter table leads
  add column if not exists qualified_at timestamptz,
  add column if not exists recovered_from_no_show boolean not null default false,
  add column if not exists lead_score_current integer,
  add column if not exists lead_score_updated_at timestamptz,
  add column if not exists awaiting_reply_since timestamptz,
  add column if not exists sms_opt_in boolean not null default false,
  add column if not exists parent_timezone text,
  add column if not exists posthog_distinct_id text,
  add column if not exists ga4_client_id text;

create index if not exists leads_awaiting_reply_idx
  on leads (awaiting_reply_since)
  where awaiting_reply_since is not null;
create index if not exists leads_lead_score_idx
  on leads (lead_score_current desc nulls last);
create index if not exists leads_posthog_distinct_id_idx
  on leads (posthog_distinct_id)
  where posthog_distinct_id is not null;
create index if not exists leads_ga4_client_id_idx
  on leads (ga4_client_id)
  where ga4_client_id is not null;

comment on column leads.qualified_at is
  'Timestamp set when the lead is marked qualified (post-Strategy Call). Used for analytics + reactivation.';
comment on column leads.lead_score_current is
  'Composite lead heat score 0-100. Recomputed by recompute_lead_score trigger when call_score / task completion / engagement changes.';
comment on column leads.awaiting_reply_since is
  'Set when outbound email/SMS sent and no reply received. Cleared on inbound reply. Drives SLA badges.';

-- ---------------------------------------------------------------------------
-- 4. lead_emails (Gmail in + out)
-- ---------------------------------------------------------------------------

create table if not exists lead_emails (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads (id) on delete cascade,
  direction text not null check (direction in ('outbound', 'inbound')),
  gmail_message_id text not null unique,
  gmail_thread_id text,
  gmail_history_id bigint,
  from_email text,
  from_name text,
  to_emails text[],
  cc_emails text[],
  subject text,
  snippet text,
  body_text text,
  body_html text,
  attachments jsonb not null default '[]'::jsonb,
  sent_at timestamptz not null,
  received_at timestamptz,
  is_bounce boolean not null default false,
  is_unsubscribe boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists lead_emails_lead_id_idx on lead_emails (lead_id, sent_at desc) where lead_id is not null;
create index if not exists lead_emails_thread_id_idx on lead_emails (gmail_thread_id);

alter table lead_emails enable row level security;

comment on table lead_emails is
  'Gmail messages synced via Gmail History API. direction = outbound (sent from brianna@) or inbound (received).';

-- ---------------------------------------------------------------------------
-- 5. lead_tasks (multi-slot, replaces single next_followup_at field)
-- ---------------------------------------------------------------------------

create table if not exists lead_tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads (id) on delete cascade,
  lead_call_id uuid references lead_calls (id) on delete set null,
  kind text not null,                       -- follows FOLLOWUP_KINDS + extras: confirm_attendance, recover_no_show, etc.
  title text not null,
  body text,
  due_at timestamptz,
  source text not null default 'manual',    -- manual | trigger | cron | webhook | gemini
  source_detail text,
  status text not null default 'open',      -- open | done | snoozed | canceled
  completed_at timestamptz,
  completed_by text,
  is_highlighted boolean not null default false, -- the one shown on Overview as the "next follow-up"
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lead_tasks_lead_id_open_idx
  on lead_tasks (lead_id, due_at)
  where status = 'open';
create index if not exists lead_tasks_due_at_idx
  on lead_tasks (due_at)
  where status = 'open' and due_at is not null;
create unique index if not exists lead_tasks_highlight_unique
  on lead_tasks (lead_id)
  where is_highlighted and status = 'open';

drop trigger if exists lead_tasks_updated_at on lead_tasks;
create trigger lead_tasks_updated_at before update on lead_tasks
  for each row execute function set_updated_at();

alter table lead_tasks enable row level security;

comment on table lead_tasks is
  'Multi-slot follow-up tasks per lead. Gemini and triggers can create many; one is_highlighted shown as the next follow-up on Overview.';

-- ---------------------------------------------------------------------------
-- 6. sync_highlighted_followup trigger (keeps leads.next_followup_* in sync)
-- ---------------------------------------------------------------------------
--
-- For backward compatibility with existing UI that reads leads.next_followup_at,
-- we mirror the highlighted open lead_tasks row onto leads.

create or replace function sync_highlighted_followup() returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead_id uuid;
begin
  v_lead_id := coalesce(new.lead_id, old.lead_id);
  if v_lead_id is null then
    return coalesce(new, old);
  end if;

  update leads l
     set next_followup_at = t.due_at,
         next_followup_note = t.title,
         next_followup_kind = case
           when t.kind = any (array['mark_attendance','no_show_reschedule','post_call','post_call_check_in','general'])
             then t.kind
           else 'general'
         end
    from (
      select due_at, title, kind
        from lead_tasks
       where lead_id = v_lead_id
         and status = 'open'
         and is_highlighted
       limit 1
    ) t
   where l.id = v_lead_id;

  if not found then
    update leads
       set next_followup_at = null,
           next_followup_note = null,
           next_followup_kind = null
     where id = v_lead_id
       and not exists (
         select 1 from lead_tasks
          where lead_id = v_lead_id
            and status = 'open'
            and is_highlighted
       );
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_sync_highlighted_followup on lead_tasks;
create trigger trg_sync_highlighted_followup
after insert or update or delete on lead_tasks
for each row execute function sync_highlighted_followup();

-- ---------------------------------------------------------------------------
-- 7. set_recovered_from_no_show trigger
-- ---------------------------------------------------------------------------
-- If a lead has had any lead_calls row with call_status = no_show, and a later
-- row reaches attended/qualified, mark the lead as recovered.

create or replace function set_recovered_from_no_show() returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.call_status in ('attended','qualified') and new.lead_id is not null then
    update leads
       set recovered_from_no_show = true
     where id = new.lead_id
       and exists (
         select 1 from lead_calls lc2
          where lc2.lead_id = new.lead_id
            and lc2.id <> new.id
            and lc2.call_status = 'no_show'
       )
       and not recovered_from_no_show;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_recovered_from_no_show on lead_calls;
create trigger trg_set_recovered_from_no_show
after insert or update of call_status on lead_calls
for each row execute function set_recovered_from_no_show();

-- ---------------------------------------------------------------------------
-- 8. Calendly workflows + workflow runs
-- ---------------------------------------------------------------------------

create table if not exists calendly_workflows (
  id uuid primary key default gen_random_uuid(),
  calendly_workflow_uri text not null unique,
  name text,
  owner_uri text,
  event_types text[],
  steps jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists calendly_workflows_updated_at on calendly_workflows;
create trigger calendly_workflows_updated_at before update on calendly_workflows
  for each row execute function set_updated_at();

create table if not exists calendly_workflow_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid references calendly_workflows (id) on delete cascade,
  lead_call_id uuid references lead_calls (id) on delete cascade,
  step_name text,
  expected_at timestamptz,
  observed_at timestamptz,
  state text not null default 'expected',  -- expected | sent | skipped | failed
  detail jsonb,
  created_at timestamptz not null default now()
);

create index if not exists calendly_workflow_runs_call_idx
  on calendly_workflow_runs (lead_call_id);

alter table calendly_workflows enable row level security;
alter table calendly_workflow_runs enable row level security;

-- ---------------------------------------------------------------------------
-- 9. CRM audit log
-- ---------------------------------------------------------------------------

create table if not exists crm_audit_log (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,             -- 'lead' | 'lead_call' | 'lead_task' | 'integration'
  entity_id uuid,
  action text not null,                  -- e.g. 'call_status:no_show', 'task:auto_completed'
  source text not null,                  -- 'manual' | 'cron' | 'webhook' | 'gemini' | 'trigger'
  actor text,                            -- user email or system identifier
  before_value jsonb,
  after_value jsonb,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists crm_audit_log_entity_idx
  on crm_audit_log (entity_type, entity_id, created_at desc);
create index if not exists crm_audit_log_action_idx
  on crm_audit_log (action, created_at desc);

alter table crm_audit_log enable row level security;

-- ---------------------------------------------------------------------------
-- 10. Lead score history + recompute trigger
-- ---------------------------------------------------------------------------

create table if not exists lead_score_history (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads (id) on delete cascade,
  score integer not null,
  breakdown jsonb not null default '{}'::jsonb,
  reason text,
  recorded_at timestamptz not null default now()
);

create index if not exists lead_score_history_lead_idx
  on lead_score_history (lead_id, recorded_at desc);

alter table lead_score_history enable row level security;

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
begin
  -- Average call score from most recent attended call (call_score.overall = 0..10).
  select coalesce((call_score->>'overall')::numeric, 0)::integer * 6   -- max 60
    into v_call_score
    from lead_calls
   where lead_id = p_lead_id
     and call_status in ('attended','qualified','closed')
     and call_score is not null
   order by call_at desc
   limit 1;

  v_call_score := coalesce(v_call_score, 0);

  select count(*), count(*) filter (where call_status in ('attended','qualified','closed'))
    into v_call_count, v_attended_count
    from lead_calls
   where lead_id = p_lead_id;

  select count(*) filter (where direction = 'inbound' and sent_at >= now() - interval '14 days'),
         count(*) filter (where direction = 'outbound' and sent_at >= now() - interval '14 days')
    into v_recent_email_in, v_recent_email_out
    from lead_emails
   where lead_id = p_lead_id;

  -- Engagement (0-25): inbound replies are more valuable than outbound sends.
  v_engagement := least(25, v_recent_email_in * 5 + v_recent_email_out * 1);

  select greatest(updated_at, coalesce(last_activity_at, updated_at))
    into v_last_activity
    from leads
   where id = p_lead_id;

  -- Recency (0-15): decays from 15 (today) to 0 (>= 30 days).
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

comment on function recompute_lead_score(uuid) is
  'Recomputes leads.lead_score_current from latest call_score + recent email engagement + recency. Logs to lead_score_history.';

-- Trigger: when a lead_call or lead_email or lead_task changes, recompute score
-- for the affected lead. Use AFTER triggers so the change is committed first.

create or replace function trg_recompute_lead_score() returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead_id uuid;
begin
  v_lead_id := coalesce(new.lead_id, old.lead_id);
  if v_lead_id is not null then
    perform recompute_lead_score(v_lead_id);
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_recompute_lead_score_calls on lead_calls;
create trigger trg_recompute_lead_score_calls
after insert or update of call_status, call_score on lead_calls
for each row execute function trg_recompute_lead_score();

drop trigger if exists trg_recompute_lead_score_emails on lead_emails;
create trigger trg_recompute_lead_score_emails
after insert or update of direction, sent_at on lead_emails
for each row execute function trg_recompute_lead_score();

-- ---------------------------------------------------------------------------
-- 11. set_awaiting_reply_since trigger
-- ---------------------------------------------------------------------------
-- When outbound email recorded: if no later inbound in same thread, set
-- leads.awaiting_reply_since to the outbound sent_at. When inbound arrives,
-- clear it.

create or replace function set_awaiting_reply_since() returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_outbound timestamptz;
  v_inbound timestamptz;
begin
  if new.lead_id is null then return new; end if;

  select max(sent_at) into v_outbound
    from lead_emails
   where lead_id = new.lead_id and direction = 'outbound';
  select max(sent_at) into v_inbound
    from lead_emails
   where lead_id = new.lead_id and direction = 'inbound';

  if v_outbound is not null and (v_inbound is null or v_inbound < v_outbound) then
    update leads set awaiting_reply_since = v_outbound where id = new.lead_id;
  else
    update leads set awaiting_reply_since = null where id = new.lead_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_awaiting_reply on lead_emails;
create trigger trg_set_awaiting_reply
after insert or update of sent_at, direction on lead_emails
for each row execute function set_awaiting_reply_since();

-- ---------------------------------------------------------------------------
-- 12. Suppression list, OOO, quiet hours
-- ---------------------------------------------------------------------------

create table if not exists suppression_list (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('email', 'sms', 'all')),
  identifier text not null,         -- email or phone number
  reason text not null,             -- 'unsub' | 'bounce' | 'manual' | 'tcpa'
  reason_detail text,
  added_at timestamptz not null default now(),
  added_by text,
  unique (channel, identifier)
);

create index if not exists suppression_list_identifier_idx on suppression_list (identifier);

alter table suppression_list enable row level security;

create table if not exists quiet_hours_config (
  id integer primary key default 1,
  start_hour_local integer not null default 21,    -- 9pm
  end_hour_local integer not null default 8,       -- 8am
  default_timezone text not null default 'America/New_York',
  updated_at timestamptz not null default now(),
  constraint quiet_hours_singleton check (id = 1)
);

insert into quiet_hours_config (id) values (1)
on conflict (id) do nothing;

create table if not exists ooo_periods (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists ooo_periods_window_idx on ooo_periods (starts_at, ends_at);

alter table ooo_periods enable row level security;

-- ---------------------------------------------------------------------------
-- 13. Pre-call briefs + sales scripts
-- ---------------------------------------------------------------------------

create table if not exists pre_call_briefs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads (id) on delete cascade,
  lead_call_id uuid references lead_calls (id) on delete cascade,
  generated_at timestamptz not null default now(),
  context_hash text not null,
  model text,
  brief_markdown text not null,
  unique (lead_call_id)
);

create index if not exists pre_call_briefs_lead_idx on pre_call_briefs (lead_id, generated_at desc);
alter table pre_call_briefs enable row level security;

create table if not exists sales_script_template (
  id integer primary key default 1,
  template_markdown text not null default '',
  updated_at timestamptz not null default now(),
  updated_by text,
  constraint sales_script_template_singleton check (id = 1)
);

insert into sales_script_template (id) values (1)
on conflict (id) do nothing;

alter table sales_script_template enable row level security;

create table if not exists lead_sales_scripts (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads (id) on delete cascade,
  generated_at timestamptz not null default now(),
  context_hash text not null,
  template_version_at timestamptz,
  script_markdown text not null,
  owner_edits_markdown text,
  unique (lead_id, generated_at)
);

create index if not exists lead_sales_scripts_lead_idx on lead_sales_scripts (lead_id, generated_at desc);
alter table lead_sales_scripts enable row level security;

-- ---------------------------------------------------------------------------
-- 14. Identity stitching
-- ---------------------------------------------------------------------------

create table if not exists identity_links (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads (id) on delete cascade,
  visitor_id text,
  posthog_distinct_id text,
  ga4_client_id text,
  meta_fbp text,
  meta_fbc text,
  klaviyo_profile_id text,
  email text,
  phone text,
  observed_at timestamptz not null default now(),
  source text                              -- 'enroll_intake' | 'quiz_submit' | 'contact_form' | 'manual'
);

create index if not exists identity_links_lead_idx on identity_links (lead_id);
create index if not exists identity_links_visitor_idx on identity_links (visitor_id) where visitor_id is not null;
create index if not exists identity_links_email_idx on identity_links (email) where email is not null;

alter table identity_links enable row level security;

create table if not exists identity_merges (
  id uuid primary key default gen_random_uuid(),
  target_lead_id uuid not null references leads (id) on delete cascade,
  merged_from_visitor_id text,
  merged_from_posthog_distinct_id text,
  merged_from_lead_id uuid,
  merged_at timestamptz not null default now(),
  source text
);

create index if not exists identity_merges_target_idx on identity_merges (target_lead_id);
alter table identity_merges enable row level security;

-- ---------------------------------------------------------------------------
-- 15. Integration heartbeat
-- ---------------------------------------------------------------------------

create table if not exists integration_heartbeat (
  id uuid primary key default gen_random_uuid(),
  provider text not null,           -- 'google_meet' | 'google_calendar' | 'gmail' | 'google_drive' | 'calendly' | 'gemini'
  status text not null,             -- 'ok' | 'degraded' | 'down'
  latency_ms integer,
  error_message text,
  checked_at timestamptz not null default now()
);

create index if not exists integration_heartbeat_provider_idx
  on integration_heartbeat (provider, checked_at desc);

alter table integration_heartbeat enable row level security;

-- ---------------------------------------------------------------------------
-- 16. Backfill: hydrate lead_score_current for existing leads (best-effort)
-- ---------------------------------------------------------------------------

do $$
declare
  r record;
begin
  for r in select id from leads where lead_score_current is null limit 500 loop
    perform recompute_lead_score(r.id);
  end loop;
end $$;
