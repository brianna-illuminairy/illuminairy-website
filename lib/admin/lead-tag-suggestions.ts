/**
 * Curated tag suggestions for the three CRM tag categories. These are the
 * "click to add" presets in the UI. Owners can also free-form a custom tag.
 *
 * Slugs are stable identifiers (snake_case). Labels are display strings.
 * Group tags by sub-theme so the UI can render them in collapsible sections
 * without overwhelming the page.
 */

export type TagCategory =
  | "buying_trigger"
  | "objection"
  | "priority"
  | "data_quality";

export type TagSuggestion = {
  tag: string;
  label: string;
  group?: string;
  /** When true, surface in the "common picks" row above the category. */
  common?: boolean;
};

export const URGENCY_LEVELS = ["low", "medium", "high", "critical"] as const;
export type UrgencyLevel = (typeof URGENCY_LEVELS)[number];

export const URGENCY_META: Record<
  UrgencyLevel,
  { label: string; description: string; tone: string }
> = {
  low: {
    label: "Low",
    description: "Exploratory. Decision is months out.",
    tone: "bg-slate-100 text-slate-700"
  },
  medium: {
    label: "Medium",
    description: "Looking to decide this month.",
    tone: "bg-sky-100 text-sky-900"
  },
  high: {
    label: "High",
    description: "Decision needed in the next 2 weeks.",
    tone: "bg-amber-100 text-amber-900"
  },
  critical: {
    label: "Critical",
    description: "Decision needed this week. Hard deadline.",
    tone: "bg-rose-200 text-rose-900"
  }
};

export const CATEGORY_META: Record<
  TagCategory,
  { label: string; helper: string; tone: string }
> = {
  buying_trigger: {
    label: "Buying triggers",
    helper:
      "Why they're reaching out now — the inflection point that prompted the inquiry.",
    tone: "bg-violet-100 text-violet-900"
  },
  objection: {
    label: "Objections",
    helper:
      "What's blocking the close. Mark as resolved once addressed without losing the history.",
    tone: "bg-rose-100 text-rose-900"
  },
  priority: {
    label: "What matters to them",
    helper:
      "Format / experience / scheduling priorities you should respect in every touchpoint.",
    tone: "bg-emerald-100 text-emerald-900"
  },
  data_quality: {
    label: "Data quality",
    helper:
      "Contact or lead quality flags — invalid email/phone, spam, duplicates. Not sales objections.",
    tone: "bg-zinc-200 text-zinc-900"
  }
};

export const BUYING_TRIGGER_SUGGESTIONS: TagSuggestion[] = [
  // Score / academic triggers
  { tag: "got_low_score", label: "Got SAT score back below target", group: "Score back", common: true },
  { tag: "missed_target_by_50_plus", label: "Missed target by 50+ points", group: "Score back" },
  { tag: "missed_target_by_100_plus", label: "Missed target by 100+ points", group: "Score back" },
  { tag: "score_dropped_from_practice", label: "Real score dropped from practice scores", group: "Score back" },
  { tag: "psat_below_expectations", label: "PSAT came back below expectations", group: "Score back" },

  // Grade / timing triggers
  { tag: "going_into_sophomore_year", label: "Going into sophomore year", group: "Grade timing" },
  { tag: "going_into_junior_year", label: "Going into junior year", group: "Grade timing", common: true },
  { tag: "going_into_senior_year", label: "Going into senior year", group: "Grade timing", common: true },
  { tag: "rising_senior_summer", label: "Rising senior over the summer", group: "Grade timing" },
  { tag: "last_chance_before_apps", label: "Last SAT attempt before apps", group: "Grade timing", common: true },
  { tag: "ED_deadline_pressure", label: "Early Decision deadline pressure", group: "Grade timing" },
  { tag: "EA_deadline_pressure", label: "Early Action deadline pressure", group: "Grade timing" },
  { tag: "scholarship_deadline", label: "Scholarship deadline driving timeline", group: "Grade timing" },

  // Initiation / influence triggers
  { tag: "parent_initiated", label: "Parent initiated (student passive)", group: "Initiator" },
  { tag: "student_initiated", label: "Student initiated", group: "Initiator" },
  { tag: "school_counselor_recommended", label: "School counselor recommended SAT focus", group: "Initiator" },
  { tag: "friend_recommended_us", label: "Heard from a friend / referral", group: "Initiator" },
  { tag: "comparing_to_sibling_success", label: "Has older sibling who scored well", group: "Initiator" },
  { tag: "tried_self_study_failed", label: "Tried self-study, didn't move score", group: "Initiator" },
  { tag: "tried_group_class_failed", label: "Tried a group class, didn't move score", group: "Initiator" },
  { tag: "tried_other_tutor_unhappy", label: "Worked with another tutor, unhappy", group: "Initiator" },

  // Life / context triggers
  { tag: "summer_break_starting", label: "Summer break starting (time to commit)", group: "Context" },
  { tag: "school_year_starting", label: "School year starting (settling on rhythm)", group: "Context" },
  { tag: "athlete_recruitment_pressure", label: "Recruited athlete needs SAT band", group: "Context" },
  { tag: "transferring_schools", label: "Switching high schools", group: "Context" },
  { tag: "homeschooled_needs_validation", label: "Homeschooled and SAT is the proof point", group: "Context" }
];

