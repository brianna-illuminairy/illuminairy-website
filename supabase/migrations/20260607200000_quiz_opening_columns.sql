-- SAT Score Path opening questions (q-who, q-score-lower) — queryable on leads

alter table leads add column if not exists quiz_who text;
alter table leads add column if not exists quiz_score_lower text;

create index if not exists leads_quiz_who_idx on leads (quiz_who);

comment on column leads.quiz_who is 'Opening answer: child | self (who needs SAT help)';
comment on column leads.quiz_score_lower is 'Opening answer: yes | planning-ahead (score lower than expected)';
comment on column leads.quiz_trigger is 'Urgency answer (legacy key q1): score-low, test-soon, app-soon, get-ahead';
