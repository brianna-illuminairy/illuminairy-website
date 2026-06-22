-- Post-call enroll: link Stripe subscription + customer on enrollment rows.

alter table enrollments add column if not exists stripe_subscription_id text;
alter table enrollments add column if not exists stripe_customer_id text;
alter table enrollments add column if not exists stripe_payment_intent_id text;
alter table enrollments add column if not exists enroll_flow text;

create unique index if not exists enrollments_stripe_subscription_id_idx
  on enrollments (stripe_subscription_id)
  where stripe_subscription_id is not null;

create unique index if not exists enrollments_stripe_payment_intent_id_idx
  on enrollments (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

comment on column enrollments.stripe_subscription_id is 'Weekly tutoring subscription from post-call on-page enroll finalize';
comment on column enrollments.stripe_customer_id is 'Stripe customer id for post-call enroll';
comment on column enrollments.stripe_payment_intent_id is 'Diagnostic PI or SetupIntent id used as enroll idempotency key';
comment on column enrollments.enroll_flow is 'standard-enroll | personalized-enroll';
