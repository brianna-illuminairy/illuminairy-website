# Agent guide — Illuminairy

Instructions for AI assistants (Cursor, Claude Code, etc.) working in this repository.

## What this repo is

Production **Next.js 16** marketing and enrollment site for [Illuminairy](https://illuminairy.com): mentorship programs led from Atlanta, with **SAT Accelerator** live for the August 22, 2026 SAT. Legal entity: Zytech Development LLC.

This is **not** a coursework or AIMA assignment repo. Do not apply academic “student code style” rules here.

## Read first

| Resource | When |
|----------|------|
| [`memory-bank/`](memory-bank/README.md) | Persistent context — update `activeContext.md` and `progress.md` when you finish meaningful work |
| [`docs/architecture.md`](docs/architecture.md) | Routes, APIs, integrations, folder layout |
| [`docs/decisions/`](docs/decisions/README.md) | Why we chose stacks and patterns — add an ADR for non-trivial choices |
| [`docs/designer-brief.md`](docs/designer-brief.md) | Brand doc index |
| [`docs/competitor-intel-curious-cardinals.md`](docs/competitor-intel-curious-cardinals.md) | Adjacent mentorship competitor — trust levers, funnel, when writing blog or competitive copy |
| [`lib/site.ts`](lib/site.ts) | Canonical product facts, tuition, hero copy, program structure |
| [`docs/agentic-development/`](docs/agentic-development/README.md) | Spec-driven, Ralph, autoresearch, growth experiments, gstack |
| [`specs/`](specs/README.md) | PRDs, specs, `ACTIVE.md`, Ralph `PLAN.md` |
| **SAT plan funnel (live UI)** | **`/satplan`** in this repo — `components/sat-plan/`, `lib/sat-plan-funnel/` |
| **Assessment funnel v2 (live UI)** | **`/assessment`** — `components/assessment/`, `lib/assessment-funnel/`, `app/assessment/funnel.css` (Aurora Light) |
| **SAT funnel specs / copy** | Sibling repo [brianna-illuminairy/quizfunnel](https://github.com/brianna-illuminairy/quizfunnel) — not runnable production code |

## SAT plan funnel (`/satplan`) — do not revert to Babel

- **Ship here:** Next.js only — `npm run dev` → http://localhost:3000/satplan
- **Do not** extend `quizfunnel/prototype/` (in-browser Babel); that folder is deprecated — see ADR [0009](docs/decisions/0009-satplan-nextjs-production.md)
- New assessment screens: `QuizStepTemplate` in `components/sat-plan/`; update step map in `lib/sat-plan-funnel/state.ts`
- **Layout lock:** step files are **content only** — swap `headline`, `hint`, `bodyVariant`, and body children. Do not edit `funnel.css`, `funnel-shell.tsx`, `quiz-step-template.tsx`, or spacing without owner approval. See `components/sat-plan/LAYOUT.lock.md` and `npm run funnel:layout-guard`.
- Product/copy checklists stay in the **quizfunnel** git repo

## Plan Builder quiz (`/plan`)

- **Ship here:** `npm run dev` → http://localhost:3000/plan
- **CTA lock:** **every** step passes a `footer` to `QFScreen`. See `app/quiz/LAYOUT.lock.md`, `npm run funnel:cta-guard`, and **`npm run funnel:e2e`** (Playwright — every step + navigation; requires dev server).
- **Shell:** `app/quiz/components/QFShell.tsx` pins the footer; step files are content + `footer` prop only.

## Assessment funnel (`/assessment`) — parallel to satplan

- **Ship here:** `npm run dev` → http://localhost:3000/assessment
- **Specs:** quizfunnel `PLAN-assessment-funnel.md`, `design/aurora/tokens.md`
- **Do not** import sat-plan shell/CSS into assessment step files; reuse `quiz-option-list` only
- v1 ends at `complete` — no offer/Calendly until `files/assessment-offer.md` exists
- Analytics: `funnel_id: "assessment"` via `trackAssessmentFunnelEvent`

## Agentic workflows

Patterns for multi-session AI work (full guide: [`docs/agentic-development/README.md`](docs/agentic-development/README.md)):

| Pattern | Command / location |
|---------|-------------------|
| Spec-driven | `specs/_templates/` → set `specs/ACTIVE.md` |
| Ralph (one task per session) | `npm run ralph:next` → `specs/ralph/PLAN.md` |
| Engineering verify gate | `npm run agent:verify` (do not edit `scripts/agent-verify.mjs`) |
| Growth experiments | `agent/growth-program.md`, `growth/experiments/`, `lib/analytics-events.ts` |
| Marketing skills (Cursor) | `.agents/skills/` + [`growth/marketingskills-usage.md`](growth/marketingskills-usage.md) · context [`.agents/product-marketing.md`](.agents/product-marketing.md) |
| Cursor skills | `.cursor/skills/` (plan, review, ship, investigate, ralph-iteration) |
| Claude Code | [`docs/agentic-development/claude-code-and-gstack.md`](docs/agentic-development/claude-code-and-gstack.md) |

Non-trivial features: start with a spec. End sessions: update memory-bank.

## Golden rules

1. **Single source of truth for public facts** — tuition, dates, program structure, and hero copy live in `lib/site.ts` (and `lib/sat-program-schedule.ts` for the calendar). Update code and brand docs together when facts change.
2. **Brand voice** — Follow [`docs/brand-voice-and-positioning.md`](docs/brand-voice-and-positioning.md). Parent/funnel messaging (Score Path, stats, banned patterns): [`docs/messaging-guide.md`](docs/messaging-guide.md). SAT-specific angles: [`docs/sat-messaging-positioning.md`](docs/sat-messaging-positioning.md). Avoid “cohort”; use parent-friendly language.
3. **Secrets** — Never commit `.env.local`, API keys, or webhook secrets. Use `.env.example` as the template.
4. **Invite-only links** — `TUTOR_CALENDLY_URL` / `lib/internal-links.ts` tutor interview URL is **email-only after vetting**. Never surface it in public pages, sitemaps, or client bundles.
5. **Deploy path** — Vercel production; DNS for `illuminairy.com` points to Vercel. Env sync: `npm run env:sync` then `npm run deploy:prod` (or `npm run release`).

## Code conventions

- **Stack:** TypeScript, React 18, App Router, Tailwind 3, Lucide icons.
- **Paths:** `@/` alias → project root.
- **Components:** `components/` for UI; `app/` for routes and API routes; `lib/` for config and server helpers.
- **Styling:** Tailwind + CSS variables in `app/globals.css`; font is Plus Jakarta Sans.
- **API routes:** `app/api/contact`, `newsletter`, `checkout`, `webhooks/stripe` — keep side effects in route handlers; validate env at runtime with clear errors.
- **Lint:** Run `npm run lint` before claiming a task is done.
- **Build:** `npm run build` uses webpack (`--webpack` in package.json).

## Common tasks

| Task | Where to look |
|------|----------------|
| Change homepage hero or tuition | `lib/site.ts`, `lib/sat-program-schedule.ts` |
| SAT program page | `app/sat-accelerator/page.tsx`, related components |
| Contact / Calendly embed | `app/contact/page.tsx`, `components/calendly-*` |
| Enrollment / Stripe | `app/enroll/`, `lib/stripe.ts`, `scripts/setup-stripe.mjs` |
| Analytics | `lib/posthog.ts`, `components/posthog-provider.tsx`, `components/google-analytics.tsx` |
| SEO | `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts` |

## Memory bank workflow

After a session with meaningful changes:

1. Update `memory-bank/activeContext.md` — what you did, what’s in flight.
2. Update `memory-bank/progress.md` — check off or add items.
3. If you made an architectural or product choice, add a row in `docs/decisions/` (see template).

## What not to do

- Do not edit `archives/` except to add dated snapshots or README notes.
- Do not duplicate long copy in multiple TSX files — prefer `lib/site.ts` or small exported constants.
- Do not add guarantee language for SAT score outcomes (see brand docs).
- Do not run `git push --force` to `main` without explicit user request.

## Verification

Before marking work complete:

```bash
npm run agent:verify
```

(`agent:verify` runs lint and build. Equivalent: `npm run lint` && `npm run build`.)

For contact/Stripe/Calendly changes, say what env vars are required and whether manual QA steps are needed.

## Human owner

Brianna — `brianna@illuminairy.com` / `support@illuminairy.com`
