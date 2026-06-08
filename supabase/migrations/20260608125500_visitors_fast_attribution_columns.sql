-- Fast-query visitor attribution/audience columns for funnel reporting

alter table visitors add column if not exists first_utm_content text;
alter table visitors add column if not exists first_hero_hook text;
alter table visitors add column if not exists quiz_who text;

update visitors
set first_utm_content = coalesce(first_utm_content, first_touch->>'utm_content')
where first_utm_content is null;

update visitors
set first_hero_hook = coalesce(first_hero_hook, first_touch->>'hero_hook')
where first_hero_hook is null;

update visitors
set quiz_who = coalesce(quiz_who, quiz_answers->>'qWho')
where quiz_who is null;

create index if not exists visitors_first_utm_content_idx
  on visitors (first_utm_content);
create index if not exists visitors_first_hero_hook_idx
  on visitors (first_hero_hook);
create index if not exists visitors_quiz_who_idx
  on visitors (quiz_who);

comment on column visitors.first_utm_content is 'First-touch utm_content extracted for fast SQL filtering';
comment on column visitors.first_hero_hook is 'First-touch hero hook shown on landing';
comment on column visitors.quiz_who is 'Audience answer: child | self';
