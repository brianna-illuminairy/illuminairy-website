-- Bind the OTP to a number so a verified parent cannot swap in a fake phone before booking.

alter table leads add column if not exists phone_verified_phone text;

comment on column leads.phone_verified_phone is 'E.164 phone that actually passed the Firebase OTP. Booking compares the submitted phone against this.';
