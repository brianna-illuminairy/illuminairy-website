# Funnel question comparison

Side-by-side of what each live funnel asks. URLs are unchanged; names follow [`funnel-names.md`](./funnel-names.md).

| | **Strategy Call** (`/plan`) | **Free lesson** (`/plan-b`) |
|--|-----------------------------|-----------------------------|
| Entry | Ad or homepage CTA → `/plan` | Ad → `/sat-plan-builder` LP → CTA → `/plan-b` |
| Offer | Book a 15-min Strategy Call | Book a free 45-min lesson |
| `funnel_id` | `sat_quiz` | `plan_builder_b` |
| Phone OTP | On `s5` (booking screen) | On `b-phone` (before claim / book) |

## Shared intake questions (same IDs, often same copy)

Both ask these (free lesson inserts **grade** earlier and skips several Strategy Call–only slides):

| Step | Question (parent voice) | Strategy Call | Free lesson |
|------|-------------------------|---------------|-------------|
| `q1-parent-child` | Who needs SAT help? (My child / Me) | Yes | Yes |
| `q-grade` | What grade is the student in? | No | **Yes** |
| `q-score-lower` | Did their SAT score come back lower than expected? | Yes | Yes |
| `q1` | What feels most urgent right now? | Yes | Yes |
| `q2` | Stakes / what’s on the line | Yes | Yes |
| `q3` | How many times taken (SAT / PSAT / none) | Yes | Yes |
| `q4` | Recent / practice score band | Yes (skipped if `q3=none`) | Yes |
| `q-doubts` | Parent doubts (multi) | Yes (parent path only) | **No** |
| `q5` | Next SAT date | Yes | Yes |
| `q6` | What’s the problem? (multi: math, R&W, …) | Yes | Yes |
| `q7` | What have they tried? (Khan, class, …) | Yes | **No** |
| `q9` | GPA band | Yes | Yes |
| `q8` | Goal score | Yes | Yes |
| `q-school-referral` | School / how they heard | No | **Yes** |

## Strategy Call–only slides (after intake)

Insights and plan machinery that free lesson does not show:

| Step | Type | What it is |
|------|------|------------|
| `i-steps` | Insight | How Illuminairy works (steps) |
| `hit-q3-none` | Insight | *Conditional* — no prior test |
| `doubts-insight` | Insight | *Conditional* — after doubts |
| `hit-outcome-month-one` | Insight | First-month outcome |
| `hit-q5-tbd` | Insight | *Conditional* — date TBD / far out |
| `hit-q7` | Insight | After “what they’ve tried” (Khan path) |
| `i-diag` | Insight | Skill Diagnostic |
| `i-compare` | Insight | Compare approach |
| `achievability` | Rating | Goal score achievability (pre-name) |
| `i-gap` | Insight | *Conditional* — GPA vs score gap |
| `name` | Question | Parent / student name |
| `i2` | Bridge | Pre-plan |
| `v1` | **Plan reveal** | Personalized SAT plan |
| `s4` | Handoff | Post-reveal handoff |
| `s5` | Booking | Calendly + **phone OTP** → Strategy Call |

## Free lesson–only slides (after intake)

| Step | Type | What it is |
|------|------|------------|
| `b-computing` | Social proof | Computing + reviews |
| `b-plan-ready` | Plan preview | Plan ready + parent proof |
| `b-email` | Lead | Email |
| `b-zip` | Lead | Zip |
| `b-target-schools` | Lead | Target schools |
| `b-regional-unlock` | Lead | Regional / partner unlock |
| `b-parent-name` | Lead | Parent name |
| `b-phone` | Lead | Phone + **OTP** |
| `b-claim` | Claim | Claim free lesson |
| `b-book` | Booking | Calendly free lesson |
| `b-post-*` / `booked` | Post-book | Device, share, join tip, redirect |

## Practical differences for drop-off analysis

1. Strategy Call has many insight slides between questions; free lesson runs questions then a contact block.
2. Free lesson collects email / zip / schools **before** phone; Strategy Call collects name mid-funnel and phone only at booking.
3. Free lesson has no `q7` (tried), no doubts, no plan-reveal chart (`v1`); it sells a lesson, not a Strategy Call.
4. Always filter metrics with `funnel_id` (`sat_quiz` vs `plan_builder_b`). Never sum shared event names across funnels.

Route SSOTs: `lib/quiz-funnel/quiz-route.ts`, `lib/quiz-funnel-b/quiz-route.ts`.
