-- CRM v1 — followups on leads
-- See specs/2026-06-enroll-onboarding/CHECKOUT-TRUTH.md history and
-- the CRM v1 plan in .cursor/plans/crm-v1-pipeline_4cf61e79.plan.md.

alter table leads
  add column if not exists next_followup_at timestamptz,
  add column if not exists next_followup_note text,
  add column if not exists last_activity_at timestamptz;

create index if not exists leads_next_followup_at_idx
  on leads (next_followup_at)
  where next_followup_at is not null;

comment on column leads.next_followup_at is
  'Manual followup reminder set from /admin/crm. Surfaces in the Due today queue when <= now().';
comment on column leads.next_followup_note is
  'Short reminder text shown alongside next_followup_at (e.g. "call back re: payment plan").';
comment on column leads.last_activity_at is
  'Most recent significant touch (note edit, stage change, call logged). Used for sort + freshness UI.';
