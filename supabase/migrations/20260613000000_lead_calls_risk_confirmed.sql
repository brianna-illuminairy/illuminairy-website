-- Add no-show risk flag + explicit parent confirmation timestamp to lead_calls.
--
-- Risk is a flag that can sit on top of any pre-call status (booked, confirmed).
-- It is *not* a separate call_status because the underlying state machine still
-- needs to flow booked -> confirmed -> attended/no_show. Risk just says "this
-- call deserves extra owner attention before the start time."
--
-- Confirmed_at captures the moment we have positive proof the parent will
-- show up. Sources: 'manual' (owner clicked confirmed), 'reply' (parent
-- replied to a confirmation email), 'sms' (future), 'calendly' (Calendly's
-- own "I'll be there" confirmation flow if we wire it).

alter table lead_calls
  add column if not exists no_show_risk boolean not null default false,
  add column if not exists no_show_risk_reason text,
  add column if not exists no_show_risk_set_at timestamptz,
  add column if not exists no_show_risk_source text,
  add column if not exists confirmed_at timestamptz,
  add column if not exists confirmation_source text;

comment on column lead_calls.no_show_risk is
  'True when something suggests the parent may not show up (bounce on the booking confirmation email, suppressed identifier, no response to confirmation, manual flag).';
comment on column lead_calls.no_show_risk_reason is
  'Free-form reason: "confirmation_email_bounced", "email_suppressed", "no_reply_24h", "manual_owner_flag".';
comment on column lead_calls.no_show_risk_source is
  'Where the risk signal came from: "gmail_sync", "suppression_check", "manual", "cron".';
comment on column lead_calls.confirmed_at is
  'Timestamp when we received positive confirmation the parent will attend.';
comment on column lead_calls.confirmation_source is
  '"manual" | "reply" | "sms" | "calendly". Used to weight call_score and per-source attribution.';

create index if not exists lead_calls_no_show_risk_idx
  on lead_calls (no_show_risk)
  where no_show_risk = true;

create index if not exists lead_calls_confirmed_at_idx
  on lead_calls (confirmed_at)
  where confirmed_at is not null;
