# ADR-0004: Public vs invite-only Calendly links

- **Status:** accepted
- **Date:** 2026-05-18
- **Deciders:** Brianna

## Context

Two scheduling needs: (1) any family booking an SAT consultation, and (2) vetted mentor applicants booking an interview after resume review.

## Decision

- **Public:** `NEXT_PUBLIC_CALENDLY_URL` → embedded on `/contact#schedule` and SAT pages; also exposed as `site.calendlyUrl` for CTAs.
- **Invite-only:** `TUTOR_CALENDLY_URL` in `lib/internal-links.ts` — **never** in public CTAs, client bundles, or sitemap. Sent manually by email after vetting.

Mentor interest uses `/contact?reason=mentor` on the public form, not the tutor Calendly link.

## Consequences

### Positive

- Clear separation of funnel vs hiring workflow
- Reduces unqualified tutor interview bookings

### Negative / tradeoffs

- Manual step to send tutor link; must train anyone doing hiring

## Alternatives considered

1. **Single Calendly event** — conflates sales and HR
2. **Public tutor link** — rejected for quality control

## References

- [`lib/internal-links.ts`](../../lib/internal-links.ts)
- [`.env.example`](../../.env.example)
