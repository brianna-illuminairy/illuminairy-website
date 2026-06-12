/**
 * Personalize the SSOT sales script for a specific lead. Returns markdown.
 *
 * The base template lives in `sales_script_template.template_markdown`. We
 * substitute parent/student names + inject 2-3 lead-specific lines, but never
 * rewrite the structure.
 */

import { callGeminiText } from "@/lib/integrations/gemini/client";

export type SalesScriptContext = {
  parentFirst: string | null;
  studentFirst: string | null;
  studentGrade: string | null;
  targetExam: string | null;
  satBaseline: string | null;
  mainGoal: string | null;
  additionalContext: string | null;
  templateMarkdown: string;
};

const SYSTEM = `You personalize a Strategy Call sales script for the Illuminairy SAT Accelerator.

Rules:
- Preserve every section heading and the order from the input template exactly.
- Substitute the parent's first name where placeholders like {parent_first} appear.
- Substitute the student's first name where {student_first} appears.
- For each section, ADD at most 2 short lines that reflect this specific lead's intake answers — never invent.
- Voice: warm, specific, no jargon, no em dashes, no "leverage / unlock / journey".
- Do not add new sections, do not delete sections, and do not change the next-step CTA.
- Return only the personalized markdown.`;

export async function personalizeSalesScript(ctx: SalesScriptContext): Promise<string> {
  const lines: string[] = [];
  lines.push("TEMPLATE:");
  lines.push(ctx.templateMarkdown);
  lines.push("\n---\nLEAD CONTEXT:");
  if (ctx.parentFirst) lines.push(`Parent first name: ${ctx.parentFirst}`);
  if (ctx.studentFirst) lines.push(`Student first name: ${ctx.studentFirst}`);
  if (ctx.studentGrade) lines.push(`Grade: ${ctx.studentGrade}`);
  if (ctx.targetExam) lines.push(`Target exam: ${ctx.targetExam}`);
  if (ctx.satBaseline) lines.push(`Baseline: ${ctx.satBaseline}`);
  if (ctx.mainGoal) lines.push(`Main goal: ${ctx.mainGoal}`);
  if (ctx.additionalContext) lines.push(`Notes: ${ctx.additionalContext}`);
  const raw = await callGeminiText({
    prompt: lines.join("\n"),
    systemInstruction: SYSTEM,
    temperature: 0.25,
    maxOutputTokens: 2048
  });
  return raw.trim();
}
