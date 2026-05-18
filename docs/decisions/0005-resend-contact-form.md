# ADR-0005: Resend for contact form

- **Status:** accepted
- **Date:** 2026-05-18
- **Deciders:** Brianna

## Context

The site needs a contact form delivering to `support@illuminairy.com` from the verified `illuminairy.com` domain, without operating our own SMTP.

## Decision

Use **Resend** in `POST /api/contact` with `RESEND_API_KEY`, `CONTACT_INBOX`, and optional `RESEND_FROM_EMAIL` after domain verification. Until the API key is set, the form fails gracefully and copy directs users to mailto.

## Consequences

### Positive

- Simple API, good deliverability story for a small team
- From-address on own domain after verification

### Negative / tradeoffs

- Another vendor and API key to rotate
- Form unusable in prod without configuration (intentional fail-safe)

## Alternatives considered

1. **Formspree / Getform** — less control over from-domain branding
2. **mailto-only** — poor conversion and tracking

## References

- [`app/api/contact/route.ts`](../../app/api/contact/route.ts)
- [`components/contact-form.tsx`](../../components/contact-form.tsx)
