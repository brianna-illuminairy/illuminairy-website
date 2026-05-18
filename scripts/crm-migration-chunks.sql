-- chunk 1: run first
create type lead_stage as enum ('intake_submitted','call_booked','call_attended','won','lost');
create type lead_source as enum ('meta','google','newsletter','organic','referral','unknown');
create type client_status as enum ('active','inactive');
create type enrollment_status as enum ('pending_payment','active','completed','withdrawn');
create type touch_event_source as enum ('client','server','webhook');

-- chunk 2: run second
create table leads (
  id uuid primary key default gen_random_uuid(),
  parent_email text not null unique,
  visitor_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  utm_source text, utm_medium text, utm_campaign text, utm_term text, utm_content text,
  gclid text, fbclid text, msclkid text, landing_page text, referrer text,
  lead_source lead_source not null default 'unknown',
  first_touch_at timestamptz,
  parent_first text, parent_last text, parent_phone text,
  student_first text, student_grade text, student_school text,
  target_exam text, sat_baseline text, score_range text, main_goal text, additional_context text,
  stage lead_stage not null default 'intake_submitted',
  booked_call_at timestamptz, attended_at timestamptz, closed_at timestamptz,
  lost_reason text, sales_notes text, converted_at timestamptz, converted_client_id uuid,
  calendly_event_uri text, klaviyo_profile_id text
);
create table clients (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads (id) on delete set null,
  parent_email text not null unique,
  parent_first text, parent_last text, parent_phone text,
  status client_status not null default 'active',
  ops_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table leads add constraint leads_converted_client_id_fkey
  foreign key (converted_client_id) references clients (id) on delete set null;

-- chunk 3: run third
create table students (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  first_name text not null, last_name text, grade text, school text,
  student_email text, student_phone text, zip_code text,
  created_at timestamptz not null default now()
);
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  student_id uuid not null references students (id) on delete cascade,
  lead_id uuid references leads (id) on delete set null,
  program text not null default 'sat-accelerator', program_label text,
  status enrollment_status not null default 'pending_payment',
  tutor_assigned text, tutor_assigned_at timestamptz,
  baseline_score text, target_score text,
  stripe_checkout_session_id text, amount_paid_cents integer, paid_at timestamptz,
  program_start_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table touch_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  visitor_id text,
  lead_id uuid references leads (id) on delete set null,
  client_id uuid references clients (id) on delete set null,
  enrollment_id uuid references enrollments (id) on delete set null,
  event_type text not null, path text, full_url text, referrer text,
  utm_source text, utm_medium text, utm_campaign text, utm_term text, utm_content text,
  gclid text, fbclid text, msclkid text,
  payload jsonb not null default '{}'::jsonb,
  source touch_event_source not null default 'server'
);

-- chunk 4: run fourth
create index touch_events_visitor_id_idx on touch_events (visitor_id);
create index touch_events_lead_id_idx on touch_events (lead_id);
create index touch_events_created_at_idx on touch_events (created_at desc);
create index leads_stage_idx on leads (stage);
create index leads_lead_source_idx on leads (lead_source);
alter table leads enable row level security;
alter table clients enable row level security;
alter table students enable row level security;
alter table enrollments enable row level security;
alter table touch_events enable row level security;
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;
create trigger leads_updated_at before update on leads for each row execute function set_updated_at();
create trigger clients_updated_at before update on clients for each row execute function set_updated_at();
create trigger enrollments_updated_at before update on enrollments for each row execute function set_updated_at();
