-- Both funnels emit the same event names, so event_type alone can never separate
-- them. Store the funnel on the row, derived from the path we already record.
-- Mapping mirrors lib/analytics/funnel-id.ts.

alter table touch_events add column if not exists funnel_id text;

comment on column touch_events.funnel_id is 'sat_quiz (Strategy Call) | plan_builder_b (free lesson) | score_review. Null means the event is not part of a funnel. Derived from path in lib/analytics/funnel-id.ts.';

update touch_events
set funnel_id = case
  when path = '/plan-b' or path like '/plan-b/%' then 'plan_builder_b'
  when path = '/quiz-b' or path like '/quiz-b/%' then 'plan_builder_b'
  when path in ('/sat-plan-builder', '/sat-free-lesson') then 'plan_builder_b'
  when path = '/plan' or path like '/plan/%' then 'sat_quiz'
  when path = '/quiz' or path like '/quiz/%' then 'sat_quiz'
  when path like '/score-review%' or path like '/june-score-review%' then 'score_review'
  when path like '/plan-c%' or path like '/quiz-c%' then 'score_review'
  -- Server events (Calendly webhooks) carry no path; fall back to the tag the
  -- caller sent, under whichever of the two keys it used.
  when payload->>'funnel_id' = 'sat_quiz' or payload->>'funnel' = 'sat_quiz' then 'sat_quiz'
  when payload->>'funnel_id' in ('plan_builder_b', 'sat_quiz_b')
    or payload->>'funnel' in ('plan_builder_b', 'sat_quiz_b') then 'plan_builder_b'
  when payload->>'funnel_id' = 'score_review' or payload->>'funnel' = 'score_review' then 'score_review'
  else null
end
where funnel_id is null;

create index if not exists touch_events_funnel_id_created_at_idx
  on touch_events (funnel_id, created_at desc)
  where funnel_id is not null;
