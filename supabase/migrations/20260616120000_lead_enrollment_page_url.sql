-- CRM: dedicated personalized enrollment page URL per lead (post–Strategy Call).

alter table leads
  add column if not exists enrollment_page_url text;

comment on column leads.enrollment_page_url is
  'Public /enroll/{slug} page for this family after the Strategy Call. Admin-only; not exposed on marketing site.';
