# Project brief — Illuminairy

## Mission

Illuminairy is a premium mentorship brand: near-peer mentors who have already achieved what students are aiming for, with clear structure and family-visible progress—not self-study or à la carte tutoring.

Tagline: **your guiding light for goals and growth**

## In scope (this repo)

- Public marketing site at `illuminairy.com`
- Program pages (SAT Accelerator primary; future programs listed on `/programs`)
- Lead capture: contact form, newsletter, Calendly consultation embeds
- Enrollment: Stripe Checkout for SAT tuition
- Legal/policy pages, SEO, analytics (PostHog, Google Analytics, Klaviyo)

## Out of scope

- Student LMS, class video hosting, grading systems (external tools)
- Mentor application CRM (manual email + invite-only Calendly for interviews)
- Competitor site mirrors in git (e.g. Curious Cardinals on branch `archive/curious-cardinals-2026-05-18`); intel in `docs/competitor-intel-curious-cardinals.md`

## Constraints

- Legal name on policies: **Zytech Development LLC**
- No SAT score guarantees in copy
- Tutor interview scheduling is invite-only, never public
- Production deploys via **Vercel**; domain DNS managed outside Vercel (historically Squarespace)

## Success criteria

- Families can understand the SAT program, book a consultation, and pay enrollment online
- Copy and design stay aligned with `docs/` brand system
- Site is fast, accessible, and maintainable by a small team (+ AI assistants)
