/** reCAPTCHA Enterprise site key for Plan B phone verify (Google Cloud console). */

export const FUNNEL_PHONE_RECAPTCHA_ACTION = "phone_verify";

export function getRecaptchaEnterpriseSiteKey(): string | null {
  return process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY?.trim() || null;
}

export function isRecaptchaEnterpriseSiteKeyConfigured(): boolean {
  return getRecaptchaEnterpriseSiteKey() !== null;
}
