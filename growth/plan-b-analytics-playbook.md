# Plan Builder B analytics playbook

Brief reference for `/plan-b` (lab funnel) event names and analysis scope.

## Funnel identity

| Property | Value |
|----------|--------|
| PostHog / touch `funnel` | `sat_quiz_b` |
| `funnel_id` / CAPI custom | `plan_builder_b` |
| `plan_builder_variant` | `b` |

## Live LP entry (ad3 tutor HD)

Meta destination (same as `npm run marketing:ad-urls` → `ad3_before_tutoring_hd1080`):

`sat-plan-builder?utm_source=meta&utm_medium=paid_social&utm_campaign=c1_sat_plan_builder_cold_creative_test&utm_content=ad3_before_tutoring_hd1080&utm_term=broad_moms_35_58&hook=tutor&version=hd1080`

Hero CTA on that URL routes to **`/plan-b`** (not `/plan`). Other creatives still route to `/plan` unless `?pb=b`.

## Canonical events

| Stage | PostHog | GA4 | Klaviyo | Meta (pixel + CAPI) |
|-------|---------|-----|---------|---------------------|
| Funnel start | `quiz_started`, `quiz_session_started` | `quiz_started`, `quiz_session_started` | — | — |
| Step view | `plan_builder_b_step_viewed` | `quiz_step_view` (tagged `funnel=plan_builder_b`) | — | — |
| Computing popups | `lab_computing_popup_answered` | `lab_computing_popup_answered` | — | — |
| Phone verified | `lab_phone_verified` | `lab_phone_verified` | — | — |
| Lead saved (phone verified) | `lab_lead_submitted` | `lab_lead_submitted` | Lab Lead Submitted | Lead (`event_id=lab_lead_{leadId}`) |
| Free lesson booked | `lab_lesson_booked` + `quiz_booking_confirmed` | `lab_lesson_booked` | Free Lesson Booked | Schedule (`event_id=schedule_<inviteeId>`) |
| Share link | `lab_lesson_link_shared` | `lab_lesson_link_shared` | — | — |
| Lesson attended | `lab_lesson_attended` | `lab_lesson_attended` (server milestone) | Free Lesson Attended | FreeLessonAttended |
| Portal login | `lab_portal_login` | `lab_portal_login` | — | — |

Touch events mirror client milestones: `quiz_step_view`, `lab_phone_verified`, `lab_lead_submitted`, `lab_lesson_booked`, `lab_lesson_link_shared`, `lab_lesson_attended` (server).

## Meta dedupe

- **Lead:** client pixel + CAPI use stable `lab_lead_{leadId}` at phone verify (no timestamp suffix).
- **Schedule:** client pixel + CAPI use `schedule_<calendly_invitee_id>` (no timestamp suffix).

## Smoke checklist

```bash
node scripts/funnel-b-analytics-smoke.mjs
```

## PostHog filters

- Prefer `properties.offer_goal = 'free_lesson'` or `properties.funnel_id = 'plan_builder_b'` (after 2026-08-03 deploy)
- Scope URL: `$current_url ILIKE '%/plan-b%'` OR rewrite target `/quiz-b`
- Exclude internal emails (same list as Strategy Call playbook)
- Break down by `offer_goal`, `plan_builder_variant`, `school_referral`, `utm_campaign`
- Parallel comparison dashboard: [Dual funnel — Strategy Call vs free lesson](https://us.posthog.com/project/428901/dashboard/1945968) — see [`posthog-funnel-dashboard.md`](posthog-funnel-dashboard.md) § Dual funnel

## APIs

| Route | Purpose |
|-------|---------|
| `POST /api/funnel-b/lead` | Lead upsert (`sat_quiz_b`) |
| `POST /api/funnel-b/phone/send` | Twilio Verify SMS |
| `POST /api/funnel-b/phone/verify` | Twilio Verify check |
| `GET /api/funnel-b/calendly-availability` | Free lesson slots |
| `POST /api/funnel-b/calendly-book` | Book + `portal_session` cookie + Klaviyo `Free Lesson Booked` |

## Welcome email (post-book)

Sent via **Resend** when a free lesson is booked (`lib/crm/lab-lesson-welcome-email.ts`). Calendly handles calendar invite + reminders.

| Field | Value |
|-------|--------|
| Subject | `Welcome to Illuminairy: SAT Session Link` |
| Includes | Google Meet link, parent portal URL, share-with-student instructions |
| Dedupe | Calendly invitee URI |
| Docs | `docs/klaviyo-plan-b-welcome-flow.md` |

## CRM

- `leads.plan_builder_variant = 'b'`
- `leads.student_grade` from `q-grade` answer (9th–12th grade label)
- `quiz_answers.qGrade` on visitors + leads (synced on every step via `quiz_progress_sync`)
- `lead_calls.call_type = 'free_lesson'` for Calendly free lesson event
- Calendly webhook detects free lesson via `lib/calendly/free-lesson-event.ts`

## Guard

```bash
npm run funnel:b-booking-guard
```

Wired into `npm run agent:verify`.
