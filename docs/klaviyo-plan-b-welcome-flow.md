# Plan B free lesson welcome email (Resend)

Plan Builder B sends the post-book welcome email through **Resend** (transactional). **No Klaviyo flow required.**

Calendly already sends the calendar invite plus email/SMS reminders. This email is the Illuminairy instructions message: **Google Meet link**, **parent portal link**, and **share-with-your-student** guidance.

## When it sends

Code: `lib/crm/lab-free-lesson-notify.ts` → `notifyLabFreeLessonBooked()`

Triggered from:

- `POST /api/funnel-b/calendly-book` after a successful book
- Calendly webhook (`invitee.created`) for free-lesson events

Deduped by Calendly invitee URI (`touch_events.event_type = lab_welcome_email_sent`).

## Subject

```
Welcome to Illuminairy: SAT Session Link
```

Constant: `LAB_WELCOME_EMAIL_SUBJECT` in `lib/crm/lab-lesson-klaviyo.ts`.

## Body includes

1. Session date/time (ET)
2. Note that Calendly handles calendar + reminders
3. **Google Meet link** (from Calendly payload or invitee API fetch)
4. **Parent portal URL** (`https://illuminairy.com/portal/home`)
5. Forward portal link to your student

If Meet link is not available yet, copy points parents to the portal (Join turns on ~5 min before start).

## Klaviyo

Still fires `Free Lesson Booked` for analytics/segments only. It does **not** send the welcome email.

## Env

- `RESEND_API_KEY` — required
- `RESEND_FROM_EMAIL` — e.g. `Illuminairy <notifications@illuminairy.com>`
- `CALENDLY_API_TOKEN` — optional fallback to fetch Meet link from invitee URI after book

## QA

1. Book through `/plan-b` with a test email.
2. Confirm one Resend message with subject above.
3. Confirm Meet link + portal link in body.
4. Confirm Calendly invite/reminders still arrive separately.
5. Confirm `touch_events` has one `lab_welcome_email_sent` row for that invitee URI.

Reference UI: `b-post-share` + `public/photos/gmail-welcome-sat-session-link.png`.
