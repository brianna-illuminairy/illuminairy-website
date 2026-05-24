export type DiagnosticSkillTag = "strong" | "developing" | "high-impact" | "low-impact";

export type DiagnosticSkill = {
  id: string;
  label: string;
  tag: DiagnosticSkillTag;
  priorityRank?: number;
  /** Illustrative score impact when this skill is prioritized — not a guarantee. */
  pointsGain?: number;
};

export type DiagnosticPhaseKey = "analyzing" | "filtering" | "building" | "ready";

export type Int8DiagnosticDrivenCopy = {
  headlineLead: string;
  headlineAccent: string;
  skillAreaCount: number;
  skills: DiagnosticSkill[];
  prioritySkillIds: string[];
  focusWeekRanges: string[];
  scoreMilestones: Array<number | string>;
  timelineWeeks: number;
  phases: Record<
    DiagnosticPhaseKey,
    {
      title: string;
      subtext?: string;
      summary?: string;
    }
  >;
  graphicAriaLabel: string;
};

const SKILLS: DiagnosticSkill[] = [
  {
    id: "linear-functions",
    label: "Linear functions",
    tag: "high-impact",
    priorityRank: 2,
    pointsGain: 70
  },
  {
    id: "systems",
    label: "Systems of equations",
    tag: "high-impact",
    priorityRank: 4,
    pointsGain: 40
  },
  {
    id: "right-triangles",
    label: "Right triangles & trig",
    tag: "high-impact",
    priorityRank: 1,
    pointsGain: 90
  },
  { id: "probability", label: "Probability", tag: "developing" },
  {
    id: "boundaries",
    label: "Boundaries",
    tag: "high-impact",
    priorityRank: 3,
    pointsGain: 60
  },
  {
    id: "transitions",
    label: "Transitions",
    tag: "high-impact",
    priorityRank: 5,
    pointsGain: 50
  },
  { id: "main-idea", label: "Main idea", tag: "strong" },
  { id: "vocab-context", label: "Vocabulary in context", tag: "strong" },
  { id: "geometry", label: "Geometry", tag: "strong" },
  { id: "inferences", label: "Inferences", tag: "developing" },
  { id: "rhetorical", label: "Rhetorical synthesis", tag: "developing" },
  { id: "ratios", label: "Ratios & rates", tag: "low-impact" },
  { id: "quadratic", label: "Quadratic functions", tag: "low-impact" },
  { id: "data-interpretation", label: "Data interpretation", tag: "low-impact" },
  { id: "command-evidence", label: "Command of evidence", tag: "strong" },
  { id: "words-context", label: "Words in context", tag: "developing" },
  { id: "exponential", label: "Exponential functions", tag: "low-impact" },
  { id: "circle-theorems", label: "Circle theorems", tag: "developing" },
  { id: "standard-english", label: "Standard English conventions", tag: "strong" },
  { id: "cross-text", label: "Cross-text connections", tag: "developing" },
  { id: "percent-change", label: "Percent change", tag: "low-impact" },
  { id: "scatterplots", label: "Scatterplots", tag: "low-impact" },
  { id: "central-ideas", label: "Central ideas & details", tag: "strong" },
  { id: "form-structure", label: "Form, structure & sense", tag: "developing" },
  { id: "equivalent-expressions", label: "Equivalent expressions", tag: "low-impact" },
  { id: "nonlinear-systems", label: "Nonlinear systems", tag: "developing" },
  { id: "text-structure", label: "Text structure & purpose", tag: "strong" },
  { id: "volume-surface", label: "Volume & surface area", tag: "low-impact" }
];

const PRIORITY_SKILL_IDS = [
  "right-triangles",
  "linear-functions",
  "boundaries",
  "systems",
  "transitions"
];

const FOCUS_WEEK_RANGES = ["2–3", "4–5", "6–7", "8–9", "10–11"];

export function buildInt8DiagnosticDrivenCopy(_testTaker?: string): Int8DiagnosticDrivenCopy {
  const skills = SKILLS.map((skill) => ({ ...skill }));

  return {
    headlineLead: "Here's what works better.",
    headlineAccent: "We focus on what moves the score fastest.",
    skillAreaCount: 28,
    skills,
    prioritySkillIds: [...PRIORITY_SKILL_IDS],
    focusWeekRanges: [...FOCUS_WEEK_RANGES],
    scoreMilestones: [1180, 1240, 1310, "1380–1410"],
    timelineWeeks: 12,
    phases: {
      analyzing: {
        title: "Analyzing SAT performance…",
        subtext: "28 SAT skill areas evaluated"
      },
      filtering: {
        title: "Identifying highest-impact weaknesses…"
      },
      building: {
        title: "Building the focus plan…"
      },
      ready: {
        title: "Focused roadmap ready.",
        summary:
          "Students improve faster when they focus on the skills most likely to move their score."
      }
    },
    graphicAriaLabel:
      "Animated analysis: SAT skills evaluated, highest-impact weaknesses ranked with illustrative point impact, then scheduled across weeks 2 through 11 of a 12-week focus plan with score range rising from 1180 toward 1380–1410."
  };
}

export function formatPointsGain(points: number): string {
  return `+${points} pts`;
}

export function tagLabel(tag: DiagnosticSkillTag): string {
  if (tag === "strong") return "STRONG";
  if (tag === "developing") return "DEVELOPING";
  if (tag === "high-impact") return "HIGH IMPACT";
  return "LOW IMPACT";
}

export function prioritySkillsFromCopy(copy: Int8DiagnosticDrivenCopy): DiagnosticSkill[] {
  const byId = new Map(copy.skills.map((skill) => [skill.id, skill]));
  return copy.prioritySkillIds
    .map((id) => byId.get(id))
    .filter((skill): skill is DiagnosticSkill => Boolean(skill))
    .sort((a, b) => (a.priorityRank ?? 99) - (b.priorityRank ?? 99));
}
