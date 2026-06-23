import { formatPortalLessonDateLine } from "@/lib/portal/lesson-join";
import { KlaviyoEvents } from "@/lib/analytics-registry";
import { trackKlaviyoEvent, upsertKlaviyoProfile } from "@/lib/klaviyo-server";
import { PLAN_BUILDER_FUNNEL_ID, PLAN_BUILDER_VARIANT } from "@/lib/quiz-funnel-b/constants";
import { site } from "@/lib/site";

/** Klaviyo Flow subject — matches Gmail mock on b-post-share. */
export const LAB_WELCOME_EMAIL_SUBJECT = "Welcome to Illuminairy: SAT Session Link";

export type LabFreeLessonKlaviyoInput = {
  lessonStartIso: string;
  portalUrl?: string;
  studentFirst?: string;
  parentFirst?: string;
  calendlyUri?: string;
  satLpVariant?: string;
  lpVariant?: string;
};

export function buildLabFreeLessonKlaviyoProps(input: LabFreeLessonKlaviyoInput) {
  const portalUrl = input.portalUrl ?? `${site.url}/portal/home`;
  const when = formatPortalLessonDateLine(input.lessonStartIso);

  return {
    funnel: PLAN_BUILDER_FUNNEL_ID,
    plan_builder_variant: PLAN_BUILDER_VARIANT,
    free_lesson_at: input.lessonStartIso,
    free_lesson_at_display: when.weekdayTimeRange,
    free_lesson_date_tz: when.monthDayTz,
    portal_url: portalUrl,
    student_first: input.studentFirst?.trim() ?? "",
    welcome_email_subject: LAB_WELCOME_EMAIL_SUBJECT,
    calendly_uri: input.calendlyUri ?? "",
    ...(input.satLpVariant ? { sat_lp_variant: input.satLpVariant } : {}),
    ...(input.lpVariant ? { lp_variant: input.lpVariant } : {}),
  };
}

/** Klaviyo metric for Plan B free lesson booked (welcome email is Resend). */
export async function trackLabFreeLessonBooked(
  email: string,
  input: LabFreeLessonKlaviyoInput
) {
  const props = buildLabFreeLessonKlaviyoProps(input);
  void upsertKlaviyoProfile(email, {
    firstName: input.parentFirst?.trim() || undefined,
    properties: props,
  });
  return trackKlaviyoEvent(email, KlaviyoEvents.freeLessonBooked, props);
}
