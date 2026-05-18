# ADR-0003: Stripe Checkout for enrollment

- **Status:** accepted
- **Date:** 2026-05-18
- **Deciders:** Brianna

## Context

Families enroll in SAT Accelerator after a consultation. We need PCI-safe payment collection and a webhook when payment succeeds.

## Decision

Use **Stripe Checkout** (hosted payment page) initiated from `/enroll` via `POST /api/checkout`, with **`checkout.session.completed`** handled at `POST /api/webhooks/stripe`. Price ID and webhook secret live in env; optional bootstrap via `scripts/setup-stripe.mjs`.

## Consequences

### Positive

- Stripe handles card UI and PCI scope
- Webhook enables post-payment automation (emails, internal alerts—extend as needed)

### Negative / tradeoffs

- Requires live webhook URL and secret rotation discipline
- Local dev needs Stripe CLI or test mode for webhook testing

## Alternatives considered

1. **Payment Element embedded** — more UI work; Checkout sufficient for single SKU
2. **Manual invoicing** — poor UX at scale

## References

- [`app/enroll/page.tsx`](../../app/enroll/page.tsx)
- [`lib/stripe.ts`](../../lib/stripe.ts)
- [`README.md`](../../README.md) — Stripe section
