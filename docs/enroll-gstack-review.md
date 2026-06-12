# /enroll — gstack review report

- **Date:** 2026-06-11
- **Subject:** [`docs/enroll-ux-design.md`](./enroll-ux-design.md)
- **Research basis:** [`docs/enroll-onboarding-research.md`](./enroll-onboarding-research.md)
- **Skills run:** plan-ceo-review · plan-design-review · plan-eng-review
- **Status:** draft — owner approval gate below

## Correct pipeline (what should have happened)

```
Research → UX design draft → gstack review (this doc) → visual mockups → owner approval → PRD/SPEC → build
```

**Visual mockups:** [`enroll-design-mockups/board.html`](./enroll-design-mockups/board.html) (open in browser; 4 tabs)

PRD/SPEC written before this review are **downstream drafts only**. Do not treat them as approved until this gate passes.

---

## Executive summary

| Phase | Score | Verdict |
|-------|-------|---------|
| CEO / strategy | **6.5 / 10** | Strong research + receipt contract; execution risks at Calendly SPOF, metrics ambition, ops promises |
| Design / UX | **6 / 10** | Zone architecture solid; state map thin, screens 2–3 copy underspecified, mobile Calendly unaddressed |
| Engineering | **6 / 10** | Receipt API + intake idempotency exist; step order inverted vs design, student TCPA fields missing, analytics absent |

**Cross-phase theme:** Screen 1 does too many jobs in 3-screen mode. CEO + design both recommend resolving **3 vs 4 screens before mockups**, not after QA.

---

## CEO review (plan-ceo-review)

### Premises

| Premise | Status | Note |
|---------|--------|------|
| Parent just paid a stranger; receipt job is load-bearing | **Valid** | CHECKOUT-TRUTH + Stripe echo is the right anti-scam wedge |
| Skill Diagnostic booked = activation | **Valid** | Matches Headway/Cerebral research |
| Take work off parent = minimize fields on screen 1 | **Valid** | Stripe prefill only on welcome |
| SMS is how students engage | **Valid** | Screen 2 is correctly scoped |
| 3-screen compresses receipt + Calendly without losing either job | **Challenge** | 48% hierarchy to Calendly on same screen as receipt fights mobile + anxiety-relief sequencing |
| Same-day diagnostic booking ≥ 85% | **Challenge** | Achievable only with 4-screen or very tight Calendly defaults; 65–70% more defensible for v1 |
| "Mentor intro email this week" on screen 3 | **Challenge** | No ops trigger defined; risks empty promise |
| Verification SMS (Reply Y) as open product question | **Invalid framing** | Parent-on-behalf TCPA is compliance-required; flag-only v1 is fine, but consent block is not optional |

### Scope

**In (confirmed):** receipt zone, diagnostic booking, student contact + guardian ack, named human, preview mode, abandon deep link.

**Defer:** second guardian, grade/school required, parent SMS weekly reports beyond email default, verification SMS send (flag-only ok).

**Add (CEO):**
- Calendly failure / no-slots state on screen 1 (or dedicated booking screen)
- Ops-owned trigger for screen 3 "this week" bullets (or soften copy to what always happens)
- Realistic activation SLA in PRD metrics

### Alternatives

| Approach | Trade-off |
|----------|-----------|
| **3-screen** (current) | Fewer clicks; receipt + Calendly compete on 390px |
| **4-screen** (gstack recommendation) | +1 click; receipt read then pure activation screen |
| Receipt-only Stripe redirect, enroll later | Violates "replace Stripe success" + anti-scam |

### Top CEO findings

1. **Critical:** Calendly SPOF — no designed path if embed fails or zero slots
2. **High:** Decide 3 vs 4 screens in design doc, not post-build QA
3. **High:** TCPA student consent is v1-required, not "open decision #3"
4. **Medium:** Success metrics need v1-realistic targets
5. **Medium:** Screen 3 agenda bullets must match automated ops reality

### CEO taste decisions (owner)

1. **3 vs 4 screens** — gstack recommends **4** (receipt clarity + Calendly focus)
2. **Metrics ambition** — keep stretch goals or adopt 65–70% same-day booking for v1?
3. **Screen 3 copy** — founder promise vs ops-safe "what happens next" only

---

## Design review (plan-design-review)

### Dimension scorecard

| Dimension | Score | What makes it 10 |
|-----------|-------|------------------|
| Information hierarchy | **7** | Lock screen 1 scan order: welcome → receipt summary → Calendly; receipt expandable on mobile |
| Mobile shell / responsive | **6** | Paper-prototype 390px; explicit Calendly height + collapse rules |
| One CTA per screen | **9** | Hold; verify no competing links on screen 2 |
| Micro-interactions / states | **4** | Full state machine per screen (below) |
| Accessibility | **7** | Calendly iframe fallback link; consent focus order; 4.5:1 on navy hero |
| Brand alignment | **8** | Cormorant + DM Sans matches brand guide; light body correct for ICP |
| Copy quality | **7** | Screens 2–3 need literal strings, not intent descriptions |

**Overall design: 6 / 10**

### Required state map (fixes micro-interactions gap)

**Screen 1**

| State | Parent sees | CTA |
|-------|-------------|-----|
| `loading` | Skeleton: welcome + receipt + Calendly placeholder | Disabled Continue |
| `session_invalid` | Plain error + support@ + link to contact | No Continue |
| `receipt_ready` | Full receipt from Stripe | Disabled until slot booked |
| `calendly_error` | Receipt visible + "Pick a time" fallback (link or support) | Disabled or "Email us to schedule" |
| `slot_selected` | Receipt + collapsed Calendly summary ("Tue Jun 17, 4:00 PM") | **Continue** enabled |
| `slot_confirmed` | Same + checkmark on diagnostic line | Continue |

