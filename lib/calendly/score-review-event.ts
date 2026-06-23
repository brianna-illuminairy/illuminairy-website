import { site, PUBLIC_SCORE_REVIEW_CALENDLY_URL } from "@/lib/site";

export function calendlyEventSlugFromPublicUrl(url: string): string | null {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    return parts.length >= 2 ? parts[1] : null;
  } catch {
    return null;
  }
}

export function scoreReviewCalendlyEventSlug(): string {
  return calendlyEventSlugFromPublicUrl(site.scoreReviewCalendlyUrl) ?? "june-sat-score-review";
}

export function isScoreReviewCalendlyEvent(input: {
  scheduledEventUri?: string | null;
  eventTypeUri?: string | null;
  eventName?: string | null;
}): boolean {
  const slug = scoreReviewCalendlyEventSlug();
  const haystack = [
    input.scheduledEventUri ?? "",
    input.eventTypeUri ?? "",
    input.eventName ?? "",
    PUBLIC_SCORE_REVIEW_CALENDLY_URL,
    site.scoreReviewCalendlyUrl,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(slug.toLowerCase());
}
