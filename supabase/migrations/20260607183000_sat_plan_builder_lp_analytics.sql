-- Meta ad LP at /sat-plan-builder — count both parent LP paths in funnel views.

create or replace view v_funnel_daily as
select
  date_trunc('day', created_at)::date as day,
  count(*) filter (
    where event_type = 'page_view'
      and path in ('/', '/sat-plan-builder')
  ) as lp_views,
  count(*) filter (where event_type = 'funnel_cta_click') as cta_clicks,
  count(*) filter (where event_type = 'quiz_started') as quiz_starts,
  count(*) filter (where event_type = 'quiz_lead_submitted') as leads,
  count(*) filter (where event_type in ('call_booked', 'quiz_booking_confirmed')) as books
from touch_events
group by 1
order by 1 desc;

create or replace view v_campaign_by_content as
select
  coalesce(utm_campaign, '(none)') as utm_campaign,
  coalesce(utm_content, '(none)') as utm_content,
  count(*) filter (where event_type = 'page_view') as page_views,
  count(*) filter (where event_type = 'funnel_cta_click') as cta_clicks,
  count(*) filter (where event_type = 'quiz_started') as quiz_starts,
  count(*) filter (where event_type = 'quiz_lead_submitted') as leads,
  count(*) filter (where event_type = 'call_booked') as books,
  round(
    100.0 * count(*) filter (where event_type = 'funnel_cta_click')
    / nullif(count(*) filter (where event_type = 'page_view'), 0),
    1
  ) as cta_rate_pct,
  round(
    100.0 * count(*) filter (where event_type = 'quiz_lead_submitted')
    / nullif(count(*) filter (where event_type = 'quiz_started'), 0),
    1
  ) as lead_rate_pct
from touch_events
where utm_content is not null or utm_campaign is not null
group by 1, 2
order by page_views desc;
