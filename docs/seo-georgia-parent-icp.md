# SEO: Georgia parent ICP (rising juniors → UGA / Georgia Tech / Emory)

*Last updated: 2026-05-18. Refresh score bands when UGA, GT, or Emory publish new admit profiles.*

## ICP summary

| Attribute | Detail |
|-----------|--------|
| Buyer | Parent (often 43–55, HHI $150k+), Georgia-based |
| Student | 11th grade / rising senior, ambitious |
| Goal | Meaningful SAT gain over summer (often framed as ~150+ points) |
| Schools | UGA, Georgia Tech, Emory (flagship Georgia selective set) |
| Product fit | SAT Accelerator — May 27 start, Aug 22, 2026 exam, $1,200, GT mentors 1450+, weekly parent reports |

## Canonical score bands (cite in all magnets)

| School | Middle 50% SAT (total unless noted) | Source | As of |
|--------|-------------------------------------|--------|-------|
| UGA | 1360–1500 | [UGA Admissions blog — Class of 2026 admits](https://admissions.uga.edu/blog/2026-final-freshman-admit-decisions/) | Mar 2026 |
| Georgia Tech | 1370–1530 composite (50th: 1460) | GT Common Data Set 2024–25 | 2024–25 cycle |
| Emory College | ~1480–1540 composite; R&W 740–770, Math 760–800 | [Emory Class of 2029 profile](https://apply.emory.edu/discover/about/first-year.html) | Fall 2025 enroll |

**Emory:** Test-optional; bands reflect students who **submitted** scores, not all enrolled students.

**UGA:** Bands use admits where SAT was strongest or only test submitted.

## Honest “+150 in one summer” framing

| Starting band | Summer goal framing |
|---------------|---------------------|
| ~1100–1250 | 100–150+ points plausible with 80–120+ focused hours over ~12 weeks |
| ~1260–1350 | Targeted gains toward UGA/GT mid-band; section-specific work |
| ~1360–1450 | “Protect and push” — pacing, Module 2, math precision; not blanket +150 |
| 1450+ | Fine-tuning; Emory often needs 1500+ submitter range |

**Never:** guarantee language, “get into UGA,” admission promises.

## Keyword clusters

### Tier 1 (guides + magnets)

| Cluster | Example queries | Asset |
|---------|-----------------|-------|
| UGA SAT | UGA SAT score, SAT for UGA with 3.8 GPA, what SAT score for UGA | `/go/guide/uga-sat-score` — H1: **school + SAT + GPA** (not “your child”) |
| Georgia Tech SAT | Georgia Tech SAT score, SAT for Georgia Tech GPA, Tech Math SAT | `/go/guide/georgia-tech-sat-score` |
| Emory SAT | Emory SAT score, Emory SAT 3.9 GPA, Emory test optional SAT | `/go/guide/emory-sat-score` |
| Rising junior summer | August SAT study plan, SAT study plan before August test | `/go/guide/rising-junior-summer-timeline` |
| 150-point realism | raise SAT 150 points summer, how many hours SAT prep | Section in flagship guide + timeline |
| Digital SAT pacing | SAT Module 2 running out of time, practice score higher than real | `/go/guide/module-2-pacing-check` |

### Tier 2 (blog spokes)

| Cluster | Example queries | Asset |
|---------|-----------------|-------|
| Pacing | pacing mistakes SAT, Module 2 time | `/blog/pacing-mistakes-that-cost-points` |
| Test policy | Emory test optional SAT, UGA SAT policy | Future post — link official pages |
| Comparison | SAT class vs tutor Atlanta | Magnet #4 (checklist) — future |

### Tier 3 (avoid)

- Thin “SAT tutor Atlanta” directory pages
- “Guaranteed 150 point increase” titles
- Generic SAT checklist-only pages (College Board owns)

## Lead magnets (live on site)

| # | Slug | URL | Klaviyo `custom_source` |
|---|------|-----|-------------------------|
| 1 | `uga-sat-score` | `/go/guide/uga-sat-score` | `lead_magnet:uga-sat-score` |
| 2 | `georgia-tech-sat-score` | `/go/guide/georgia-tech-sat-score` | `lead_magnet:georgia-tech-sat-score` |
| 3 | `emory-sat-score` | `/go/guide/emory-sat-score` | `lead_magnet:emory-sat-score` |
| 4 | `rising-junior-summer-timeline` | `/go/guide/rising-junior-summer-timeline` | `lead_magnet:rising-junior-summer-timeline` |
| 5 | `module-2-pacing-check` | `/go/guide/module-2-pacing-check` | `lead_magnet:module-2-pacing-check` |
| 4 | `georgia-list-fit` | `/tools/georgia-list-fit` | `lead_magnet:georgia-list-fit` (optional email gate phase 1b) |

Post-download: `/go/guide/[slug]/download` (print / Save as PDF). Legacy `/guides/*` 301s to `/go/guide/*`.

## Funnel

```
Organic / referral → Guide landing (email gate) → Klaviyo + download
  → Nurture (see docs/klaviyo-magnet-nurture.md) → /get-started → /get-started/schedule → Calendly → enroll
```

## Brand guardrails

- Parent-first PDFs, not student cram sheets
- Say **selective universities** in body; school names in H1/titles for SEO OK with citations
- No banned phrases per `.cursor/rules/banned-copy-phrases.mdc` (no “prep,” “journey,” “unlock,” negative-only headlines)
- Facts: `lib/site.ts`, scores: `lib/georgia-flagship-scores.ts`

## Success metrics (90-day)

| Metric | Notes |
|--------|-------|
| Organic impressions | GSC: flagship + August SAT study plan queries |
| Magnet conversion | PostHog `lead_magnet_submitted` / pageviews |
| Email → consult | Klaviyo → Calendly bookings |
| Consult → enroll | Existing Stripe funnel |

## Maintenance

1. Re-check UGA blog each March after final admits post
2. Refresh GT CDS annually
3. Refresh Emory first-year profile each fall
4. Update `lib/georgia-flagship-scores.ts` and guide copy together
