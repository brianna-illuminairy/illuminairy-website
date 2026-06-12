# Active context

*Last updated: 2026-06-12*

## CRM v4 just shipped (2026-06-12)

Full call-history + lead-intelligence stack. All 11 phases from `.cursor/plans/crm-v4-call-history_*.plan.md` implemented. Live verification pending — run `npm run crm:smoke` first, then follow [`docs/crm-v4-smoke-test.md`](../docs/crm-v4-smoke-test.md) against a real Strategy Call before declaring it production-trusted.

What's live:

- **Phase 0–1** OAuth + heartbeat. Google Meet/Calendar/Gmail/Drive scopes, Calendly + Gemini probes. Encrypted refresh tokens (`INTEGRATION_TOKEN_ENC_KEY`). `/admin/integrations` shows real status.
- **Phase 2** Meet attendance cron (`/api/cron/meet-attendance`, every 15 min). Tiered identity match → call_status of attended/no_show/confirm. 10-min delayed Calendly no-show POST with owner override.
- **Phase 3** Gmail in+out incremental sync via `history.list`. Bounce/unsub → `suppression_list`. `awaiting_reply_since` SLA chip on the leads list.
- **Phase 4** Calendly webhooks now handle no_show.created/deleted + reschedule. Calls tab shows Meet links, scheduled times, override controls.
- **Phase 5** Lead profile tabs: Calls, Emails, Tasks, Score, Audit, Brief, Script. Today's Calls panel on `/admin/crm`. Heat chip per lead. Integrations pill.
- **Phase 6** Gemini extract cron: summary + concerns + buying signals + decision + per-call score + auto-tasks + Gmail draft. Task reconciler auto-completes follow-ups when the email is sent.
- **Phase 7** Pre-call brief cron (`/api/cron/pre-call-brief`, every 5 min, T-3h window) writes markdown to `pre_call_briefs`. Personalized sales script generation on demand.
- **Phase 8** Heartbeat cron probes all 6 providers every 6 h. `admin_alerts` with `notify=false` on regression (no email noise).
- **Phase 9** `/admin/compliance` — quiet hours, OOO windows, suppression list CRUD. `canAutomateSend()` consulted by Phase 6 draft creation.
- **Phase 10** `identity_links` populated on intake + quiz submit. `/api/cron/identity-reconcile` (every 6 h) detects duplicate leads → `crm_audit_log: duplicate_detected`. Manual `/api/admin/leads/[id]/merge-from` for owner-driven merges. Server-side GA4 milestones (`lead_call_booked`, `lead_call_attended`, `lead_call_no_show`, `lead_qualified`, `lead_lost`, `lead_won`) fire when GA4_MEASUREMENT_ID + GA4_API_SECRET are set.
- **Phase 11** Smoke probe `npm run crm:smoke` + live runbook `docs/crm-v4-smoke-test.md`.

Cron is driven by `.github/workflows/crm-cron.yml` using `CRON_SHARED_SECRET`. Idempotent via `dedupeKey` on `admin_alerts`. Token disconnect alerts skip notify, just turn the chip red.

**Open follow-ups for the owner:**

1. Run `npm run crm:smoke` against prod once envs are deployed.
2. Walk `docs/crm-v4-smoke-test.md` with a real test Strategy Call.
3. Apply migration `supabase/migrations/20260612130000_crm_v4_call_intelligence.sql` if not yet on prod.
4. Add `GA4_MEASUREMENT_ID` and `GA4_API_SECRET` to Vercel if you want server-side conversion attribution.

## CRM v1 (2026-06-11 PM)

The `/admin/crm` rework from the plan in `.cursor/plans/crm-v1-pipeline_4cf61e79.plan.md` is implemented and ready to deploy. Sumary:

