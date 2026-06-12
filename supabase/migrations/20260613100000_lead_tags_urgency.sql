-- Sales intelligence tagging system for leads.
--
-- Three categories of structured tags + one urgency dial per lead:
--
--   buying_trigger   why this parent is reaching out now (got low score,
--                    going into junior year, last chance before apps, ...)
--   objection        what's blocking the close (price, wanted in-person,
--                    spouse needs to weigh in, ...)
--   priority         what matters to them (1:1 mentorship, evenings/weekends
--                    availability, ADHD-friendly, ...)
--
-- Each tag is a free-form slug + optional human note + evidence link
-- (call_id, email_id) so we can trace why it was set. Suggestions are
-- curated in lib/admin/lead-tag-suggestions.ts but anything is allowed.
--
-- Objections can be "resolved" (resolved_at + resolved_note) so the owner
-- knows when an objection was addressed without losing the history.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_tag_category') then
    create type lead_tag_category as enum ('buying_trigger', 'objection', 'priority');
  end if;

  if not exists (select 1 from pg_type where typname = 'lead_urgency_level') then
    create type lead_urgency_level as enum ('low', 'medium', 'high', 'critical');
  end if;
end$$;

create table if not exists lead_tags (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads (id) on delete cascade,
  category lead_tag_category not null,
  tag text not null,
  note text,
  source text not null default 'manual', -- 'manual' | 'gemini' | 'intake' | 'quiz' | 'cron'
  source_detail text,
  evidence jsonb not null default '{}'::jsonb, -- { call_id, email_id, message_excerpt }
  created_at timestamptz not null default now(),
  created_by text,
  resolved_at timestamptz,
  resolved_by text,
  resolved_note text
);

create index if not exists lead_tags_lead_idx on lead_tags (lead_id);
create index if not exists lead_tags_lead_category_idx on lead_tags (lead_id, category);
create index if not exists lead_tags_unresolved_idx
  on lead_tags (lead_id, category)
  where resolved_at is null;

-- Dedupe rule: same (lead, category, tag) only logged once unless previously
-- resolved. We enforce with a partial unique index so a tag can re-appear
-- after being resolved (e.g. "price_concern" resolved last week, comes back
-- in a follow-up call).
create unique index if not exists lead_tags_lead_category_tag_active_uidx
  on lead_tags (lead_id, category, tag)
  where resolved_at is null;

alter table lead_tags enable row level security;

-- Urgency lives on the lead itself (single read; not historized as tags).
alter table leads
  add column if not exists urgency_level lead_urgency_level,
  add column if not exists urgency_reason text,
  add column if not exists urgency_source text, -- 'manual' | 'gemini' | 'intake'
  add column if not exists urgency_set_at timestamptz;

comment on column leads.urgency_level is
  'How time-sensitive this lead is. critical = decision needed this week, high = decision next 2 wks, medium = month, low = exploratory.';
comment on column leads.urgency_reason is
  'Short free-text reason: "ED deadline Nov 1", "last test before apps", "score back below GPA", etc.';
comment on column leads.urgency_source is
  'Where the urgency read came from: manual | gemini | intake.';
