-- Anonymous snapshots of SAT Improvement Plan reveal for parent-to-parent sharing.

create table if not exists plan_shares (
  id text primary key,
  payload jsonb not null,
  visitor_id text,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '90 days')
);

create index if not exists plan_shares_expires_at_idx on plan_shares (expires_at);

comment on table plan_shares is 'Public read-only Improvement Plan snapshots; no PII in payload.';
