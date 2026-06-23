/** Plan B illuminairy-web key (GCP console). Set NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY to override. */
export const PLAN_B_RECAPTCHA_ENTERPRISE_SITE_KEY =
  "6LfY4y4tAAAAAJIIuRDs0cKXvxWoN4JgKuWmKPJ6";

export const FUNNEL_PHONE_RECAPTCHA_ACTION = "phone_verify";

export function getRecaptchaEnterpriseSiteKey(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY?.trim();
  if (fromEnv) return fromEnv;
  return null;
}

/** Site key for Enterprise execute() — env or Plan B default when enterprise mode is on. */
export function getRecaptchaEnterpriseSiteKeyForClient(): string {
  return getRecaptchaEnterpriseSiteKey() || PLAN_B_RECAPTCHA_ENTERPRISE_SITE_KEY;
}

export function isRecaptchaEnterpriseSiteKeyConfigured(): boolean {
  return getRecaptchaEnterpriseSiteKey() !== null;
}