**Screen 2**

| State | Parent sees | CTA |
|-------|-------------|-----|
| `default` | Guardian checkbox unchecked, fields disabled | Disabled |
| `guardian_checked` | Fields active, prefill visible | Disabled until valid |
| `submitting` | Spinner on CTA | Disabled |
| `error` | Inline field errors + support path | Retry |

**Screen 3**

| State | Parent sees |
|-------|-------------|
| `complete` | Diagnostic time, 3 bullets, named human |
| `diagnostic_pending` | If webhook lag: "We're confirming your time…" + support |

### Layout taste decisions (owner)

| Decision | Option A | Option B |
|----------|----------|----------|
| Desktop screen 1 columns | **Calendly left** (activation priority) | **Receipt left** (anti-scam read first) |
| Flow length | **3 screens** | **4 screens** (gstack recommends — see CEO) |
| Screen 2 frame | Task: "Set up [Student]'s contact" | Handoff: "We'll work with [Student] directly now" |

### Brand guide alignment

From `illuminairy_brand_guide (1).html`:
- Cormorant Garamond display + DM Sans body: **correct** (guide uses these on editorial surfaces)
- Navy chrome + polar white body: **correct adaptation** (guide is full-dark; enroll inverts for moms 45–55)
- Celestial → aurora gradient accent on receipt card: **correct** (guide motif, 1–2px top border)
- Forest `#2F6E47` CTA: **add to visual tokens** (guide uses glow/silver CTAs on dark; enroll needs forest for light-surface contrast)

---

## Engineering review (plan-eng-review)

### Architecture (target)

```
Stripe redirect → /enroll?session_id=
  → GET /api/enroll/session (prefill + receipt)
  → Screen 1: Calendly embed → webhook stores diagnostic
  → Screen 2: POST /api/enroll/intake (student + student_tcpa_consent_at + ip)
  → Screen 3: read-only confirmation
```

### What already exists

| Piece | Status |
|-------|--------|
| Session API + Stripe expand | Works; receipt parser may need line-item labels |
| Intake API + idempotency | Works |
| Calendly webhook | Works |
| Preview mode | Works |
| `EnrollReceiptCard`, named human components | Exist but not on correct step |
| 5-step orchestrator | **Wrong** — Calendly on step 4, not screen 1 |

### Net-new before ship

| Item | Severity |
|------|----------|
| 3-screen orchestrator (reorder steps) | **Blocker** |
| `student_sms_consent_at` + `consent_ip` on intake | **Blocker** (legal) |
| 5 analytics events in `lib/analytics-events.ts` | **Blocker** (metrics) |
| Calendly error / no-slot UI state | **High** |
| Abandon deep link `?step=` routing | **Medium** |
| Stale 5-step error copy | **Low** |

### Failure modes

| Failure | Mitigation |
|---------|------------|
| Expired `session_id` | Screen 1 `session_invalid` state |
| Calendly iframe blocked | Fallback link + support CTA |
| Webhook lag after book | Screen 3 pending state; poll or refresh |
| Double submit intake | Idempotency key (exists) |
| Parent closes before screen 2 | 1h email + deep link |
| Already enrolled client | Redirect or read-only complete |

### Eng score: **6 / 10**

Infra is ahead of UX alignment. Reorder + consent fields + analytics are the gap between spec and code.

---

## Cross-phase consensus

| Topic | CEO | Design | Eng | Recommendation |
|-------|-----|--------|-----|----------------|
| 4-screen over 3-screen | Yes | Yes | Neutral | **Adopt 4-screen as primary** in UX doc |
| Calendly failure state | Critical | Critical | High | **Design before build** |
| Student TCPA in v1 | Required | Required | Blocker | **Remove from "open decisions"** |
| Receipt vs program line split | — | Confirmed | — | Keep (owner preference) |
| `/plan` parity | No | No | — | Keep enroll as sibling surface |

---

## Owner approval gate

Answer these before PRD/SPEC are marked approved and before any code:

1. **Flow:** 3 screens or 4 screens? (gstack recommends 4)
2. **Desktop screen 1:** Calendly-left or receipt-left? (or N/A if 4-screen)
3. **Screen 2 headline:** task-forward or handoff-forward?
4. **Metrics:** keep 85% same-day booking target or set v1 to 65–70%?
5. **Screen 3 bullets:** ops-automated only, or keep mentor-intro promise?

Options:
- **A)** Approve gstack recommendations (4-screen, states map, TCPA committed, realistic metrics)
- **B)** Override specific choices (list which)
- **C)** Revise UX doc first, re-run gstack on changed sections

---

## Next steps after approval

1. Update [`docs/enroll-ux-design.md`](./enroll-ux-design.md) with gate decisions + state map + 4-screen primary flow
2. Refresh [`specs/2026-06-enroll-onboarding/PRD.md`](../specs/2026-06-enroll-onboarding/PRD.md) and [`SPEC.md`](../specs/2026-06-enroll-onboarding/SPEC.md) from approved UX
3. Deprecate stale [`docs/enroll-design-pick.md`](./enroll-design-pick.md) and update [`docs/enroll-gstack-context.md`](./enroll-gstack-context.md)
4. Then implement
