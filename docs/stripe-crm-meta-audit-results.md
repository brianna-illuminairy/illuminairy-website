# Stripe → CRM → Meta audit results (2026-06-21)

## CRM stage (pre-backfill)

| Family | Email | Lead stage | Notes |
|--------|-------|------------|-------|
| Danielle / Nana | bonsuc@gmail.com | **won** | Legacy typeform + enrollment `f34c3ee3-…` |
| Sohail / Shermeen | sohailft@gmail.com | call_attended | Quiz lead; paid Stripe Jun 2026 |
| Skye / Sara | sara_crisafulli@hotmail.com | call_attended | Paid via checkout session + PI |
| Nada / Soha | nj00@hotmail.com | diagnostic_scheduled | Enrolled bootcamp; sub trialing |

`nadanaveed@gmail.com` has no lead row (Calendly booked under that email without quiz match).

## Stripe (prod)

| Family | Customer | Diagnostic | Subscription |
|--------|----------|------------|--------------|
| Sohail | cus_UjWyX9oCo95hyu | pi_3Tk3u72… $249 | sub_1Tk3vP… trialing |
| Skye | cus_UivK4GKo1w8XJc | pi_3TjTTc… $249 | sub_1TjTTe… trialing |
| Nada | cus_UkRzjwteTSTms1 | waived (seti_1Tkx5k…) | sub_1Tkx7n… trialing $149/wk |

## Meta Events Manager

- ~1–2 Purchase events in May 24 – Jun 20 window vs 3+ enrollments.
- **Stripe does not send to Meta** in this repo; server Purchase was likely Meta-enabled CAPI mirroring pixel or a one-off test.
- CSV exports empty at this volume; use **Event source** tab or **Test Events**.

## Code shipped

- `recordPostCallEnrollCompletion` on standard/personalized finalize
- Purchase CAPI on finalize with `purchase_{piOrSiId}` dedupe
- Waived-diagnostic Purchase value = weekly price (not $0)
- Stripe webhook: `parent_email` fix, invoice.paid, subscription lifecycle
- Backfill: `npm run crm:backfill-post-call-enroll`

## Owner actions

1. Apply migration `20260621120000_enrollment_stripe_subscription.sql` (Vercel/Supabase SQL or `SUPABASE_ACCESS_TOKEN` + `crm:migrate:api`)
2. Re-register Stripe webhook events in Dashboard (or run `setup-stripe.mjs` on new endpoint)
3. Run `npm run crm:backfill-post-call-enroll` after migration
4. Events Manager → Purchase → **Event source** + Settings → confirm Meta-enabled CAPI
