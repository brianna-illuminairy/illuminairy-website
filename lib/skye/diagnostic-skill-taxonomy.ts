/**
 * Digital SAT Skill Diagnostic taxonomy — Section → Domain → Topic.
 * SSOT from MentoMind tabular reports (Danielle Jun 2026, Soha Jun 2026).
 * Topics are the lowest discrete level the diagnostic tags per question.
 */

export type DiagnosticSkillTopic = {
  id: string;
  label: string;
  /** Plain-language hint for first-time SAT students. */
  hint?: string;
};

export type DiagnosticSkillDomain = {
  id: string;
  label: string;
  topics: DiagnosticSkillTopic[];
};

export type DiagnosticSkillSection = {
  id: "rw" | "math";
  label: string;
  schoolSpan: string;
  domains: DiagnosticSkillDomain[];
};

export const DIAGNOSTIC_SKILL_HIERARCHY: DiagnosticSkillSection[] = [
  {
    id: "rw",
    label: "Reading & Writing",
    schoolSpan: "3 years of language arts (grades 8–10 English class skills)",
    domains: [
      {
        id: "craft-structure",
        label: "Craft and Structure",
        topics: [
          { id: "words-in-context", label: "Words in Context", hint: "What does this word mean in the passage?" },
          { id: "text-structure-purpose", label: "Text Structure and Purpose", hint: "Why did the author write it this way?" },
          { id: "cross-text-connections", label: "Cross-Text Connections", hint: "How do two short passages relate?" }
        ]
      },
      {
        id: "information-ideas",
        label: "Information and Ideas",
        topics: [
          { id: "central-ideas-details", label: "Central Ideas and Details", hint: "Main point and supporting facts" },
          { id: "command-of-evidence", label: "Command of Evidence", hint: "Which quote or data backs up an answer?" },
          { id: "inferences", label: "Inferences", hint: "What must be true based on the passage?" }
        ]
      },
      {
        id: "standard-english",
        label: "Standard English Conventions",
        topics: [
          { id: "boundaries", label: "Boundaries", hint: "Commas, semicolons, sentence breaks" },
          { id: "form-structure-sense", label: "Form, Structure, and Sense", hint: "Subject-verb agreement, verb tense, pronouns" }
        ]
      },
      {
        id: "expression-ideas",
        label: "Expression of Ideas",
        topics: [
          { id: "transitions", label: "Transitions", hint: "Best word to connect two sentences" },
          { id: "rhetorical-synthesis", label: "Rhetorical Synthesis", hint: "Combine notes into one clear sentence" }
        ]
      }
    ]
  },
  {
    id: "math",
    label: "Math",
    schoolSpan: "Algebra 1 through Algebra 2, plus geometry and basic data analysis (no calculus)",
    domains: [
      {
        id: "algebra",
        label: "Algebra",
        topics: [
          { id: "linear-eq-one", label: "Linear equations in one variable", hint: "Solve for x (e.g. 3x + 7 = 22)" },
          { id: "linear-functions", label: "Linear functions", hint: "Slope, y-intercept, rate of change" },
          { id: "linear-eq-two", label: "Linear equations in two variables", hint: "Lines in the form ax + by = c" },
          { id: "systems-two", label: "Systems of two linear equations in two variables", hint: "Where two lines cross" },
          { id: "linear-inequalities", label: "Linear inequalities in one or two variables", hint: "Shading regions on a graph" }
        ]
      },
      {
        id: "advanced-math",
        label: "Advanced Math",
        topics: [
          {
            id: "nonlinear-eq",
            label: "Nonlinear equations in one variable and systems of equations in two variables",
            hint: "Quadratics, exponents, parabolas"
          },
          { id: "nonlinear-functions", label: "Nonlinear functions", hint: "How a graph curves or grows" },
          { id: "equivalent-expressions", label: "Equivalent expressions", hint: "Factor, expand, or rewrite expressions" }
        ]
      },
      {
        id: "psda",
        label: "Problem-Solving and Data Analysis",
        topics: [
          { id: "ratios-rates", label: "Ratios, rates, proportional relationships, and units", hint: "Unit conversions, miles per hour" },
          { id: "percentages", label: "Percentages", hint: "Percent increase, discount, tip problems" },
          {
            id: "one-var-data",
            label: "One-variable data: distributions and measures of center and spread",
            hint: "Mean, median, range, dot plots"
          },
          {
            id: "two-var-data",
            label: "Two-variable data: models and scatterplots",
            hint: "Trend lines, correlation, tables"
          },
          { id: "probability", label: "Probability and conditional probability", hint: "Chance of an event, given another event" },
          {
            id: "inference-stats",
            label: "Inference from sample statistics and margin of error",
            hint: "Survey samples, confidence intervals"
          }
        ]
      },
      {
        id: "geometry-trig",
        label: "Geometry and Trigonometry",
        topics: [
          { id: "area-volume", label: "Area and volume", hint: "Rectangles, cylinders, 3D shapes" },
          { id: "lines-angles-triangles", label: "Lines, angles, and triangles", hint: "Parallel lines, angle sums, similar triangles" },
          { id: "circles", label: "Circles", hint: "Radius, diameter, arc length, circle equations" }
        ]
      }
    ]
  }
];

export function diagnosticTopicCount(sectionId: "rw" | "math") {
  const section = DIAGNOSTIC_SKILL_HIERARCHY.find((s) => s.id === sectionId);
  if (!section) return 0;
  return section.domains.reduce((sum, d) => sum + d.topics.length, 0);
}

export const DIAGNOSTIC_RW_TOPIC_COUNT = diagnosticTopicCount("rw");
export const DIAGNOSTIC_MATH_TOPIC_COUNT = diagnosticTopicCount("math");
export const DIAGNOSTIC_TOTAL_TOPIC_COUNT = DIAGNOSTIC_RW_TOPIC_COUNT + DIAGNOSTIC_MATH_TOPIC_COUNT;
