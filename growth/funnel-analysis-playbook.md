# Plan Builder funnel analysis playbook

Self-serve reference for quiz drop-off analysis so we never re-audit the flow. Pairs with the always-on rule [`.cursor/rules/funnel-flow-canonical.mdc`](../.cursor/rules/funnel-flow-canonical.mdc).

Code SSOT: `lib/quiz-funnel/quiz-route.ts` (`getQuizRouteSteps`), `app/quiz/QuizRunner.tsx`, `lib/quiz-funnel/step-aliases.ts`, `lib/quiz-funnel/funnel-screen-roles.ts`, `lib/marketing/funnel-stage-labels.ts`.

## Mandatory query scoping

- Window: `timestamp >= toDateTime('2026-06-07 16:00:00')` (launch = noon ET 06/07). Nothing before this is valid (internal testing).
- Exclude internal: `ifNull(person.properties.email,'') NOT IN ('noelbrianna@gmail.com','testemil@gmail.com','testemial@gmail.com','brianna@illuminairy.com','support@illuminairy.com')`.
- Scope: `properties.$current_url ILIKE '%/plan%'`.
- Canonicalize step IDs before counting (see alias map). Never sum per-alias counts.

## Full step table

| # | step id | component | Parent sees | Notes |
|---|---------|-----------|-------------|-------|
| 1 | `q1-parent-child` | QFQWho | Who needs SAT help | entry; alias `q-who` |
| 2 | `q-score-lower` | QFQScoreLower | Score lower than expected? | |
| 3 | `q1` | QFQ1Trigger | What's most urgent | urgency |
| 4 | `q2` | QFQ2Stakes | Stakes | |
| 5 | `q3` | QFQ3TimesTaken | Times taken SAT | |
| 6 | `i-steps` | QFISteps | "Plan like Sophia's" | interstitial (explicit CTA) |
| 7 | `q4` | QFQ4RecentScore | Most recent SAT score (bands) | skipped if `q3=none` |
| 8 | `q-doubts` | QFQDoubts | What you've heard | parent only; self skips |
| 8b | `doubts-insight` | QFIDoubtsInsight | Doubts insight | conditional |
| 9 | `q5` | QFQ5Clock | Next test date | |
| 9b | `hit-q5-tbd` | QFInsightHit | No-date insight | conditional |
| 10 | `hit-outcome-month-one` | QFIHopeScreen | First-month outcome stat | |
| 11 | `q6` | QFQ6Blocker | Biggest problem (multi) | |
| 12 | `q7` | QFQ7Tried | What they've tried (multi) | |
| 13 | `hit-q7` | QFInsightHit | Prep-failure insight | |
| 14 | `i-diag` | QFIDiagnosis | Diagnosis insight | |
| 15 | `i-compare` | QFIComparePrep | Prep comparison | |
| 16 | `q9` | QFQ9GPA | GPA | |
| 16b | `hit-q8-scores` | QFInsightHit | Goal-TBD insight | conditional (q8=tbd) |
| 17 | `q8` | QFQ8Goal | Goal score | |
| 18 | `achievability` | QFSGoalAchievability | Goal score achievability rating | BEFORE name; aliases `reveal`, `s1` (NOT plan reveal); widget also on v1 |
| 18b | `i-gap` | QFIGPAGap | "Why smart kids score low" | conditional (high GPA + low band) |
| 19 | `name` | QFQName | Student first name | |
| 20 | `i2` | QFI2Compute | "Building {name}'s plan" (loading) | |
| 21 | `v1` | QFV1Projection | PLAN REVEAL ("Personalized SAT plan") | the actual plan |
| 22 | `s4` | QFS4PlanHandoff | Plan handoff | |
| 23 | `s5` | QFS5Approved | Booking screen (contact + slot) | |
| – | `quiz_lead_submitted` | – | lead saved | event |
| – | `quiz_booking_confirmed` | – | booked | event |

Conditionals and the achievability-vs-v1 facts: see the rule file.

## Alias map (SSOT: `QUIZ_STEP_ALIAS_GROUPS`)

- `q1-parent-child` <- `q-who`
- `achievability` <- `reveal`, `s1` (**goal achievability rating — NOT plan reveal**)
- Plan reveal = step **`v1` only** (no aliases). Filter `step = 'v1'` or `is_plan_reveal = true`.
- Dead pre-launch IDs (ignore): `i1`, `i-method`, `i3`, `s2`, `s3`, `s7`, `s9`, `hit-q6`, `heard`.

HogQL canonical mapping (mirror of `hogqlQuizStepCanonical()`):

```sql
CASE WHEN properties.step = 'q-who' THEN 'q1-parent-child'
     WHEN properties.step IN ('reveal','s1') THEN 'achievability'
     ELSE properties.step END
```

## utm_content alias map (SSOT: `UTM_CONTENT_ALIAS_GROUPS`)

Same creative, multiple slugs when campaigns were renamed. **Canonical = `script_5`** (ad1 concerned mom).

- `script_5` <- `concerned_mom_good_grades_low_sat`, `concerned_mom`
- New events are canonicalized at capture (`lib/attribution.ts`). Historical PostHog rows still carry legacy slugs — UNION in HogQL.

HogQL canonical mapping (mirror of `hogqlUtmContentCanonical()`):

```sql
CASE WHEN properties.utm_content = 'concerned_mom_good_grades_low_sat' THEN 'script_5'
     WHEN properties.utm_content = 'concerned_mom' THEN 'script_5'
     ELSE properties.utm_content END
```

**Active Meta ad URLs:** use `utm_content=script_5` only (see `META_LIVE_CREATIVES`).

