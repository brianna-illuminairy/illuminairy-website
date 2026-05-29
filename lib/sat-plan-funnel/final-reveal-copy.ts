import { GPA_OPTIONS } from "@/lib/sat-plan-funnel/gpa-options";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";
import { KHAN_SAT_MATH_SKILL_COUNT, KHAN_SAT_SKILL_COUNT_LABEL } from "@/lib/sat-skills-copy";
import {
  diagnosisProfileId,
  prepMirrorPhrase,
  recentScoreBandLabel
} from "@/lib/sat-plan-funnel/diagnosis-copy";
import { isTestedHistory } from "@/lib/sat-plan-funnel/funnel-routing";
import { formatPrepLabels } from "@/lib/sat-plan-funnel/prep-labels";
import { normalizePrepMethods } from "@/lib/sat-plan-funnel/prep-options";
import { conservativeScoreGap, targetBandLabel } from "@/lib/sat-plan-funnel/score-gap";
import {
  getTestDateLabel,
  resolveTimelineFromTestDate
} from "@/lib/sat-plan-funnel/sat-test-dates";
import { studentDisplayName, studentVoice } from "@/lib/sat-plan-funnel/student-voice";
import { wrongReasonMatches } from "@/lib/sat-plan-funnel/wrong-options";
import { satProgramOutcomes } from "@/lib/site";

export type RevealStakesLadderStep = {
  label: string;
  sublabel?: string;
};

export type RevealStakesCopy = {
  headline: string;
  paragraphs: string[];
  ladder: RevealStakesLadderStep[];
  footnote: string;
};

export type RevealDiagnosisCopy = {
  headline: string;
  paragraphs: string[];
  differenceParagraph: string;
};

export type RevealBottlenecksCopy = {
  headline: string;
  bullets: string[];
  closingLine: string;
};

export type RevealProofCopy = {
  headline: string;
  storyParagraphs: string[];
  footnote: string;
};

export type BookCtaCopy = {
  headline: string;
  intro: string;
  agenda: string[];
  continueLabel: string;
  footnote: string;
};

function gpaLabel(gpaBand?: string): string | null {
  if (!gpaBand) return null;
  return GPA_OPTIONS.find((row) => row.id === gpaBand)?.label ?? null;
}

function buildStakesLadder(answers: SatPlanAnswers): RevealStakesLadderStep[] {
  const dateLabel = getTestDateLabel(answers.test_date);
  const timeline = resolveTimelineFromTestDate(answers.test_date);

  if (answers.test_date === "test_date_not_planning") {
    return [
      { label: "Pick a test date", sublabel: "Lock the runway" },
      { label: "Focused prep window", sublabel: "Weeks on the right gaps" },
      { label: "Nov 1 EA / ED", sublabel: "Application deadlines" }
    ];
  }

  if (timeline.mode === "exam" && dateLabel) {
    return [
      { label: "Aug 2026 SAT", sublabel: "Last summer window" },
      { label: "Oct 2026 SAT", sublabel: "Common retake date" },
      { label: "Nov 1 deadlines", sublabel: "Early Action & Early Decision" }
    ];
  }

  return [
    { label: "Next SAT date", sublabel: dateLabel ?? "When you're ready" },
    { label: "Focused weeks", sublabel: "Before applications" },
    { label: "Nov 1 EA / ED", sublabel: "Early application deadlines" }
  ];
}

export function buildRevealStakesCopy(answers: SatPlanAnswers): RevealStakesCopy {
  const target = targetBandLabel(answers.target_score);
  const current = recentScoreBandLabel(answers.recent_score);
  const tested = isTestedHistory(answers.test_history);
  const voice = studentVoice(answers);

  const headline = "A higher SAT score changes the application conversation.";

  let lead: string;
  if (tested && current && target !== "your goal") {
    lead =
      voice.isSelf
        ? `For many students, moving from a ${current} to a ${target} range opens a different set of schools, scholarships, and admissions outcomes.`
        : `For many students, moving from a ${current} to a ${target} range opens a different set of schools, scholarships, and admissions outcomes.`;
  } else if (target !== "your goal") {
    lead =
      voice.isSelf
        ? `Reaching a ${target} range on the first official SAT can widen schools, scholarships, and admissions options more than families expect.`
        : `Reaching a ${target} range can widen schools, scholarships, and admissions options more than families expect.`;
  } else {
    lead =
      "A stronger SAT score often widens schools, scholarships, and admissions options — especially for students who already do well in school.";
  }

  const urgency =
    "With Early Action and Early Decision deadlines on November 1, there are only a few realistic test dates left before applications go in.";

  return {
    headline,
    paragraphs: [lead, urgency],
    ladder: buildStakesLadder(answers),
    footnote: "Most families can't afford to waste one of those test dates using the wrong approach."
  };
}

