-- SAT quiz funnel: structured lead fields + full answer snapshot

alter table leads add column if not exists funnel text not null default 'legacy';
alter table leads add column if not exists intake_submitted_at timestamptz;

-- Quiz intake (queryable without parsing JSON)
alter table leads add column if not exists quiz_trigger text;
alter table leads add column if not exists quiz_stakes text;
alter table leads add column if not exists quiz_tests_taken text;
alter table leads add column if not exists sat_next_test text;
alter table leads add column if not exists gpa_band text;
alter table leads add column if not exists target_score text;
alter table leads add column if not exists quiz_blockers text[];
alter table leads add column if not exists quiz_prep_tried text[];

-- Derived at submit (for prioritization + call prep)
alter table leads add column if not exists showed_gpa_gap boolean;
alter table leads add column if not exists promised_gain_pts integer;
alter table leads add column if not exists weeks_until_test integer;

-- Compliance
alter table leads add column if not exists tcpa_consent boolean not null default false;
alter table leads add column if not exists tcpa_consent_at timestamptz;

-- Full fidelity snapshot (planChoice, raw ids, future questions)
alter table leads add column if not exists quiz_answers jsonb not null default '{}'::jsonb;

create index if not exists leads_funnel_idx on leads (funnel);
create index if not exists leads_sat_next_test_idx on leads (sat_next_test);
create index if not exists leads_gpa_band_idx on leads (gpa_band);
create index if not exists leads_stage_funnel_idx on leads (stage, funnel);

comment on column leads.funnel is 'Lead origin: sat_quiz, intake, legacy, etc.';
comment on column leads.quiz_answers is 'Raw SAT quiz payload snapshot at S5 submit';
comment on column leads.promised_gain_pts is 'Capped score gain shown on S5 approval screen';
