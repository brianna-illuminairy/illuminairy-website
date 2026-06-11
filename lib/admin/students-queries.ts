import { isInternalCrmEmail } from "@/lib/admin/internal-emails";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type StudentListRow = {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string | null;
  grade: string | null;
  school: string | null;
  studentEmail: string | null;
  studentPhone: string | null;
  parentFirst: string | null;
  parentLast: string | null;
  parentEmail: string;
  programLabel: string | null;
  tutorAssigned: string | null;
  baselineScore: string | null;
  targetScore: string | null;
  programStartDate: string | null;
  enrollmentStatus: string | null;
  paidAt: string | null;
  createdAt: string;
};

export async function listCrmStudents(limit = 500): Promise<StudentListRow[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data: students } = await supabase
    .from("students")
    .select(
      "id, client_id, first_name, last_name, grade, school, student_email, student_phone, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!students || students.length === 0) return [];

  const clientIds = Array.from(new Set(students.map((s) => s.client_id)));
  const studentIds = students.map((s) => s.id);

  const [clientsRes, enrollmentsRes] = await Promise.all([
    supabase
      .from("clients")
      .select("id, parent_first, parent_last, parent_email")
      .in("id", clientIds),
    supabase
      .from("enrollments")
      .select(
        "student_id, program_label, status, tutor_assigned, baseline_score, target_score, program_start_date, paid_at, created_at"
      )
      .in("student_id", studentIds)
      .order("created_at", { ascending: false })
  ]);

  const parentByClient = new Map<
    string,
    { parentFirst: string | null; parentLast: string | null; parentEmail: string }
  >();
  for (const c of clientsRes.data ?? []) {
    parentByClient.set(c.id, {
      parentFirst: c.parent_first,
      parentLast: c.parent_last,
      parentEmail: c.parent_email
    });
  }

  // Pick the most-recent enrollment per student.
  const enrollmentByStudent = new Map<
    string,
    {
      programLabel: string | null;
      status: string | null;
      tutorAssigned: string | null;
      baselineScore: string | null;
      targetScore: string | null;
      programStartDate: string | null;
      paidAt: string | null;
    }
  >();
  for (const e of enrollmentsRes.data ?? []) {
    if (!enrollmentByStudent.has(e.student_id)) {
      enrollmentByStudent.set(e.student_id, {
        programLabel: e.program_label,
        status: e.status,
        tutorAssigned: e.tutor_assigned,
        baselineScore: e.baseline_score,
        targetScore: e.target_score,
        programStartDate: e.program_start_date,
        paidAt: e.paid_at
      });
    }
  }

  return students
    .map((s) => {
      const parent = parentByClient.get(s.client_id) ?? {
        parentFirst: null,
        parentLast: null,
        parentEmail: ""
      };
      const enrollment = enrollmentByStudent.get(s.id) ?? {
        programLabel: null,
        status: null,
        tutorAssigned: null,
        baselineScore: null,
        targetScore: null,
        programStartDate: null,
        paidAt: null
      };
      return {
        id: s.id,
        clientId: s.client_id,
        firstName: s.first_name,
        lastName: s.last_name,
        grade: s.grade,
        school: s.school,
        studentEmail: s.student_email,
        studentPhone: s.student_phone,
        parentFirst: parent.parentFirst,
        parentLast: parent.parentLast,
        parentEmail: parent.parentEmail,
        programLabel: enrollment.programLabel,
        tutorAssigned: enrollment.tutorAssigned,
        baselineScore: enrollment.baselineScore,
        targetScore: enrollment.targetScore,
        programStartDate: enrollment.programStartDate,
        enrollmentStatus: enrollment.status,
        paidAt: enrollment.paidAt,
        createdAt: s.created_at
      };
    })
    .filter((row) => !isInternalCrmEmail(row.parentEmail));
}
