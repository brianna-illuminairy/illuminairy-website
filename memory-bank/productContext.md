# Product context

## Audiences

1. **Parents & students (SAT)** — Ambitious high schoolers targeting August 22, 2026 SAT; want structure, named mentors, weekly visibility.
2. **Future: professionals** — “AI for Professionals” (Q3 2026, not live).
3. **Future: business** — Programs TBD on `/programs`.
4. **Mentor applicants** — `/contact?reason=mentor`; vetted manually; interview link sent by email only.

## Live product: SAT Accelerator

| Attribute | Value (see `lib/site.ts`) |
|-----------|---------------------------|
| Duration | 12 weeks |
| Live classes | 2×/week (R&W + Math) |
| 1:1 sessions | 6 private sessions |
| Class cap | 10 per class |
| Tuition | $1,200 (`tuitionCents: 120_000`) |
| Program start | May 27, 2026 |
| Exam | August 22, 2026 |

**Positioning:** Structured plan with week-one diagnostics, live teaching, assigned practice, weekly family reports—not Khan Academy-style self-study, not random hourly tutoring.

## Funnel

1. Discover (SEO, referrals, content)
2. `/sat-accelerator` → understand program
3. Book consultation → `/contact#schedule` (public Calendly)
4. Enroll → `/enroll` (Stripe Checkout after consultation)
5. Success → `/enroll/success`

## Voice (summary)

- Illuminate + guide; warm, clear, confident without hype
- Parent-friendly; avoid jargon like “cohort”
- Proof-oriented (mentor credentials, structure, reports)—see full rules in `docs/brand-voice-and-positioning.md`

## Canonical copy

Implementation source: **`lib/site.ts`** — must stay aligned with brand docs when marketing changes.

## Competitor context (adjacent)

**Curious Cardinals** — mentorship / passion-project / college-narrative platform (not direct SAT prep). May 2026 pivot to **FlightPlan**. Illuminairy matches their **parent-trust mechanics** (narrative, content, outcomes, mentor visibility) with **SAT program proof**; we do not copy their product story or unbacked scale claims. Full intel: `docs/competitor-intel-curious-cardinals.md`. Site mirror: git branch `archive/curious-cardinals-2026-05-18`.
