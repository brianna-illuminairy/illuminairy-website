import { site } from "@/lib/site";

/** Aurora quiz funnel — matches --qf-* tokens in app/quiz-funnel.css */
export const CALENDLY_AURORA_PAGE_SETTINGS = {
  hideLandingPageDetails: true,
  hideEventTypeDetails: true,
  hideGdprBanner: true,
  backgroundColor: "f4f0e8",
  textColor: "14202e",
  primaryColor: "2f6e47"
} as const;

export type CalendlyPrefill = {
  email?: string;
  name?: string;
  phone?: string;
  /** Student first name → Calendly invitee question a1 (first custom question on event) */
  kidFirstName?: string;
};

export type CalendlyUtm = {
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmContent?: string;
  utmTerm?: string;
};

export type QuizCalendlyContact = {
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  kidName?: string;
};

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/** Quiz S5 → Calendly prefill (name, email, phone, student). */
export function buildQuizCalendlyPrefill(
  answers: QuizCalendlyContact
): CalendlyPrefill {
  const name = answers.parentName?.trim();
  const email = answers.parentEmail?.trim();
  const phone = answers.parentPhone?.trim();
  const kidFirstName = answers.kidName?.trim();

  return {
    name: name || undefined,
    email: email || undefined,
    phone: phone || undefined,
    kidFirstName: kidFirstName || undefined
  };
}

export function hasQuizContactForBooking(answers: QuizCalendlyContact): boolean {
  const email = answers.parentEmail?.trim() ?? "";
  const name = answers.parentName?.trim() ?? "";
  const phone = answers.parentPhone?.trim() ?? "";
  return email.includes("@") && name.length > 0 && phone.length >= 7;
}

function customAnswersFromPrefill(prefill?: CalendlyPrefill) {
  const answers: Record<string, string> = {};
  if (prefill?.kidFirstName) answers.a1 = prefill.kidFirstName;
  return Object.keys(answers).length ? answers : undefined;
}

/** Drop empty UTM fields so Calendly doesn't receive literal "undefined" strings. */
function compactUtm(utm?: CalendlyUtm): CalendlyUtm | undefined {
  if (!utm) return undefined;
  const compact: CalendlyUtm = {};
  if (utm.utmCampaign) compact.utmCampaign = utm.utmCampaign;
  if (utm.utmSource) compact.utmSource = utm.utmSource;
  if (utm.utmMedium) compact.utmMedium = utm.utmMedium;
  if (utm.utmContent) compact.utmContent = utm.utmContent;
  if (utm.utmTerm) compact.utmTerm = utm.utmTerm;
  return Object.keys(compact).length ? compact : undefined;
}

/** Booking page URL with Aurora colors + URL-level prefill (used by widget URL and iframe fallback). */
export function calendlyEmbedUrl(
  base: string = site.calendlyUrl,
  prefill?: CalendlyPrefill,
  options?: { embedDomain?: string }
) {
  try {
    const url = new URL(base);
    const s = CALENDLY_AURORA_PAGE_SETTINGS;
    url.searchParams.set("hide_landing_page_details", "1");
    url.searchParams.set("hide_event_type_details", "1");
    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("background_color", s.backgroundColor);
    url.searchParams.set("text_color", s.textColor);
    url.searchParams.set("primary_color", s.primaryColor);
    url.searchParams.set("embed_type", "Inline");

    if (options?.embedDomain) {
      url.searchParams.set("embed_domain", options.embedDomain);
    }

    if (prefill?.email) url.searchParams.set("email", prefill.email);
    if (prefill?.name) url.searchParams.set("name", prefill.name);

    const nameParts = prefill?.name ? splitName(prefill.name) : null;
    if (nameParts?.firstName) {
      url.searchParams.set("first_name", nameParts.firstName);
    }
    if (nameParts?.lastName) {
      url.searchParams.set("last_name", nameParts.lastName);
    }

    // Phone: append as location on URL (Calendly workaround for call events).
    if (prefill?.phone) {
      url.searchParams.set("location", prefill.phone);
    }

    if (prefill?.kidFirstName) {
      url.searchParams.set("a1", prefill.kidFirstName);
    }

    return url.toString();
  } catch {
    return base;
  }
}

export function buildCalendlyInlineWidgetOptions(
  parentElement: HTMLElement,
  options?: {
    prefill?: CalendlyPrefill;
    utm?: CalendlyUtm;
    eventUrl?: string;
    embedDomain?: string;
  }
) {
  const prefill = options?.prefill;
  const nameParts = prefill?.name ? splitName(prefill.name) : null;
  const embedDomain =
    options?.embedDomain ??
    (typeof window !== "undefined" ? window.location.hostname : undefined);

  return {
    url: calendlyEmbedUrl(options?.eventUrl ?? site.calendlyUrl, prefill, {
      embedDomain
    }),
    parentElement,
    resize: true,
    pageSettings: { ...CALENDLY_AURORA_PAGE_SETTINGS },
    prefill: {
      email: prefill?.email,
      name: prefill?.name,
      firstName: nameParts?.firstName,
      lastName: nameParts?.lastName || undefined,
      location: prefill?.phone,
      smsReminderNumber: prefill?.phone,
      customAnswers: customAnswersFromPrefill(prefill)
    },
    utm: compactUtm(options?.utm)
  };
}

export const CALENDLY_WIDGET_JS =
  "https://assets.calendly.com/assets/external/widget.js";
export const CALENDLY_WIDGET_CSS =
  "https://assets.calendly.com/assets/external/widget.css";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: ReturnType<typeof buildCalendlyInlineWidgetOptions>) => void;
    };
  }
}
