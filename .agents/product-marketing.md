# Product Marketing Context — Illuminairy

*Last updated: 2026-06-01 · Canonical strategy: [`growth/funnel-strategy.md`](../growth/funnel-strategy.md) · Copy rules: [`docs/messaging-guide.md`](../docs/messaging-guide.md)*

**Agents:** Read this file before other [marketingskills](https://github.com/coreyhaines31/marketingskills) tasks. **Illuminairy messaging guide always wins** over generic marketing advice (banned phrases, stats source, product names).

## Product Overview

**One-liner:** Diagnostic-first SAT mentorship for parents who want a credible improvement plan before committing to a program.

**What it does:** Illuminairy helps parents of ambitious high schoolers get a free **SAT Improvement Plan** (~2 min, no child test), then a **SAT Strategy Call**, **Skill Diagnostic**, and an activated **personalized weekly plan** with near-peer mentors (Georgia Tech, 1450+ SAT).

**Product category:** Premium SAT test-prep / mentorship (not self-serve apps, not generic tutoring marketplaces).

**Product type:** B2C service — 12-week **SAT Accelerator** cohort (August 22, 2026 SAT).

**Business model:** Paid program after consult; tuition from `lib/site.ts` ($1,200 display). Top of funnel is **free** Plan Builder + Strategy Call.

## Target Audience

**Target companies:** N/A (B2C parents).

**Decision-makers:** Parent (often mom), 42–57, affluent suburban, college-educated; researches for 10th–12th grader targeting selective / merit-aid-sensitive schools.

**Primary use case:** Child’s SAT doesn’t match GPA or school-list ambition; past Khan/class/tutor attempts didn’t move the score.

**Jobs to be done:**
- Is meaningful improvement still realistic for *my* child?
- Give me a **credible plan I can share** (spouse/student) before I pay for tutoring.
- Show transparent next steps and weekly visibility.

**Use cases:** GPA–SAT mismatch; Khan/Bluebook plateau; August deadline urgency; wants one plan vs five apps.

## Personas

| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| Catherine (primary) | School list, merit aid, control | Skeptical of another tutoring pitch | Free Improvement Plan + honest projection |
| Student (secondary) | Less work, believable path | Overwhelmed by SAT breadth | 5–6 skills, not whole test |
| Spouse (influencer) | ROI, proof | Needs artifact to align | Shareable plan doc |

## Problems & Pain Points

**Core problem:** SAT covers everything; score movement is usually **5–6 recurring skills** — parents don’t know which or whether improvement is realistic.

**Why alternatives fall short:**
- Khan / Bluebook — breadth, no ranked skill order for *their* misses
- Group class — one syllabus for everyone
- Scattered tutors — no diagnostic-first weekly plan

**What it costs them:** Wrong 3 months of practice, list/merit anxiety, decision fatigue.

**Emotional tension:** “Is it still fixable?” “I need something concrete, not another sales call.”

## Competitive Landscape

**Direct:** Large prep brands — volume, not personalized diagnostic + parent visibility.

**Secondary:** Khan, Princeton Review DIY — cheap but opaque on *their* gaps.

**Indirect:** Private tutors — expensive black box without shareable plan artifact.

## Differentiation

**Key differentiators:** Starter **Improvement Plan** artifact; proctored **Skill Diagnostic**; mistake-driven 5–6 skill focus; weekly parent reports; Georgia Tech mentors 1450+.

**How we do it differently:** Plan Builder → Strategy Call → Skill Diagnostic → activated weekly plan (same doc evolves).

**Why customers choose us:** Clarity, focus, accountability — not more content hours.

## Objections

| Objection | Response |
|-----------|----------|
| Another tutoring program? | Start with free plan + projection; call is advisory, not enrollment |
| Online won’t work | Same test, recent-scorer mentors; proctored diagnostic |
| Too late for August | Strategy Call maps timeline; stats show focus beats breadth (Results vary) |
| Score guarantees? | No guarantees; program structure + diagnostic-first |

**Anti-persona:** DIY-only, no tutoring budget, student-only “study plan generator” SEO.

## Switching Dynamics

**Push:** Disappointing PSAT/SAT, wasted Khan hours.

**Pull:** Free plan in 2 min, looks real, spouse-shareable.

**Habit:** Default to free apps.

**Anxiety:** Paid offer too early — use **staged disclosure** on LP (plan first, program detail after quiz).

## Customer Language

**How they describe the problem:**
- “High GPA, low SAT”
- “We tried Khan but nothing moved”
- “I don’t know where to start”

**Words to use:** Improvement Plan, score projection, Strategy Call, Skill Diagnostic, personalized weekly plan, your child, Results vary.

**Words to avoid:** quiz, assessment (bare), prep (noun), score guarantee, point leak, blueprint, fit call, free quiz.

**Glossary:**

| Term | Meaning |
|------|---------|
| SAT Improvement Plan | Plan Builder output (~2 min) |
| SAT Strategy Call | Free 15 min parent call |
| Skill Diagnostic | Proctored ~2 hr 14 min after call |
| Plan Builder | `/plan` entry (`/quiz` redirects) |

## Brand Voice

**Tone:** Warm, clear, parent-facing — mom-to-mom OK in UGC; not lecture-hall prep tropes.

**Style:** Specific numbers from `lib/site.ts` only; honest illustrative labels until diagnostic.

**Personality:** Guiding light, clarity, near-peer mentors — not “AI tutor” headline.

## Proof Points

**Metrics:** n=95 completers, avg +182, 78% hit target; first-month 90% at 20–28 hrs / 5–7 hrs/week — always “Results vary.”

**Value themes:**

| Theme | Proof |
|-------|-------|
| Focus beats breadth | 5–6 skills vs 200+ Khan topics |
| Parent visibility | Weekly reports |
| Realistic path | Improvement Plan + projection |

## Goals

### Funnel-wide conversion principle

One promise end-to-end: free **SAT Improvement Plan + score projection** (~2 min, parent, no child test) → **SAT Strategy Call** → **Skill Diagnostic** → activated **personalized weekly plan**. Cold surfaces use **staged disclosure** (plan-first; program/tutor detail after Plan Builder). Stats only from `lib/site.ts`; always **Results vary**.

**Business goal:** Cold UGC → Plan Builder completion → Strategy Call booked → show → enroll.

**Conversion actions (in order):**
1. Meta ad → `https://illuminairy.com/sat-plan-builder?…` (UTMs per `meta-live-creatives.ts`; `npm run marketing:ad-urls`)
2. LP hero CTA → `/plan?step=q1-parent-child` (UTMs preserved)
3. Book SAT Strategy Call on s5 (after `PLAN_BUILDER_BOOKING_LIVE=1` + mobile QA)
4. Skill Diagnostic Week 1 → program enrollment

**Current metrics:** PostHog funnel in `growth/posthog-funnel-dashboard.md`.

## Repo pointers (for agents)

| Topic | Path |
|-------|------|
| Funnel strategy | `growth/funnel-strategy.md` |
| Icon + Meta + UGC | `growth/icon-fall-sat-2026.md` |
| LP copy rules | `growth/b3-lp-staged-disclosure-copy.md` |
| Klaviyo | `docs/klaviyo-quiz-funnel-nurture.md` |
| Facts / tuition | `lib/site.ts` |
