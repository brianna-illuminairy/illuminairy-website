import { isRecaptchaEnterpriseAssessmentConfigured } from "@/lib/firebase/recaptcha-enterprise-assess";
import {
  getRecaptchaEnterpriseSiteKey,
  PLAN_B_RECAPTCHA_ENTERPRISE_SITE_KEY,
} from "@/lib/firebase/recaptcha-enterprise-public";

/** Plan B phone SMS — reCAPTCHA Enterprise assessments when server key is configured. */
export function isFunnelPhoneEnterpriseRecaptchaEnabled(): boolean {
  if (process.env.FIREBASE_ENTERPRISE_RECAPTCHA === "0") {
    return false;
  }
  const siteKey = getRecaptchaEnterpriseSiteKey() || PLAN_B_RECAPTCHA_ENTERPRISE_SITE_KEY;
  return Boolean(siteKey) && isRecaptchaEnterpriseAssessmentConfigured();
}
