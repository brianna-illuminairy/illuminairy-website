import { fetchCalendlyInviteePhone } from "@/lib/calendly/invitee-details";
import type { QuizAnswersSnapshot } from "@/lib/crm/quiz-answers-snapshot";
import type { EnrollPrefillSource } from "@/lib/enroll/enroll-prefill-note";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type Stripe from "stripe";

export type EnrollPrefill = {
  parentFirst: string;
  parentLast: string;
  parentPhone: string;
  parentEmail: string;
  studentFirst: string;
  studentLast: string;
  studentGrade: string;
  studentSchool: string;
  studentPhone: string;
  studentEmail: string;
};

export type EnrollPrefillResult = {
  prefill: EnrollPrefill;
  sources: EnrollPrefillSource[];
};

function emptyPrefill(): EnrollPrefill {
  return {
    parentFirst: "",
    parentLast: "",
    parentPhone: "",
    parentEmail: "",
    studentFirst: "",
    studentLast: "",
    studentGrade: "",
    studentSchool: "",
    studentPhone: "",
    studentEmail: ""
  };
}

function pick(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

function splitName(full: string) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

/** Fill empty target fields from source — never overwrite user-visible values. */
export function mergePrefillFields(
  target: EnrollPrefill,
  source: Partial<EnrollPrefill>
): EnrollPrefill {
  const next = { ...target };
  for (const key of Object.keys(next) as Array<keyof EnrollPrefill>) {
    if (!next[key].trim() && source[key]?.trim()) {
      next[key] = source[key]!.trim();
    }
  }
  return next;
}

function applyLayer(
  prefill: EnrollPrefill,
  source: Partial<EnrollPrefill>,
  sourceTag: EnrollPrefillSource,
  sources: Set<EnrollPrefillSource>
): EnrollPrefill {
  const before = JSON.stringify(prefill);
  const next = mergePrefillFields(prefill, source);
  if (JSON.stringify(next) !== before) {
    sources.add(sourceTag);
  }
  return next;
}

function prefillFromQuizSnapshot(snapshot: QuizAnswersSnapshot | null | undefined): Partial<EnrollPrefill> {
  if (!snapshot) return {};
  const parent = splitName(snapshot.parentName ?? "");
  return {
    parentFirst: parent.first,
    parentLast: parent.last,
    parentPhone: snapshot.parentPhone ?? "",
    parentEmail: snapshot.parentEmail ?? "",
    studentFirst: snapshot.kidName ?? ""
  };
}

function prefillFromStripeMetadata(meta: Record<string, string>): Partial<EnrollPrefill> {
  return {
    parentFirst: meta.parentFirstName ?? "",
    parentLast: meta.parentLastName ?? "",
    parentPhone: meta.parentPhone ?? "",
    parentEmail: meta.parentEmail ?? "",
    studentFirst: meta.studentFirstName ?? "",
    studentLast: meta.studentLastName ?? "",
    studentPhone: meta.studentPhone ?? "",
    studentEmail: meta.studentEmail ?? ""
  };
}

function prefillFromStripeCustomerDetails(
  session: Stripe.Checkout.Session
): Partial<EnrollPrefill> {
  const details = session.customer_details;
  if (!details) return {};
  const name = splitName(details.name ?? "");
  return {
    parentFirst: name.first,
    parentLast: name.last,
    parentPhone: details.phone ?? "",
    parentEmail: details.email ?? session.customer_email ?? ""
  };
}

export async function buildEnrollPrefill(
  session: Stripe.Checkout.Session
): Promise<EnrollPrefillResult> {
  let prefill = emptyPrefill();
  const sources = new Set<EnrollPrefillSource>();
  const meta = session.metadata ?? {};

  const parentEmail = pick(
    meta.parentEmail,
    session.customer_email,
    session.customer_details?.email
  ).toLowerCase();

  const supabase = getSupabaseAdmin();
  if (supabase) {
    if (meta.visitorId) {
      const { data: visitor } = await supabase
        .from("visitors")
        .select("quiz_answers")
        .eq("id", meta.visitorId)
        .maybeSingle();
      prefill = applyLayer(
        prefill,
        prefillFromQuizSnapshot(visitor?.quiz_answers as QuizAnswersSnapshot | undefined),
        "quiz",
        sources
      );
    }

    if (parentEmail) {
      const { data: lead } = await supabase
        .from("leads")
        .select(
          "parent_first, parent_last, parent_phone, student_first, student_grade, student_school, quiz_answers, visitor_id, calendly_event_uri"
        )
        .eq("parent_email", parentEmail)
        .maybeSingle();

      if (lead) {
        prefill = applyLayer(
          prefill,
          {
            parentFirst: lead.parent_first ?? "",
            parentLast: lead.parent_last ?? "",
            parentPhone: lead.parent_phone ?? "",
            parentEmail,
            studentFirst: lead.student_first ?? "",
            studentGrade: lead.student_grade ?? "",
            studentSchool: lead.student_school ?? ""
          },
          "quiz",
          sources
        );
        prefill = applyLayer(
          prefill,
          prefillFromQuizSnapshot(lead.quiz_answers as QuizAnswersSnapshot | undefined),
          "quiz",
          sources
        );

        if (lead.visitor_id && !meta.visitorId) {
          const { data: visitor } = await supabase
            .from("visitors")
            .select("quiz_answers")
            .eq("id", lead.visitor_id)
            .maybeSingle();
          prefill = applyLayer(
            prefill,
            prefillFromQuizSnapshot(visitor?.quiz_answers as QuizAnswersSnapshot | undefined),
            "quiz",
            sources
          );
        }

        if (!prefill.parentPhone.trim() && lead.calendly_event_uri) {
          const calendlyPhone = await fetchCalendlyInviteePhone(lead.calendly_event_uri);
          if (calendlyPhone) {
            prefill = applyLayer(
              prefill,
              { parentPhone: calendlyPhone },
              "calendly",
              sources
            );
          }
        }
      }

      const { data: client } = await supabase
        .from("clients")
        .select("id, parent_first, parent_last, parent_phone")
        .eq("parent_email", parentEmail)
        .maybeSingle();

      if (client) {
        prefill = applyLayer(
          prefill,
          {
            parentFirst: client.parent_first ?? "",
            parentLast: client.parent_last ?? "",
            parentPhone: client.parent_phone ?? "",
            parentEmail
          },
          "quiz",
          sources
        );

        const { data: enrollment } = await supabase
          .from("enrollments")
          .select("student_id")
          .eq("stripe_checkout_session_id", session.id)
          .maybeSingle();

        const studentId = enrollment?.student_id;
        let student:
          | {
              first_name: string | null;
              last_name: string | null;
              grade: string | null;
              school: string | null;
              student_email: string | null;
              student_phone: string | null;
            }
          | null
          | undefined;

        if (studentId) {
          const { data } = await supabase
            .from("students")
            .select("first_name, last_name, grade, school, student_email, student_phone")
            .eq("id", studentId)
            .maybeSingle();
          student = data;
        } else {
          const { data } = await supabase
            .from("students")
            .select("first_name, last_name, grade, school, student_email, student_phone")
            .eq("client_id", client.id)
            .order("created_at", { ascending: false })
            .limit(1);
          student = data?.[0];
        }

        if (student) {
          prefill = applyLayer(
            prefill,
            {
              studentFirst: student.first_name ?? "",
              studentLast: student.last_name ?? "",
              studentGrade: student.grade ?? "",
              studentSchool: student.school ?? "",
              studentPhone: student.student_phone ?? "",
              studentEmail: student.student_email ?? ""
            },
            "quiz",
            sources
          );
        }
      }
    }
  }

  prefill = applyLayer(prefill, prefillFromStripeCustomerDetails(session), "payment", sources);
  prefill = applyLayer(prefill, prefillFromStripeMetadata(meta), "payment", sources);

  // Explicit kidName fallback — quiz_answers snapshot can be fresher than denormalized
  // lead.student_first because the `name` step writes through the snapshot first.
  if (!prefill.studentFirst.trim() && supabase && parentEmail) {
    const { data: leadAnswers } = await supabase
      .from("leads")
      .select("quiz_answers")
      .eq("parent_email", parentEmail)
      .maybeSingle();
    const kid = (leadAnswers?.quiz_answers as QuizAnswersSnapshot | undefined)?.kidName?.trim();
    if (kid) {
      prefill = applyLayer(prefill, { studentFirst: kid }, "quiz", sources);
    }
    if (!prefill.studentFirst.trim() && meta.visitorId) {
      const { data: visitorAnswers } = await supabase
        .from("visitors")
        .select("quiz_answers")
        .eq("id", meta.visitorId)
        .maybeSingle();
      const v = (visitorAnswers?.quiz_answers as QuizAnswersSnapshot | undefined)?.kidName?.trim();
      if (v) {
        prefill = applyLayer(prefill, { studentFirst: v }, "quiz", sources);
      }
    }
  }

  if (!prefill.parentEmail.trim()) {
    prefill.parentEmail = parentEmail;
  }

  return { prefill, sources: Array.from(sources) };
}
