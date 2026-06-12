# `/enroll` design-pick — Variant D (Hybrid)

Locked direction for the consumer-grade `/enroll` rebuild. Source: `docs/enroll-design-shotgun.md`. Brianna's stated preference: same Aurora neighborhood as `/plan`, with one borrow from the component sheet (dark feature card) for moments that matter (welcome, success). Variant D meets that brief with the lowest brand-drift risk and zero new shell work.

---

## Locked direction

| | |
|--|--|
| Visual variant | **D — Hybrid:** `/plan` shell + dark feature card borrow on `welcome` and `complete` only |
| Type pairing | Source Serif 4 500 (display) + Schibsted Grotesk (body) + DM Mono (eyebrow) — same as `/plan` |
| Hero treatment | Standard `.qf-top` navy band + dark feature card (`.card.dark`) inside `.qf-body` for `welcome` + `complete` |
| Card pattern | Plain `.qf-card` panels + `.card.cream` for soft summaries + `.card.dark` for hero/success |
| Button treatment | Primary forest 56px pill (`qf-btn forest` with `→`); "Add another guardian" as `qf-link-button` text button — never a second primary |
| Italic rule | Forest non-italic on `<em>` (matches `/plan`; site-wide italic ban respected) |
| In-context borrow | One only: dark feature card on `welcome` and `complete` |
| Step count | 5 |

## Step-by-step spec

```
welcome → profile → updates → diagnostic → complete
```

| # | Step ID | Mode | What's on screen |
|---|---------|------|------------------|
| 1 | `welcome` | `explicit-cta` | `QFScreen` with `.qf-top` navy band + dark feature card hero in `.qf-body`: eyebrow "Step 1 of 5", `.qf-h1` "Welcome to SAT Accelerator, {parentFirst}", lead about three quick steps before the Skill Diagnostic. Below, plain `.checklist` agenda (Confirm contact info · Choose how to receive weekly progress reports · Book Skill Diagnostic). Pinned forest pill "Continue →". |
| 2 | `profile` | `form-continue` | Eyebrow "Step 2 of 5" · `.qf-h1` "Confirm contact info" · `.qf-lead` short. Sectioned `.qf-input` form: parent (4 fields) + student (first name required; "Add school + grade" expands grade / school / student phone / email). Each prefilled value renders with a small forest-soft check chip in the field label area. Pinned forest pill "Continue →". |
| 3 | `updates` | `form-continue` | Eyebrow "Step 3 of 5" · `.qf-h1` "Weekly progress reports" · `.qf-lead` "Choose how you want them delivered." Two `.qf-opt multi` cards (Email · SMS) with multi-select check. SMS card reveals the parent phone field (if missing) + a TCPA checkbox + microcopy directly inline. Below: text-button "Add another parent or guardian" expands a second-guardian inline section (first, last, email required, phone optional, second SMS TCPA when phone + SMS selected). Pinned forest pill "Continue →". |
| 4 | `diagnostic` | `explicit-cta` | Eyebrow "Step 4 of 5" · `.qf-h1` "Book your Skill Diagnostic" · short `.qf-lead`: "2 hr 14 min proctored. Pick a time that works for your family." Soft summary card (`.card.cream`) above Calendly with student first name + parent first name. Calendly inline embed taking remaining body. Pinned forest pill "Complete enrollment →" disabled until slot booked. |
| 5 | `complete` | `auto-advance` | Dark feature card success in `.qf-body`: `.qf-h1` "{studentFirst} is enrolled." Lead about what happens this week. Below, agenda card with three forest-bullet items: "Mentor introduction email · Skill Diagnostic on {date} · Weekly classes start week of {date}". Support email line. No pinned action — terminal state. |

## Data persistence (locked, regardless of UI)

- `clients.weekly_report_email_opt_in boolean default false`
- `clients.weekly_report_sms_opt_in boolean default false`
- `clients.weekly_report_sms_consent_at timestamptz`
- `enrollments.intake_details.second_parent: { first, last, email, phone }` + `second_parent_sms_consent_at`

`POST /api/enroll/intake` body extends with `weeklyReportEmail`, `weeklyReportSms`, `weeklyReportSmsConsent`, `secondParent`, `secondParentSmsConsent`.

## Copy direction

All parent-facing strings live in `lib/enroll/enroll-copy.ts`. No mention of data sources ("from your SAT Score Path", "from your Stripe receipt", "From your payment receipt"). No em dashes. No "prep," "boost," or guarantee language. Use **Skill Diagnostic**, **SAT Accelerator**, **personalized weekly plan** as exact product names.

## Files (final)

**Create**
- `components/enroll/enroll-shell.tsx` — thin wrapper around `QFScreen` + step body + pinned action
- `components/enroll/steps/enroll-step-welcome.tsx`
- `components/enroll/steps/enroll-step-profile.tsx`
- `components/enroll/steps/enroll-step-updates.tsx`
- `components/enroll/steps/enroll-step-diagnostic.tsx`
- `components/enroll/steps/enroll-step-complete.tsx`
- `supabase/migrations/20260612000000_clients_weekly_report.sql`

**Rewrite**
- `app/enroll/layout.tsx` — Aurora V3b imports + `qf-funnel-root` + `QFFunnelLegal`
- `app/enroll/enroll-intake.tsx` — orchestrator only (step state, prefill, submit)
- `lib/enroll/enroll-copy.ts` — consumer-tone strings, no data-source language
- `lib/enroll/enroll-prefill.ts` — explicit `kidName` fallback pass
- `lib/enroll/enroll-local-prefill.ts` — return per-key contributions
- `app/api/enroll/intake/route.ts` — accept new fields
- `lib/crm/typeform-enrollment.ts` — persist `weekly_report_*` on clients + second parent
- `lib/crm/typeform-enrollment-parse.ts` — extend intake type with new fields

**Delete**
- `app/enroll/enroll.css`
- `components/enroll/enroll-page-shell.tsx`
- `components/enroll/enroll-details-panel.tsx`
- `app/enroll/success/page.tsx` (legacy stub)

**Restyle**
- `components/enroll/enroll-field-inputs.tsx` — `.qf-input`, `.qf-field-label`, `.qf-field-error`
- `components/enroll/enroll-diagnostic-scheduler.tsx` — fit into the diagnostic step layout (drop section heading; that's the step head)
