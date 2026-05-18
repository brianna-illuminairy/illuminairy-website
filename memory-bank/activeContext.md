# Active context

*Last updated: 2026-05-18*

## Current focus

- **SAT growth funnel shipped in repo** — `/go/sat`, funnel intake/schedule/complete, List Fit Check, campaign kits, PostHog events
- **Human next:** Klaviyo flows from `funnel/email/sequences/`, PostHog dashboard (`growth/posthog-funnel-dashboard.md`), message-match QA before ad spend
- **Research next:** use `docs/research/premium-funnel-teardowns.md` to decide whether `/get-started` should add consult-agenda copy, a budget/readiness question, and a nurture branch before ad spend

## Recent changes

- **Georgia parent SEO + lead magnets:** `docs/seo-georgia-parent-icp.md`, `/guides` hub + 3 gated guides (Klaviyo), `/get-started` intake + schedule, blog spoke on pacing, PostHog magnet events, `docs/klaviyo-magnet-nurture.md` for Klaviyo flow setup
- **Agentic workflow:** `docs/agentic-development/`, `specs/`, `growth/`, `agent/`, `npm run agent:verify`, `ralph:status` / `ralph:next`, `.cursor/skills/`, ADR 0006
- Added `memory-bank/`, `docs/decisions/`, `docs/architecture.md`, `AGENTS.md`, `.cursor/rules/`
- Root README expanded with documentation index
- **Curious Cardinals:** full site archive on branch `archive/curious-cardinals-2026-05-18` (~658 MB, GitHub-only); competitor intel in `docs/competitor-intel-curious-cardinals.md`

## Next steps (suggested)

- [ ] Keep `activeContext.md` / `progress.md` updated after each agent session
- [ ] Add ADRs when making new integration or routing decisions
- [ ] Verify Resend domain + Stripe webhook in production after env changes
- [x] **Parent guides + blog spoke** — `/guides`, `/blog/pacing-mistakes-that-cost-points`; more posts from competitor-intel §5 calendar
- [ ] **Trust assets vs CC playbook:** post-cohort outcome stories, curated `/mentors` pages—not thin directory SEO
- [ ] **Klaviyo:** build nurture flow from `docs/klaviyo-magnet-nurture.md` in dashboard

## Open questions

- None recorded — add here when product or tech choices are pending

## Session notes

*Agents: replace or append dated bullets below when you finish work.*

- **2026-05-18** — Supabase CRM complete: schema, attribution (`/api/attribution/touch`), intake/Stripe/Calendly webhooks, Klaviyo server events, `/admin` with lead/enrollment edits. Apply migration: `supabase db push` (see `supabase/README.md`). ADR [0007](docs/decisions/0007-supabase-crm-attribution.md).
- **2026-05-18** — Initial memory bank and agent docs created.
- **2026-05-18** — CC archive + `docs/competitor-intel-curious-cardinals.md`; blog analyzer `npm run cc:analyze-blog`.
- **2026-05-18** — Synced CC “same trust levers / SAT proof” framing across `sat-competitor-analysis`, `sat-messaging-positioning`, `brand-voice`, `sat-us-vs-competitors`, `designer-brief`, `docs/README`, `AGENTS`, memory-bank.
- **2026-05-18** — Agentic development workflow (specs, Ralph, verify gate, growth experiment templates, Cursor skills).
- **2026-05-18** — Georgia parent ICP: SEO doc, 3 lead-magnet guides, `/get-started`, blog, analytics + Klaviyo nurture copy doc.
- **2026-05-18** — SAT funnel parent-voice research exported to `docs/research/parent-voice-social-listening-2026-05.md` (+ `docs/research/README.md`).
- **2026-05-18** — SAT conversion funnel implemented: `specs/2026-05-sat-funnel/`, `funnel/` kits + copy, `/go/sat`, mobile intake, `/tools/georgia-list-fit`, analytics; `npm run agent:verify` passed.
- **2026-05-18** — Premium application-funnel research added: `docs/research/premium-funnel-teardowns.md` compares Alpha, Gauntlet, MarketerHire, Cohort, Curious Cardinals, Crimson, Prep Expert, and adult cohort platforms; maps borrowable patterns to `/get-started`.
