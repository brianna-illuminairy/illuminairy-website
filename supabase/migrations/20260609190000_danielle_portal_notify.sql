-- Danielle student portal: notification preferences + delivery log

create table danielle_portal_notify_subscriptions (
  email text primary key,
  phone text,
  email_opt_in boolean not null default false,
  sms_opt_in boolean not null default false,
  sms_opt_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table danielle_portal_notify_deliveries (
  id uuid primary key default gen_random_uuid(),
  update_id text not null,
  email text not null references danielle_portal_notify_subscriptions (email) on delete cascade,
  channel text not null check (channel in ('email', 'sms')),
  sent_at timestamptz not null default now(),
  unique (update_id, email, channel)
);

create index danielle_portal_notify_deliveries_update_idx
  on danielle_portal_notify_deliveries (update_id);
