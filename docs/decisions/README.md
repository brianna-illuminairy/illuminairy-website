# Architecture decision log (ADR)

Lightweight record of **why** we chose something—not just what we built.

## Format

Each decision is `NNNN-short-title.md` (four-digit id, kebab-case title).

Use [0000-template.md](0000-template.md) for new entries.

## Status values

| Status | Meaning |
|--------|---------|
| proposed | Under discussion |
| accepted | In use |
| deprecated | Replaced; see successor ADR |
| superseded | Replaced by linked ADR |

## Index

| ID | Title | Status |
|----|-------|--------|
| [0001](0001-nextjs-vercel.md) | Next.js on Vercel | accepted |
| [0002](0002-canonical-site-config.md) | Canonical config in `lib/site.ts` | accepted |
| [0003](0003-stripe-checkout-enrollment.md) | Stripe Checkout for enrollment | accepted |
| [0004](0004-calendly-public-vs-invite.md) | Public vs invite-only Calendly | accepted |
| [0005](0005-resend-contact-form.md) | Resend for contact form | accepted |
| [0006](0006-agentic-development-workflow.md) | Agentic development workflow | accepted |

## When to add an ADR

- New third-party service or payment flow
- Routing or URL structure that is hard to reverse
- Security boundary (what is public vs server-only)
- Copy/positioning choice that affects multiple pages

Skip ADRs for typo fixes, dependency patch bumps, or one-off styling tweaks.
