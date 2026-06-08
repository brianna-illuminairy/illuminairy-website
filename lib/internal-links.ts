/**
 * Invite-only links — not used in public site CTAs or embedded widgets.
 * Send these manually (email) after you review an application.
 */

/** SAT family consultations — public; also wired via NEXT_PUBLIC_CALENDLY_URL / site.calendlyUrl */
export const publicConsultationPath = "/contact#schedule";

/** White-labeled tutoring practice platform — student login (Danielle portal nav). */
export const practicePortalLoginUrl = "https://my.illuminairy.com/login";

/**
 * Mentor interview — invite only after resume review.
 * Do not import this in client components or public pages.
 */
export const tutorInterviewCalendlyUrl =
  process.env.TUTOR_CALENDLY_URL ||
  "https://calendly.com/brianna-illuminairy/tutor-call";
