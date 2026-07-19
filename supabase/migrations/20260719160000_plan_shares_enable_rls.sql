-- Retired plan-share feature (2026-06). Lock down orphaned table.
ALTER TABLE public.plan_shares ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.plan_shares IS
  'Retired public plan-share snapshots (2026-06). RLS enabled; no public policies. Orphaned rows OK; no new product writes.';
