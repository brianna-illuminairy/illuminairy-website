import { trackLabFreeLessonBooked } from "@/lib/crm/lab-lesson-klaviyo";
import {
  fetchMeetLinkFromCalendlyInviteeUri,
  sendLabFreeLessonWelcomeEmail,
} from "@/lib/crm/lab-lesson-welcome-email";
import { site } from "@/lib/site";

export type LabFreeLessonNotifyInput = {
  parentEmail: string;
  parentFirst?: string;
  studentFirst?: string;
  lessonStartIso: string;
  calendlyUri: string;
  meetLink?: string | null;
  portalUrl?: string;
  leadId?: string;
  visitorId?: string;
  satLpVariant?: string;
  lpVariant?: string;
};

/** Klaviyo metric + Resend welcome email (deduped by Calendly invitee URI). */
export async function notifyLabFreeLessonBooked(input: LabFreeLessonNotifyInput) {
  const portalUrl = input.portalUrl ?? `${site.url}/portal/home`;
  const email = input.parentEmail.trim().toLowerCase();

  void trackLabFreeLessonBooked(email, {
    lessonStartIso: input.lessonStartIso,
    portalUrl,
    studentFirst: input.studentFirst,
    parentFirst: input.parentFirst,
    calendlyUri: input.calendlyUri,
    satLpVariant: input.satLpVariant,
    lpVariant: input.lpVariant,
  });

  let meetLink = input.meetLink ?? null;
  if (!meetLink && input.calendlyUri) {
    meetLink = await fetchMeetLinkFromCalendlyInviteeUri(input.calendlyUri);
  }

  return sendLabFreeLessonWelcomeEmail({
    parentEmail: email,
    parentFirst: input.parentFirst,
    studentFirst: input.studentFirst,
    lessonStartIso: input.lessonStartIso,
    portalUrl,
    meetLink,
    calendlyUri: input.calendlyUri,
    leadId: input.leadId,
    visitorId: input.visitorId,
  });
}
