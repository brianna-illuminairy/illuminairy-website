# Growth autoresearch

For startups and growth marketers: same discipline as ML autoresearch — **one primary metric per experiment**, immutable measurement, logged outcomes.

## Illuminairy funnel

Discover → `/sat-accelerator` → book consult (Calendly) → `/enroll` (Stripe) → paid.

See [`memory-bank/productContext.md`](../../memory-bank/productContext.md).

## Two layers (do not mix)

| Layer | Immutable | Sandbox | Success metric |
|-------|-----------|---------|----------------|
| Engineering | `agent-verify`, analytics event names | Code | lint + build |
| Growth | `lib/analytics-events.ts`, funnel defs in PostHog | Copy, layout, CTAs | **One** funnel metric per experiment |

## North star (business truth)

| Metric | Source |
|--------|--------|
| Paid enrollments | Stripe Dashboard / webhook |
| Checkout completed | Stripe |
| Consultation booked | Calendly (webhook or weekly manual count) |

## Pick one primary metric per experiment

| Metric | When to use |
|--------|-------------|
| `schedule_cta_click` | SAT page / hero → consult |
| `enroll_cta_click` | Paths to `/enroll` |
| `checkout_started` | Enroll page UX |
| `checkout_completed` | Full funnel (needs volume) |
| `contact_form_submitted` | Trust / support tests |

Event names are defined in [`lib/analytics-events.ts`](../../lib/analytics-events.ts). Do not rename mid-experiment.

## Leading indicators (diagnose only)

- SAT page views, bounce rate, time on page (PostHog / GA)
- Newsletter signups (Klaviyo)
- Contact API errors

## Guardrails (revert variant if violated)

- [Banned copy phrases](../../.cursor/rules/banned-copy-phrases.mdc)
- No SAT score guarantees ([`AGENTS.md`](../../AGENTS.md))
- Tuition/dates only via human edit to `lib/site.ts`
- Bounce rate not worse than baseline + agreed band
- `npm run agent:verify` still passes

## Experiment log

Copy [`growth/experiments/_template.md`](../../growth/experiments/_template.md) → `growth/experiments/YYYY-MM-DD-slug.md`.

Log every experiment, including inconclusive runs — this is your marketing “git history.”

## Human program

[`agent/growth-program.md`](../../agent/growth-program.md) — hypotheses and priorities. Human-owned; agents read, do not edit without approval.

## PostHog setup

1. Ensure `NEXT_PUBLIC_POSTHOG_KEY` is set (`npm run posthog:verify`).
2. Build a funnel: SAT pageview → schedule CTA → (optional) enroll → checkout.
3. Instrument CTAs with `posthog.capture()` using constants from `lib/analytics-events.ts` (lead magnets, get-started intake — see `lib/analytics-capture.ts`).

## Rules

1. One primary metric per experiment.
2. One variant at a time on production (or use feature flags later).
3. Human approves deploy; measure after deploy for an agreed window (e.g. 7–14 days or min 200 SAT pageviews).
4. Keep / revert / inconclusive — document in the experiment file.

## Generic startup checklist

Acquisition (sessions, UTM) → activation (first intent action) → revenue (payment) → retention (email/return) → quality (errors, support, feedback). For consult→enroll businesses, prioritize **consult booked** and **paid enroll** over vanity traffic.
