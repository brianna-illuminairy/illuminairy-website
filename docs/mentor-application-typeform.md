# Mentor / SAT instructor application (Typeform)

Structured application for Georgia Tech–adjacent SAT mentors. Replaces the lightweight `/contact?reason=mentor` path when `NEXT_PUBLIC_MENTOR_TYPEFORM_URL` is set.

**Public apply page:** `/apply/mentor` (embeds Typeform or links to contact fallback).

**Interview scheduling:** Still invite-only via `TUTOR_CALENDLY_URL` — emailed after vetting, never on the public site (ADR 0004).

## Field order and logic

| # | Field | Type | Required | Notes |
|---|--------|------|----------|--------|
| — | Welcome | screen | — | Sets expectations + file checklist |
| 1 | Current location | Multiple choice | Yes | **U.S. (currently residing)** vs **Outside the U.S.** |
| — | *Logic* | — | — | If **Outside the U.S.** → thank-you screen `tys_not_us_resident` (disqualify) |
| 2 | U.S. state | Dropdown | Yes | All states + D.C. |
| 3 | ZIP code | Short text | Yes | Max 10 chars |
| 4 | Contact information | Contact info | Yes | First name, last name, email, phone (U.S. default) |
| 5 | Georgia Tech ID or transcript | File upload | Yes | PDF / JPG / PNG |
| 6 | Resume | File upload | Yes | PDF preferred |
| 7 | LinkedIn profile | Website URL | Yes | Full profile URL |
| 8 | Professional headshot | File upload | Yes | JPG / PNG |
| 9 | Why mentor (2–3 sentences) | Long text | Yes | Why SAT mentor + why you would be good; max 1200 chars |
| — | Thank you | screen | — | Application received; team will email if fit |

### Disqualification copy (non-U.S.)

> Thanks for your interest. Right now we are only accepting mentors who are **currently residing in the United States**. If your situation changes, you are welcome to apply again.

### Qualified thank-you

> Application received. We will review your materials and email you if you are a strong fit, including an invite-only interview link. Typically within a few business days.

## Create or update the form

### Option A — API (recommended)

1. [Typeform personal token](https://admin.typeform.com/account#/section/tokens) with **Forms: Read/Write**.
2. Export token (do not commit):

   ```bash
   export TYPEFORM_API_TOKEN=tfp_...
   ```

3. Create form:

   ```bash
   node scripts/create-mentor-typeform.mjs
   ```

4. Copy `NEXT_PUBLIC_MENTOR_TYPEFORM_URL` from output into `.env.local` and Vercel (`npm run env:sync`).

Payload source: `scripts/typeform/build-mentor-application.mjs` (regenerate with `--dry-run`).

### Option B — Manual in Typeform UI

Recreate the table above in the builder. Logic Jump on question 1: if answer is “Outside the United States” → jump to the non-U.S. thank-you screen.

## Integrations (recommended)

| Integration | Purpose |
|-------------|---------|
| Email notification | `support@illuminairy.com` on each submission |
| Google Drive / Dropbox | Store uploads in a dated folder |
| Slack (optional) | `#hiring` ping on new apply |

Do **not** add `TUTOR_CALENDLY_URL` to Typeform redirects or thank-you screens.

## Site wiring

| Item | Location |
|------|----------|
| Env | `NEXT_PUBLIC_MENTOR_TYPEFORM_URL` in `.env.example` |
| Canonical link | `mentorApplyLink` in `lib/site.ts` → `/apply/mentor` |
| Embed | `components/typeform-embed.tsx` |
| Sitemap | `/apply/mentor` in `app/sitemap.ts` |

## QA checklist

- [ ] Select “Outside the United States” → disqualify screen, no contact/upload steps
- [ ] U.S. path → all required fields enforce uploads + 2–3 sentence answer
- [ ] Submission email received with file attachments/links
- [ ] `/mentors` and homepage “Apply” CTAs land on `/apply/mentor`
- [ ] No Calendly tutor URL in form, embed, or thank-you redirect
