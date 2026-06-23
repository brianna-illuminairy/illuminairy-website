"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  initializeRecaptchaConfig,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  type Auth,
  type ConfirmationResult,
} from "firebase/auth";
import { getFirebasePublicConfig } from "@/lib/firebase/public-config";
import { phoneToCalendlyE164 } from "@/lib/calendly/phone-e164";

const RECAPTCHA_CONTAINER_ID = "qfb-recaptcha";

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;
let recaptchaConfigPromise: Promise<void> | null = null;

function getClientApp(): FirebaseApp {
  if (firebaseApp) return firebaseApp;
  const config = getFirebasePublicConfig();
  if (!config) {
    throw new Error("firebase_not_configured");
  }
  firebaseApp = getApps().length
    ? getApps()[0]!
    : initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        appId: config.appId,
        messagingSenderId: config.messagingSenderId,
      });
  return firebaseApp;
}

export function getFunnelFirebaseAuth(): Auth {
  if (firebaseAuth) return firebaseAuth;
  firebaseAuth = getAuth(getClientApp());
  return firebaseAuth;
}

/** Call on phone screen mount — required before Enterprise phone SMS. */
export function preloadFunnelPhoneRecaptcha(): Promise<void> {
  const auth = getFunnelFirebaseAuth();
  return ensureRecaptchaEnterpriseConfig(auth);
}

export function funnelPhoneRecaptchaContainerId(): string {
  return RECAPTCHA_CONTAINER_ID;
}

async function clearRecaptcha(auth: Auth) {
  if (!recaptchaVerifier) return;
  try {
    recaptchaVerifier.clear();
  } catch {
    // ignore stale verifier cleanup
  }
  recaptchaVerifier = null;
  auth.settings.appVerificationDisabledForTesting = false;
}

async function ensureRecaptchaEnterpriseConfig(auth: Auth): Promise<void> {
  if (!recaptchaConfigPromise) {
    recaptchaConfigPromise = initializeRecaptchaConfig(auth)
      .then(() => undefined)
      .catch(() => {
        // Project has no Enterprise recaptchaKey yet — Firebase uses reCAPTCHA v2 for phone SMS.
      });
  }
  await recaptchaConfigPromise;
}

async function ensureRecaptchaVerifier(auth: Auth): Promise<RecaptchaVerifier> {
  await ensureRecaptchaEnterpriseConfig(auth);
  await clearRecaptcha(auth);

  recaptchaVerifier = new RecaptchaVerifier(auth, RECAPTCHA_CONTAINER_ID, {
    size: "invisible",
  });
  await recaptchaVerifier.render();
  return recaptchaVerifier;
}

export async function sendFunnelPhoneVerificationCode(phone: string): Promise<ConfirmationResult> {
  const auth = getFunnelFirebaseAuth();
  const e164 = phoneToCalendlyE164(phone);
  if (!e164) {
    throw new Error("invalid_phone");
  }

  const verifier = await ensureRecaptchaVerifier(auth);
  try {
    return await signInWithPhoneNumber(auth, e164, verifier);
  } catch (error) {
    await clearRecaptcha(auth);
    throw error;
  }
}

export async function confirmFunnelPhoneVerificationCode(
  confirmation: ConfirmationResult,
  code: string
): Promise<string> {
  const auth = getFunnelFirebaseAuth();
  const trimmed = code.replace(/\D/g, "");
  if (trimmed.length < 4) {
    throw new Error("invalid_code");
  }

  const credential = await confirmation.confirm(trimmed);
  const idToken = await credential.user.getIdToken();

  try {
    await signOut(auth);
  } catch {
    // verification token is already issued
  }

  await clearRecaptcha(auth);
  return idToken;
}

export function funnelFirebaseClientErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" &&
    error &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
      ? (error as { code: string }).code
      : "";

  switch (code) {
    case "auth/invalid-phone-number":
      return "Enter a valid US mobile number.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a few minutes and try again.";
    case "auth/code-expired":
      return "That code expired. Request a new one.";
    case "auth/invalid-verification-code":
      return "That code did not match. Try again.";
    case "auth/captcha-check-failed":
      return "Security check failed. Refresh the page and try again.";
    case "auth/invalid-app-credential":
    case "auth/missing-client-identifier":
      return "Security check failed. Refresh the page and try again.";
    case "auth/operation-not-allowed":
      return "Verification is temporarily unavailable. Email support@illuminairy.com.";
    case "auth/quota-exceeded":
      return "Verification is temporarily unavailable. Email support@illuminairy.com.";
    default:
      if (error instanceof Error && error.message === "invalid_phone") {
        return "Enter a valid US mobile number.";
      }
      if (error instanceof Error && error.message === "invalid_code") {
        return "Enter the full code from your text.";
      }
      if (error instanceof Error && error.message === "firebase_not_configured") {
        return "Verification is temporarily unavailable. Email support@illuminairy.com.";
      }
      return "Could not verify right now. Try again.";
  }
}
