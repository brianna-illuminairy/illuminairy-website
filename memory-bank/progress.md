# Progress

*Last updated: 2026-05-24*

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
- [x] **SAT plan funnel** at `/satplan` (ADR 0009)
- [x] Funnel spine: landing, worries, who, target, INT1 trust, history, INT3 retake, prep
- [x] **INT8** prep comparison: stub + 4-step trilogy (`prep_class`), mentorship splash, contrast bars, triptych (girl variant for daughter/Me)
- [x] `satPrepComparison` + Bloom chart title in `lib/site.ts`
- [x] Shared `ContrastBarChart`; INT3 + INT8 proof charts

## In progress

- [ ] SAT plan funnel: GPA question + INT2; hours/score/wrong; contact → report → book (quizfunnel SPEC Phase A tail)
- [ ] Default (son) prep-path triptych art asset

## Backlog

- [ ] PostHog funnel dashboard + step completion rates on new INT8 beats
- [ ] `POST /api/funnel/lead` + Supabase + Klaviyo (Phase B)
- [ ] Optional: dedicated 680×510 panel PNGs (`USE_DEDICATED_PREP_PATH_PANELS`)
- [ ] INT12 format contrast visual
- [ ] CI job running `npm run agent:verify` on PRs
- [ ] Remove `noindex` on `/satplan` at launch

## Known issues

- Contact form shows error until `RESEND_API_KEY` is configured (by design)
- `gpa-stub` is placeholder — back nav returns to last INT8 step
- Funnel layout CSS guarded by `FUNNEL_LAYOUT_UNLOCK=1` in CI
