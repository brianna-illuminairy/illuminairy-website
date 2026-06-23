-- Plan Builder B — email OTP codes (Twilio alternative)
create table if not exists funnel_b_otp (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  phone_e164 text,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists funnel_b_otp_email_lower_idx on funnel_b_otp (lower(email));
create index if not exists funnel_b_otp_expires_at_idx on funnel_b_otp (expires_at);

comment on table funnel_b_otp is 'Short-lived email OTP hashes for Plan Builder B phone step when Twilio Verify is unavailable.';
