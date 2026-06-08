-- Partial funnel answers on anonymous visitors (before lead submit / booking)

alter table visitors add column if not exists quiz_answers jsonb not null default '{}'::jsonb;
alter table visitors add column if not exists quiz_answers_updated_at timestamptz;

comment on column visitors.quiz_answers is 'Latest SAT Score Path answers snapshot (intake + kid name + contact fields as entered)';
comment on column visitors.quiz_answers_updated_at is 'Last time quiz_answers was synced from the browser';
