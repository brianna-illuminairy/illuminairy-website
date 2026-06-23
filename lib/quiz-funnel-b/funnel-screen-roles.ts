/**
 * Plan Builder B lab screen roles — PostHog disambiguation for lab-only steps.
 */
import { canonicalizeQuizStepId } from "@/lib/quiz-funnel-b/funnel-steps";

export type LabFunnelScreenRole =
  | "lab_intake"
  | "lab_social_proof"
  | "lab_plan_preview"
  | "lab_lead_capture"
  | "lab_phone_verify"
  | "lab_claim"
  | "lab_booking"
  | "lab_post_book"
  | "funnel_step";

export type LabFunnelScreenMeta = {
  role: LabFunnelScreenRole;
  component: string | null;
  label: string;
  postHogStep: string;
};

const LAB_SCREEN_META: Record<string, LabFunnelScreenMeta> = {
  "q-grade": {
    role: "lab_intake",
    component: "BStudentGrade",
    label: "Student grade (2026–27)",
    postHogStep: "q-grade",
  },
  "q-school-referral": {
    role: "lab_intake",
    component: "BSchoolReferral",
    label: "School referral",
    postHogStep: "q-school-referral",
  },
  "b-computing": {
    role: "lab_social_proof",
    component: "BComputing",
    label: "Computing + reviews",
    postHogStep: "b-computing",
  },
  "b-plan-ready": {
    role: "lab_plan_preview",
    component: "BPlanReady",
    label: "Plan ready + parent proof",
    postHogStep: "b-plan-ready",
  },
  "b-email": {
    role: "lab_lead_capture",
    component: "BEmailCapture",
    label: "Email capture",
    postHogStep: "b-email",
  },
  "b-zip": {
    role: "lab_lead_capture",
    component: "BZipCode",
    label: "Zip code",
    postHogStep: "b-zip",
  },
  "b-parent-name": {
    role: "lab_lead_capture",
    component: "BParentName",
    label: "Parent name",
    postHogStep: "b-parent-name",
  },
  "b-phone": {
    role: "lab_phone_verify",
    component: "BPhoneVerify",
    label: "Phone verify",
    postHogStep: "b-phone",
  },
  "b-claim": {
    role: "lab_claim",
    component: "BClaimLesson",
    label: "Claim free lesson",
    postHogStep: "b-claim",
  },
  "b-book": {
    role: "lab_booking",
    component: "BBookLesson",
    label: "Book free lesson",
    postHogStep: "b-book",
  },
  "b-post-device": {
    role: "lab_post_book",
    component: "BPostDevice",
    label: "Device preference",
    postHogStep: "b-post-device",
  },
  "b-post-share": {
    role: "lab_post_book",
    component: "BPostShare",
    label: "Share lesson link",
    postHogStep: "b-post-share",
  },
  "b-post-join-tip": {
    role: "lab_post_book",
    component: "BPostJoinTip",
    label: "Join lesson tip",
    postHogStep: "b-post-join-tip",
  },
  booked: {
    role: "lab_post_book",
    component: "BBookedRedirect",
    label: "Booked redirect",
    postHogStep: "booked",
  },
};

const DEFAULT_META: LabFunnelScreenMeta = {
  role: "funnel_step",
  component: null,
  label: "Funnel step",
  postHogStep: "",
};

export function labFunnelScreenMeta(stepId: string): LabFunnelScreenMeta {
  const canonical = canonicalizeQuizStepId(stepId);
  const meta = LAB_SCREEN_META[canonical];
  if (!meta) {
    return { ...DEFAULT_META, postHogStep: canonical };
  }
  return meta;
}

export function labFunnelScreenRole(stepId: string): LabFunnelScreenRole {
  return labFunnelScreenMeta(stepId).role;
}

export function labFunnelScreenComponent(stepId: string): string | null {
  return labFunnelScreenMeta(stepId).component;
}

export function labFunnelScreenLabel(stepId: string): string {
  const meta = labFunnelScreenMeta(stepId);
  return meta.label || meta.postHogStep || stepId;
}
