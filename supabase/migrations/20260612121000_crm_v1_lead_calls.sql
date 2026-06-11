-- CRM v1 — call notes table, attachable to a lead and/or client.
-- See .cursor/plans/crm-v1-pipeline_4cf61e79.plan.md (Phases C + D).

create table if not exists lead_calls (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads (id) on delete cascade,
  client_id uuid references clients (id) on delete cascade,
  call_at timestamptz not null default now(),
  duration_minutes integer,
  summary text,
  transcript text,
  recording_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lead_calls_subject check (lead_id is not null or client_id is not null)
);

create index if not exists lead_calls_lead_id_idx
  on lead_calls (lead_id, call_at desc)
  where lead_id is not null;

create index if not exists lead_calls_client_id_idx
  on lead_calls (client_id, call_at desc)
  where client_id is not null;

drop trigger if exists lead_calls_updated_at on lead_calls;
create trigger lead_calls_updated_at before update on lead_calls
  for each row execute function set_updated_at();

alter table lead_calls enable row level security;

comment on table lead_calls is
  'Sales / Strategy Call notes pasted in from Fireflies/Otter. Attaches to a lead, a client, or both (post-conversion).';
