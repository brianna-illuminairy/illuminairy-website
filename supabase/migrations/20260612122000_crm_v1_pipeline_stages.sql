-- CRM v1 pipeline: add `no_show` and `diagnostic_scheduled` to lead_stage enum.
--
-- Rationale (researched against HubSpot/Pipedrive/Close/Tutorbase 2026 patterns):
--   * Adding `no_show` as a real column instead of a flag is right for solo-operator
--     scale (<100 active deals): visual overflow in `call_booked` was the actual
--     problem, and dragging-to-column is the most visible affordance.
--   * `diagnostic_scheduled` mirrors the tutoring-vertical "Trial Completed"
--     stage. Paying for the 2hr14min Skill Diagnostic is a real buyer commitment
--     and deserves its own column distinct from "Attended Strategy Call".
--
-- Postgres caveat: ADD VALUE inside a transaction was restricted pre-PG 12;
-- modern Supabase is PG 15+, so this works without a separate session.

alter type lead_stage add value if not exists 'no_show' after 'call_booked';
alter type lead_stage add value if not exists 'diagnostic_scheduled' after 'call_attended';