export function buildRevealDiagnosisCopy(answers: SatPlanAnswers): RevealDiagnosisCopy {
  const voice = studentVoice(answers);
  const name = studentDisplayName(answers);
  const tested = isTestedHistory(answers.test_history);
  const gpa = gpaLabel(answers.gpa_band);
  const current = recentScoreBandLabel(answers.recent_score);
  const target = targetBandLabel(answers.target_score);
  const gapPts = conservativeScoreGap(answers.target_score, answers.recent_score);
  const prepMirror = prepMirrorPhrase(answers);
  const timeline = resolveTimelineFromTestDate(answers.test_date);

  let headline: string;
  if (voice.isSelf) {
    headline = "Your score gap looks fixable.";
  } else if (voice.subject === "he") {
    headline = "We think his score gap is fixable.";
  } else if (voice.subject === "she") {
    headline = "We think her score gap is fixable.";
  } else {
    headline = "We think this score gap is fixable.";
  }

  const traitBits: string[] = [];
  if (gpa) traitBits.push(`a ${gpa} GPA`);
  traitBits.push("strong academic habits");
  if (target !== "your goal") traitBits.push(`a clear target of ${target}`);

  const traitsLine =
    voice.isSelf
      ? `${name.charAt(0).toUpperCase()}${name.slice(1)} already has many of the traits we see in strong SAT students: ${traitBits.join(", ")}.`
      : `${name.charAt(0).toUpperCase()}${name.slice(1)} already has many of the traits we see in strong SAT students: ${traitBits.join(", ")}.`;

  const hasRetakeWindow =
    Boolean(answers.test_date) &&
    answers.test_date !== "test_date_not_planning" &&
    Boolean(timeline.weeks);

  const retakeConfidenceSuffix = voice.isSelf
    ? " With time before application deadlines, a retake is a realistic path to meaningful improvement."
    : voice.subject === "he"
      ? " With time before application deadlines, a retake is a realistic path to meaningful improvement."
      : voice.subject === "she"
        ? " With time before application deadlines, a retake is a realistic path to meaningful improvement."
        : " With time before application deadlines, there's a realistic path to meaningful improvement.";

  const paragraphs: string[] = [traitsLine];

  if (tested && current) {
    paragraphs.push(
      voice.isSelf
        ? `But based on what you shared, your current ${current} SAT score likely doesn't reflect your full academic potential yet.`
        : `But based on what you shared, ${voice.possessive} current ${current} SAT score likely doesn't reflect ${voice.possessive} full academic potential yet.`
    );
    const gapBase = voice.isSelf
      ? `You're about ${gapPts} points from your ${target} goal range. Students with similar GPAs and prep history often improve faster once they stop studying everything equally and focus on the smaller set of skills costing the most points.`
      : `${voice.subject.charAt(0).toUpperCase()}${voice.subject.slice(1)}'s about ${gapPts} points from a ${target} goal range. Students with similar GPAs and prep history often improve faster once they stop studying everything equally and focus on the smaller set of skills costing the most points.`;
    paragraphs.push(hasRetakeWindow ? `${gapBase}${retakeConfidenceSuffix}` : gapBase);
  } else {
    paragraphs.push(
      voice.isSelf
        ? "Based on what you shared, there's meaningful upside on the first official SAT — especially with strong grades and a clear target."
        : `Based on what you shared, there's meaningful upside on the first official SAT — especially with ${voice.possessive} grades and a clear target.`
    );
    paragraphs.push(
      "Students with similar GPAs often improve faster once prep focuses on the smaller set of skills the digital SAT actually rewards under time pressure."
    );
    if (hasRetakeWindow) {
      const retakeLine = voice.isSelf
        ? "Because you're planning a retake with time before application deadlines, we believe there's a realistic path to meaningful improvement before the next SAT."
        : voice.subject === "he"
          ? "Because he's planning a retake with time before application deadlines, we believe there's a realistic path to meaningful improvement before the next SAT."
          : voice.subject === "she"
            ? "Because she's planning a retake with time before application deadlines, we believe there's a realistic path to meaningful improvement before the next SAT."
            : "Because there's still time before application deadlines, we believe there's a realistic path to meaningful improvement before the next SAT.";
      paragraphs.push(retakeLine);
    }
  }

  if (prepMirror) {
    paragraphs.push(`${prepMirror} The plateau you're seeing is actually very common.`);
  }

  const differenceParagraph =
    "Most students keep the same prep approach that produced the original score. We find the highest-impact gaps first and train pacing and decision-making for the digital SAT.";

  return { headline, paragraphs, differenceParagraph };
}

