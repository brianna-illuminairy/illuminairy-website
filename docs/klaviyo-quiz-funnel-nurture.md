# Klaviyo — Plan Builder nurture + show-up

*Manual setup in Klaviyo. Code fires server events from [`app/api/funnel/lead/route.ts`](../app/api/funnel/lead/route.ts) and [`lib/crm/calendly-webhook.ts`](../lib/crm/calendly-webhook.ts).*

**SMS copy:** [`growth/2026-06-strategy-call-sms.md`](../growth/2026-06-strategy-call-sms.md)

## Profile properties (set on events)

| Property | When |
|----------|------|
| `q1`–`q9`, `promised_gain_pts`, `showed_gpa_gap`, `weeks_until_test`, `sat_lp_variant`, `funnel` | `Quiz Lead Submitted` |
| `quiz_furthest_step`, `resume_plan_url` | Lead + nurture CTAs (deep link to `/plan?step=…`) |
| `utm_campaign`, `utm_source`, `utm_content`, `first_touch_utm_campaign` | Attribution segments |
| `strategy_call_at` | `Quiz Call Booked` (ISO datetime — use for Flow D delays) |
| `calendly_uri` | Booking |

Properties are built in [`lib/klaviyo-quiz-props.ts`](../lib/klaviyo-quiz-props.ts).

## Flow B2 — Quiz abandon (pre-lead, email known only)

**Note:** Anonymous abandons live in Supabase `visitors` for Meta retargeting. Klaviyo Flow B2 applies only after you capture email (e.g. partial lead save in a future spec).

**Trigger (manual segment or future cron):** profile has `quiz_furthest_step` ≥ `q3` and has not done `Quiz Lead Submitted`.

**CTA:** `{{ person.resume_plan_url|default:'https://illuminairy.com/plan?step=q1' }}`

**Subject variants:**
- `weeks_until_test` ≤ 8: "August timeline: pick up your Improvement Plan"
- `showed_gpa_gap` = yes: "Your child's SAT plan is saved — finish the Plan Builder"

## Flow B — Lead, no call booked

**Trigger:** Metric `Quiz Lead Submitted`  
**Filter:** Has not done `Quiz Call Booked` or `Consultation Booked` in last 7 days

| Delay | Subject | Preview text | Body | CTA |
|-------|---------|--------------|------|-----|
| 1 hour | Finish booking your SAT Strategy Call | Your starter Improvement Plan is ready — book the free 15-min call. | You have a starter **SAT Improvement Plan** from the Plan Builder. The free 15-minute **SAT Strategy Call** confirms your score projection and schedules Week 1 **Skill Diagnostic**. | `https://illuminairy.com/plan?step=s5` |
| 24 hours | Still realistic for your child? | Movement usually comes from 5–6 skills — not the whole test. | GPA–SAT mismatch is common. Movement usually comes from **5–6 skills**, not the whole test. Results vary. | Book your free SAT Strategy Call → `https://illuminairy.com/plan?step=s5` |
| 72 hours | What Week 1 looks like | Skill Diagnostic after your call — not on the call itself. | Mon/Wed **Skill Diagnostic** (proctored), Fri personalized plan review — **after** your SAT Strategy Call. | Book your free SAT Strategy Call |
| 7 days | August timeline | If they're aiming for Aug 22, timing matters. | If they're aiming for Aug 22, timing matters. Illuminairy completers: focused path, weekly parent visibility — Results vary. | Book your free SAT Strategy Call |

## Flow C — Booked confirmation (immediate)

**Trigger:** `Quiz Call Booked`

**Subject:** You're booked — SAT Strategy Call

**Preview text:** Check your calendar invite for time and link. Parent on the call.

**Body:**

- Hi {{ first_name|default:"there" }},
- Your **SAT Strategy Call** is scheduled for {{ person.strategy_call_at|date:"F j, Y g:i A" }} (check your calendar invite for the exact link).
- **Before the call:** accept the calendar invite; have recent SAT/PSAT scores and target schools handy; **a parent should be on the call** (your child can join).
- The proctored **Skill Diagnostic** is **after** this call — not on the call itself.
- We'll send reminders 24 hours and 1 hour before (email and SMS if you opted in).
- — Illuminairy

*Aligns with [`BEFORE_STRATEGY_CALL_STEPS`](../lib/quiz-funnel/thank-you-copy.ts) on the booked screen.*

## Flow D — Show-up reminders

**Trigger:** `Quiz Call Booked`  
**Timing:** Relative to profile property **`strategy_call_at`**

| When | Channel | Subject | Preview text | Body |
|------|---------|---------|--------------|------|
| T-24h | Email | Tomorrow: your SAT Strategy Call | Time + link in your calendar invite. | Hi {{ first_name|default:"there" }}, your **SAT Strategy Call** is tomorrow at {{ person.strategy_call_at|date:"g:i A" }} (see calendar invite for link). **A parent should be on the call** — bring recent SAT/PSAT scores and target schools. Your child can join. The **Skill Diagnostic** is scheduled after this call. |
| T-1h | Email + SMS (if phone) | Starting in 1 hour | Open your calendar invite for the link. | Your **SAT Strategy Call** starts in one hour. Use the link in your calendar invite to join. Reschedule from that invite if needed. |
| T-10m | SMS optional | In 10 minutes | — | See [`growth/2026-06-strategy-call-sms.md`](../growth/2026-06-strategy-call-sms.md) |

**Note:** Enable Calendly native email/SMS reminders on the event type as backup. Funnel `booked` screen promises Klaviyo reminders — both should be on.

## Flow E — Cancel / no-show

**Trigger:** `Quiz Call Canceled`  
**Action:** Suppress Flow D; optional single reschedule email:

**Subject:** Reschedule your SAT Strategy Call  
**Preview text:** Pick a new time — your Improvement Plan is still saved.  
**Body:** Hi {{ first_name|default:"there" }}, your Strategy Call was canceled. Your starter **SAT Improvement Plan** is still saved. Book a new time when you're ready: `https://illuminairy.com/plan?step=s5`

## Calendly ops checklist

- [ ] Event type: phone required
- [ ] Confirmation email ON
- [ ] Reminder emails ON (24h, 1h)
- [ ] SMS reminders ON (uses `smsReminderNumber` from embed)
- [ ] Webhook `invitee.created` / `invitee.canceled` → production URL
- [ ] `CALENDLY_WEBHOOK_SIGNING_KEY` + `KLAVIYO_PRIVATE_API_KEY` on Vercel prod

## Test plan

1. Personal email through `/plan` → s5 → verify `Quiz Lead Submitted` + profile properties.
2. Book test slot → verify `Quiz Call Booked` + `strategy_call_at` on profile.
3. Confirm Flow C sends immediately; Flow D scheduled (or send test profiles in Klaviyo).
4. Cancel test → `Quiz Call Canceled`; reminders stop.
