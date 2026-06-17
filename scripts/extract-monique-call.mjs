// One-off: run Gemini extraction against a transcript file and print JSON.
// Used when the cron pipeline can't fetch the transcript itself
// (Google OAuth not connected) but we want the same structured output.
//
// Usage: node scripts/extract-monique-call.mjs <transcript_path>

// Run with: node --env-file=.env.local scripts/extract-monique-call.mjs <path>
import { readFileSync } from "fs";

const transcriptPath = process.argv[2];
if (!transcriptPath) {
  console.error("Usage: node scripts/extract-monique-call.mjs <path>");
  process.exit(1);
}

const transcript = readFileSync(transcriptPath, "utf8");
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY missing from .env.local");
  process.exit(1);
}

const SYSTEM = `You are an analyst extracting structured intelligence from a Strategy Call transcript for the Illuminairy SAT Accelerator program. The owner (Brianna) is a consultative sales agent for parents of high schoolers.

Score the call honestly. "Overall" is your composite. Rationale must reference the specific moment that drove the score.

Action items must be CONCRETE, not vague advice. Each must be something a person can do in one sitting.

TAGS - structured CRM intel. Extract three categories plus an urgency read:

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

If a tag does not fit a known slug, invent a snake_case slug that is short (1-3 words) and reusable across other parents. Always include a one-sentence note that quotes or paraphrases the moment that justifies the tag.

URGENCY - single value for the lead:
  low       exploratory, decision is months out
  medium    plans to decide this month
  high      decision needed in the next 2 weeks
  critical  decision needed this week; hard external deadline mentioned
Reason should be specific.

The draft_email is from the owner to the parent. Match Brianna's voice: warm, specific, no marketer jargon, no em dashes. Reference one specific thing the parent said. Always end with a clear next step the parent can act on.

Never invent facts the transcript does not contain. If a section has no signal, return an empty array.`;

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
    summary: { type: "string" },
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
        properties: { tag: { type: "string" }, note: { type: "string" } }
      }
    },
    objections: {
      type: "array",
      maxItems: 6,
      items: {
        type: "object",
        required: ["tag", "note"],
        properties: { tag: { type: "string" }, note: { type: "string" } }
      }
    },
    priorities: {
      type: "array",
      maxItems: 8,
      items: {
        type: "object",
        required: ["tag", "note"],
        properties: { tag: { type: "string" }, note: { type: "string" } }
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
          due_at: { type: "string" },
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
};

const intake = `Intake context (for reference; do not invent beyond this):
Parent: Monique Reynolds <moniquedreynolds@gmail.com>
Student grade: rising junior, private school, 3.7 GPA, honors pre-calc fall, AP calc spring
Target schools: Emory, UGA, Georgia Tech, Kennesaw State
Target SAT: 1400+
Currently using: Khan Academy (school counselor recommended)
No SAT taken yet; only PSAT (no result shared)
`;

const prompt = `Parent first name: Monique
Student first name: (not stated, son)
${intake}---
TRANSCRIPT BEGINS:
${transcript.slice(0, 60000)}
TRANSCRIPT ENDS.`;

const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

const body = {
  systemInstruction: { parts: [{ text: SYSTEM }] },
  contents: [{ role: "user", parts: [{ text: prompt }] }],
  generationConfig: {
    temperature: 0.2,
    maxOutputTokens: 4096,
    responseMimeType: "application/json",
    responseSchema: SCHEMA
  }
};

const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body)
});

if (!res.ok) {
  const txt = await res.text();
  console.error(`Gemini error ${res.status}:`, txt.slice(0, 1000));
  process.exit(1);
}

const data = await res.json();
const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
if (!text) {
  console.error("Empty Gemini response:", JSON.stringify(data).slice(0, 500));
  process.exit(1);
}

try {
  const parsed = JSON.parse(text);
  console.log(JSON.stringify(parsed, null, 2));
} catch (e) {
  console.error("Failed to parse Gemini JSON:", e.message);
  console.error(text.slice(0, 2000));
  process.exit(1);
}
