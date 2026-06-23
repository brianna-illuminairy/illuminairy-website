-- Plan Builder B lab funnel — lead segmentation + free lesson call typing.

alter table leads add column if not exists parent_zip text;
alter table leads add column if not exists school_referral text;
alter table leads add column if not exists child_email text;
alter table leads add column if not exists phone_verified_at timestamptz;
alter table leads add column if not exists plan_builder_variant text;

create index if not exists leads_plan_builder_variant_idx
  on leads (plan_builder_variant)
  where plan_builder_variant is not null;

comment on column leads.parent_zip is 'Parent ZIP from Plan Builder B (b-zip step).';
comment on column leads.school_referral is 'School referral answer (q-school-referral).';
comment on column leads.child_email is 'Student email when collected separately from parent.';
comment on column leads.phone_verified_at is 'Twilio Verify approval timestamp (Plan Builder B).';
comment on column leads.plan_builder_variant is 'Plan Builder variant: b for /plan-b lab funnel.';

alter table lead_calls add column if not exists call_type text not null default 'strategy_call';

create index if not exists lead_calls_call_type_idx
  on lead_calls (call_type, call_at desc);

comment on column lead_calls.call_type is 'strategy_call | free_lesson — Calendly event type for attendance + CAPI.';
