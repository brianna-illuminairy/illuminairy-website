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

| Stage | PostHog (`LabPostHogEvents`) | GA4 (`LabGa4Events`) | Klaviyo | Meta CAPI |
|-------|------------------------------|----------------------|---------|-----------|
| Phone verified | `lab_phone_verified` | `lab_phone_verified` | — | — |
| Lead saved (b-book) | `lab_lead_submitted` | `lab_lead_submitted` | Lab Lead Submitted | Lead |
| Free lesson booked | `lab_lesson_booked` | `lab_lesson_booked` | Free Lesson Booked | Schedule |
| Lesson attended | `lab_lesson_attended` | `lab_lesson_attended` | Free Lesson Attended | FreeLessonAttended |
| Portal login | `lab_portal_login` | `lab_portal_login` | — | — |

Touch events mirror: `lab_phone_verified`, `lab_lead_submitted`, `lab_lesson_booked`, `lab_lesson_attended`.

## PostHog filters

- Scope URL: `$current_url ILIKE '%/plan-b%'` OR rewrite target `/quiz-b`
- Exclude internal emails (same list as Plan Builder A playbook)
- Break down by `plan_builder_variant`, `school_referral`, `utm_campaign`

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
- `lead_calls.call_type = 'free_lesson'` for Calendly free lesson event
- Calendly webhook detects free lesson via `lib/calendly/free-lesson-event.ts`

## Guard

```bash
npm run funnel:b-booking-guard
```

Wired into `npm run agent:verify`.
