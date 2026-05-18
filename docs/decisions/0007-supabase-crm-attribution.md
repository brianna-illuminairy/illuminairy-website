# ADR 0007: Supabase CRM, touch log, and attribution

**Status:** Accepted  
**Date:** 2026-05-18

## Context

Illuminairy needs a sales pipeline (consult → enroll), marketing attribution (UTMs, Meta `fbclid`, Google `gclid`), and post-sale ops (tutor, scores) without HubSpot or Airtable. Klaviyo remains email-only.

## Decision

- **Supabase Postgres** as ops source of truth: `leads`, `clients`, `students`, `enrollments`, `touch_events`.
- **Server-only writes** via `SUPABASE_SERVICE_ROLE_KEY` from Next.js API routes (RLS enabled, no public policies).
- **First-party attribution:** `visitor_id` cookie + `POST /api/attribution/touch` + denormalized first-touch on `leads` at intake.
- **Klaviyo:** server-side events (`Intake Submitted`, `Consultation Booked`, `Checkout Started`, `Enrollment Completed`) after Supabase writes; failures do not block users.
- **Resend:** internal inbox alerts only.
- **Admin:** `/admin` gated by `ADMIN_SECRET` cookie.

## Consequences

- Run `supabase db push` (or SQL editor) before production CRM use.
- Calendly webhook requires `CALENDLY_WEBHOOK_SIGNING_KEY` in env.
- Service role key must never be exposed to the browser.
