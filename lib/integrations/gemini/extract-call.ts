/**
 * Gemini extraction for Strategy Calls. Reads the call transcript + a small
 * intake context blob, returns a strongly-typed structured payload.
 */

import { callGemini } from "@/lib/integrations/gemini/client";

export type ExtractedAction = {
  title: string;
  notes?: string;
  due_at?: string | null;
  assignee?: "owner" | "parent" | "student";
  kind:
    | "post_call"
    | "post_call_check_in"
    | "send_payment_link"
    | "send_resource"
    | "schedule_diagnostic"
    | "schedule_next_call"
    | "follow_up_email"
    | "general";
};

export type ExtractedTag = {
  /** Snake_case slug. Use a known suggestion slug when one fits — otherwise invent a tight, reusable slug. */
  tag: string;
  /** One-sentence reference back to what the parent / student said. */
  note: string;
};

export type ExtractedUrgency = {
  level: "low" | "medium" | "high" | "critical";
  /** Short reason in the parent's words: "ED deadline Nov 1", "last test before apps", etc. */
  reason: string;
};

/**
 * Lead profile fields the call disclosed. Only populate a field when the
 * transcript EXPLICITLY says it — never guess. These will only overwrite
 * blank fields on the lead; existing values are preserved.
 */
export type ExtractedStudentProfile = {
  /** Student first name, only if stated on the call. */
  student_first?: string | null;
  /** Numeric grade as a string ("9"-"12"). "rising junior" → "11", "rising sophomore" → "10", etc. */
  student_grade?: string | null;
  /** Named school only ("Pace Academy"). Skip vague descriptors like "private school". */
  student_school?: string | null;
  /** Baseline score or range as parent stated it ("1100-1200", "1050"). */
  sat_baseline?: string | null;
  /** Specific target score ("1400", "1500+"). */
  main_goal?: string | null;
};

export type ExtractedCall = {
  summary: string;
  parent_top_concerns: string[];
  buying_signals: string[];
  blockers: string[];
  next_step_decision: "qualified" | "follow_up" | "no_fit" | "no_decision";
  call_score: {
    overall: number;
    rapport: number;
    discovery: number;
    pitch_fit: number;
    objection_handling: number;
    next_step: number;
    rationale: string;
  };
  /** Structured tag extraction for CRM tagging. Each tag includes a brief evidence note. */
  buying_triggers: ExtractedTag[];
  objections: ExtractedTag[];
  priorities: ExtractedTag[];
  urgency: ExtractedUrgency;
  /** Profile facts the call disclosed. Cron applies only to empty fields. */
  student_profile_updates?: ExtractedStudentProfile;
  draft_email: {
    subject: string;
    body_text: string;
  };
  action_items: ExtractedAction[];
};

const SCHEMA = {
  type: "object",
  required: [
    "summary",
    "parent_top_concerns",
    "buying_signals",
    "blockers",
    "next_step_decision",
    "call_score",
    "buying_triggers",
    "objections",
    "priorities",
    "urgency",
    "draft_email",
    "action_items"
  ],
  properties: {
    summary: { type: "string", description: "3-5 sentence summary of the call." },
    parent_top_concerns: { type: "array", items: { type: "string" }, maxItems: 5 },
    buying_signals: { type: "array", items: { type: "string" }, maxItems: 5 },
    blockers: { type: "array", items: { type: "string" }, maxItems: 5 },
    next_step_decision: {
      type: "string",
      enum: ["qualified", "follow_up", "no_fit", "no_decision"]
    },
    call_score: {
      type: "object",
      required: [
        "overall",
        "rapport",
        "discovery",
        "pitch_fit",
        "objection_handling",
        "next_step",
        "rationale"
      ],
      properties: {
        overall: { type: "integer", minimum: 0, maximum: 100 },
        rapport: { type: "integer", minimum: 0, maximum: 100 },
        discovery: { type: "integer", minimum: 0, maximum: 100 },
        pitch_fit: { type: "integer", minimum: 0, maximum: 100 },
        objection_handling: { type: "integer", minimum: 0, maximum: 100 },
        next_step: { type: "integer", minimum: 0, maximum: 100 },
        rationale: { type: "string" }
      }
    },
    buying_triggers: {
      type: "array",
      maxItems: 6,
      items: {
        type: "object",
        required: ["tag", "note"],
        properties: {
          tag: { type: "string" },
          note: { type: "string" }
        }
      }
    },
    objections: {
      type: "array",
      maxItems: 6,
      items: {
        type: "object",
        required: ["tag", "note"],
        properties: {
          tag: { type: "string" },
          note: { type: "string" }
        }
      }
    },
    priorities: {
      type: "array",
      maxItems: 8,
      items: {
        type: "object",
        required: ["tag", "note"],
        properties: {
          tag: { type: "string" },
          note: { type: "string" }
        }
      }
    },
    urgency: {
      type: "object",
      required: ["level", "reason"],
      properties: {
        level: { type: "string", enum: ["low", "medium", "high", "critical"] },
        reason: { type: "string" }
      }
    },
    student_profile_updates: {
      type: "object",
      description:
        "Lead profile facts explicitly disclosed on the call. Only include a field if the transcript clearly states it; omit anything you are guessing.",
      properties: {
        student_first: { type: "string" },
        student_grade: {
          type: "string",
          description:
            "Numeric grade as a string. rising junior=11, rising sophomore=10, rising senior=12, rising freshman=9."
        },
        student_school: {
          type: "string",
          description:
            "Named school only (e.g. 'Pace Academy'). Skip vague descriptors like 'private school'."
        },
        sat_baseline: { type: "string" },
        main_goal: { type: "string" }
      }
    },
    draft_email: {
      type: "object",
      required: ["subject", "body_text"],
      properties: {
        subject: { type: "string" },
        body_text: { type: "string" }
      }
    },
    action_items: {
      type: "array",
      maxItems: 10,
      items: {
        type: "object",
        required: ["title", "kind"],
        properties: {
          title: { type: "string" },
          notes: { type: "string" },
          due_at: { type: "string", description: "ISO 8601 datetime, optional." },
          assignee: { type: "string", enum: ["owner", "parent", "student"] },
          kind: {
            type: "string",
            enum: [
              "post_call",
              "post_call_check_in",
              "send_payment_link",
              "send_resource",
              "schedule_diagnostic",
              "schedule_next_call",
              "follow_up_email",
              "general"
            ]
          }
        }
      }
    }
  }
} as const;

