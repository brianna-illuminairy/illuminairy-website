# CRM v4 — end-to-end smoke test

Run this after the first **real** Strategy Call on production. Each block below maps to one phase of CRM v4. Tick the box once verified.

Pre-flight (do once, before the call):

- [ ] `npm run crm:smoke` — synthetic probe of every integration (no real call needed). Confirms all envs are wired, all APIs answer, all cron routes are reachable.
- [ ] `/admin/integrations` — every provider chip shows status `ok` and a recent `last_success_at`.
- [ ] `/admin/compliance` — quiet hours, OOO, and suppression list load. Add a junk row to suppression, confirm it appears, then remove it.
- [ ] Calendly → Integrations → webhooks: confirm subscription includes `invitee.created`, `invitee.canceled`, `invitee_no_show.created`, `invitee_no_show.deleted`.

## Phase 0 — secrets + Workspace defaults

- [ ] `vercel env ls production` shows all 9 CRM v4 secrets (Google client + refresh + enc key, Gemini, Calendly token + signing key, CRON_SHARED_SECRET, GA4 measurement + secret).
- [ ] In Google Workspace admin → Meet → "Take notes with Gemini" and "Transcribe meeting" are both **on by default**.

## Phase 1 — OAuth + heartbeat

- [ ] `/admin/integrations` → "Connect Google" flow completes. The page returns and shows `connected` for `gmail`, `calendar`, `drive`, `meet`.
- [ ] `integration_tokens` row exists with non-null `refresh_token_enc` and `gmail_history_id` populated within ~5 min.

## Phase 2 — Meet attendance

Book a real test Strategy Call against your Calendly + join it from a second Google account.

- [ ] Within 15 min of the scheduled end, `lead_calls.call_status = attended` with `attendance_source = meet_api` and `confidence ≥ 0.7`.
- [ ] If you intentionally **don't** join, after 15 min the row goes to `no_show` and `calendly_no_show_pending_until` is set to "now + 10 min."
- [ ] Click "Override – they did show up" on the Calls tab during the 10-min window. Row reverts to `booked`. No POST to Calendly's no-show endpoint.
- [ ] If you skip the override, after 10 min the cron POSTs to Calendly's `/invitee_no_shows` and you see the booking marked no-show in Calendly's UI.

## Phase 3 — Gmail in+out + SLA

- [ ] Send an outbound email from your support inbox to the test lead. Within 15 min, an `outbound` `lead_emails` row appears on the Emails tab with subject + snippet.
- [ ] Reply to that email from the lead's inbox. Within 15 min, an `inbound` row appears and the lead's `awaiting_reply_since` clears.
- [ ] Send to a non-existent address. Bounce shows up as suppressed (Compliance → Suppression list → reason `bounce`).
- [ ] Click unsubscribe in any test email — Suppression list gains an `unsub` row.

## Phase 4 — Calendly history + reschedule

- [ ] Reschedule the test booking. New event arrives; the original `lead_calls` row updates `scheduled_start/end`. No duplicate row.
- [ ] Cancel the new booking. Row goes to `canceled`. Lead stage reverts to `intake_submitted`.
- [ ] `/api/cron/calendly-history` returns `{ ok: true, synced_count: N }` (run it once via GitHub Actions or `curl -H "Authorization: Bearer $CRON_SHARED_SECRET"`).

## Phase 5 — Dashboard surfaces

- [ ] Today's Calls panel on `/admin/crm` shows the booked test call with time + parent name + Meet link.
- [ ] CRM leads list shows a Heat chip on the test lead (color matches `lead_score_current`).
- [ ] Awaiting-reply chip appears when `awaiting_reply_since` is set, disappears when cleared.
- [ ] Lead profile shows Calls, Emails, Tasks, Score, Audit, Brief, Script tabs — all load without 500.
- [ ] Integrations pill on the lead overview matches the global `/admin/integrations` view.

## Phase 6 — Gemini extract + draft

- [ ] After the call attended above, wait ~15 min for the Gemini Notes doc to land in Drive.
- [ ] Within 30 min `lead_calls` row has: `summary`, `concerns`, `buying_signals`, `blockers`, `next_step_decision`, `call_score`, `transcript_extracted_at`, `gmail_draft_id`.
- [ ] Calls tab links to the Notes doc, Transcript doc, and the Gmail draft. Click each.
- [ ] Tasks tab gains the action items the LLM extracted from the call.
- [ ] Task reconciler: send the draft. Within 30 min the `post_call` follow-up task auto-completes.

## Phase 7 — Pre-call brief + sales script

- [ ] 3 hours before the next test call, `pre_call_briefs` row appears for the lead; Brief tab renders the markdown.
- [ ] On Script tab, click "Generate personalized script." Within ~5 sec, a markdown script appears using lead's intake data. Edits save on PATCH.

## Phase 8 — Heartbeat alerts

- [ ] Temporarily flip `GEMINI_API_KEY` to garbage. Within 6 h (or trigger `/api/cron/heartbeat-check`), an `admin_alerts` row appears for `integration_health: gemini` with `notify=false`. `/admin/integrations` Gemini chip turns red. Revert the key — within one cycle, chip returns to green.

## Phase 9 — Compliance

- [ ] Suppress your own email. Phase 6 draft creator skips creating a draft to you. (`canAutomateSend` returns `{ ok: false }`).
- [ ] Add an OOO window covering the next call. Phase 7 brief still generates; Phase 6 draft creation skips with `reason: ooo`.
- [ ] Quiet hours set 21:00 → 08:00. Any test SMS path returns `{ ok: false, reason: quiet_hours }`.

## Phase 10 — Identity stitching

- [ ] Submit a quiz from an incognito window without identifying yourself; then on the same browser submit the enroll intake. Two `identity_links` rows appear with the same `visitor_id` and the same `lead_id`.
- [ ] Run `/api/cron/identity-reconcile`. If there are duplicate leads, an audit row `duplicate_detected` appears on the winning lead.
- [ ] Click "Merge into this lead" on the duplicate (admin UI surfaces this on the audit row): related rows move, duplicate goes to `lost` with `lost_reason: merged_into_<id>`.
- [ ] Check GA4 Realtime → events tab. After the test call attended, `lead_call_attended` event fires with `lead_id` param. After marking qualified, `lead_qualified` fires.

## After verification

- [ ] Update `memory-bank/activeContext.md` with the date you signed off and any phases that need follow-up.
- [ ] Disable the test no-show in Calendly so the lead doesn't get tagged in real reports.
- [ ] Remove any junk suppression / OOO rows you added during testing.
