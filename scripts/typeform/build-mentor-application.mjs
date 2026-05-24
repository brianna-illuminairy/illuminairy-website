#!/usr/bin/env node
/**
 * Build mentor application Typeform payload (fields + logic).
 * Output: scripts/typeform/mentor-application.payload.json
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const states = JSON.parse(
  readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "us-states.json"), "utf8")
);

const REF = {
  welcome: "welcome_mentor_apply",
  location: "fld_current_location",
  choiceUs: "choice_us_resident",
  choiceNonUs: "choice_outside_us",
  state: "fld_us_state",
  zip: "fld_us_zip",
  contact: "fld_contact_info",
  gtProof: "fld_gatech_id_or_transcript",
  resume: "fld_resume",
  linkedin: "fld_linkedin",
  headshot: "fld_headshot",
  why: "fld_why_mentor",
  tysQualified: "tys_application_received",
  tysNotUs: "tys_not_us_resident"
};

function stateChoices() {
  return states.map((label) => ({
    ref: `state_${label.toLowerCase().replace(/\s+/g, "_")}`,
    label
  }));
}

export function buildMentorApplicationForm() {
  return {
    title: "Illuminairy — Mentor / SAT Instructor Application",
    type: "form",
    settings: {
      language: "en",
      progress_bar: "proportion",
      show_progress_bar: true,
      show_typeform_branding: false,
      show_time_to_complete: true,
      show_question_number: true,
      meta: { allow_indexing: false },
      is_public: true,
      are_uploads_public: false,
      autosave_progress: true
    },
    welcome_screens: [
      {
        ref: REF.welcome,
        title: "Apply to mentor with Illuminairy",
        properties: {
          description:
            "We review every application. If you are a fit for the SAT Accelerator, we will email you a link to schedule an interview — we do not publish interview scheduling on the website.\n\nYou will need: contact details, your current U.S. location, Georgia Tech ID or transcript, resume, LinkedIn, a professional headshot, and a short note on why you want to mentor.",
          show_button: true,
          button_text: "Start application"
        }
      }
    ],
    thankyou_screens: [
      {
        ref: REF.tysNotUs,
        title: "Thanks for your interest.",
        type: "thankyou_screen",
        properties: {
          description:
            "Right now we are only accepting mentors who are **currently residing in the United States**. If your situation changes, you are welcome to apply again.",
          show_button: true,
          button_text: "Back to illuminairy.com",
          button_mode: "redirect",
          redirect_url: "https://illuminairy.com/mentors"
        }
      },
      {
        ref: REF.tysQualified,
        title: "Application received — thank you.",
        type: "thankyou_screen",
        properties: {
          description:
            "Our team will review your materials. If you are a strong fit, we will email you at the address you provided with next steps and an invite-only link to schedule an interview. We typically respond within a few business days.",
          show_button: true,
          button_text: "Back to illuminairy.com",
          button_mode: "redirect",
          redirect_url: "https://illuminairy.com/mentors"
        }
      }
    ],
    fields: [
      {
        ref: REF.location,
        title: "Where are you located right now?",
        type: "multiple_choice",
        properties: {
          description:
            "We require mentors to be **physically in the United States** for the current SAT Accelerator cycle.",
          choices: [
            {
              ref: REF.choiceUs,
              label: "United States (I am currently residing in the U.S.)"
            },
            {
              ref: REF.choiceNonUs,
              label: "Outside the United States"
            }
          ]
        },
        validations: { required: true }
      },
      {
        ref: REF.state,
        title: "What U.S. state are you in?",
        type: "dropdown",
        properties: {
          choices: stateChoices(),
          randomize: false,
          alphabetical_order: true
        },
        validations: { required: true }
      },
      {
        ref: REF.zip,
        title: "ZIP code",
        type: "short_text",
        properties: {
          description: "Five-digit ZIP (or ZIP+4). Used for scheduling and local program planning only."
        },
        validations: {
          required: true,
          max_length: 10
        }
      },
      {
        ref: REF.contact,
        title: "Your contact information",
        type: "contact_info",
        properties: {
          fields: [
            {
              ref: "contact_first_name",
              title: "First name",
              subfield_key: "first_name",
              type: "short_text",
              validations: { required: true }
            },
            {
              ref: "contact_last_name",
              title: "Last name",
              subfield_key: "last_name",
              type: "short_text",
              validations: { required: true }
            },
            {
              ref: "contact_email",
              title: "Email",
              subfield_key: "email",
              type: "email",
              validations: { required: true }
            },
            {
              ref: "contact_phone",
              title: "Phone number",
              subfield_key: "phone_number",
              type: "phone_number",
              properties: { default_country_code: "US" },
              validations: { required: true }
            }
          ]
        },
        validations: { required: true }
      },
      {
        ref: REF.gtProof,
        title: "Georgia Tech student ID or transcript",
        type: "file_upload",
        properties: {
          description:
            "Upload a photo or PDF of your **Georgia Tech student ID**, or an **unofficial transcript** showing enrollment. PDF, JPG, or PNG."
        },
        validations: { required: true }
      },
      {
        ref: REF.resume,
        title: "Resume",
        type: "file_upload",
        properties: {
          description: "PDF preferred. Include teaching, tutoring, or leadership experience if relevant."
        },
        validations: { required: true }
      },
      {
        ref: REF.linkedin,
        title: "LinkedIn profile",
        type: "website",
        properties: {
          description: "Full URL, e.g. https://www.linkedin.com/in/your-name"
        },
        validations: { required: true }
      },
      {
        ref: REF.headshot,
        title: "Professional headshot",
        type: "file_upload",
        properties: {
          description:
            "A clear, professional photo (face visible, neutral background). JPG or PNG. Used only for internal vetting and mentor materials — not published without your consent."
        },
        validations: { required: true }
      },
      {
        ref: REF.why,
        title: "Why do you want to be an SAT mentor with Illuminairy?",
        type: "long_text",
        properties: {
          description:
            "In **2–3 sentences**, tell us why you want to be an SAT tutor/mentor/instructor with us, and what makes you think you would be good at it."
        },
        validations: {
          required: true,
          max_length: 1200
        }
      }
    ],
    logic: [
      {
        type: "field",
        ref: REF.location,
        actions: [
          {
            action: "jump",
            details: {
              to: { type: "thankyou", value: REF.tysNotUs }
            },
            condition: {
              op: "is",
              vars: [
                { type: "field", value: REF.location },
                { type: "choice", value: REF.choiceNonUs }
              ]
            }
          }
        ]
      }
    ]
  };
}

if (process.argv[1]?.endsWith("build-mentor-application.mjs")) {
  const out = resolve(root, "scripts/typeform/mentor-application.payload.json");
  const payload = buildMentorApplicationForm();
  writeFileSync(out, JSON.stringify(payload, null, 2));
  console.error(`Wrote ${out} (${payload.fields.length} fields)`);
}
