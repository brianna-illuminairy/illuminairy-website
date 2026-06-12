/**
 * Generate a 1-page pre-call brief in markdown for a specific Strategy Call.
 * Inputs: parent intake answers, quiz answers, past calls, emails, sales notes.
 *
 * Output is markdown — not JSON — because the brief is presented to a human.
 */

import { callGeminiText } from "@/lib/integrations/gemini/client";

export type PreCallBriefContext = {
  parentFirst: string | null;
  parentLast: string | null;
  parentEmail: string;
  studentFirst: string | null;
  studentGrade: string | null;
  targetExam: string | null;
  satBaseline: string | null;
  mainGoal: string | null;
  additionalContext: string | null;
  salesNotes: string | null;
  pastCallsSummary: string | null;
  recentEmailsSummary: string | null;
  callAt: string;
  /** Known buying triggers (slug + optional note). */
  buyingTriggers?: Array<{ tag: string; note?: string | null }>;
  /** Open / unresolved objections. */
  objections?: Array<{ tag: string; note?: string | null }>;
  /** What matters to them (priorities). */
  priorities?: Array<{ tag: string; note?: string | null }>;
  urgencyLevel?: "low" | "medium" | "high" | "critical" | null;
  urgencyReason?: string | null;
};

const SYSTEM = `You write 1-page pre-call briefs for a consultative sales agent (Brianna, the owner) about to have a 15-minute SAT Accelerator Strategy Call with a parent.

Output FORMAT — markdown, exactly these sections in this order, nothing more:

## Snapshot
One sentence: who the parent is, who the student is, what they're trying to accomplish, what raises the urgency.

## What to bring up
Three bullets max. Specific moments / answers / signals worth referencing on the call. Never generic.

## What to listen for
Three bullets max. Open questions where you need MORE info before recommending a path.

## Likely objections
Two bullets max. The actual objection she's likely to hear (price, time, "we tried Khan", etc.) and a one-line response that fits her voice.

## Next-step framing
One sentence on how to land the next step (Skill Diagnostic booking) given what we know.

Constraints:
- No marketer jargon. No em dashes. No "leverage", "unlock", "journey".
- Don't invent. If there's no data for a section, say "No signal yet — ask on the call."
- Address the parent by first name.
- Total length under 220 words.`;

export async function generatePreCallBriefMarkdown(
  ctx: PreCallBriefContext
): Promise<string> {
  const lines: string[] = [];
  lines.push(`Call scheduled: ${ctx.callAt}`);
  lines.push(`Parent: ${ctx.parentFirst ?? ""} ${ctx.parentLast ?? ""} <${ctx.parentEmail}>`);
  if (ctx.studentFirst) lines.push(`Student: ${ctx.studentFirst}`);
  if (ctx.studentGrade) lines.push(`Grade: ${ctx.studentGrade}`);
  if (ctx.targetExam) lines.push(`Target exam: ${ctx.targetExam}`);
  if (ctx.satBaseline) lines.push(`Baseline SAT: ${ctx.satBaseline}`);
  if (ctx.mainGoal) lines.push(`Main goal: ${ctx.mainGoal}`);
  if (ctx.additionalContext) lines.push(`Parent context: ${ctx.additionalContext}`);
  if (ctx.salesNotes) lines.push(`Owner notes from earlier: ${ctx.salesNotes}`);
  if (ctx.urgencyLevel) {
    lines.push(
      `Urgency: ${ctx.urgencyLevel.toUpperCase()}${ctx.urgencyReason ? ` (${ctx.urgencyReason})` : ""}`
    );
  }
  if (ctx.buyingTriggers && ctx.buyingTriggers.length > 0) {
    lines.push(
      `Buying triggers:\n${ctx.buyingTriggers
        .map((t) => `- ${t.tag}${t.note ? `: ${t.note}` : ""}`)
        .join("\n")}`
    );
  }
  if (ctx.objections && ctx.objections.length > 0) {
    lines.push(
      `Open objections:\n${ctx.objections
        .map((t) => `- ${t.tag}${t.note ? `: ${t.note}` : ""}`)
        .join("\n")}`
    );
  }
  if (ctx.priorities && ctx.priorities.length > 0) {
    lines.push(
      `What matters to them:\n${ctx.priorities
        .map((t) => `- ${t.tag}${t.note ? `: ${t.note}` : ""}`)
        .join("\n")}`
    );
  }
  if (ctx.pastCallsSummary) lines.push(`\nPast calls:\n${ctx.pastCallsSummary}`);
  if (ctx.recentEmailsSummary) lines.push(`\nRecent emails:\n${ctx.recentEmailsSummary}`);

  const prompt = lines.join("\n");

  const raw = await callGeminiText({
    prompt,
    systemInstruction: SYSTEM,
    temperature: 0.3,
    maxOutputTokens: 1024
  });
  return raw.trim();
}
