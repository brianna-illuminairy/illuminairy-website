import { isRecaptchaEnterpriseAssessmentConfigured } from "@/lib/firebase/recaptcha-enterprise-assess";
import { isRecaptchaEnterpriseSiteKeyConfigured } from "@/lib/firebase/recaptcha-enterprise-public";

/** Optional GCP Enterprise layer — only when site key + service account are both set. */
export function isFunnelPhoneEnterpriseRecaptchaEnabled(): boolean {
  return (
    isRecaptchaEnterpriseSiteKeyConfigured() && isRecaptchaEnterpriseAssessmentConfigured()
  );
}
