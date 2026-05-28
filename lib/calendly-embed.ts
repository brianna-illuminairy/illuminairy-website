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
  /** Kid first name — maps to custom answer a1 if your event has that question */
  kidFirstName?: string;
};

export type CalendlyUtm = {
  utmCampaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmContent?: string;
  utmTerm?: string;
};

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/** Booking page URL with Aurora colors (fallback when widget.js unavailable). */
export function calendlyEmbedUrl(
  base: string = site.calendlyUrl,
  prefill?: CalendlyPrefill
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
    if (prefill?.email) url.searchParams.set("email", prefill.email);
    if (prefill?.name) url.searchParams.set("name", prefill.name);
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
  }
) {
  const prefill = options?.prefill;
  const nameParts = prefill?.name ? splitName(prefill.name) : null;

  return {
    url: calendlyEmbedUrl(options?.eventUrl ?? site.calendlyUrl, prefill),
    parentElement,
    resize: true,
    pageSettings: { ...CALENDLY_AURORA_PAGE_SETTINGS },
    prefill: {
      email: prefill?.email,
      name: prefill?.name,
      firstName: nameParts?.firstName,
      lastName: nameParts?.lastName || undefined,
      customAnswers: prefill?.kidFirstName
        ? { a1: prefill.kidFirstName }
        : undefined
    },
    utm: options?.utm
      ? {
          utmCampaign: options.utm.utmCampaign,
          utmSource: options.utm.utmSource,
          utmMedium: options.utm.utmMedium,
          utmContent: options.utm.utmContent,
          utmTerm: options.utm.utmTerm
        }
      : undefined
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
