-- CRM v1: enforce "client exists => lead is won" at the data layer.
--
-- Both code paths that currently create clients (lib/crm/enrollment.ts for
-- Stripe, lib/crm/typeform-enrollment.ts for the Typeform enrollment) already
-- set the matching lead's stage to 'won'. This trigger is a defensive layer
-- so future code paths, future webhooks, or manual admin edits can't drift
-- out of sync. Paid customer trumps any prior stage (including 'lost').
--
-- Two firing surfaces:
--   1. clients.lead_id transitions from NULL -> non-null, or a row is inserted
--      with lead_id set. (Most cases.)
--   2. Backfill any client rows that already point at a non-won lead. (Should
--      be zero today, but we run it to be safe.)

create or replace function sync_lead_won_on_client() returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.lead_id is not null and (
    tg_op = 'INSERT'
    or old.lead_id is distinct from new.lead_id
  ) then
    update leads
       set stage = 'won',
           converted_client_id = new.id,
           converted_at = coalesce(converted_at, now()),
           last_activity_at = now(),
           updated_at = now()
     where id = new.lead_id
       and (stage <> 'won' or converted_client_id is distinct from new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_sync_lead_won_on_client on clients;

create trigger trg_sync_lead_won_on_client
after insert or update of lead_id on clients
for each row
execute function sync_lead_won_on_client();

-- Backfill: any existing client whose linked lead isn't won yet.
update leads l
   set stage = 'won',
       converted_client_id = c.id,
       converted_at = coalesce(l.converted_at, c.created_at, now()),
       last_activity_at = now(),
       updated_at = now()
  from clients c
 where c.lead_id = l.id
   and (l.stage <> 'won' or l.converted_client_id is distinct from c.id);
