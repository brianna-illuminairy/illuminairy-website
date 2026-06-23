import { getSupabaseAdmin } from "@/lib/supabase/server";
import { q5DisplayLabel } from "@/lib/quiz-funnel/quiz-profile";
import { FREE_LESSON_DURATION_MIN } from "@/lib/portal/lesson-join";
import {
  isPortalEnrollUnlocked,
  portalEnrollUnlockAt,
} from "@/lib/portal/enroll-unlock";
import { planBRecommendedPackage } from "@/lib/plan-b/membership-pricing";

export type PortalProfileField = {
  label: string;
  value: string;
};

export type PortalProfileContact = {
  studentFirst: string;
  parentFirst: string;
  parentLast: string;
  parentEmail: string;
  parentPhone: string;
  parentZip: string;
};

export type PortalProfile = {
  studentName: string;
  studentInitials: string;
  parentName: string;
  parentEmail: string;
  contact: PortalProfileContact;
  /** Read-only program / funnel answers */
  programFields: PortalProfileField[];
};

export type PortalLesson = {
  scheduledStart: string | null;
  scheduledEnd: string | null;
  meetLink: string | null;
  durationMin: number;
};

export type PortalEnrollTabState = {
  unlockAt: string | null;
  locked: boolean;
  href: string;
  recommendedPackage: "standard" | "intensive";
};

export type PortalDashboardData = {
  profile: PortalProfile;
  lesson: PortalLesson;
  enrollTab: PortalEnrollTabState;
};

const Q4_LABEL: Record<string, string> = {
  u1000: "Under 1100",
  "1100-1200": "1100–1200",
  "1200-1300": "1200–1300",
  "1300-1400": "1300–1400",
  "1400plus": "1400+",
  na: "No SAT yet",
};

const Q8_LABEL: Record<string, string> = {
  "1250": "1250",
  "1300": "1300",
  "1350": "1350",
  "1400": "1400",
  "1450": "1450+",
  tbd: "Not sure yet",
};

const Q9_LABEL: Record<string, string> = {
  "u3.0": "Under 3.0",
  "3.0-3.3": "3.0 – 3.3",
  "3.3-3.5": "3.3 – 3.5",
  "3.5-3.7": "3.5 – 3.7",
  "3.7-3.9": "3.7 – 3.9",
  "4.0+": "4.0+",
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ST";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function labelOrDash(map: Record<string, string>, key: string | null | undefined): string {
  if (!key) return "—";
  return map[key] ?? key;
}

function emptyEnrollTab(): PortalEnrollTabState {
  return {
    unlockAt: null,
    locked: true,
    href: "/portal/enroll",
    recommendedPackage: "standard",
  };
}

function emptyDashboard(email: string): PortalDashboardData {
  return {
    profile: {
      studentName: "Your student",
      studentInitials: "ST",
      parentName: "",
      parentEmail: email,
      contact: {
        studentFirst: "",
        parentFirst: "",
        parentLast: "",
        parentEmail: email,
        parentPhone: "",
        parentZip: "",
      },
      programFields: [],
    },
    lesson: {
      scheduledStart: null,
      scheduledEnd: null,
      meetLink: null,
      durationMin: FREE_LESSON_DURATION_MIN,
    },
    enrollTab: emptyEnrollTab(),
  };
}

