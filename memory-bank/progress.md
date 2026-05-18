# Progress

*Last updated: 2026-05-18*

## Shipped

- [x] Next.js marketing site with brand-aligned pages
- [x] SAT Accelerator program page and schedule data
- [x] Contact form (Resend) with mentor reason query param
- [x] Public Calendly embed on contact / SAT pages
- [x] Stripe enrollment flow (`/enroll`, webhook, success page)
- [x] Policy pages (privacy, terms, refund, support)
- [x] PostHog, GA, Klaviyo hooks
- [x] Brand docs in `docs/` (voice, visual, SAT messaging)
- [x] Curious Cardinals competitor intel (`docs/competitor-intel-curious-cardinals.md`) + site archive branch
- [x] CC blog analyzer script (`npm run cc:analyze-blog`)
- [x] CC intel cross-linked in SAT + brand docs (trust levers vs SAT proof)
- [x] Vercel deploy scripts and env sync
- [x] Agent docs: AGENTS.md, memory bank, ADRs, Cursor rules
- [x] Agentic dev workflow: `docs/agentic-development/`, `specs/`, `agent:verify`, Ralph scripts, Cursor skills, ADR 0006
- [x] Premium application-funnel teardowns for SAT growth strategy (`docs/research/premium-funnel-teardowns.md`)

## In progress

- [ ] —

## Backlog

- [ ] PostHog CTA instrumentation using `lib/analytics-events.ts`
- [ ] Optional: CI job running `npm run agent:verify` on PRs
- [ ] AI for Professionals program page when offer is ready
- [ ] Business programs when defined
- [ ] Optional: rate limiting on `/api/contact` if spam increases
- [ ] Optional: E2E smoke tests for enroll + contact

## Known issues

- Contact form shows error until `RESEND_API_KEY` is configured (by design; mailto fallback in copy)
- Calendly CTAs fall back to mailto if `NEXT_PUBLIC_CALENDLY_URL` unset
