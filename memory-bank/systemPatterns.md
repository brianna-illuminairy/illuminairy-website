# System patterns

## App structure (Next.js App Router)

```
app/           → pages, layouts, API routes
components/    → reusable UI (client/server as needed)
lib/           → site config, Stripe, PostHog, schedules
public/        → static assets
docs/          → brand & internal docs (not shipped)
memory-bank/   → AI/human persistent context
specs/         → PRDs, specs, Ralph PLAN, ACTIVE pointer
agent/         → human-owned program.md, growth-program.md
growth/        → experiment logs (not shipped)
scripts/       → env sync, agent-verify, ralph-loop, PostHog verify
.cursor/skills → plan, review, ship, investigate, ralph-iteration
```

## Agentic workflow

- **Spec-driven** — `specs/ACTIVE.md` points at the current `SPEC.md`; templates in `specs/_templates/`.
- **Ralph** — one task per agent session; `specs/ralph/PLAN.md`; `npm run ralph:next`.
- **Engineering gate** — `npm run agent:verify`; `scripts/agent-verify.mjs` is immutable for agents.
- **Growth experiments** — `agent/growth-program.md`, `growth/experiments/`, event names in `lib/analytics-events.ts`.
- **Docs** — `docs/agentic-development/`; ADR [0006](../docs/decisions/0006-agentic-development-workflow.md).

## Configuration pattern

- **`lib/site.ts`** — `site`, `satProgram`, `cohorts`, marketing arrays, icon maps for features
- **`lib/sat-program-schedule.ts`** — week-by-week calendar data for enroll page
- **`lib/internal-links.ts`** — public consultation path vs private tutor Calendly URL
- **`lib/stripe.ts`** — server Stripe client and checkout session helpers
- **Env** — `.env.local` locally; Vercel env for deploy; `.env.example` documents keys

## API route pattern

- Parse JSON body; validate required fields
- Return structured JSON errors (4xx/5xx) with safe messages (no stack traces to client)
- Use Resend for email; Stripe SDK for checkout/webhooks; no secrets in client bundles

## Component pattern

- Server components by default in `app/`
- Client components only when needed (forms, Calendly embed, PostHog provider, checkout)
- Shared primitives in `components/ui.tsx`
- Brand visuals in `components/brand-visual.tsx`, `components/logo.tsx`

## Analytics pattern

- PostHog via provider + proxy-friendly host env
- Google Analytics component in root layout
- Klaviyo script for newsletter/list growth

## Content pattern

- Long-form marketing copy: colocate in page or import from `lib/site.ts`
- Do not fork tuition/dates across files
- SAT competitive messaging: consult `docs/sat-messaging-positioning.md` before large copy edits

## Security pattern

- Webhook signature verification for Stripe
- `TUTOR_CALENDLY_URL` server-only; never `NEXT_PUBLIC_*`
- Rate limiting: rely on provider limits + minimal validation in routes (enhance if abused)
