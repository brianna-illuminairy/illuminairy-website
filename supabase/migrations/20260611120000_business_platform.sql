-- Business management platform: alerts, economics, ads, integration jobs

create table if not exists admin_alerts (
  id uuid primary key default gen_random_uuid(),
  alert_type text not null,
  severity text not null default 'info' check (severity in ('critical', 'warning', 'info')),
  title text not null,
  body text,
  link_url text,
  source text not null default 'system',
  dedupe_key text,
  acknowledged_at timestamptz,
  notified_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists admin_alerts_dedupe_key_idx
  on admin_alerts (dedupe_key)
  where dedupe_key is not null and acknowledged_at is null;

create index if not exists admin_alerts_open_idx
  on admin_alerts (created_at desc)
  where acknowledged_at is null;

create table if not exists client_payments (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references enrollments (id) on delete cascade,
  client_id uuid references clients (id) on delete cascade,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  amount_cents integer not null,
  currency text not null default 'usd',
  paid_at timestamptz not null default now(),
  source text not null default 'stripe',
  notes text,
  created_at timestamptz not null default now()
);

create unique index if not exists client_payments_stripe_session_idx
  on client_payments (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

create unique index if not exists client_payments_stripe_pi_idx
  on client_payments (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

create table if not exists client_costs (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references enrollments (id) on delete cascade,
  cost_type text not null check (cost_type in ('cac', 'software_license', 'other')),
  amount_cents integer not null,
  notes text,
  allocated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists client_time_logs (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references enrollments (id) on delete cascade,
  category text not null check (category in ('sales_call', 'diagnostic', 'tutoring', 'admin')),
  duration_minutes integer not null check (duration_minutes > 0),
  occurred_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists ad_spend_daily (
  id uuid primary key default gen_random_uuid(),
  spend_date date not null,
  utm_campaign text not null default '',
  utm_content text not null default '',
  spend_cents integer not null default 0,
  impressions integer,
  clicks integer,
  reach integer,
  meta_campaign_id text,
  meta_adset_id text,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (spend_date, utm_campaign, utm_content)
);

create table if not exists integration_jobs (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references enrollments (id) on delete set null,
  job_type text not null,
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  payload jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  last_error text,
  screenshot_path text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists integration_jobs_enrollment_idx on integration_jobs (enrollment_id);
create index if not exists integration_jobs_status_idx on integration_jobs (status, created_at desc);

create trigger integration_jobs_updated_at before update on integration_jobs
  for each row execute function set_updated_at();

alter table admin_alerts enable row level security;
alter table client_payments enable row level security;
alter table client_costs enable row level security;
alter table client_time_logs enable row level security;
alter table ad_spend_daily enable row level security;
alter table integration_jobs enable row level security;
