# HPHS endorsement gate (Plan Builder B)

## Context

Plan Builder B (`/plan-b`) includes a **school referral** step (`q-school-referral`) before contact capture. **Highland Park High School (Dallas, TX)** endorsement copy is locked in [`lib/quiz-funnel-b/school-referral-copy.ts`](../lib/quiz-funnel-b/school-referral-copy.ts).

## Gate rules

1. **Referral answer** is stored on the lead as `school_referral` (Supabase) from `qSchoolReferral` at lead submit.
2. **HPHS-specific copy or offers** must only render when the referral answer matches the locked HPHS slug (confirm slug with Brianna before prod ads).
3. **Analytics:** always pass `school_referral` on touch events and Klaviyo profile properties for lab leads so PostHog breakdowns can segment HPHS vs organic.

## Ops checklist

- [ ] Confirm HPHS slug value in `q-school-referral` options matches CRM `school_referral` filter
- [ ] Klaviyo flow branch: `school_referral` equals HPHS slug → endorsement track
- [ ] Admin CRM filter: `plan_builder_variant = b` AND `school_referral = <hphs_slug>`
- [ ] Do not promise admission or score outcomes in HPHS-specific copy (messaging guide)

## Related code

- Step: `q-school-referral` in `lib/quiz-funnel-b/quiz-route.ts`
- Lead fields: `supabase/migrations/20260622120000_plan_b_lead_fields.sql`
- Lead API: `app/api/funnel-b/lead/route.ts`
