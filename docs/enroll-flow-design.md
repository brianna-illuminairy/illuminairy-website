# Post-payment enrollment flow (from scratch)

**Status:** draft for Brianna review. **No implementation.** This is the flow design only.

**Question this answers:** After a parent pays on Stripe, what do we do on `/enroll` to properly enroll them?

---

## What “enrolled” means

A family is **enrolled** when we have:

| Need | Why |
|------|-----|
| Payment confirmed + receipt shown | Replaces Stripe success page; kills scam anxiety |
| Parent contact accurate | Billing, receipts, parent-facing comms |
| Student contact accurate | Mentors and ops reach the kid where they live (usually text) |
| Parent notification prefs | Respect how involved they want to be (email/SMS) |
| Skill Diagnostic booked | Program actually starts; ranked skills come from this |
| Support path clear | Named human + email if anything feels wrong |

---

## Data inventory (quiz → pay → enroll)

### Collected in Plan Builder (`/plan`) before payment

| Data | Where in funnel | Stored in CRM |
|------|-----------------|---------------|
| Student **first name** only (`kidName`) | `name` step | `leads.student_first`, `visitors.quiz_answers` |
| Parent full name | `s5` Strategy Call form | `leads.parent_first` / `parent_last`, snapshot `parentName` |
| Parent email | `s5` | `leads.parent_email`, snapshot |
| Parent phone | `s5` | `leads.parent_phone`, snapshot; backup from Calendly invitee |
| Parent TCPA (contact parent by phone/SMS) | `s5` checkbox | snapshot `confirmTcpa` — **do not re-ask on `/enroll`** |
| Quiz context (scores, goals, doubts, etc.) | steps `q1`–`q9` | `leads.quiz_answers` JSON (full snapshot) |

**Not collected in the quiz at all:** student last name, student email, student phone, grade, school, parent notification prefs, Skill Diagnostic time.

`student_grade` / `student_school` on the lead row are always **null** from quiz today.

### Collected at Stripe payment

Depends which checkout path:

| Path | What Stripe holds |
|------|-------------------|
| **Payment link** (live $249 + $99/wk model per CHECKOUT-TRUTH) | Usually `customer_email`, `customer_details` (name, phone). Metadata may be sparse unless the link is configured to pass `visitorId` / student fields. |
| **`POST /api/checkout`** (in repo, not wired from `/plan` UI today) | Full metadata: parent + student names, emails, phones, zip. |

On `checkout.session.completed`, CRM creates `clients` + `students` from **Stripe metadata**. If metadata is thin, the student row may be a placeholder (`first_name` from meta or `"Student"`) with **null phone/email** until `/enroll` intake.

### What `/enroll` prefill merges (server-side)

Order: quiz/lead by email → Calendly phone → existing client/student → Stripe `customer_details` → Stripe metadata. **Empty fields only**; never silently overwrite.

Match key is **parent email**. If the parent pays with a different email than they used on `s5`, quiz lead data may not join (ops edge case).

### What we usually have vs need at `/enroll`

