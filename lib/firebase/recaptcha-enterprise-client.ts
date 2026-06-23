"use client";

import {
  FUNNEL_PHONE_RECAPTCHA_ACTION,
  getRecaptchaEnterpriseSiteKey,
} from "@/lib/firebase/recaptcha-enterprise-public";

declare global {
  interface Window {
    grecaptcha?: {
      enterprise: {
        ready: (callback: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}

const ENTERPRISE_SCRIPT_ID = "illuminairy-recaptcha-enterprise";

let scriptPromise: Promise<void> | null = null;

function loadEnterpriseScript(siteKey: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("recaptcha_browser_only"));
  }

  if (window.grecaptcha?.enterprise) {
    return Promise.resolve();
  }

  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(ENTERPRISE_SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("recaptcha_script_failed")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = ENTERPRISE_SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("recaptcha_script_failed"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export async function executeFunnelPhoneRecaptchaEnterprise(): Promise<{
  token: string;
  action: string;
}> {
  const siteKey = getRecaptchaEnterpriseSiteKey();
  if (!siteKey) {
    throw new Error("recaptcha_not_configured");
  }

  await loadEnterpriseScript(siteKey);

  const enterprise = window.grecaptcha?.enterprise;
  if (!enterprise) {
    throw new Error("recaptcha_script_failed");
  }

  const action = FUNNEL_PHONE_RECAPTCHA_ACTION;

  await new Promise<void>((resolve) => {
    enterprise.ready(() => resolve());
  });

  const token = await enterprise.execute(siteKey, { action });
  if (!token) {
    throw new Error("recaptcha_token_empty");
  }

  return { token, action };
}

export function funnelRecaptchaEnterpriseClientErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    switch (error.message) {
      case "recaptcha_not_configured":
      case "recaptcha_script_failed":
      case "recaptcha_token_empty":
      case "recaptcha_browser_only":
        return "Security check failed. Refresh the page and try again.";
      default:
        break;
    }
  }
  return "Security check failed. Refresh the page and try again.";
}
