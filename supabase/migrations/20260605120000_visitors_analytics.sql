-- Anonymous visitors + funnel analytics views

create table if not exists visitors (
  id text primary key,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  first_touch jsonb,
  last_touch jsonb,
  quiz_furthest_step text,
  quiz_furthest_step_index integer,
  sat_lp_variant text,
  device_class text,
  posthog_distinct_id text,
  abandon_notified_at timestamptz
);

create index if not exists visitors_last_seen_idx on visitors (last_seen_at desc);
create index if not exists visitors_furthest_step_idx on visitors (quiz_furthest_step);
create index if not exists visitors_sat_lp_variant_idx on visitors (sat_lp_variant);

alter table leads add column if not exists quiz_furthest_step text;
alter table leads add column if not exists sat_lp_variant text;
alter table leads add column if not exists posthog_distinct_id text;

alter table visitors enable row level security;

-- Daily funnel counts from touch_events
create or replace view v_funnel_daily as
select
  date_trunc('day', created_at)::date as day,
  count(*) filter (where event_type = 'page_view' and path = '/') as lp_views,
  count(*) filter (where event_type = 'funnel_cta_click') as cta_clicks,
  count(*) filter (where event_type = 'quiz_started') as quiz_starts,
  count(*) filter (where event_type = 'quiz_lead_submitted') as leads,
  count(*) filter (where event_type in ('call_booked', 'quiz_booking_confirmed')) as books
from touch_events
group by 1
order by 1 desc;

-- Step drop-off (unique visitors per step in window — approximate via visitor_id)
create or replace view v_funnel_by_step as
select
  payload->>'step' as step,
  (payload->>'step_index')::int as step_index,
  count(distinct visitor_id) as visitors
from touch_events
where event_type = 'quiz_step_view'
  and visitor_id is not null
  and payload->>'step' is not null
group by 1, 2
order by step_index nulls last;

-- First-touch campaign performance (leads table)
create or replace view v_attribution_by_campaign as
select
  coalesce(utm_campaign, '(none)') as utm_campaign,
  coalesce(utm_source, '(none)') as utm_source,
  count(*) as leads,
  count(*) filter (where stage in ('call_booked', 'call_attended', 'won')) as books,
  count(*) filter (where stage = 'won') as enrollments
from leads
where funnel = 'sat_quiz'
group by 1, 2
order by leads desc;

-- Campaign quality proxy (touch-based bounce = LP views minus CTA)
create or replace view v_campaign_quality as
select
  coalesce(utm_campaign, '(none)') as utm_campaign,
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
where utm_campaign is not null or utm_source is not null
group by 1
order by page_views desc;