| Field | Usually have? | Must collect on enroll? |
|-------|---------------|-------------------------|
| Parent first / last | Yes (quiz + often Stripe) | **Confirm** (step 2) |
| Parent email | Yes (Stripe) | **Confirm**; Stripe receipt shows it |
| Parent phone | Often (quiz or Calendly) | **Confirm**; required |
| Student first name | Yes (quiz) | **Confirm** (step 3) |
| Student last name | **No** (never from quiz; **not** parent's last) | **Required** |
| Student mobile | **No** | **Required** (primary channel for the student) |
| Student email | **No** (unless full `/api/checkout`) | Optional (recommended for portal/copies) |
| Grade / school | **No** | Optional |
| Parent notification prefs | **No** | **Required** (step 4) |
| Skill Diagnostic booked | **No** | **Required** (step 5) |
| Student SMS consent (parent on behalf) | **No** | **Required** (step 3 or 4) |

### How we ensure accuracy (UX, not “trust the quiz”)

1. **Confirm, don’t assume** — Every prefilled value is editable. No “from your Score Path” copy.
2. **Receipt as anchor** — Step 1 shows Stripe email and charge; parent spots wrong payer email immediately.
3. **Stripe wins for billing email** — After pay, treat `customer_email` as billing root; if it differs from quiz, show both and let them fix parent email on step 2.
4. **Student phone ≠ parent phone** — Validate separately (Greenlight pattern); never copy parent mobile into student field.
5. **Student last ≠ parent last** — Never prefill student last name from parent or Stripe billing name. Parent enters the student's legal name.
5. **Guardian checkbox** — Before student fields unlock (step 3).
6. **Empty = required** — Missing prefill still blocks Continue.
7. **Intake overwrites CRM** — `POST /api/enroll/intake` is the enrollment truth after parent submits; prefill is a starting point only.

**UX rule:** Prefill every known field. Parent **confirms or edits**. Filled fields: subtle check or “Edit”; empty fields: normal required inputs.

---

## Why this order (DTC patterns)

Consumer post-pay flows that work (Ritual, Headway, Outschool, Greenlight, Stripe Atlas) share a sequence:

1. **Trust first** — receipt and what they bought (not a generic “thanks”)
2. **Light parent check** — billing contact only; fast
3. **Child profile** — separate from parent (Greenlight: never treat parent phone as student phone)
4. **Comms prefs** — parent chooses involvement; low cognitive load before scheduling
5. **Activation** — one focused screen to book the Skill Diagnostic (Headway: booked first session = activated)
6. **Relief** — summary, next steps, support (Warby Parker / Brooklinen named-human pattern)

Diagnostic is **after** contact + notifications so we can text/email the student with a real number and honor parent channel prefs before the first high-stakes calendar moment. Support is **not** a step; it’s persistent on every screen (see **Support & help** below).

---

## Flow: 5 steps + done

```text
Stripe pay → /enroll?session_id=…

Step 1  Payment confirmed + receipt
Step 2  Your contact (parent)
Step 3  Student contact
Step 4  How we keep you updated (parent notifications)
Step 5  Book Skill Diagnostic
Done    You're set + support
```

Nav: **Step 1 of 5** … **Step 5 of 5** (clear labels in top bar; progress bar).

---

### Step 1 — Payment confirmed + receipt

**Job:** “I paid the right company for the right thing.”

**Show:**
- Welcome: *Welcome to Illuminairy! We're excited to have [Student] in our [Month Day] SAT Program.*
- Program line (no price): **[Student] · [Month Day] SAT Program**
- Receipt card (live from Stripe):
  - Today: Skill Diagnostic + Plan — $249 (one-time)
  - Weekly Tutoring — $99/week, 7-day free trial, first charge date, billed through test day
  - What's included (short, two bullets per product)
  - We'll text you the day before your trial ends
  - Cancel: reply to Stripe receipt or support@illuminairy.com
  - Merchant: **Illuminairy SAT Prep** (Zytech fine print)
  - Stripe sent receipt to [parent email]
- Support card (see **Support & help**): *Questions? I'm Brianna — support@illuminairy.com*

**CTA:** **Continue**

**Do not:** Calendly, long forms, or “SAT Accelerator” anywhere parent-facing.

**Pattern:** Ritual/Hims post-pay receipt screen, not Allbirds empty “order confirmed.”

---

### Step 2 — Your contact

**Job:** Confirm billing / parent-of-record details. Fill gaps only.

**Show:**
- Headline: **Confirm your contact**
- Lead: One line: for receipts and program updates to you.
- Fields (prefilled when known):
  - First name, last name, email, mobile
- Only highlight fields that are empty or look wrong; everything else editable inline.

**Required:** email + mobile.

**CTA:** **Continue**

**Pattern:** Stripe Atlas “confirm details” — not a blank signup form.

---

### Step 3 — Student contact

**Job:** The student's real name and mobile. This is who we text for diagnostic prep, session reminders, and mentor messages. Teens rarely read parent-facing email.

**Show:**
- Headline: **Set up [Student]'s contact**
- Lead: *Use your student's name and mobile number — not yours. We text students directly; that's how they actually respond.*
- **Checkbox first:** *I confirm I am [Student]'s parent or legal guardian.* (required before fields unlock)
- Fields:
  - **First name** (prefill from quiz `kidName` only — editable)
  - **Last name** (required, **empty by default** — never copy from parent last name or Stripe billing name)
  - **Student mobile** (required, empty by default — never copy from parent phone)
  - **Student email** (optional; label: *Optional — we reach [Student] by text for reminders and prep*)
  - Optional expand: grade, school
- Trust line: *Diagnostic instructions and class reminders go to this number.*
- **SMS consent** (required checkbox): parent-on-behalf consent to text this mobile (see comms section). Log timestamp + IP.

**Required to continue:** guardian checkbox, student first + **last** name, student mobile, student SMS consent.

**Validation:**
- Block if student mobile = parent mobile (show: *Use your student's cell, not yours.*)
- Block if student last left blank
- Do not auto-fill last name from parent

**CTA:** **Continue**

**Pattern:** Outschool learner profile under parent; Greenlight separate child phone and identity.

**API (when built):** Intake must require `studentLast` + `studentPhone`; `studentEmail` optional.

---

### Step 4 — How we keep you updated

**Job:** Parent chooses involvement level and channels (not the student’s day-to-day text).

**Show:**
- Headline: **How involved do you want to be?**
- Lead: Weekly progress goes to you; [Student] gets session reminders by text.

**Involvement (single select or sensible default):**
- **Standard (recommended):** Weekly progress email + important updates
- **Light:** Email for milestones only (diagnostic done, monthly summary)
- **Hands-on:** Weekly email + text me for scheduling changes (parent SMS opt-in only — TCPA already captured on Strategy Call)

**Channels (checkboxes, respect involvement choice):**
- Email to [parent email] — default on for Standard/Hands-on
- Text to my phone — off by default; if on, **no second TCPA** (parent already agreed on `s5` `confirmTcpa` for this number)

**Do not:** Hide that students are contacted by SMS for program ops (honest in step 3).

**CTA:** **Continue**

**Pattern:** Spotify Family / health apps channel cards; defaults pre-selected so “Continue” works without toggling.

---

### Step 5 — Book Skill Diagnostic

**Job:** Activation. One screen, one task.

**Show:**
- Headline: **Pick a time for [Student]'s Skill Diagnostic**
- Lead: 2 hr 14 min proctored. We'll send prep before the session.
- Calendly embed (full width; primary visual on desktop)
- If Calendly fails: link to book via email + support@ (never a dead end)

**CTA:** **Complete enrollment** (enabled after slot selected)

**Pattern:** Headway / ZocDoc — booking screen owns the viewport.

---

### Done — You're set

**Job:** Relief + what happens next + support.

**Show:**
- **[Student] is in your [Month Day] SAT Program.**
- Skill Diagnostic: [date/time]
- This week (max 3 bullets):
  - Confirmation email today
  - Prep instructions before diagnostic
  - Mentor intro this week
- Support card (primary on Done): who to email, what to do if something looks wrong
- Line: *Your mentor will reach out this week. Until then, Brianna and support@ are your direct line.*
- Optional: *Bookmark this page* if session_id still in URL
- No primary CTA (terminal)

**Pattern:** Warby Parker order confirmation “what happens next” list.

---

## Support & help (every step)

Parents just paid online. They need a **named place to come back** and a **named person** before mentor assignment.

### Always visible

| Surface | Content |
|---------|---------|
| **Sticky nav or footer** (steps 1–5) | `Questions?` → opens support strip or `support@illuminairy.com` |
| **Support card** (steps 1, 5, Done) | Photo + **I'm Brianna** + `support@illuminairy.com` + short line: *Billing, scheduling, or anything that feels off — email me.* |
| **Receipt block** (step 1) | Cancel/billing: reply to Stripe receipt **or** support@ |
| **Calendly error** (step 5) | *Can't find a time? Email support@ and we'll help you book.* |
| **Done screen** | Repeat support card + **Save this page** or *We'll email a link to finish if you need to step away* |

v1 named human: **Brianna** (founder). After mentor match, copy can add *Your mentor will introduce themselves this week. Until then, I'm here.*

### Where to come back

| Situation | Where they go |
|-----------|----------------|
| **Finish enrollment later** | Same URL: `/enroll?session_id=…` (Stripe puts them here after pay; bookmark or email deep link if they abandon) |
| **Questions during setup** | support@illuminairy.com (one tap from every step) |
| **"Did I get scammed?"** | Step 1 receipt + Illuminairy SAT Prep + Stripe email parity |
| **Wrong charge / trial / cancel** | Reply to Stripe receipt or support@ (stated on receipt) |
| **Can't book diagnostic** | support@ on step 5 fallback |
| **After enroll is done** | support@; mentor intro email when assigned |

Do **not** use a generic Contact page as the only path. Post-pay support should feel like **one inbox and one face**, not a ticket portal.

### Copy SSOT (support)

- Email: `support@illuminairy.com` from `lib/site.ts`
- Short help line: *Questions about billing, scheduling, or your student's setup? Email support@illuminairy.com — we respond within one business day.*
- Banned: "submit a ticket," "help center," unnamed "our team"

### Not in v1

- Live chat
- Parent portal login (mention on Done as "coming by email" only if true)
- Mentor direct line before assignment

---

## What we cut from v1

| Cut | Why |
|-----|-----|
| Second guardian | Parent portal later |
| `satTakenBefore` toggle | Mentor can ask |
| Separate welcome screen with no receipt | Receipt is step 1 |
| Receipt + Calendly on same screen | Mobile cram; breaks trust-then-act rhythm |
| Data-source copy (“from your Score Path”) | Feels internal |
| “SAT Accelerator” parent-facing | Your rule |

---

## Visual / CX (consumer-grade, not `/plan` clone)

| Principle | Application |
|-----------|-------------|
| Desktop-first | ~1200px frame; forms ~720px; not a phone column on 1280 |
| Light body | Polar white `#F5F8FA`; moms 45–55 |
| Navy moments | Sticky nav + step 1 hero + done hero only |
| Type | Cormorant headlines, DM Sans body, DM Mono step labels (brand guide) |
| One primary CTA per step | Forest green pill |
| States | Loading receipt, invalid session, Calendly error, submitting |

---

## Research → this flow (one line each)

| Pattern | Step |
|---------|------|
| Receipt replaces Stripe success | 1 |
| Confirm parent, don’t re-register | 2 |
| Child profile separate from parent | 3 |
| Channel / involvement choice | 4 |
| Booked diagnostic = activated | 5 |
| Named human reduces scam fear | 1 + Done |

Full research: [`enroll-onboarding-research.md`](./enroll-onboarding-research.md)

---

## One alternative (if you want diagnostic sooner)

Swap **steps 4 and 5** (book diagnostic before notification prefs). Trade-off: faster activation metric, but we might book before student phone is saved. **Recommended:** keep order above unless ops says diagnostic reminders need student mobile first.

---

## Text, email, and reminders (two audiences)

Parents and students get **different** messages. Parent TCPA for **their** number is already on file from Strategy Call — enroll only collects channel prefs, not a second parent TCPA.

### Student (operational texts)

**Who:** the kid — **first + last name** on step 3 (never assume same surname as parent). **Number:** `students.student_phone` from step 3. **Channel:** text first; students are rarely responsive over email.

**What we send (once we have phone + consent):**

| When | Example |
|------|---------|
| Right after enroll | Skill Diagnostic prep link + what to bring |
| 24–48 hr before diagnostic | Reminder + join/proctor instructions |
| Ongoing program | Class reminders, mentor scheduling, session nudges |

**Consent:** Parent checks guardian box + **parent-on-behalf student SMS** disclosure (TCPA). Log timestamp + IP on intake. Copy draft lives in `lib/enroll/enroll-copy.tsx` (`EnrollStudentSmsConsent`).

**Not built yet:** automated student SMS sends. Intake can save phone; no Twilio/Klaviyo SMS flow wired for student number today.

### Parent (progress + billing)

**Who:** the buyer. **Channels:** email (default) and optional **parent** mobile for weekly summaries.

| Message type | Channel | Opt-in on enroll |
|--------------|---------|------------------|
| Weekly progress report | Email | Step 4, default on for Standard |
| Weekly progress report | SMS to **parent** phone | Step 4 opt-in only; TCPA from quiz `s5` (`confirmTcpa`) |
| Trial ending soon | SMS or email to **parent** | Receipt promise on step 1; tied to Stripe trial |
| Enrollment confirmation | Email | Today: `sendEnrollmentIntakeCompleteEmail` (parent only) |
| Calendly diagnostic invite | Email to **parent** | Calendly embed uses parent email today |

**Stored today:** `clients.weekly_report_email_opt_in`, `weekly_report_sms_opt_in`. Parent SMS consent timestamp: reuse lead snapshot `confirmTcpa` + `s5` submit time — **not** a new enroll checkbox.

**Important:** Parent weekly SMS ≠ student operational SMS. Different numbers, different purposes. Parent TCPA is one-time on Strategy Call; student texts use step 3 guardian attestation + student mobile collection.

### Involvement level (step 4) maps to parent comms only

| Level | Parent gets |
|-------|-------------|
| **Standard** | Weekly progress email (+ optional parent SMS if they turn it on) |
| **Light** | Milestone emails only (diagnostic done, monthly summary) |
| **Hands-on** | Standard + parent SMS encouraged for scheduling changes |

Student still gets operational texts if step 3 consent is checked. Involvement does not turn off student reminders.

### Implementation order (comms)

1. Require student first + **last** name, mobile, and student SMS consent on intake API (email optional)  
2. Store `student_sms_consent_at` (+ IP) on client or enrollment  
3. Trigger Klaviyo flow or SMS provider on `enroll_completed` → student prep text  
4. Calendly webhook + scheduled job → diagnostic reminder to `student_phone`  
5. Parent weekly reports from `weekly_report_*` flags (email first; SMS when ops ready)

---

## After you approve this doc

1. Update PRD/SPEC from this flow only  
2. HTML mockups per step  
3. Then build `/enroll`

**Supersedes** for flow purposes: `enroll-design-pick.md`, agent 3/4-screen debates, and prior `enroll-ux-design.md` step maps until you merge edits.
