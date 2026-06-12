-- CRM v1: auto-advance the single follow-up slot through the call lifecycle.
--
-- Brianna's task flow is serial:
--   1. Call passes -> "Mark attendance" task (mark show or no-show)
--   2. Show'd     -> "Send post-call email" task (immediate)
--   3. Done       -> "Post-call check-in" task (+3 days, requires explicit completion)
--   4. No-show    -> "Reschedule outreach" task (+1 hour)
--
-- Implementation: a single BEFORE UPDATE trigger on `leads` that mutates
-- next_followup_at/note/kind when the lead's stage transitions. The trigger
-- ALWAYS advances on a stage change, so if she manually sets a follow-up
-- and then advances the stage, the auto-task takes over. This is consistent
-- and predictable; she can re-set a manual follow-up after the transition
-- if she really wanted to preserve it.

-- 1. Allow the two new kinds.
alter table leads drop constraint if exists leads_next_followup_kind_chk;
alter table leads add constraint leads_next_followup_kind_chk check (
  next_followup_kind is null
  or next_followup_kind in (
    'mark_attendance',
    'no_show_reschedule',
    'post_call',
    'post_call_check_in',
    'general'
  )
);

-- 2. Auto-schedule trigger.
create or replace function auto_schedule_lead_followup() returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
begin
  -- Booking just landed (stage entered call_booked or booked_call_at changed
  -- while in call_booked) and no existing follow-up: schedule "Mark attendance"
  -- 20 min after the call ends.
  if new.stage = 'call_booked'
     and new.booked_call_at is not null
     and (
       old.stage is distinct from new.stage
       or old.booked_call_at is distinct from new.booked_call_at
     )
     and new.next_followup_at is null
  then
    new.next_followup_at := new.booked_call_at + interval '20 minutes';
    new.next_followup_note := 'Mark Strategy Call attended or no-show';
    new.next_followup_kind := 'mark_attendance';
  end if;

  -- Stage advanced to call_attended: send post-call email now.
  if old.stage is distinct from new.stage
     and new.stage = 'call_attended'
  then
    new.next_followup_at := v_now;
    new.next_followup_note := 'Send post-call email';
    new.next_followup_kind := 'post_call';
    new.attended_at := coalesce(new.attended_at, v_now);
  end if;

  -- Stage advanced to no_show: reschedule outreach in 1 hour.
  if old.stage is distinct from new.stage
     and new.stage = 'no_show'
  then
    new.next_followup_at := v_now + interval '1 hour';
    new.next_followup_note := 'Reach out re: rescheduling the Strategy Call';
    new.next_followup_kind := 'no_show_reschedule';
  end if;

  -- Terminal stages: clear any follow-up.
  if old.stage is distinct from new.stage
     and new.stage in ('won', 'lost')
  then
    new.next_followup_at := null;
    new.next_followup_note := null;
    new.next_followup_kind := null;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_auto_schedule_lead_followup on leads;
create trigger trg_auto_schedule_lead_followup
before update on leads
for each row
execute function auto_schedule_lead_followup();

-- 3. Backfill: any call_booked lead without a follow-up gets the Mark
-- attendance task pegged to (booked_call_at + 20min), or to now() if that
-- moment has already passed.
update leads
   set next_followup_at = greatest(
         coalesce(booked_call_at, now()) + interval '20 minutes',
         now()
       ),
       next_followup_note = 'Mark Strategy Call attended or no-show',
       next_followup_kind = 'mark_attendance'
 where stage = 'call_booked'
   and next_followup_at is null;