function bottleneckFromWrong(answers: SatPlanAnswers): string[] {
  const wrong = answers.wrong_reasons;
  const bullets: string[] = [];

  if (wrongReasonMatches(wrong, "time")) {
    bullets.push("Pacing under time pressure");
  }
  if (wrongReasonMatches(wrong, "focus")) {
    bullets.push("Stamina across the full digital exam");
  }
  if (wrongReasonMatches(wrong, "anxiety")) {
    bullets.push("Confidence under time pressure");
  }
  if (wrongReasonMatches(wrong, "math") || wrongReasonMatches(wrong, "content")) {
    bullets.push("Inconsistent execution in key math skills");
  }
  if (wrongReasonMatches(wrong, "reading")) {
    bullets.push("Reading and writing accuracy under pace");
  }
  if (wrongReasonMatches(wrong, "prep")) {
    bullets.push("Prep that wasn't personalized or timed enough");
  }

  const prepIds = normalizePrepMethods(answers.prep_method);
  if (prepIds.includes("prep_class") || prepIds.includes("prep_khan")) {
    if (!bullets.some((b) => b.includes("personalized"))) {
      bullets.push("Prep methods that weren't personalized enough");
    }
  }

  if (bullets.length === 0) {
    const profile = diagnosisProfileId(answers);
    if (profile === "profile_thorough" || profile === "profile_anxious_performer") {
      bullets.push("Pacing under time pressure", "Stamina across the full digital exam");
    } else if (profile === "profile_class_middle") {
      bullets.push("Group prep that never targeted personal misses", "Pacing under time pressure");
    } else if (profile === "profile_high_ceiling") {
      bullets.push("Test skills not yet trained under pace", "No diagnostic on highest-impact gaps");
    } else {
      bullets.push("A small set of high-impact skills under time pressure", "Prep that spread effort too thin");
    }
  }

  return bullets.slice(0, 5);
}

export function buildRevealBottlenecksCopy(answers: SatPlanAnswers): RevealBottlenecksCopy {
  const current = recentScoreBandLabel(answers.recent_score);
  const target = targetBandLabel(answers.target_score);
  const bullets = bottleneckFromWrong(answers);

  let closingLead = "That combination is extremely common among high-GPA students.";
  if (current && target !== "your goal") {
    closingLead = `That combination is extremely common among high-GPA students — and often what separates a ${current} from a ${target}.`;
  }

  return {
    headline: "Here's where we'd likely start looking.",
    bullets,
    closingLine: closingLead
  };
}

type ProofVariant = "plateau_retaker" | "anxious_performer" | "self_study";

function pickProofVariant(answers: SatPlanAnswers): ProofVariant {
  const wrong = answers.wrong_reasons;
  const prepIds = normalizePrepMethods(answers.prep_method);

  if (wrongReasonMatches(wrong, "anxiety")) return "anxious_performer";
  if (
    prepIds.some((id) => id === "prep_khan" || id === "prep_books" || id === "prep_class")
  ) {
    return "self_study";
  }
  return "plateau_retaker";
}

const PROOF_STORIES: Record<
  ProofVariant,
  { headline: string; buildStory: (answers: SatPlanAnswers) => string[] }