export async function loadPortalDashboard(
  leadId: string | null,
  fallbackEmail: string
): Promise<PortalDashboardData> {
  if (!leadId) return emptyDashboard(fallbackEmail);

  const supabase = getSupabaseAdmin();
  if (!supabase) return emptyDashboard(fallbackEmail);

  const { data: lead } = await supabase
    .from("leads")
    .select(
      "parent_first, parent_last, parent_email, parent_phone, parent_zip, student_first, sat_baseline, main_goal, target_score, sat_next_test, gpa_band, quiz_blockers, quiz_prep_tried, quiz_answers, booked_call_at, school_referral, plan_b_membership_package"
    )
    .eq("id", leadId)
    .maybeSingle();

  if (!lead) return emptyDashboard(fallbackEmail);

  const { data: call } = await supabase
    .from("lead_calls")
    .select("scheduled_start, scheduled_end, meet_link, call_at")
    .eq("lead_id", leadId)
    .eq("call_type", "free_lesson")
    .order("scheduled_start", { ascending: false })
    .limit(1)
    .maybeSingle();

  const studentName = lead.student_first?.trim() || "Your student";
  const parentName = [lead.parent_first, lead.parent_last].filter(Boolean).join(" ").trim();
  const q4 = lead.sat_baseline ?? null;
  const q8 = lead.target_score ?? lead.main_goal ?? null;
  const q5 = lead.sat_next_test ?? null;
  const q9 = lead.gpa_band ?? null;

  const quizAnswers =
    lead.quiz_answers && typeof lead.quiz_answers === "object" && !Array.isArray(lead.quiz_answers)
      ? (lead.quiz_answers as Record<string, unknown>)
      : {};

  const devicePref =
    typeof quizAnswers.devicePreference === "string" ? quizAnswers.devicePreference : null;

  const programFields: PortalProfileField[] = [];
  programFields.push({ label: "Current SAT", value: labelOrDash(Q4_LABEL, q4) });
  programFields.push({ label: "Goal score", value: labelOrDash(Q8_LABEL, q8) });
  const testLabel = q5DisplayLabel(q5) ?? labelOrDash(
    {
      aug22: "Aug 22, 2026",
      sept12: "Sept 12, 2026",
      oct3: "Oct 3, 2026",
      nov7: "Nov 7, 2026",
      dec5: "Dec 5, 2026",
      tbd: "Not sure yet",
      "2027": "2027 or later",
    },
    q5
  );
  programFields.push({ label: "Next SAT", value: testLabel });
  if (q9) programFields.push({ label: "GPA", value: labelOrDash(Q9_LABEL, q9) });

  const blockers = Array.isArray(lead.quiz_blockers)
    ? lead.quiz_blockers.filter((x): x is string => typeof x === "string")
    : [];
  if (blockers.length) {
    programFields.push({ label: "Biggest blockers", value: blockers.join(", ") });
  }

  const tried = Array.isArray(lead.quiz_prep_tried)
    ? lead.quiz_prep_tried.filter((x): x is string => typeof x === "string")
    : [];
  if (tried.length) {
    programFields.push({ label: "Already tried", value: tried.join(", ") });
  }

  if (devicePref === "computer-tablet") {
    programFields.push({ label: "Lesson device", value: "Computer or tablet" });
  } else if (devicePref === "phone") {
    programFields.push({ label: "Lesson device", value: "Phone only" });
  }

  if (lead.school_referral?.trim()) {
    programFields.push({ label: "School referral", value: lead.school_referral.trim() });
  }

  const scheduledStart =
    call?.scheduled_start ??
    call?.call_at ??
    lead.booked_call_at ??
    null;

  let scheduledEnd = call?.scheduled_end ?? null;
  if (scheduledStart && !scheduledEnd) {
    scheduledEnd = new Date(
      new Date(scheduledStart).getTime() + FREE_LESSON_DURATION_MIN * 60_000
    ).toISOString();
  }

  const unlockAt = portalEnrollUnlockAt(scheduledStart);
  const storedPkg = lead.plan_b_membership_package;
  const recommendedPackage =
    storedPkg === "intensive" || storedPkg === "standard"
      ? storedPkg
      : planBRecommendedPackage(q5);

  return {
    profile: {
      studentName,
      studentInitials: initials(studentName),
      parentName,
      parentEmail: lead.parent_email ?? fallbackEmail,
      contact: {
        studentFirst: lead.student_first?.trim() ?? "",
        parentFirst: lead.parent_first?.trim() ?? "",
        parentLast: lead.parent_last?.trim() ?? "",
        parentEmail: lead.parent_email ?? fallbackEmail,
        parentPhone: lead.parent_phone?.trim() ?? "",
        parentZip: lead.parent_zip?.trim() ?? "",
      },
      programFields,
    },
    lesson: {
      scheduledStart,
      scheduledEnd,
      meetLink: call?.meet_link ?? null,
      durationMin: FREE_LESSON_DURATION_MIN,
    },
    enrollTab: {
      unlockAt,
      locked: !isPortalEnrollUnlocked(scheduledStart),
      href: "/portal/enroll",
      recommendedPackage,
    },
  };
}
