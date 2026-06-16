# Sohail Yousaf — locked custom enrollment page

This page (`/enroll/sohail-shermeen`) is **frozen**. It was hand-tuned for Sohail Yousaf and Shermeen Yousaf after their June 9, 2026 Strategy Call and **the live link was sent to him**. He may revisit it at any time. Anything that changes after he saw it would be confusing or worse.

## Do not edit any of these without an explicit owner unlock

- `app/enroll/sohail-shermeen/page.tsx`
- `components/personalized-enroll/personalized-enroll-page.tsx`
- `components/personalized-enroll/personalized-enroll.css`
- `lib/personalized-enroll.ts`
- `app/api/personalized-enroll/checkout/route.ts`
- `app/api/personalized-enroll/finalize/route.ts`

These files exclusively serve Sohail's page. They are not a template.

## Do not import these into anything else

If you are building a new enrollment page, **do not import** anything from `lib/personalized-enroll` or `components/personalized-enroll/`. Build new pages on the standard stack at:

- `lib/standard-enroll.ts`
- `components/standard-enroll/*`
- `app/api/standard-enroll/*`

Sharing components / types / API routes from Sohail's stack reintroduces the risk that a future change to the standard breaks Sohail's already-sent page. Keep them isolated.

## What "Sohail's page" means

- Custom 11-item "What's included" list (his + the optional 60-minute single-module tooltip on item 1)
- Custom progress strip: `Free SAT plan -> Strategy call -> Enroll -> Phase 1 begins`
- Custom 5-question FAQ (Shermeen-specific Bluebook diagnostic question, "is the first week free" billing breakdown, etc.)
- Stripe `prod_UfmBm2GawHFXRA` (diag) + `prod_UfmE3JUG5ykfSk` (weekly), 7-day trial, fallback link `https://buy.stripe.com/7sYcMY7DK1X19lO7gZc7u01`

## Owner unlock

Only Brianna can authorize edits to this page after it has been sent. Coordinate via email before touching anything in the file list above.