> = {
  plateau_retaker: {
    headline: "We thought he just wasn't a strong test taker.",
    buildStory: (answers) => {
      const prep = formatPrepLabels(normalizePrepMethods(answers.prep_method).filter((id) => id !== "prep_little_none"));
      const prepBit = prep ? ` after months of ${prep.toLowerCase()}` : " despite months of studying";
      return [
        `A student had a 3.9 GPA but kept scoring in the low 1200s${prepBit}.`,
        "After the diagnostic, we realized points were lost from pacing, geometry accuracy, and mental fatigue late in the test.",
        "Over 11 weeks, the score moved from about 1210 to 1380 — in time to submit applications before November deadlines."
      ];
    }
  },
  anxious_performer: {
    headline: "She knew the material — the test just didn't show it.",
    buildStory: () => [
      "A student with a strong GPA kept scoring below where her practice suggested she should.",
      "The diagnostic showed test-day pressure and second-guessing cost more points than missing content.",
      "With timed reps and a tighter plan on her highest-impact skills, she improved enough to apply Early Action with confidence."
    ]
  },
  self_study: {
    headline: "They studied hard — but not on the right things.",
    buildStory: (answers) => {
      const prep = formatPrepLabels(normalizePrepMethods(answers.prep_method));
      const prepBit = prep ? prep.toLowerCase() : "self-study and group prep";
      return [
        `A high-GPA student relied on ${prepBit} but couldn't break past a plateau.`,
        `Nothing was diagnosing which of Khan's ${KHAN_SAT_SKILL_COUNT_LABEL} SAT skills (${KHAN_SAT_MATH_SKILL_COUNT} in math alone) were still weak under time pressure.`,
        "Once prep focused on three high-impact gaps — with a tutor correcting mistakes in real time — the score moved meaningfully before the next test date."
      ];
    }
  }
};

export function buildRevealProofCopy(answers: SatPlanAnswers): RevealProofCopy {
  const variant = pickProofVariant(answers);
  const template = PROOF_STORIES[variant];
  const voice = studentVoice(answers);

  let headline = template.headline;
  if (voice.subject === "she") {
    headline = headline.replace(/\bhe\b/g, "she").replace(/\bHe\b/g, "She").replace(/\bhim\b/g, "her");
  } else if (voice.subject === "they") {
    headline = headline.replace(/\bhe just\b/i, "they just").replace(/\bShe\b/g, "They");
  } else if (voice.isSelf) {
    headline = "I didn't think I was a strong test taker.";
  }

  return {
    headline,
    storyParagraphs: template.buildStory(answers),
    footnote: satProgramOutcomes.varyDisclaimer
  };
}

export function buildBookCtaCopy(answers: SatPlanAnswers): BookCtaCopy {
  const voice = studentVoice(answers);
  const rawName = answers.student_first_name?.trim();
  const target = targetBandLabel(answers.target_score);

  let continueLabel: string;
  if (voice.isSelf) {
    continueLabel = "Build my plan";
  } else if (rawName) {
    continueLabel = `Build ${rawName}'s plan`;
  } else if (voice.subject === "he") {
    continueLabel = "Build his plan";
  } else if (voice.subject === "she") {
    continueLabel = "Build her plan";
  } else {
    continueLabel = "Book free review";
  }

  const intro =
    voice.isSelf
      ? "On the call, we'll walk through your snapshot and answer questions about fit."
      : `On the call, we'll walk through ${voice.possessive} snapshot and answer questions about fit.`;

  const agenda = [
    "Review the score report and what it suggests",
    "Talk through pacing, stamina, and timing issues",
    "Discuss previous prep attempts",
    "Answer questions about the program",
    voice.isSelf
      ? "Determine whether you're a good fit"
      : `Determine whether ${voice.subject === "they" ? "they're" : voice.subject} is a good fit`
  ];

  if (target !== "your goal") {
    agenda.unshift(`Map the fastest realistic path toward ${target}`);
  }

  return {
    headline: "Next step: a free 15-minute SAT Score Review.",
    intro,
    agenda: agenda.slice(0, 5),
    continueLabel,
    footnote: "Opens scheduling in a new tab."
  };
}