- **Marketing dashboard counts fixed** (`lib/marketing/funnel-metrics.ts`) — `getFunnelCounts`, `getCampaignRows`, `getCreativeRows` now count `DISTINCT lead_id`, exclude internal CRM emails via `INTERNAL_CRM_EMAILS`, and scope `books` to lead_ids that also have a `quiz_lead_submitted` event in the window. Invariant `books ≤ leads` should now hold.
- **`/admin/crm`** is a three-view shell (`?view=list|pipeline|due`): sortable/filterable leads table → clickable to `/admin/crm/leads/[id]`, kanban with `@dnd-kit/core` (drag between Intake/Booked/Attended/Won/Lost), Due today queue grouped Overdue/Today/This week, plus a Due-today KPI tile.
- **Lead profile** (`/admin/crm/leads/[id]`) — tabs: Overview (parent/student/source/Calendly cards + quiz answers), Notes (sales notes + next followup datetime + note), Calls (paste-in transcripts), Activity (merged touch_events + calls + conversion event).
- **Clients list** (`/admin/crm/clients`) + **client profile** (`/admin/crm/clients/[id]`) — tabs: Overview (with weekly-report opt-in dots + payments + lead-history accordion), Ops notes (autosave on `clients.ops_notes`), Students/enrollments, Calls, Activity.
- **Conversion handoff UX** wired both ways — lead profile gets an emerald banner + locked stage dropdown when `converted_client_id` is set; client profile gets a sky banner back to the original lead; leads list fades converted rows and offers a "Hide converted clients" toggle (defaults on); clients list has a Source utm_campaign column.
- **New migrations** (not yet applied to prod): `supabase/migrations/20260612120000_crm_v1_followups.sql` (adds `leads.next_followup_at`, `next_followup_note`, `last_activity_at`), `supabase/migrations/20260612121000_crm_v1_lead_calls.sql` (creates polymorphic `lead_calls` table referencing lead_id and/or client_id). Apply via `DATABASE_URL=… npm run crm:migrate` or `SUPABASE_ACCESS_TOKEN=… npm run crm:migrate:api`.
- **Stripe webhook** (`lib/crm/enrollment.ts`) now logs `[crm] lead X (email) converted -> client Y via stripe session Z` and bumps `last_activity_at` on conversion.
- **`@dnd-kit/core` + `@dnd-kit/sortable`** added to `package.json`.

Brianna's local `ADMIN_SECRET` is already set; the Vercel env still needs `ADMIN_SECRET` for prod admin access, plus the migrations need to run before deploy.

## Resume here (start next chat with this)

**Pipeline:** Research → UX → gstack review → **visual mockups** → owner gate → PRD/SPEC → build

**Visual mockups:** [`docs/enroll-design-mockups/board.html`](../docs/enroll-design-mockups/board.html)

**UX design:** [`docs/enroll-ux-design.md`](../docs/enroll-ux-design.md)

**Gstack review (CEO 6.5 · Design 6 · Eng 6):** [`docs/enroll-gstack-review.md`](../docs/enroll-gstack-review.md)

**Derived specs (stale until gate passes):**
- PRD: [`specs/2026-06-enroll-onboarding/PRD.md`](../specs/2026-06-enroll-onboarding/PRD.md)
- SPEC: [`specs/2026-06-enroll-onboarding/SPEC.md`](../specs/2026-06-enroll-onboarding/SPEC.md)
- Research (full): [`docs/enroll-onboarding-research.md`](../docs/enroll-onboarding-research.md) · index: [`specs/2026-06-enroll-onboarding/RESEARCH.md`](../specs/2026-06-enroll-onboarding/RESEARCH.md)
- Checkout truth: [`specs/2026-06-enroll-onboarding/CHECKOUT-TRUTH.md`](../specs/2026-06-enroll-onboarding/CHECKOUT-TRUTH.md)

**Status:** Research → UX → gstack review complete (2026-06-11). **No implementation.** PRD/SPEC written early; refresh after gate. Prior `/enroll` code and `docs/enroll-design-pick.md` are stale.

**Next action:** Brianna answers approval gate in [`docs/enroll-gstack-review.md`](../docs/enroll-gstack-review.md) (4 vs 3 screens, metrics, screen 2 tone) → refresh PRD/SPEC → then build.

---

## /enroll onboarding — session summary (2026-06-10 → 2026-06-11)

### What Brianna asked for

Rebuild `/enroll` (post-Stripe payment) into a **consumer-grade onboarding** experience:
- Brand in the Aurora / brand-guide neighborhood — **not** `/plan`'s narrow mobile column on desktop
- **Light surface** (polar white) for moms 45–55 — dark navy only for nav chrome + hero band on welcome/complete
- **Every element has a purpose** — hierarchy, order, and vertical space budget matter
- **Take work off the parent** — "breath of fresh air"; Illuminairy works with the kid now
- **Book Skill Diagnostic ASAP** — activation metric; sooner start = better results
- **Named human** to come back to (billing, progress, support)
- **Accurate student data + parent-on-behalf SMS acknowledgment** — SMS is where students engage
- **Receipt replaces Stripe success page** — confirm payment, trial, next charge, what's included (like a steal)
- **Echo Stripe payment link verbatim** — two products already shown at checkout:
  1. **Skill Diagnostic + Plan** — $249 one-time upfront (before diagnostic)
  2. **Weekly Tutoring** — $99/week with **7-day free trial**, through SAT test day
