# Illuminairy

Custom Next.js website for [Illuminairy](https://illuminairy.com) — mentorship programs with **SAT Accelerator** live for the August 22, 2026 SAT.

## Documentation map

| Doc | Purpose |
|-----|---------|
| [**AGENTS.md**](AGENTS.md) | Instructions for AI assistants working in this repo |
| [**memory-bank/**](memory-bank/README.md) | Persistent context (product, tech, active work) |
| [**docs/architecture.md**](docs/architecture.md) | Routes, APIs, integrations, folder layout |
| [**docs/decisions/**](docs/decisions/README.md) | Architecture decision log (ADRs) |
| [**CONTRIBUTING.md**](CONTRIBUTING.md) | Setup, PR checklist, commit norms |
| [**docs/agentic-development/**](docs/agentic-development/README.md) | Spec-driven, Ralph loop, agent verify, growth experiments |
| [**specs/**](specs/README.md) | PRDs, active spec, Ralph PLAN |
| [**docs/**](docs/README.md) | Brand voice, visual identity, SAT messaging |

## Brand & design

**Brand docs:** [`docs/designer-brief.md`](docs/designer-brief.md) (index) · [voice & positioning](docs/brand-voice-and-positioning.md) · [visual identity](docs/visual-identity.md) · [SAT messaging](docs/sat-messaging-positioning.md)

Canonical copy for tagline and homepage hero lives in [`lib/site.ts`](lib/site.ts). HTML brand books may live outside this repo (see [visual-identity.md](docs/visual-identity.md)).

## SAT plan funnel (Meta assessment)

**Production URL:** `/satplan` (e.g. https://illuminairy.com/satplan)

| | |
|-|-|
| Code | `app/satplan/`, `components/sat-plan/`, `lib/sat-plan-funnel/` |
| Specs & screen copy | [github.com/brianna-illuminairy/quizfunnel](https://github.com/brianna-illuminairy/quizfunnel) |
| Local | `npm run dev` → http://localhost:3000/satplan |

Do **not** build new funnel screens in the quizfunnel Babel prototype — see [ADR 0009](docs/decisions/0009-satplan-nextjs-production.md).

## Repo layout

```
app/              Pages and API routes (includes /satplan)
components/       UI components (sat-plan/ = assessment funnel)
lib/              Site config, Stripe, schedules, sat-plan-funnel/
docs/             Brand + internal technical docs
memory-bank/      Session context for humans & AI
specs/            PRDs, specs, Ralph PLAN
agent/            Human-owned engineering & growth program files
growth/           Growth experiment logs
archives/         Historical reference captures (not deployed)
scripts/          Env sync, Stripe setup, agent:verify, ralph loop
.cursor/rules/    Cursor agent rules
.cursor/skills/   Cursor project skills (plan, review, ship, …)
```

## Local development

```bash
npm install
npm run dev
```

## Environment variables

Copy `.env.example` to `.env.local`.

**Vercel (one command):** after editing `.env.local`, push secrets to production, preview, and development:

```bash
npm run env:sync
npm run deploy:prod
```

Pull from Vercel into `.env.local` on a new machine: `npm run env:pull` (requires `vercel link` once).

**Contact form** (recommended): create a free [Resend](https://resend.com) account, add your API key, and verify `illuminairy.com` so messages send from your domain to `support@illuminairy.com`:

```bash
RESEND_API_KEY=re_...
CONTACT_INBOX=support@illuminairy.com
RESEND_FROM_EMAIL=Illuminairy <notifications@illuminairy.com>
```

Until `RESEND_API_KEY` is set, the form on `/contact` shows an error and visitors can still email `support@illuminairy.com` directly.

**Public SAT consultation** (embedded on `/contact#schedule` and `/sat-accelerator#schedule`):

```bash
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/brianna-illuminairy/august-sat
```

**Invite-only mentor interview** (never on the public site — email this link after you review an application):

```bash
TUTOR_CALENDLY_URL=https://calendly.com/brianna-illuminairy/tutor-call
```

See `lib/internal-links.ts`. Mentor applicants use `/contact?reason=mentor`; you send `tutor-call` manually when they pass vetting.

If Calendly is not set, consultation CTAs fall back to `mailto:support@illuminairy.com`.

**Stripe enrollment** (post-consultation checkout on `/enroll`):

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

**Automated setup (recommended):** add `STRIPE_SECRET_KEY` and `STRIPE_TUITION_CENTS` (tuition in USD cents) to `.env.local`, then run:

```bash
node --env-file=.env.local scripts/setup-stripe.mjs
```

The script creates the Product, Price, and production webhook; copy the printed `STRIPE_PRICE_ID` and `STRIPE_WEBHOOK_SECRET` into `.env.local` and Vercel.

Or create Product/Price in Dashboard → Products and register webhook `https://illuminairy.com/api/webhooks/stripe` for `checkout.session.completed`. For local testing, install [Stripe CLI](https://stripe.com/docs/stripe-cli) and run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

## Deployment

Deploy the project on Vercel, then point the Squarespace-managed DNS for
`illuminairy.com` to Vercel.

## Working with AI in Cursor

1. Open **`memory-bank/activeContext.md`** to see current focus.
2. Agents follow **`AGENTS.md`** and **`.cursor/rules/`** automatically.
3. After significant work, update the memory bank and add an ADR if you made a durable decision.
