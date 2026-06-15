/**
 * Preset lost_reason slugs for leads.stage = lost.
 * Stored on leads.lost_reason (text); displayed in admin CRM.
 */

export type LostReasonSlug =
  | "invalid_contact_info"
  | "fake_or_spam"
  | "no_response"
  | "budget"
  | "chose_competitor"
  | "not_ready"
  | "merged_duplicate"
  | "other";

export type LostReasonPreset = {
  slug: LostReasonSlug;
  label: string;
  description: string;
  /** When set, "Mark invalid contact" and similar shortcuts also add this tag. */
  tag?: { category: "data_quality"; tag: string };
};

export const LOST_REASON_PRESETS: LostReasonPreset[] = [
  {
    slug: "invalid_contact_info",
    label: "Invalid contact info",
    description: "Email bounce, SMS undeliverable, or phone disconnected.",
    tag: { category: "data_quality", tag: "invalid_contact_info" }
  },
  {
    slug: "fake_or_spam",
    label: "Fake / spam lead",
    description: "Placeholder email, bot, or obvious junk booking.",
    tag: { category: "data_quality", tag: "fake_or_spam" }
  },
  {
    slug: "no_response",
    label: "No response",
    description: "No-show or ghosted after outreach."
  },
  {
    slug: "budget",
    label: "Budget",
    description: "Price did not fit the family."
  },
  {
    slug: "chose_competitor",
    label: "Chose another option",
    description: "Went with another tutor, class, or self-study."
  },
  {
    slug: "not_ready",
    label: "Not ready / bad timing",
    description: "Deferred; may revisit later."
  },
  {
    slug: "merged_duplicate",
    label: "Merged duplicate",
    description: "System: duplicate lead merged into another record."
  },
  {
    slug: "other",
    label: "Other",
    description: "See sales notes."
  }
];

export function lostReasonLabel(slug: string | null | undefined): string {
  if (!slug) return "—";
  const preset = LOST_REASON_PRESETS.find((p) => p.slug === slug);
  return preset?.label ?? slug.replace(/_/g, " ");
}

export function lostReasonPreset(slug: string): LostReasonPreset | undefined {
  return LOST_REASON_PRESETS.find((p) => p.slug === slug);
}