- Entity on receipt: **Illuminairy SAT Prep** (Zytech Development LLC fine print)
- Welcome copy direction: `Welcome to Illuminairy! We're excited to have [Student] in our [Month Day] SAT Program!`
- Keep **clear step labels in top-right nav** (Brianna likes these)
- Preview mode: `/enroll?preview=1` for testing without Stripe checkout

### Brand promise (9 principles — spec north star)

See PRD § Brand promise. Load-bearing: diagnostic-first activation, anti-scam receipt, echo checkout, SMS as student channel, named human.

### Spec recommendation (not yet implemented)

**3-step compressed flow:**
1. Welcome + receipt + book Skill Diagnostic (same screen)
2. Student contact + parent-on-behalf SMS ack + parent report prefs
3. Done + named human + this-week agenda

Cut from v1: second guardian (→ parent portal), long welcome agenda (receipt replaces it), decorative aside copy.

### Code state (uncommitted WIP on branch)

Partial rebuild exists in working tree:
- `app/enroll/enroll.css` — light surface + hero band + forest CTA
- `components/enroll/enroll-shell.tsx` — nav + progress + split layout
- `lib/enroll/enroll-copy.tsx`, `enroll-preview.ts`, step components
- `components/enroll/enroll-order-summary.tsx` — program summary (no pricing yet; needs Stripe receipt)
- Preview mode in API routes (`session_id=preview`)
- Inline SVG logo (`IlluminairyLogoV7`)

**Known gaps vs spec:**
- Still 5 steps; Calendly last
- No live Stripe receipt ($249 / $99 trial)
- Welcome title still `Welcome, {parent}.` not Illuminairy + student program line
- `lib/site.ts` still has stale `tuitionDisplay: "$1,200"`
- `docs/enroll-gstack-context.md` still references $1,200 / SAT Accelerator
- SPEC was PLACEHOLDER until 2026-06-11 night session completed it

### Reference assets (design)

Primary: `~/Downloads/illuminairy_brand_guide (1).html` (editorial, desktop-first)
Also: Aurora Tokens.html, illuminairy_context.html, diagnostic interface uploads
Rule: [`.cursor/rules/saas-dtc-best-practices.mdc`](../.cursor/rules/saas-dtc-best-practices.mdc) — user assets first, brand SSOT second, SaaS patterns third

---

## Other active work (paused while /enroll spec lands)

**Mobile cold traffic funnel:** [`specs/2026-06-mobile-cold-traffic-funnel/SPEC.md`](../specs/2026-06-mobile-cold-traffic-funnel/SPEC.md) — superseded as ACTIVE by enroll spec; still valid for `/plan` work.

**Plan reveal drop analysis:** [`growth/plan-reveal-drop-playbook.md`](../growth/plan-reveal-drop-playbook.md)

---

## Plan reveal vs achievability (locked naming)

- **Plan reveal** = PostHog step **`v1`** / `QFV1Projection` (after `name` → `i2`).
- **Goal achievability rating** = step **`achievability`** / `QFSGoalAchievability` (before `name`).
- SSOT: `lib/quiz-funnel/funnel-screen-roles.ts`

## Messaging (locked)

Strategy: [`growth/funnel-strategy.md`](../growth/funnel-strategy.md) · Copy: [`docs/messaging-guide.md`](../docs/messaging-guide.md)

| Topic | Decision |
|-------|----------|
| Funnel product | SAT Improvement Plan / Plan Builder (`/plan`) |
| Call | SAT Strategy Call (15 min) |
| Diagnostic | Skill Diagnostic (2 hr 14 min, after call) |
| /enroll program name | **Illuminairy SAT Prep** — not "SAT Accelerator" parent-facing |
| Stats | `lib/site.ts` only; "Results vary." |

## Dev quick ref

```bash
npm run dev
# Preview enroll without Stripe:
open http://localhost:3000/enroll?preview=1
npm run agent:verify
```
