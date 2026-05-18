# PRD: SAT conversion funnel (Georgia paid + mobile)

- **Author:** Illuminairy / agent
- **Date:** 2026-05-18
- **Status:** approved (implementation in progress)

## Problem

Paid Meta + Google traffic needs a **single conversion path** (matched LP → intake → consult → enroll) isolated from the legacy marketing site. Parents arriving after a disappointing May score need message match, honest positioning, and thumb-friendly intake.

## Audience

Georgia parents of **11th graders** targeting **UGA, Georgia Tech, Emory** and August 22, 2026 SAT. HHI $150k+; self-study (Khan/Bluebook) often failed to produce list-competitive scores.

## North star

**Paid enrollments** for SAT Accelerator at `satProgram.tuitionDisplay` ([`lib/site.ts`](../../lib/site.ts)).

| Metric | Source | Week-1 target (set baseline after launch) |
|--------|--------|-------------------------------------------|
| LP → intake start | PostHog `funnel_cta_click` / `funnel_landing_view` | > 25% |
| Intake completion | `intake_completed` / starts | > 60% |
| Intake → consult booked | Calendly | > 40% |
| Consult show | Calendly | > 70% |
| CPE | Ad spend / enrollments | TBD |

## Scope

### In scope

- `funnel/` module: campaign kits, copy, landing variants, email copy, `track.ts`, `campaigns.ts`, `utm.ts`
- Routes: `/go/sat`, `/get-started`, `/get-started/schedule`, `/get-started/complete`, `/tools/georgia-list-fit` under `app/(funnel)/`
- Campaign kits: `control`, `trigger-may-score` (full); stubs for `trigger-gpa-mismatch`, `trigger-no-nag`, `trigger-post-finals`, `trigger-aug-registered`
- PostHog + GA4 funnel events; UTM persistence
- Georgia List Fit Check (SAT vs flagship bands, middle-50% education)
- Klaviyo flow copy in `funnel/email/sequences/`
- Parent voice research: [`docs/research/parent-voice-social-listening-2026-05.md`](../../docs/research/parent-voice-social-listening-2026-05.md)

### Out of scope

- Homepage or `/sat-accelerator` as ad destinations
- Score guarantees; admission promises
- National ad geo (Georgia v1)
- Tutor Calendly on public pages

## Scarcity (real only)

| Claim | Ops truth |
|-------|-----------|
| Class cap | Max **10 per class** — sync seat count in ops doc; public copy: “limited seats” only when true |
| Program start | **May 27, 2026** from `lib/site.ts` |
| Consult bandwidth | Founder calendar — “limited consultation slots this week” only if Calendly reflects it |

No fake countdowns or “X parents viewing.”

## Launch gate

**No ad spend** until: kit + LP message-match QA on phone (Meta preview + Google mobile ad → LP headline within 3s).

## Consult → enroll (human)

| Outcome | Tag | Email |
|---------|-----|-------|
| Enrolled | `customer` | Welcome (future) |
| Thinking | `opportunity` | Flow 03 + 48h follow-up |
| Not a fit | `disqualified` | Kind close |

See `funnel/email/sequences/` and appendix in SPEC.

## References

- Plan: SAT Conversion Funnel (Cursor)
- Copy research: `docs/research/parent-voice-social-listening-2026-05.md`
- List fit tool: `docs/research/list-fit-check-tool.md`
- SEO ICP: `docs/seo-georgia-parent-icp.md`
