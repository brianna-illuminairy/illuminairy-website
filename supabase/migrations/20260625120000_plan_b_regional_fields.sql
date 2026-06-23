ALTER TABLE leads ADD COLUMN IF NOT EXISTS target_schools jsonb;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS target_region text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS regional_discount_code text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS regional_discount_pct smallint;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS plan_b_membership_package text;
