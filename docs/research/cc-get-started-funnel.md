# Curious Cardinals — Get Started funnel (full capture)

**Captured:** 2026-05-18  
**Entry URL:** [curiouscardinals.com/get-started/contact-info](https://www.curiouscardinals.com/get-started/contact-info)

Sources: Typeform public API (`api.typeform.com/forms/{id}`), live page inspection, Playwright scrape of Webflow steps, archived marketing site on branch `archive/curious-cardinals-2026-05-18`.

**Related:** [competitor-intel-curious-cardinals.md](../competitor-intel-curious-cardinals.md)

---

## Funnel overview

```text
/get-started/contact-info
    Typeform P5h8CCfR  "Parent Intake - Parent Info"
         │
         ▼ (redirect, passes parent email/name/phone + UTMs)
/get-started/student-info   (same embed as /parent-info)
    Typeform ALTmLSan  "Parent Intake - Student Info"
         │
         ├── Schedule a call (recommended) ──► /get-started/book-a-consultation-call
         │                                      HubSpot: meetings.hubspot.com/alec-katz/curious-cardinals-consultation-call
         │
         └── Attend a virtual event ──────────► https://lu.ma/calendar/cal-LvLbx6gS0ChhPQz?utm_source=getstarted

Alternate / legacy Webflow paths (still in sitemap, not the main Typeform redirect):
  /basic-info → /student-insights → /add-another-student → HubSpot booking
```

**Pricing confirmed in Typeform:** statement screen asks parents to confirm willingness to invest **$380/month** for sessions.

---

## Typeform 1 — Contact info (`P5h8CCfR`)

| | |
|---|---|
| **Page** | `/get-started/contact-info` |
| **Embed ID** | `data-tf-live="01K8K8SQJ19ZW5HCXAD7WHDAYT"` |
| **Public form** | [form.typeform.com/to/P5h8CCfR](https://form.typeform.com/to/P5h8CCfR) |
| **Title** | Parent Intake - Parent Info |

### Questions (in order)

| # | Type | Question | Required | Notes |
|---|------|----------|----------|-------|
| 1 | `email` | **Parent/Guardian Email** | Yes | Description: confidential use for mentorship outreach |
| 2 | `contact_info` | **Parent/Guardian Contact Information** | Yes | First name, last name, phone (US default) |
| 3 | `picture_choice` | **Which of these images is a dog** | Yes | 5 image choices — **spam/bot trap** (not shown to real users on happy path) |
| 4 | `file_upload` | **Bye!** | Yes | Spam path only |

### Hidden fields

`source`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `hubspot_utk`, `hubspot_page_name`, `hubspot_page_url`

### Logic (simplified)

- Known spam emails → jump to dog picture question → file upload loop
- Everyone else → contact info block → **redirect thank-you**

### Ending redirect

```
https://www.curiouscardinals.com/get-started/student-info
  ?utm_* + parent_email + parent_first + parent_last + parent_phone + source + sessionId
```

---

## Typeform 2 — Student info (`ALTmLSan`)

| | |
|---|---|
| **Pages** | `/get-started/student-info`, `/get-started/parent-info` (same form) |
| **Embed ID** | `data-tf-live="01K8BW43NZXA5C24GC08WJBB9G"` |
| **Public form** | [form.typeform.com/to/ALTmLSan](https://form.typeform.com/to/ALTmLSan) |
| **Title** | Parent Intake - Student Info |

Pre-filled from step 1 via URL/hidden: `parent_email`, `parent_first`, `parent_last`, `parent_phone`, UTMs, `sessionid`.

### Questions (in order)

| # | Type | Question | Notes |
|---|------|----------|-------|
| 1 | `multiple_choice` | **Which mentorship program are you interested in for your child?** | • Academic Mentorship • Passion Project • **Both** |
| 2 | `inline_group` | **What academic subjects… mentorship in?** | Multi-select groups: **Math** (K-5 through Calculus, Statistics), **Science**, **Writing**, **Languages**, **Other** (Academic Coaching, Executive Function, College Essay, Reading, History, Economics, CS) |
| 3 | `inline_group` | **What areas of interest… passion project?** | **Arts & Humanities** (Creative Writing, Music, Film, etc.), **Business/Finance/Entrepreneurship**, **Science/Engineering/Tech** (Coding, Medicine, AI, Robotics, etc.), **Politics/Ethics/Social Justice** |
| 4 | `short_text` | **Please elaborate on your child’s goals or areas for growth:** | Free text |
| 5 | `inline_group` | **Student Information** | Student first/last name, school, city/state |
| 6 | `dropdown` | **What is your student's grade?** | 1st – 12th grade |
| 7 | `multiple_choice` | **Match your child with the perfect mentor:** | See endings below |
| 8 | `statement` | **☎️ We take the call very seriously! Please confirm that:** | Guardian attends consult, 24hr cancel policy, **$380/month** willingness |
| 9 | `statement` | **We have identified you as a spammer. Please stop.** | Spam path only |

### Question 7 — Call vs webinar (key branch)

| Choice | Label | Where it goes |
|--------|-------|----------------|
| A | **Schedule a call (Recommended)** | `/get-started/book-a-consultation-call` + HubSpot prefill (`firstname`, `lastname`, `email`, `phone`, UTMs) |
| B | **Attend a virtual event** | [Luma calendar](https://lu.ma/calendar/cal-LvLbx6gS0ChhPQz?utm_source=getstarted) — **no live sales call** |

Some logic branches also reference nested Typeform `eE2xCG6H` (async follow-up).

### Endings

| Path | Redirect |
|------|----------|
| Book a call | `https://www.curiouscardinals.com/get-started/book-a-consultation-call?...` |
| Virtual event | `https://lu.ma/calendar/cal-LvLbx6gS0ChhPQz?utm_source=getstarted` |
| Spam | “Thank you and goodbye!” screen |

---

## After Typeform — Book a consultation

| | |
|---|---|
| **URL** | `/get-started/book-a-consultation-call` |
| **Embed** | **HubSpot Meetings** — `meetings.hubspot.com/alec-katz/curious-cardinals-consultation-call` |
| **Host** | Alec Katz (co-founder) |

Passion-project variant: `/get-started/book-a-consultation-call-passion-project` — same HubSpot meeting embed + long marketing page (tracks, pricing, Vimeo testimonials).

---

## Legacy Webflow + HubSpot path (sitemap)

These pages still exist; primary CTA on site is `/get-started/contact-info` (Typeform). Archive captured:

### `/get-started/basic-info` (HubSpot form)

Single-page form fields:

- Parent: first name, last name, phone, email  
- Student: first name, last name, **grade** (dropdown), school (optional)  
- Marketing opt-in checkbox  
- Hidden: `gs_source`, A/B variant, submitted timestamp, full UTM set  
- **Next** → `/get-started/student-insights`

### `/get-started/student-insights`

Same field shell in HTML (may be multi-step via JS); **Next** or add student loop.

### `/get-started/add-another-student`

- **Add another student** → back to student-insights  
- **Next** → continues funnel  

### Confirmations

- `/get-started/confirmation` — post-submit  
- `/get-started/async-confirmation` — FAQ for async path  
- `/get-started/asynchronous-match-request` — thank-you + HubSpot embed  

---

## Archive coverage vs this funnel

| URL | In wget archive? |
|-----|------------------|
| `/get-started/contact-info` | Yes (Typeform loads live only) |
| `/get-started/student-info` | Live page exists (may be post-archive deploy) |
| `/get-started/parent-info` | Yes |
| `/get-started/basic-info` | Yes |
| `/get-started/book-a-consultation-call` | Yes (HubSpot iframe URL in HTML) |
| `lu.ma/calendar/...` | **No** — external; linked from Typeform redirect |
| Typeform JSON definitions | Saved in `docs/research/cc-typeform-capture/*.json` |

---

## Re-fetch Typeform definitions

```bash
node scripts/fetch-cc-typeforms.mjs
# or walk pages: node scripts/capture-cc-typeform.mjs
```

Raw API dumps: [cc-typeform-capture/](cc-typeform-capture/)

---

## Illuminairy takeaways

1. **Two-step Typeform** qualifies parent contact, then program fit + student detail — before any calendar.  
2. **Explicit $380/mo confirmation** on the form reduces unqualified consults.  
3. **Webinar escape hatch** (Luma) for parents not ready to book — still captures marketing opt-in from step 1.  
4. **Heavy spam logic** (dog images, blocklist emails) — explains automated runs hitting “spammer” screens.  
5. For Illuminairy: mirror **schedule vs nurture** split (Calendly + optional recorded webinar), plus **published price** acknowledgment before consult.