## Reusable queries

### 1. Canonical funnel counts (distinct sessions per step)

```sql
SELECT
  CASE WHEN properties.step = 'q-who' THEN 'q1-parent-child'
       WHEN properties.step IN ('reveal','s1') THEN 'achievability'
       ELSE properties.step END AS step,
  count(DISTINCT person_id) AS sessions
FROM events
WHERE timestamp >= toDateTime('2026-06-07 16:00:00')
  AND event = 'quiz_step_viewed'
  AND properties.$current_url ILIKE '%/plan%'
  AND ifNull(person.properties.email,'') NOT IN
      ('noelbrianna@gmail.com','testemil@gmail.com','testemial@gmail.com','brianna@illuminairy.com','support@illuminairy.com')
GROUP BY step
ORDER BY sessions DESC
LIMIT 100
```

Top-of-funnel denominator: `count(DISTINCT person_id)` where `event='quiz_started'` (same scope).

### 2. Gap buckets at achievability + downstream

Start/goal use the product midpoints (q4 band -> point, q8 -> point). Gap = goal - start.

```sql
SELECT multiIf(gap=0,'0',gap<=50,'1-50',gap<=100,'51-100','101+') AS bucket,
       count() AS at_achievability,
       countIf(v1=1) AS reached_v1_reveal,
       countIf(s5=1) AS reached_booking,
       countIf(booked=1) AS booked
FROM (
  SELECT a.person_id,
    multiIf(any(a.q8s)='1250',1250,any(a.q8s)='1300',1300,any(a.q8s)='1350',1350,any(a.q8s)='1400',1400,any(a.q8s)='1450',1450,NULL)
    - multiIf(any(a.q4s)='u1000',1050,any(a.q4s)='1100-1200',1150,any(a.q4s)='1200-1300',1250,any(a.q4s)='1300-1400',1350,any(a.q4s)='1400plus',1430,NULL) AS gap,
    max(d.v1) AS v1, max(d.s5) AS s5, max(d.booked) AS booked
  FROM (
    SELECT person_id, properties.q4 AS q4s, properties.q8 AS q8s
    FROM events
    WHERE timestamp >= toDateTime('2026-06-07 16:00:00')
      AND event='quiz_step_viewed' AND properties.step='achievability'
      AND properties.$current_url ILIKE '%/plan%'
      AND properties.q4 IS NOT NULL AND properties.q8 IS NOT NULL
      AND properties.q4 != 'na' AND properties.q8 != 'tbd'
      AND ifNull(person.properties.email,'') NOT IN
          ('noelbrianna@gmail.com','testemil@gmail.com','testemial@gmail.com','brianna@illuminairy.com','support@illuminairy.com')
  ) a
  LEFT JOIN (
    SELECT person_id,
      maxIf(1, event='quiz_step_viewed' AND properties.step='v1') AS v1,
      maxIf(1, event='quiz_step_viewed' AND properties.step='s5') AS s5,
      maxIf(1, event='quiz_booking_confirmed') AS booked
    FROM events WHERE timestamp >= toDateTime('2026-06-07 16:00:00') AND properties.$current_url ILIKE '%/plan%'
    GROUP BY person_id
  ) d ON a.person_id = d.person_id
  GROUP BY a.person_id
)
GROUP BY bucket ORDER BY bucket
```

Do NOT add a "<=100 total" subtotal row next to the mutually exclusive buckets (it looks like extra bookings). Buckets `0`, `1-50`, `51-100`, `101+` are mutually exclusive and sum to the total.

### 3. Booking-screen abandonment (s5)

```sql
SELECT count(DISTINCT person_id) AS reached_s5,
       count(DISTINCT if(event='quiz_lead_submitted', person_id, NULL)) AS lead_submitted,
       count(DISTINCT if(event='quiz_booking_confirmed', person_id, NULL)) AS booked,
       count(DISTINCT if(event='quiz_booking_error', person_id, NULL)) AS hit_error
FROM events
WHERE timestamp >= toDateTime('2026-06-07 16:00:00')
  AND properties.$current_url ILIKE '%/plan%'
  AND ifNull(person.properties.email,'') NOT IN
      ('noelbrianna@gmail.com','testemil@gmail.com','testemial@gmail.com','brianna@illuminairy.com','support@illuminairy.com')
```

There are no field-level booking events yet, so s5 abandonment (which field/step) is not yet visible in data; recordings only.

## Baseline snapshot (since launch, as of 2026-06-09)

Funnel: 43 quiz starts -> 22 achievability (51%) -> 22 name -> 16 i2 -> 16 v1 plan reveal (37%) -> 16 s5 booking -> 3 booked (7%).

Leaks (largest first):
- `s5` booking screen -> booked: 16 -> 3 (silent; 0 booking errors).
- entry (who) -> `q-score-lower`: ~41 -> 32.
- `name` -> `i2`: 22 -> 16.
- `i-steps` -> `q4`: 30 -> 24 (4 bailed on the i-steps interstitial; 1 legit `q3=none` skip).

Gap at achievability (21 valid q4+q8): 0 pt = 1 (booked 0), 1-50 = 3 (0), 51-100 = 2 (1), 101+ = 15 (2). High-gap (>100) is 71% and produced 2 of 3 bookings; the only 0-gap session stalled at achievability.

Bookers (n=3): all parents; goals 1300-1450; gaps 100-400; mixed urgency/attempts. Bookers and s5 abandoners look identical on quiz answers, so the booking screen UX is the bottleneck, not the quiz inputs.

Re-run all numbers with the queries above as traffic grows; treat small-n ratios as directional.