export const OBJECTION_SUGGESTIONS: TagSuggestion[] = [
  // Price objections
  { tag: "price_too_high", label: "Price feels too high", group: "Price", common: true },
  { tag: "price_concern_general", label: "Price-conscious in general", group: "Price" },
  { tag: "payment_plan_needed", label: "Needs a payment plan", group: "Price", common: true },
  { tag: "financial_aid_required", label: "Needs financial aid / scholarship", group: "Price" },
  { tag: "comparing_with_cheaper_option", label: "Comparing with a cheaper option", group: "Price" },

  // Format objections
  { tag: "wanted_in_person", label: "Wanted in-person", group: "Format", common: true },
  { tag: "wanted_local_tutor", label: "Wanted local tutor", group: "Format" },
  { tag: "wanted_group_setting", label: "Wanted a group setting", group: "Format" },
  { tag: "skeptical_of_virtual", label: "Skeptical that virtual works", group: "Format" },
  { tag: "prefer_self_study", label: "Prefers self-study (Khan / books)", group: "Format" },
  { tag: "already_using_khan_or_other", label: "Already deep into Khan / other tool", group: "Format" },

  // Timing objections
  { tag: "timing_conflict", label: "Schedule conflict with our hours", group: "Timing" },
  { tag: "waiting_for_school_to_end", label: "Wants to wait until school ends", group: "Timing" },
  { tag: "considering_other_options_first", label: "Wants to evaluate other options first", group: "Timing", common: true },
  { tag: "spouse_partner_decision", label: "Other parent / spouse needs to weigh in", group: "Timing", common: true },
  { tag: "student_resistant", label: "Student isn't bought in", group: "Timing", common: true },

  // Confidence objections
  { tag: "doesnt_believe_score_can_improve", label: "Doesn't believe the score can move", group: "Confidence" },
  { tag: "previous_bad_tutor_experience", label: "Burned by a previous tutor", group: "Confidence" },
  { tag: "skeptical_of_marketing", label: "Wary of tutoring marketing", group: "Confidence" },
  { tag: "needs_proof_of_results", label: "Wants to see proof of past results", group: "Confidence" }
];

export const PRIORITY_SUGGESTIONS: TagSuggestion[] = [
  // Format priorities
  { tag: "one_on_one_mentorship", label: "One-on-one is non-negotiable", group: "Format", common: true },
  { tag: "specific_mentor_personality", label: "Mentor personality fit matters", group: "Format" },
  { tag: "gender_specific_mentor", label: "Wants a specific-gender mentor", group: "Format" },
  { tag: "subject_specialist_match", label: "Wants subject specialist (math vs reading)", group: "Format" },
  { tag: "ivy_grad_or_top_school_mentor", label: "Wants a top-school graduate mentor", group: "Format" },

  // Schedule priorities
  { tag: "evenings_only", label: "Evenings only", group: "Schedule", common: true },
  { tag: "weekends_only", label: "Weekends only", group: "Schedule" },
  { tag: "flexible_schedule", label: "Needs a flexible schedule", group: "Schedule", common: true },
  { tag: "around_sports_schedule", label: "Around sports practice / games", group: "Schedule", common: true },
  { tag: "around_other_activities", label: "Around other activities (band, theater, work)", group: "Schedule" },
  { tag: "consistent_same_time_weekly", label: "Wants the same time every week", group: "Schedule" },

  // Outcome priorities
  { tag: "specific_score_target", label: "Hard score target (1450+, 1500+, etc.)", group: "Outcome" },
  { tag: "score_for_specific_school", label: "Score for a specific school's middle 50%", group: "Outcome" },
  { tag: "score_for_scholarship", label: "Score required for a scholarship", group: "Outcome" },
  { tag: "score_for_recruiting", label: "Score required for athletic recruiting", group: "Outcome" },
  { tag: "score_for_honors_program", label: "Score required for an honors program", group: "Outcome" },

  // Process priorities
  { tag: "communication_with_parent", label: "Wants regular parent communication", group: "Process" },
  { tag: "weekly_progress_reports", label: "Wants weekly progress reports", group: "Process" },
  { tag: "transparent_curriculum", label: "Wants to see the curriculum / plan", group: "Process" },
  { tag: "data_driven_explanation", label: "Wants data-driven explanations", group: "Process" },

  // Learning needs
  { tag: "adhd_friendly", label: "Student has ADHD — needs accommodation-aware mentor", group: "Learning needs" },
  { tag: "anxiety_aware", label: "Test anxiety is a factor", group: "Learning needs" },
  { tag: "504_or_iep", label: "Has a 504 / IEP", group: "Learning needs" },
  { tag: "neurodivergent_friendly", label: "Neurodivergent — needs experienced mentor", group: "Learning needs" },
  { tag: "esl_or_international_student", label: "ESL / international student context", group: "Learning needs" }
];

export const DATA_QUALITY_SUGGESTIONS: TagSuggestion[] = [
  {
    tag: "invalid_contact_info",
    label: "Invalid contact info (bounce / SMS fail)",
    group: "Contact",
    common: true
  },
  {
    tag: "fake_or_spam",
    label: "Fake or spam lead",
    group: "Contact",
    common: true
  },
  {
    tag: "wrong_phone_number",
    label: "Wrong phone number",
    group: "Contact"
  },
  {
    tag: "duplicate_lead",
    label: "Duplicate of another lead",
    group: "Contact"
  },
  {
    tag: "test_or_internal",
    label: "Test / internal booking",
    group: "Contact"
  }
];

export const SUGGESTIONS_BY_CATEGORY: Record<TagCategory, TagSuggestion[]> = {
  buying_trigger: BUYING_TRIGGER_SUGGESTIONS,
  objection: OBJECTION_SUGGESTIONS,
  priority: PRIORITY_SUGGESTIONS,
  data_quality: DATA_QUALITY_SUGGESTIONS
};

export function suggestionLabel(category: TagCategory, slug: string): string {
  const all = SUGGESTIONS_BY_CATEGORY[category];
  return all.find((s) => s.tag === slug)?.label ?? slug.replace(/_/g, " ");
}
