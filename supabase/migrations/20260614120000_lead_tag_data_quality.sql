-- Add data_quality tag category for ops flags (invalid contact, spam, etc.)

do $$
begin
  if exists (select 1 from pg_type where typname = 'lead_tag_category') then
    if not exists (
      select 1
      from pg_enum e
      join pg_type t on t.oid = e.enumtypid
      where t.typname = 'lead_tag_category'
        and e.enumlabel = 'data_quality'
    ) then
      alter type lead_tag_category add value 'data_quality';
    end if;
  end if;
end$$;

comment on type lead_tag_category is
  'buying_trigger | objection | priority | data_quality (invalid contact, spam, duplicate)';
