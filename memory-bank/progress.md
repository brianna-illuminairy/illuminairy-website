# Progress

*Last updated: 2026-06-17*

## Shipped

- [x] Next.js marketing site with brand-aligned pages
- [x] SAT Accelerator program page and schedule data
- [x] Contact form (Resend) with mentor reason query param
- [x] Public Calendly embed on contact / SAT pages
- [x] Stripe enrollment flow (`/enroll`, webhook, success page)
- [x] Policy pages (privacy, terms, refund, support)
- [x] PostHog, GA, Klaviyo hooks
- [x] Brand docs in `docs/` (voice, visual, SAT messaging)
- [x] Agent docs: AGENTS.md, memory bank, ADRs, Cursor skills
- [x] **SAT plan funnel** at `/satplan` (ADR 0009) — **Phase A spine**
- [x] Intake: landing through test-date, score, wrong, GPA, schools
- [x] Interstitials: INT1, INT3, INT8 quartet, INT12, INT2, INT6 timeline, plan-path, plan-ready
- [x] Tail: contact (form UI), report (snapshot), book (Calendly)
- [x] INT8 contrast: triptych (daughter/Me variant), `ContrastBarChart`, diagnostic animation
- [x] Wrong step: dashboard tile icons; INT2 tutor-note; INT12 digital-vs-paper mockup
- [x] `satPrepComparison` + Bloom chart title in `lib/site.ts`
- [x] Mobile cold-traffic funnel spec + architecture docs (`specs/2026-06-mobile-cold-traffic-funnel`, `docs/funnel-*`)
- [x] Visitor fast-reporting columns live in Supabase (`first_utm_content`, `first_hero_hook`, `quiz_who`) with indexes
- [x] Completeness monitor command + ops checklist (`npm run funnel:completeness`, `growth/mobile-funnel-qa-checklist.md`)
- [x] **CRM v1** (`/admin/crm`) — clickable lead profiles, pipeline kanban, due-today queue, paste-in call notes, clients list + profile, lead↔client conversion banners, merged activity timeline. Marketing dashboard counts fixed (distinct lead_id, internal-email filter, funnel-attributed books). See `.cursor/plans/crm-v1-pipeline_4cf61e79.plan.md`. Requires running `npm run crm:migrate` (or `crm:migrate:api`) once with `DATABASE_URL` / `SUPABASE_DB_PASSWORD` / `SUPABASE_ACCESS_TOKEN` to apply new migrations `20260612120000_crm_v1_followups.sql` + `20260612121000_crm_v1_lead_calls.sql`.
- [x] **Post-call sales spec package (research-first)** — strict 3-phase workflow completed: external-only research (`docs/post-call-sales-research.md`), audience-specific insights (`docs/post-call-sales-audience-insights.md`), and synthesis PRD/SPEC (`specs/2026-06-post-call-sales/*`).

## In progress

- [x] **Shelly Sood follow-up** — dual enroll pages, FAQ bank, email draft ([`docs/leads/shelly-sood-context.md`](../docs/leads/shelly-sood-context.md)); owner: CRM attended_at + send email + deploy
- [x] **Standard enroll FAQ bank** — `lib/standard-enroll-faq-bank.ts` with per-lead presets (Shelly pages)
- [ ] **`/enroll` post-payment onboarding spec** — [`specs/2026-06-enroll-onboarding/SPEC.md`](../specs/2026-06-enroll-onboarding/SPEC.md) (PRD + CHECKOUT-TRUTH + SPEC drafted 2026-06-11; **awaiting Brianna approval before implementation**)
- [ ] `/enroll` implementation WIP in working tree (5-step light-surface shell; needs spec-aligned 3-step + Stripe receipt)
- [ ] Mobile cold-traffic funnel stabilization (`specs/2026-06-mobile-cold-traffic-funnel/SPEC.md`) — Phases A/B/C
- [ ] Phase B: `POST /api/funnel/lead` + Supabase + Klaviyo + TCPA on contact
- [ ] Default (son) prep-path triptych art asset
- [ ] Launch QA: Meta IAB 390×844, Lighthouse baseline
- [ ] Post-call sales pages implementation from `specs/2026-06-post-call-sales/SPEC.md` (spec complete; build not started in this pass)

## Backlog

- [ ] PostHog funnel dashboard + step completion rates
- [ ] Optional: dedicated 680×510 panel PNGs (`USE_DEDICATED_PREP_PATH_PANELS`)
- [ ] Optional interstitials: INT5, INT9, INT10
- [ ] Remove schools step from routing (if approved)
- [ ] CI job running `npm run agent:verify` on PRs
- [ ] Remove `noindex` on `/satplan` at launch

## Known issues

- Contact form on main site shows error until `RESEND_API_KEY` is configured (by design)
- Funnel contact saves to sessionStorage only — no server lead row yet
- Funnel layout CSS guarded by `FUNNEL_LAYOUT_UNLOCK=1` in CI
