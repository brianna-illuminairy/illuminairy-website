# Spec: /enroll post-payment onboarding

- **PRD:** [`PRD.md`](./PRD.md)
- **UX design (canonical for screens, layout, copy):** [`docs/enroll-ux-design.md`](../../docs/enroll-ux-design.md)
- **Research:** [`docs/enroll-onboarding-research.md`](../../docs/enroll-onboarding-research.md)
- **Checkout strings:** [`CHECKOUT-TRUTH.md`](./CHECKOUT-TRUTH.md)
- **Date:** 2026-06-11
- **Status:** draft — awaiting owner review. **No implementation until UX + gstack gate approved.**

> **Pipeline:** Research → [`docs/enroll-ux-design.md`](../../docs/enroll-ux-design.md) → [`docs/enroll-gstack-review.md`](../../docs/enroll-gstack-review.md) → owner gate → this SPEC → build. Refresh this file after gate.

## Summary

Implement the 3-screen flow defined in [`docs/enroll-ux-design.md`](../../docs/enroll-ux-design.md): (1) welcome + Stripe receipt + book Skill Diagnostic, (2) student contact + SMS acknowledgment, (3) done + named human. Light editorial surface from brand guide; navy chrome + hero bands only.

## Acceptance criteria

- [ ] Screen 1 shows welcome copy, program line **without pricing**, full receipt zone (Stripe live data), Calendly, step **1 of 3** in nav, founder anchor.
- [ ] Receipt echoes [`CHECKOUT-TRUTH.md`](./CHECKOUT-TRUTH.md) product names; amounts from Stripe only.
- [ ] Diagnostic bookable on screen 1; Continue enabled after slot picked.
- [ ] Screen 2: guardian checkbox before student fields; required student mobile + email; consent logged (timestamp + IP).
- [ ] Screen 3: diagnostic time, this-week bullets, named human, support path.
- [ ] Desktop 1280 uses ~1200px frame, not narrow mobile column.
- [ ] Mobile 390 usable without horizontal scroll.
- [ ] No "SAT Accelerator" in parent-facing strings.
- [ ] `?preview=1` exercises all screens with stub receipt.
- [ ] `npm run agent:verify` clean after implementation phase.

---

## Screen map

| Step | ID | Primary job | Research basis |
|------|-----|-------------|----------------|
| 1 | `welcome-receipt-diagnostic` | Anti-scam receipt + book diagnostic | Ritual/Hims receipt + Cerebral/Headway activation |
| 2 | `student-contact` | Student profile + SMS ack | Outschool/Greenlight + Talkspace consent |
| 3 | `complete` | Relief + named human | Warby Parker next steps + Brooklinen founder |

Full wire-level detail: UX design doc § Recommended flow.

---

## Data model

| Role | Source | Collected on /enroll |
|------|--------|---------------------|
| Parent | Stripe `customer_details` | Confirm only (prefilled) |
| Student | Parent form | Required: first, last, mobile, email. Optional: grade, school |
| Second guardian | — | Deferred (parent portal) |

Prefill: Stripe → CRM → quiz `kidName` for student first name. No data-source language in UI.

---

## Receipt API

`GET /api/enroll/session?session_id=` returns `prefill` + `receipt` object parsed from Stripe (`line_items`, `subscription` expanded). Preview mode returns stub per `CHECKOUT-TRUTH.md`.

---

## Intake API

`POST /api/enroll/intake` requires: diagnostic booking, student mobile + email, consent flag. Logs consent metadata. Weekly report email defaults true to parent email.

---

## Visual implementation notes

See UX design § Visual system. Fonts: `lib/enroll-fonts.ts` (Cormorant + DM Sans + DM Mono). CSS: `app/enroll/enroll.css` — **rewrite to match UX doc**, not `/plan` funnel CSS.

---

## Analytics

| Event | When |
|-------|------|
| `enroll_page_viewed` | Valid session load |
| `enroll_receipt_viewed` | Receipt in viewport |
| `enroll_diagnostic_booked` | Calendly confirmed |
| `enroll_student_contact_submitted` | Screen 2 submit |
| `enroll_completed` | Screen 3 |

Add to `lib/analytics-events.ts` if missing.

---

## Compliance (legal review before ship)

- TCPA parent-on-behalf acknowledgment for student SMS
- COPPA assumption: students 14–18
- Privacy/Terms links on consent block

---

## Out of scope

Per PRD. Includes all `/enroll` code until this spec is approved.

---

## Implementation order (after approval)

1. UX/CSS shell matching visual system
2. Stripe receipt on session API + receipt component
3. Screen 1 orchestration (welcome + receipt + Calendly)
4. Screen 2 student + consent
5. Screen 3 complete
6. Analytics + preview QA

---

## References

Pattern → decision table in [`docs/enroll-ux-design.md`](../../docs/enroll-ux-design.md) § Research → design decisions. Full product research in [`docs/enroll-onboarding-research.md`](../../docs/enroll-onboarding-research.md).
