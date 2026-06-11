-- Weekly progress report channel preferences captured during /enroll intake
-- See docs/enroll-design-pick.md (Variant D · Step 3 Updates)

alter table clients add column if not exists weekly_report_email_opt_in boolean not null default false;
alter table clients add column if not exists weekly_report_sms_opt_in boolean not null default false;
alter table clients add column if not exists weekly_report_sms_consent_at timestamptz;

comment on column clients.weekly_report_email_opt_in is
  'Parent opted into weekly progress emails during /enroll intake (Variant D step 3). Default false until they pick.';
comment on column clients.weekly_report_sms_opt_in is
  'Parent opted into weekly progress SMS during /enroll intake. Requires weekly_report_sms_consent_at when true.';
comment on column clients.weekly_report_sms_consent_at is
  'TCPA consent timestamp for weekly progress SMS (separate from Strategy Call TCPA captured in QFPlanScheduler).';
