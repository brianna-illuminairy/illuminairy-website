/** Pronouns from opening Q1 (`qWho`: child vs self). */

export type QuizWhoId = "child" | "self";

export type QuizSubjectVoice = {
  isSelf: boolean;
  subject: string;
  possessive: string;
  object: string;
  reflexive: string;
};

export function isQuizSelfTaker(qWho?: string): boolean {
  return qWho === "self";
}

export function quizSubjectVoice(qWho?: string): QuizSubjectVoice {
  if (isQuizSelfTaker(qWho)) {
    return {
      isSelf: true,
      subject: "you",
      possessive: "your",
      object: "you",
      reflexive: "yourself"
    };
  }
  return {
    isSelf: false,
    subject: "they",
    possessive: "their",
    object: "them",
    reflexive: "themselves"
  };
}

export function stakesQuestionHtml(qWho?: string): string {
  const { object } = quizSubjectVoice(qWho);
  return `What would a higher SAT score help ${object} <em>achieve</em>?`;
}

export function timesTakenQuestion(qWho?: string): string {
  return isQuizSelfTaker(qWho)
    ? "Have you taken the SAT before?"
    : "Have they taken the SAT before?";
}

export function recentScoreQuestionHtml(qWho?: string, hasSat = true): string {
  if (hasSat) {
    return isQuizSelfTaker(qWho)
      ? "What's your <em>most recent</em> SAT score?"
      : "What's the <em>most recent</em> SAT score?";
  }
  return isQuizSelfTaker(qWho)
    ? "Best estimate of where you'd score <em>today</em>?"
    : "Best estimate of where they'd score <em>today</em>?";
}

export function recentScoreWhyWeAsk(qWho?: string, hasSat = true): string {
  if (hasSat) {
    return "This helps us estimate a realistic improvement range before test day.";
  }
  return isQuizSelfTaker(qWho)
    ? "Optional. The Skill Diagnostic sets the real starting point. A rough band helps us preview your Improvement Plan."
    : "Optional. The Skill Diagnostic sets the real starting point. A rough band helps us preview your Improvement Plan.";
}

export function nextSatQuestionHtml(qWho?: string): string {
  return isQuizSelfTaker(qWho)
    ? "When's your <em>next</em> SAT?"
    : "When's their <em>next</em> SAT?";
}

export function blockerOptionLabel(id: string, qWho?: string): string {
  if (id === "wont") {
    return isQuizSelfTaker(qWho)
      ? "Won't study on my own"
      : "Won't study on their own";
  }
  const labels: Record<string, string> = {
    math: "Math",
    reading: "Reading & writing",
    "self-study": "Self-study isn't working",
    "no-plan": "No clear plan",
    "too-busy": "Too busy"
  };
  return labels[id] ?? id;
}

export function prepQuestionHtml(qWho?: string, hasSat = true): string {
  if (hasSat) {
    return isQuizSelfTaker(qWho)
      ? "How did you prepare for your <em>last SAT</em>?"
      : "How did they prep for their <em>last SAT</em>?";
  }
  return isQuizSelfTaker(qWho)
    ? "How have you <em>prepared</em> so far?"
    : "How have they <em>prepared</em> so far?";
}

export function goalScoreQuestionHtml(qWho?: string): string {
  return isQuizSelfTaker(qWho)
    ? "What score are you <em>aiming for</em>?"
    : "What score are they <em>aiming for</em>?";
}

export function gpaQuestionHtml(qWho?: string): string {
  return isQuizSelfTaker(qWho)
    ? "What's your <em>GPA</em>?"
    : "What's their <em>GPA</em>?";
}

export function gpaWhyWeAsk(qWho?: string): string {
  const { possessive } = quizSubjectVoice(qWho);
  return `${possessive.charAt(0).toUpperCase()}${possessive.slice(1)} GPA helps us set a realistic score target and shape ${possessive} Improvement Plan for ${possessive} timeline.`;
}

export function nameQuestionHtml(qWho?: string): string {
  return isQuizSelfTaker(qWho)
    ? "What's your <em>first name</em>?"
    : "What's your student's <em>first name</em>?";
}

export function nameWhyWeAsk(qWho?: string): string {
  const { possessive } = quizSubjectVoice(qWho);
  return `We'll personalize ${possessive} plan and score roadmap with ${possessive} name.`;
}

/** Locked effort line — possessive follows qWho (your vs their). */
export function scorePathEffortLine(qWho?: string): string {
  const { possessive } = quizSubjectVoice(qWho);
  return `~5–7 hrs/week · mistake-driven SAT tutoring on ${possessive} weakest skills`;
}

export function revealPlanCta(qWho?: string): string {
  return isQuizSelfTaker(qWho) ? "Continue to your plan" : "Continue to their plan";
}

export function buildPlanCta(qWho?: string): string {
  return isQuizSelfTaker(qWho) ? "Build my plan" : "Build their plan";
}

export function stakesOptionLabel(id: string, qWho?: string): string {
  if (!isQuizSelfTaker(qWho)) {
    const child: Record<string, string> = {
      "top-choice": "Get into their top-choice school",
      merit: "Qualify for merit scholarships",
      selective: "Stay competitive at selective colleges",
      "app-rounds": "Be ready for early application rounds"
    };
    return child[id] ?? id;
  }
  const self: Record<string, string> = {
    "top-choice": "Get into my top-choice school",
    merit: "Qualify for merit scholarships",
    selective: "Stay competitive at selective colleges",
    "app-rounds": "Be ready for early application rounds"
  };
  return self[id] ?? id;
}
