-- CRM v1: classify follow-ups by kind so the Due-today queue can be triaged
-- (no-show reschedule outreach behaves differently from post-sales-call
-- check-ins). Text column with a soft check, not an enum, so adding new
-- kinds later doesn't require an enum migration.

alter table leads
  add column if not exists next_followup_kind text;

-- Drop and recreate the check so re-running is idempotent on existing prod.
alter table leads drop constraint if exists leads_next_followup_kind_chk;

alter table leads
  add constraint leads_next_followup_kind_chk
  check (
    next_followup_kind is null
    or next_followup_kind in (
      'no_show_reschedule',
      'post_call',
      'general'
    )
  );

comment on column leads.next_followup_kind is
  'Classification of next_followup_at task: no_show_reschedule | post_call | general. NULL means no follow-up scheduled or unclassified legacy row.';
