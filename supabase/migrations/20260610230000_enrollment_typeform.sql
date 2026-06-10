-- SAT enrollment Typeform (form oWevli6O) — idempotency + scheduling payload

alter table enrollments add column if not exists typeform_response_token text;
alter table enrollments add column if not exists intake_details jsonb not null default '{}'::jsonb;

create unique index if not exists enrollments_typeform_response_token_idx
  on enrollments (typeform_response_token)
  where typeform_response_token is not null;

comment on column enrollments.typeform_response_token is 'Typeform form_response.token — dedupe webhooks and CSV backfill';
comment on column enrollments.intake_details is 'Enrollment form: availability windows, diagnostic prefs, second parent, etc.';