const SYSTEM = `You are an analyst extracting structured intelligence from a Strategy Call transcript for the Illuminairy SAT Accelerator program. The owner (Brianna) is a consultative sales agent for parents of high schoolers.

Score the call honestly. "Overall" is your composite. Rationale must reference the specific moment that drove the score.

Action items must be CONCRETE, not vague advice. Each must be something a person can do in one sitting.

TAGS — structured CRM intel. Extract three categories plus an urgency read:

  buying_triggers  WHY they are reaching out now. Reuse these slugs when they fit (in order of preference):
                   got_low_score, missed_target_by_50_plus, missed_target_by_100_plus,
                   psat_below_expectations, going_into_sophomore_year,
                   going_into_junior_year, going_into_senior_year,
                   rising_senior_summer, last_chance_before_apps,
                   ED_deadline_pressure, EA_deadline_pressure,
                   scholarship_deadline, parent_initiated, student_initiated,
                   school_counselor_recommended, friend_recommended_us,
                   tried_self_study_failed, tried_group_class_failed,
                   tried_other_tutor_unhappy, summer_break_starting,
                   athlete_recruitment_pressure.

  objections       WHAT is blocking the close. Reuse these slugs when they fit:
                   price_too_high, payment_plan_needed, financial_aid_required,
                   comparing_with_cheaper_option, wanted_in_person,
                   wanted_local_tutor, wanted_group_setting, skeptical_of_virtual,
                   prefer_self_study, already_using_khan_or_other,
                   timing_conflict, considering_other_options_first,
                   spouse_partner_decision, student_resistant,
                   doesnt_believe_score_can_improve, previous_bad_tutor_experience,
                   needs_proof_of_results.

  priorities       WHAT MATTERS to them. Reuse these slugs when they fit:
                   one_on_one_mentorship, specific_mentor_personality,
                   gender_specific_mentor, evenings_only, weekends_only,
                   flexible_schedule, around_sports_schedule,
                   around_other_activities, consistent_same_time_weekly,
                   specific_score_target, score_for_specific_school,
                   score_for_scholarship, score_for_recruiting,
                   communication_with_parent, weekly_progress_reports,
                   transparent_curriculum, adhd_friendly, anxiety_aware,
                   504_or_iep, neurodivergent_friendly, esl_or_international_student.

If a tag doesn't fit a known slug, invent a snake_case slug that is short (1-3 words) and reusable across other parents. Always include a one-sentence note that quotes or paraphrases the moment that justifies the tag.

URGENCY — single value for the lead:
  low       exploratory, decision is months out
  medium    plans to decide this month
  high      decision needed in the next 2 weeks
  critical  decision needed this week; hard external deadline mentioned
Reason should be specific ("ED Nov 1", "last SAT before applications", "scholarship deadline next month").

STUDENT_PROFILE_UPDATES — only fill fields the transcript EXPLICITLY states. Skip a field if you'd be guessing. The CRM only writes these into blank profile fields; existing values are preserved.
  student_first   Use only if the student is named on the call.
  student_grade   Numeric string. "rising junior" -> "11", "rising sophomore" -> "10", "rising senior" -> "12", "rising freshman" -> "9". Current grade stays as the number ("currently a sophomore" -> "10").
  student_school  Named school only (e.g. "Pace Academy", "Lakeside High"). Do NOT fill from vague descriptors like "private school" or "his school".
  sat_baseline    Score or range as stated ("1100-1200", "1050"). Skip if no number given.
  main_goal       Specific target score ("1400", "1500+"). Skip if no number given.

The draft_email is from the owner to the parent. Match Brianna's voice: warm, specific, no marketer jargon, no em dashes. Reference one specific thing the parent said. Always end with a clear next step the parent can act on.

Never invent facts the transcript doesn't contain. If a section has no signal, return an empty array.`;

export async function extractCallFromTranscript(args: {
  transcript: string;
  intakeSummary?: string | null;
  parentFirst?: string | null;
  studentFirst?: string | null;
}): Promise<ExtractedCall> {
  const intake = args.intakeSummary
    ? `Intake context (for reference; do not invent beyond this):\n${args.intakeSummary}\n\n`
    : "";
  const parent = args.parentFirst ? `Parent first name: ${args.parentFirst}\n` : "";
  const student = args.studentFirst ? `Student first name: ${args.studentFirst}\n` : "";
  const prompt = `${parent}${student}${intake}---\nTRANSCRIPT BEGINS:\n${args.transcript.slice(0, 60_000)}\nTRANSCRIPT ENDS.`;

  const { json } = await callGemini<ExtractedCall>({
    prompt,
    systemInstruction: SYSTEM,
    schema: SCHEMA as unknown as Record<string, unknown>,
    temperature: 0.2,
    maxOutputTokens: 4096
  });
  return json;
}
