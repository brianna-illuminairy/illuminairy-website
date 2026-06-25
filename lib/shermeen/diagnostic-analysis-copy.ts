import {
  SHERMEEN_MATH_SKILL_AREA_COUNT,
  SHERMEEN_MATH_SKILLS_15_PLUS,
  SHERMEEN_RW_SKILL_AREA_COUNT,
  SHERMEEN_RW_SKILLS_15_PLUS,
} from "@/lib/shermeen/diagnostic-skill-points";

/** Mentor narrative from the June 23, 2026 diagnostic. */

export type MissBullet = { q: string; text: string };

export type RwSkillListItem = string | { label: string; text: string };

export type RwSkillBodyBlock =
  | { kind: "p"; text: string }
  | { kind: "ul"; intro?: string; items: RwSkillListItem[] }
  | { kind: "ol"; intro?: string; items: string[] };

export type RwSkillBlock = {
  rank: number;
  title: string;
  lead: string;
  misses: MissBullet[];
  body: RwSkillBodyBlock[];
};

export type MathWalkthroughRow = {
  question: string;
  how: string;
  desmos: string;
  formulaNeeded: "Yes" | "No";
  formulaName: string;
  marked: string;
};

export const SHERMEEN_OVERVIEW_INTRO = [
  "Shermeen took her full-length Skill Diagnostic on June 23, 2026. Her total score range was 1100 to 1150, with Reading and Writing at 540 to 560 and Math at 560 to 590. That is slightly above her unproctored Blue Book practice average of about 1080, and above the national average total score of 1029 among the College Board class of 2025 (graduating seniors who took the SAT, using each student's most recent score if they tested more than once).",
  "Math was the stronger section on this test. She missed 20 Reading and Writing questions and 14 Math questions.",
  `Those misses were not highly concentrated in any one particular skill set. Instead, they were spread across multiple skills within each section. On Reading and Writing, wrong answers touched ${SHERMEEN_RW_SKILL_AREA_COUNT} different skill areas, including transitions, command of evidence, form and structure, boundaries, text structure, central ideas, inferences, rhetorical synthesis, and words in context. No single topic carried most of that section. Math looked similar: ${SHERMEEN_MATH_SKILL_AREA_COUNT} skill areas picked up at least one miss, including factoring, circles, linear functions, nonlinear graphs, statistics, and grid-in questions, rather than one thread accounting for almost everything.`,
  `When I rank those misses by how often each question type appears on the SAT and the difficulty of what she missed on this test, ${SHERMEEN_RW_SKILLS_15_PLUS} Reading and Writing skills and ${SHERMEEN_MATH_SKILLS_15_PLUS} Math skills cross a 15-point modeled impact line on this diagnostic. Several other skills still show up below that threshold. Spread does not mean we work everything at once. It means we rotate through a longer ranked list in each section, one skill at a time, starting with the highest-impact areas first.`,
  `On Reading and Writing she scored 70% on hard questions and 38% on easy, with most of her wrong answers on easy or medium questions spread across ${SHERMEEN_RW_SKILL_AREA_COUNT} skill areas. Students who struggle on easy and medium questions across a broad set of skills typically need to learn the SAT question types, how to identify what each one is asking, and the best method to apply to arrive at the correct answer. Shermeen's results fit that profile. Easy questions on this test usually test one specific rule or question type; hard questions often reward working through a longer passage.`,
  "We will help her build this foundation by teaching the question types, how to identify what each question is asking, and the best method to solve it. We go through examples every session until she has the type, the ask, and the method memorized. There are more than 20 question types across Reading and Writing and Math, so this takes repetition, but it is the same process in each section.",
  "Below I walk through how Module 2 was assigned in each section, her Reading and Writing results by skill, her Math results with a question-by-question table, and what her timing charts show. The goal is to make clear where tutoring time will move her score fastest.",
];

export const SHERMEEN_OVERVIEW_INTRO_FOOTNOTE =
  "National average · College Board 2025 SAT Suite Annual Report (total-group mean, most recent score if retaken).";

export const SHERMEEN_ADAPTIVE_INTRO = [
  "The Digital SAT has two modules per section. How you do on Module 1 affects whether Module 2 stays on an easier question set or moves to a harder one. If you miss too many easy and medium questions in Module 1, Module 2 usually stays easier, which caps how high that section score can go. In practice, Reading and Writing Module 1 often needs about 18 correct out of 27 before Module 2 gets harder, and Math Module 1 often needs about 13 or 14 out of 22.",
];

export const SHERMEEN_ADAPTIVE_RW =
  "On Reading and Writing, Shermeen got 21 of 27 correct in Module 1 (77.8%), enough that Module 2 used the harder question set. In Module 2 she got 13 of 27 correct. Most of her Reading and Writing wrong answers were in Module 2, but six of her seven Module 1 wrong answers were easy or medium questions on grammar, transitions, evidence, and rhetorical synthesis. That is where her easy-and-medium miss profile shows up first.";

export const SHERMEEN_ADAPTIVE_MATH =
  "On Math, she got 16 of 22 correct in Module 1 (72.7%), so Module 2 also used the harder question set. She got 14 of 22 correct there. The work now is fixing the question types she missed in Module 1 before they show up again in Module 2, and tightening medium-difficulty Math where she was at 50% across the full section.";

export const SHERMEEN_RW_INTRO_LEAD =
  `Shermeen missed 20 Reading and Writing questions across both modules, spread across transitions, command of evidence, form and structure, boundaries, text structure, central ideas, inferences, rhetorical synthesis, and words in context. She scored 70% on hard questions and 38% on easy in this section, with most wrong answers on easy or medium questions across those ${SHERMEEN_RW_SKILL_AREA_COUNT} skill areas. Students who struggle on easy and medium questions across a broad set of Reading and Writing skills typically need to learn each question type, how to identify what that type is asking, and the best method to apply before working the answer choices. Shermeen's results fit that profile. In Module 1 she got hard craft-and-structure and central-ideas questions right while missing easy transition, evidence, and rhetorical synthesis questions. On most wrong answers she picked an answer that fit the passage theme but did not match what that question type was asking for.`;

export const SHERMEEN_RW_PLAN_NOTE =
  "Because the misses are spread out, we still work one skill at a time in ranked order. Each session we teach the question type, how to identify what it is asking, and the best method to use, then walk through examples until she has it memorized. Timed practice on that skill follows until she hits 95%+ accuracy on medium questions before we move to the next.";

/** Module 1 wrong answers with Mentomind timing and marked responses (June 2026 review). */
export const SHERMEEN_RW_M1_MISSES_HEAD =
  "Module 1 wrong answers, question by question (7 of 27)";

export const SHERMEEN_RW_M1_MISSES: MissBullet[] = [
  {
    q: "Q10 (easy, Command of Evidence)",
    text: "The question asked which choice best supports a stated claim. She spent about 125 seconds, well above the average of about 75 seconds, and marked an answer that cited a true detail from the passage without matching the claim in the question stem.",
  },
  {
    q: "Q11 (easy, Command of Evidence, 115 seconds)",
    text: 'Dr. Santos asserts that drinking water availability is the most frequently reported impact across all regions. Shermeen spent nearly two minutes and marked an answer that cited a true table detail without matching that specific claim. On evidence questions, several answers can be factually correct from the table; only one supports the exact assertion in the question stem.',
  },
  {
    q: "Q15 (medium, Inferences, 80 seconds)",
    text: 'The caterpillar-vibration study found that only chewing-mimicking vibrations raised glucosinolates; silence and wind-like vibrations did not. She marked an answer claiming glucosinolates are the "most effective" defense mechanism. The passage never compares defenses or ranks effectiveness. The logical completion is that the plant can distinguish caterpillar chewing vibrations from other vibrations.',
  },
  {
    q: "Q20 (easy, Form/Structure, Verb tense, 32 seconds)",
    text: 'The sentence places a 1974 discovery after an earlier Olduvai Gorge find ("well before that date"). That requires past perfect: "had already made." She marked "already made" (simple past), which does not show the earlier discovery happened before 1974.',
  },
  {
    q: "Q23 (easy, Transitions, 77 seconds)",
    text: 'The second sentence gives iconic examples that confirm the Renaissance creativity claim in the first sentence. That is emphasis or restatement, so the transition is "Indeed." She marked "Nevertheless," a contrast word, even though the two sentences agree rather than conflict.',
  },
  {
    q: "Q24 (easy, Transitions, 43 seconds)",
    text: 'The poem seems like "barren terrain" for analysis, but Bloom finds "fertile ground" in the opening stanza. That is contrast. The correct transition is "Nonetheless." She marked "In turn," which signals sequence or role change, not opposition.',
  },
  {
    q: "Q26 (easy, Rhetorical Synthesis, 50 seconds)",
    text: 'The goal asked for an advantage of Dr. Patel\'s new alloy. The notes say it was durable and required simpler production methods than traditional titanium alloys. She marked an answer that described what the alloy is and repeated general facts about titanium in aerospace, but never named the advantage (simpler manufacturing).',
  },
];

/** Module 2 wrong answers with Mentomind timing and marked responses (June 2026 review). */
export const SHERMEEN_RW_M2_MISSES_HEAD =
  "Module 2 wrong answers, question by question (13 of 27)";

export const SHERMEEN_RW_M2_MISSES: MissBullet[] = [
  {
    q: "Q2 (medium, Words in Context, 78 seconds)",
    text: 'Methane findings "challenge" existing theories, and the sentence says revisions "may be necessary" but not necessarily a full rewrite. The blank needs a strong-change word that fits "won\'t necessarily require." She marked "reinforce," which contradicts "challenge." The correct direction is "overhaul."',
  },
  {
    q: "Q6 (medium, Text Structure, 214 seconds)",
    text: 'The underlined sentence names what botanists are uncertain about (reproductive timing), which sets up Priya Sharma\'s research in the next sentence. She marked an answer about a "contrasting viewpoint" on environmental adaptations because she saw "however." The contrast is about confidence level on a different question, not about whether the flower survives cold. This was her largest Reading and Writing time sink on the test.',
  },
  {
    q: "Q8 (hard, Text Structure, 20 seconds)",
    text: 'The underlined Wharton sentence describes the barren landscape ("frozen fields," "silence"). She marked an answer about internal conflict, which fits the passage theme but not the function of that specific sentence. She answered in 20 seconds on a hard question.',
  },
  {
    q: "Q10 (medium, Central Ideas, 34 seconds)",
    text: 'Sonnet 94 praises people who have power to hurt but do not, who resist temptation, and "rightly do inherit heaven\'s graces." She marked an answer that the speaker is criticizing people who appear virtuous but cause harm. The tone is praise, not criticism.',
  },
  {
    q: "Q11 (hard, Central Ideas, 87 seconds)",
    text: "Chen's team saw bacterial synchronization at room temperature because enzyme complexes shield action potentials from thermal interference. She marked an answer that enzyme complexes accelerate the release of bursts. The passage describes protection from heat, not faster release.",
  },
  {
    q: "Q14 (hard, Command of Evidence, 102 seconds)",
    text: 'The claim is that diverse adaptations of Kurosawa\'s work (music, essays, graphic novels) reflect his hybrid film style. She marked an answer about where he studied theater and painting before Tokyo. That is background on Kurosawa, not evidence that others\' creations mirror his genre-blending approach.',
  },
  {
    q: "Q15 (hard, Command of Evidence, 34 seconds)",
    text: 'Historians claim early national park policy was motivated by economic benefits (tourism, local development). She marked an answer that visitation to natural landmarks rose from 5% to 15% by 1900. That shows a later result, not evidence of Congress\'s motivation when the policy was enacted.',
  },
  {
    q: "Q17 (hard, Inferences, 42 seconds)",
    text: "Early southwestern settlers used Pueblo irrigation techniques without having seen Pueblo systems firsthand. She marked an answer that Pueblo irrigation was widely used outside the Southwest. The logical completion is that settlers learned the techniques indirectly from people who had been influenced by Pueblo practices.",
  },
  {
    q: "Q18 (medium, Boundaries, 15 seconds)",
    text: 'The phrase "intricately carved with mythical figures" sits between two dashes in the sentence. She marked no punctuation after "surface," but the opening dash must match the closing dash. She answered in 15 seconds.',
  },
  {
    q: "Q20 (hard, Boundaries, 69 seconds)",
    text: 'Two independent clauses follow the rover\'s descent: the rover overcame a harrowing descent (in part due to design), and it is outfitted with cutting-edge tools. She marked a comma between those clauses, which creates a comma splice. The correct mark is a colon introducing the explanation.',
  },
  {
    q: "Q21 (medium, Form/Structure, dangling modifier, 44 seconds)",
    text: 'Opening phrase: "While examining the early sculptures of Michelangelo." The subject after the comma must be whoever is examining. She marked an answer whose subject is "Michelangelo\'s dynamic approach," and an approach cannot examine sculptures.',
  },
  {
    q: "Q22 (medium, Form, Structure, and Sense)",
    text: "Another grammar question where the marked answer did not satisfy the full sentence. She spent about 65 seconds, nearly double the module average for medium form-and-structure questions, and still chose incorrectly.",
  },
  {
    q: "Q23 (medium, Transitions)",
    text: "The sentence moves to a final interpretation of the passage, so the relationship is conclusion or wrap-up. The marked answer was a transition word for addition rather than conclusion.",
  },
  {
    q: "Q24 (hard, Transitions)",
    text: "The second sentence presents an alternative or contrasting view. The marked answer did not match that relationship.",
  },
];

export const SHERMEEN_RW_SKILLS: RwSkillBlock[] = [
  {
    rank: 1,
    title: "Transitions · 4 wrong answers on this diagnostic (2 in Module 1, both easy)",
    lead: "On transition questions, first identify how the two sentences relate, then choose the transition word that expresses that relationship. Do not start by reading the answer choices.",
    misses: [
      {
        q: "Q23 (Module 1, easy, 77 seconds)",
        text: 'The second sentence confirms the first with iconic examples (Mona Lisa, David). The relationship is emphasis, so the answer is "Indeed." She marked "Nevertheless," a contrast word where no contrast exists.',
      },
      {
        q: "Q24 (Module 1, easy, 43 seconds)",
        text: 'The poem seems like "barren terrain" but Bloom finds "fertile ground." That is contrast. The correct answer is "Nonetheless." She marked "In turn," which does not express opposition.',
      },
      {
        q: "Q23 (Module 2, medium)",
        text: 'The sentence moves to a final interpretation of the passage, so the relationship is conclusion. The correct answer fits that concluding move. The marked answer was "Additionally," which signals addition, not a wrap-up.',
      },
      {
        q: "Q24 (Module 2, hard)",
        text: 'The second sentence presents an alternative view, so the relationship is contrast or alternative. The marked answer did not match that relationship.',
      },
    ],
    body: [
      {
        kind: "p",
        text:
          "Transition questions repeat the same idea on every SAT: name the relationship between the two sentences, then match a transition word to that relationship. Shermeen missed four of them on this test, including both easy transition questions in Module 1. That makes this one of the fastest skills to improve with focused practice.",
      },
      {
        kind: "ol",
        intro: "Here is how we teach transitions in tutoring:",
        items: [
          "Learn the five relationship types that cover almost every transition question on the SAT: addition (the second sentence adds a similar point), contrast (the second sentence pushes against the first), cause and effect (the first sentence leads to the second), example (the second sentence is a specific case of the first), and emphasis or restatement (the second sentence restates or strengthens the first).",
          "Memorize which words belong to each group. Addition words include furthermore, moreover, in addition, also, similarly, and likewise. Contrast words include however, nonetheless, nevertheless, in contrast, on the other hand, conversely, still, and yet. Cause-and-effect words include therefore, thus, consequently, as a result, hence, and so. Example words include for example, for instance, namely, and specifically. Emphasis words include indeed, in fact, in other words, and that is. Drill sorting these words into groups until it feels automatic.",
          "On each question, state the relationship between the two sentences in plain words before you look at the choices. Then pick the word from the matching group.",
        ],
      },
    ],
  },
  {
    rank: 2,
    title: "Command of Evidence · 4 wrong answers (2 easy in Module 1, 2 hard in Module 2)",
    lead: "On command-of-evidence questions, restate the exact claim in the question before reading the answer choices. Then reject anything that is true from the passage but does not support that specific claim.",
    misses: [
      {
        q: "Q10 (Module 1, easy, ~125 seconds)",
        text: "The question asked which choice best supports a stated claim. She spent well above average time and marked a detail that appeared in the passage but did not support the specific claim named in the question.",
      },
      {
        q: "Q11 (Module 1, easy, 115 seconds)",
        text: 'Santos claims drinking water is the most frequently reported impact in every region. Shermeen spent 115 seconds and marked an answer with a true table detail that did not support that specific claim. Same method miss as Q10.',
      },
      {
        q: "Q14 (Module 2, hard, 102 seconds)",
        text: 'Claim: others\' diverse adaptations of Kurosawa\'s films reflect his hybrid style. She marked where he studied theater and painting. Correct evidence links his genre-merging to how other art forms engage with film.',
      },
      {
        q: "Q15 (Module 2, hard, 34 seconds)",
        text: 'Claim: national park policy was motivated by economic benefits. She marked later visitation statistics. That shows an outcome, not motivation at the time of enactment.',
      },
    ],
    body: [
      {
        kind: "p",
        text:
          "Both easy evidence questions in Module 1 were wrong despite extra time. That tells me this is a method issue, not a pacing issue. On evidence questions the passage often contains several true statements. Only one of them answers the claim in the question stem.",
      },
      {
        kind: "ul",
        intro: "The process we use in tutoring:",
        items: [
          "Read the question and underline the claim you need to support or weaken.",
          "Restate that claim in your own words before you look at the choices.",
          "Eliminate any answer that is true in the passage but does not match the claim.",
          "Choose the answer that directly supports or weakens the claim you restated.",
        ],
      },
    ],
  },
  {
    rank: 3,
    title: "Form, Structure, and Sense · 3 wrong answers",
    lead: "On grammar and usage questions, test whether the marked word fits both the meaning and the grammar of the sentence. A nearby noun or verb can pull you toward the wrong agreement or verb form.",
    misses: [
      {
        q: "Q20 (Module 1, easy, 32 seconds)",
        text: 'Verb tense: a discovery at Olduvai happened before the 1974 Laetoli find. The sentence needs past perfect ("had already made"). She marked simple past ("already made").',
      },
      {
        q: "Q21 (Module 2, medium, 44 seconds)",
        text: 'Dangling modifier: "While examining the early sculptures of Michelangelo" requires a person as the subject. She marked an answer whose subject was "Michelangelo\'s dynamic approach."',
      },
      {
        q: "Q22 (Module 2, medium)",
        text: "Another form-and-structure question where the marked answer did not satisfy the full sentence. She spent about 65 seconds here, nearly double the average of about 35 seconds, and still chose incorrectly.",
      },
    ],
    body: [
      {
        kind: "p",
        text:
          "These questions reward a short, repeatable check: cross out interrupting phrases, identify the real subject and verb, then test the answer choice against both grammar and meaning. That is the same move Soha needed on her diagnostic, and it usually improves quickly once it becomes a habit.",
      },
    ],
  },
  {
    rank: 4,
    title: "Boundaries · 2 wrong answers (Module 2)",
    lead: "Boundary questions test punctuation where two parts of a sentence meet. You decide whether each side is a complete sentence, then choose the punctuation that fits.",
    misses: [
      {
        q: "Q18 (Module 2, medium, 15 seconds)",
        text: 'Nonessential phrase punctuated with dashes: "surface — intricately carved … — was found." She marked no punctuation after "surface," leaving the dash pair unmatched.',
      },
      {
        q: "Q20 (Module 2, hard, 69 seconds)",
        text: 'Comma splice between two independent clauses about the Mars rover. She marked a comma; the sentence needs a colon before the explanation of what the rover carries.',
      },
    ],
    body: [
      {
        kind: "p",
        text:
          "Start by labeling each side of the punctuation mark. An independent clause is a complete sentence. A dependent clause cannot stand alone. Once you know what is on each side, the punctuation rule is usually straightforward.",
      },
      {
        kind: "ul",
        intro: "The rules we drill in tutoring:",
        items: [
          {
            label: "Two complete sentences",
            text: "Join them with a period, a semicolon, or a comma plus a conjunction (and, but, or so). Do not join them with a comma alone.",
          },
          {
            label: "Complete sentence plus an incomplete phrase",
            text: "You may need a comma, no punctuation, or a colon if the first part introduces what follows.",
          },
          {
            label: "Interrupting phrase in the middle of a sentence",
            text: "Put a comma on both sides of the interrupting phrase.",
          },
        ],
      },
    ],
  },
  {
    rank: 5,
    title: "Reading logic, words in context, and rhetorical synthesis · 5 wrong answers combined",
    lead: "On passage questions, match the answer to what the question asks for, not to a phrase that sounds familiar from the text. On rhetorical synthesis questions, read the stated goal first, then pick the answer that completes that specific task.",
    misses: [
      {
        q: "Q15 (Module 1, medium, inference, 80 seconds)",
        text: 'Only caterpillar-mimicking vibrations raised chemical defenses; wind and silence did not. She marked an answer about glucosinolates being the "most effective" defense, which the study never tested or ranked.',
      },
      {
        q: "Q2 (Module 2, medium, words in context, 78 seconds)",
        text: 'New evidence challenges theories but "won\'t necessarily require" a full rewrite. She marked "reinforce," which contradicts "challenge." The blank needs a word like "overhaul."',
      },
      {
        q: "Q6 (Module 2, medium, text structure, 214 seconds)",
        text: 'The underlined sentence states what researchers are uncertain about, setting up the study in the next sentence. She marked "contrasting viewpoint" because of "however," not because the function matched the question.',
      },
      {
        q: "Q8 (Module 2, hard, text structure, 20 seconds)",
        text: "The underlined sentence builds the physical setting (barren landscape). She marked internal conflict, which fits the passage but not that sentence's function. Rushed at 20 seconds.",
      },
      {
        q: "Q10 (Module 2, medium, central ideas, 34 seconds)",
        text: 'Sonnet 94 praises those who resist temptation and use power responsibly. She marked an answer that the speaker is criticizing secretly harmful people.',
      },
      {
        q: "Q11 (Module 2, hard, central ideas, 87 seconds)",
        text: "Enzyme complexes shield action potentials from heat so bacteria can synchronize at room temperature. She marked that they accelerate burst release.",
      },
      {
        q: "Q17 (Module 2, hard, inference, 42 seconds)",
        text: "Settlers used Pueblo irrigation without seeing it firsthand. She marked that Pueblo irrigation was widely used outside the Southwest. The inference is indirect transmission from people closer to Pueblo practice.",
      },
      {
        q: "Q26 (Module 1, easy, rhetorical synthesis, 50 seconds)",
        text: 'The goal asked for an advantage of the new titanium alloy. She marked an answer that described the alloy and repeated note language about titanium in aerospace, but never stated simpler production methods (the advantage in the notes).',
      },
    ],
    body: [
      {
        kind: "p",
        text:
          "Before reading the passage for a question, read the question stem and decide what type of answer it wants. Main idea, detail, function, structure, evidence, and inference each need a different kind of answer. Once the type is clear, eliminate any answer that answers a different type, even if it repeats more words from the passage.",
      },
      {
        kind: "p",
        text:
          "On rhetorical synthesis questions, read the goal in the question first, restate it in plain words, then eliminate any answer that does not do exactly what the goal asks.",
      },
    ],
  },
];

export const SHERMEEN_RW_SKILLS_RANK_HEAD =
  "Reading and Writing topics to work on, ranked by how many questions she got wrong on this diagnostic";

export const SHERMEEN_MATH_INTRO = [
  "Shermeen missed 14 Math questions across both modules. She answered 92% of easy Math questions correctly, which shows a solid base on straightforward content. Medium questions were 50% correct (8 of 16), and that is the main Math gap on this test. Hard questions were 67% correct (10 of 15), which is stronger than her medium tier.",
  "When I reviewed each wrong answer in Mentomind, the misses clustered on medium questions across several topics, not one narrow skill. Students who miss medium questions in several Math skill areas typically need to learn the question types, what each one is asking, and which method to apply first. Shermeen's wrong answers fit that profile. Module 1 Question 14 is a clear example: she found the x-intercept (h = 4) but did not finish with h + k. Module 2 Question 20 she answered in 19 seconds on a factor-theorem problem, which suggests she had not named the setup step yet. Several other misses (factoring, circle tangency, arc length) follow the same shape: once she knows the type and the method, the algebra is straightforward.",
  "Several questions that look different on the surface (quadratic equations, equivalent expressions, the factor theorem, even setting up a probability table) all require the same move once named: rearrange to zero, factor out a common piece, verify factors by expanding, or use f(r) = 0 when a factor is given. That is the first skill block I would teach her, before we add more Desmos practice on top.",
  "She also left three grid-in answers blank in Math Module 2 (Questions 8, 10, and 14). Those blank responses count as wrong. On the real SAT, an educated guess or a partial setup is better than leaving the box empty.",
  "We build that foundation in tutoring by teaching the question types, how to identify what is being asked, and the best method to solve. We go through examples every session until she has them memorized. Desmos helps only after that setup is clear.",
];

export const SHERMEEN_MATH_GAP1_INTRO =
  "The first area I would work on is factoring and the factor theorem. Four of her fourteen Math wrong answers trace back to the same move: rearrange to zero, pull out a common factor, verify proposed factors by expanding, or use f(r) = 0 when a factor is given. These are by-hand algebra questions. Desmos cannot replace the setup step, and on Module 2 Question 20 she answered in 19 seconds with a guess instead of writing the factor condition.";

export const SHERMEEN_MATH_M2Q9_WORKED = {
  setup:
    'Module 2 Question 9 asks which expressions are factors of 2x² + 17x − 63. She marked "Both I and II" for (x − 7) and (2x + 9). Before picking an answer, expand and check the middle term:',
  factorLine: "(x − 7)(2x + 9) = 2x² − 14x + 9x − 63 = 2x² − 5x − 63",
  after:
    "The original expression has +17x, not −5x, so those two binomials are not both factors. The middle-term check takes under a minute and catches the error before she selects an answer. She spent 84 seconds on this question and still marked both without verifying.",
  correct: "Neither I nor II alone (correct choice D)",
  marked: "Both I and II (choice C)",
};

export const SHERMEEN_MATH_M2Q20_WORKED = {
  setup:
    "Module 2 Question 20 gives that x + 2a is a factor of f(x) = x⁵ − 4a²x³ + 2x + 2a + 3 and asks for a. The move is the factor theorem:",
  factorLine: "If x + 2a is a factor, then f(−2a) = 0. Substitute and simplify to get a = 3/2.",
  after:
    "She marked 2 in 19 seconds on a hard question. That timing suggests she did not set up f(−2a) = 0 at all. This is the same factor-theorem family as the equivalent-expressions question above, but with a higher-degree polynomial.",
  correct: "3/2 (choice B)",
  marked: "2 (choice C)",
};

export const SHERMEEN_MATH_GAP1_AFTER =
  "Module 2 Question 2 also belongs in this bucket. She spent 283 seconds on x² − 10x + 7 = 0 and marked n = 18 instead of 2. The quadratic formula gives x = 5 ± 3√2, so n = 2. She was on the right path but made an error simplifying √72. Factoring the radicand (72 = 36 × 2) is the same equivalent-form discipline as checking a factor expansion.";

export const SHERMEEN_MATH_Q9_CONTEXT =
  'Module 1 Question 9 is the y − 42 nonlinear equation: y − 42 = (y − c)(y − 42). Shermeen spent 90 seconds and marked "I only" (y = 42). That value works when you plug it in, so it feels like a finished answer. The issue was setup: she did not move everything to one side and factor out the shared piece (y − 42). Once you do, the zero-product rule gives a second solution, y = 1 + c, and the correct answer includes both I and III. The steps are: move to one side, set equal to zero, factor out anything common, solve each factor. The worked panels below are the same scratch-paper walkthrough I use for this question.';

export const SHERMEEN_MATH_GAP2 =
  "The second area is circles and geometry formulas that are not fully spelled out on the SAT reference sheet. On Module 1 Question 13 she added π/4 and π/6 but converted to 60° instead of 75°. On Module 1 Question 21 she spent 158 seconds on arc length and picked 40 when the only integer in the valid range is 39. On Module 2 Question 10 she left a grid-in blank after 37 seconds on a circle tangency problem (center at (p, 18), tangent to both axes, find k + p). Those three misses share the same fix: know the circle and arc relationships cold, then read what the question is asking for at the end.";

export const SHERMEEN_MATH_GAP2_RESOLVE =
  "In Phase 1 tutoring I would refresh radian-to-degree conversion, arc length as a fraction of circumference, and what tangency to both axes tells you about radius and center coordinates. We would drill those until she can set up the inequality or grid-in without hesitating.";

export const SHERMEEN_MATH_REMAINING = [
  {
    q: "Module 1 Question 11",
    text: "exponential growth: doubling every 3 days means k = 1/3, not 3. She spent 187 seconds and picked the reciprocal relationship backward.",
  },
  {
    q: "Module 1 Question 14",
    text: "linear intercepts: she found h = 4 but marked 4 instead of h + k = −16. She answered the first part and stopped before the last step the question asked for.",
  },
  {
    q: "Module 1 Question 20",
    text: "conditional probability from a two-way table: build the system (b = 4a, d = 7c), solve, then divide white cats by total white animals. She marked 0.230 instead of 0.125 after 136 seconds.",
  },
  {
    q: "Module 2 Question 1",
    text: "one-variable data: medians are both 8, but Plot A is more spread out, so its standard deviation is greater, not equal. She spent 111 seconds on an easy question.",
  },
  {
    q: "Module 2 Question 4",
    text: "linear word problem: first 3 hours cost $180, so the function after hour 3 is m(x) = 45x + 45, not 60x.",
  },
  {
    q: "Module 2 Questions 8, 10, and 14",
    text: "three medium grid-ins left blank. Those count as wrong on the real SAT. Partial setup or an educated guess is better than an empty box.",
  },
  {
    q: "Module 2 Question 16",
    text: "collinear points: set slopes equal to get ak + bh = hk. She marked the rearranged form wrong in 16 seconds.",
  },
  {
    q: "Module 2 Question 22",
    text: "profit percent on partial inventory: sell one-third at a 10% loss, then find the profit percent on the rest to net 20% overall. She marked 30% instead of 35% in 34 seconds. Teachable, but lower priority than factoring and circles because it appears less often.",
  },
];

export const SHERMEEN_MATH_PLAN_NOTE =
  "Given her Math base on easy questions (92% correct), I would work one skill block at a time: factoring and the factor theorem first, then circles and arc length, then linear word problems and finish-the-question habits. On each block we teach the question type, how to identify what it is asking, and the best method to use, then walk through examples every session until she has it memorized. Timed practice follows until she hits 95%+ accuracy on medium questions in that skill before we move to the next.";

export const SHERMEEN_MATH_WALKTHROUGH_ROWS: MathWalkthroughRow[] = [
  {
    question: "Q9 (M1, med) nonlinear with constant c",
    how: "Move to one side, factor out (y − 42), apply zero-product rule",
    desmos: "Limited; by-hand factoring",
    formulaNeeded: "No",
    formulaName: "",
    marked: 'Marked "I only" (42); correct is "I and III" (42 and 1 + c); 90s',
  },
  {
    question: "Q11 (M1, med) exponential growth k",
    how: "Doubling every 3 days means exponent 1 when t = 3, so k = 1/3",
    desmos: "Yes, test k values",
    formulaNeeded: "Yes",
    formulaName: "Exponential form N = A·2^(kt)",
    marked: "Marked k = 3; correct is k = 1/3; 187s",
  },
  {
    question: "Q13 (M1, med) circle radians to degrees",
    how: "Add π/4 + π/6 = 5π/12, then × 180/π = 75°",
    desmos: "Arithmetic only",
    formulaNeeded: "Yes",
    formulaName: "Radians to degrees",
    marked: "Marked 60°; correct is 75°; 60s",
  },
  {
    question: "Q14 (M1, med) linear intercepts h + k",
    how: "y-int k = −20, x-int h = 4, then h + k = −16",
    desmos: "Yes, graph y = 5x − 20",
    formulaNeeded: "No",
    formulaName: "",
    marked: "Marked 4 (h alone); correct is −16; 47s",
  },
  {
    question: "Q20 (M1, hard) conditional probability",
    how: "Build equations from the table (b = 4a, d = 7c), solve system, then b/128",
    desmos: "By-hand algebra",
    formulaNeeded: "No",
    formulaName: "",
    marked: "Marked 0.230; correct is 0.125; 136s",
  },
  {
    question: "Q21 (M1, hard) circle arc length",
    how: "Arc = (x/360)·2πr; solve inequality for integer x in range",
    desmos: "Yes, after setup",
    formulaNeeded: "Yes",
    formulaName: "Arc length",
    marked: "Marked 40; correct is 39; 158s",
  },
  {
    question: "Q1 (M2, easy) one-variable data",
    how: "Medians both 8; Plot A is more spread out, so SD is greater",
    desmos: "No",
    formulaNeeded: "No",
    formulaName: "",
    marked: "Marked equal SD; correct is A has greater SD; 111s",
  },
  {
    question: "Q2 (M2, med) quadratic / radical form",
    how: "Quadratic formula → 5 ± 3√2, so n = 2",
    desmos: "After setup",
    formulaNeeded: "Yes",
    formulaName: "Quadratic formula",
    marked: "Marked n = 18; correct is n = 2; 283s (largest sink)",
  },
  {
    question: "Q4 (M2, med) linear word problem",
    how: "First 3 hr = $180; extra 4 hr add $180 → $45/hr after hour 3; m(x) = 45x + 45",
    desmos: "Yes",
    formulaNeeded: "No",
    formulaName: "",
    marked: "Marked m(x) = 60x; correct is 45x + 45; 133s",
  },
  {
    question: "Q6 (M2, med) nonlinear functions",
    how: "Identify function family, substitute, or graph in Desmos",
    desmos: "Yes",
    formulaNeeded: "No",
    formulaName: "",
    marked: "Marked D; correct is B; ~250s but got it right",
  },
  {
    question: "Q8 (M2, med) systems (grid-in)",
    how: "Solve system by substitution or elimination; enter exact value",
    desmos: "Yes",
    formulaNeeded: "No",
    formulaName: "",
    marked: "Left blank; correct is about −2.112",
  },
  {
    question: "Q9 (M2, med) factoring quadratic",
    how: "Factor 2x² + 17x − 63; verify each proposed factor by expanding",
    desmos: "Expand to check",
    formulaNeeded: "No",
    formulaName: "",
    marked: 'Marked "Both I and II"; middle term does not match; 84s',
  },
  {
    question: "Q10 (M2, med) circles tangency (grid-in)",
    how: "Tangent to both axes → radius = |y-coordinate| = 18, so k = 324; then k + p",
    desmos: "After setup",
    formulaNeeded: "Yes",
    formulaName: "Circle standard form",
    marked: "Left blank; correct is 342; 37s on screen",
  },
  {
    question: "Q14 (M2, med) nonlinear (grid-in)",
    how: "Set up equation from context, factor or isolate variable",
    desmos: "Yes, after setup",
    formulaNeeded: "No",
    formulaName: "",
    marked: "Left blank; correct is 6",
  },
  {
    question: "Q16 (M2, hard) collinear points",
    how: "Set slopes equal: b/a = k/(−h) → ak + bh = hk",
    desmos: "Symbolic only",
    formulaNeeded: "No",
    formulaName: "",
    marked: "Marked ah + bk = hk; correct is ak + bh = hk; 16s",
  },
  {
    question: "Q20 (M2, hard) factor theorem",
    how: "If x + 2a is a factor, f(−2a) = 0; solve for a",
    desmos: "No; by-hand algebra",
    formulaNeeded: "No",
    formulaName: "",
    marked: "Marked a = 2; correct is a = 3/2; 19s",
  },
  {
    question: "Q22 (M2, hard) profit percent word problem",
    how: "Track cost and revenue on each portion; set up equation for 20% overall gain",
    desmos: "By-hand",
    formulaNeeded: "No",
    formulaName: "",
    marked: "Marked 30%; correct is 35%; 34s",
  },
];

export const SHERMEEN_MATH_AFTER_TABLE = [
  "Not every wrong answer required factoring, but the ones that did were costly. Module 1 Question 9 and Module 2 Questions 9 and 20 are the clearest examples. Module 2 Question 2 used the quadratic formula rather than factoring, but the same algebra discipline applies: simplify radicals carefully and match the form the question asks for.",
  "Other misses were about reading the question to the end (Module 1 Question 14: she answered h = 4 instead of h + k = −16), setting up a word problem (Module 2 Question 4), or slowing down on hard questions she answered in under 20 seconds (Module 2 Questions 16, 20, and 22).",
  "The three blank grid-in responses in Module 2 remain a separate habit to fix. Questions 8, 10, and 14 were medium difficulty where she did not enter a value at all.",
];

export const SHERMEEN_MATH_SKILLS_HEAD = "Math topics to work on from her wrong answers";

export const SHERMEEN_MATH_SKILLS_INTRO = [
  "If I had to rank what moves her score fastest, factoring and equivalent-form fluency come first. That shows up directly on Module 1 Question 9, Module 2 Questions 9 and 20, and indirectly on Module 2 Question 2. After that: linear functions and word problems (Module 1 Question 14, Module 2 Question 4), circle formulas including arc length and tangency (Module 1 Questions 13 and 21, Module 2 Question 10 blank), and reading statistics carefully (Module 2 Question 1).",
];

export const SHERMEEN_MATH_QUESTION_TYPES =
  "A large part of SAT Math is knowing the question type before you calculate. The SAT reuses the same types, and the same topic can look different depending on the wording. Once she knows the type, what it is asking, and the method to use, the formula usually follows. In tutoring we teach what each type looks like, how to identify what is being asked, and the best approach: two points and \"find the equation\" means write a line equation; a grid-in with a system means solve and enter the exact value; a circle question with a diagram means pull the radius or arc relationship first. We review examples on each type every session until she has them memorized.";

export const SHERMEEN_MATH_FORMULAS_HEAD = "Formulas to memorize and practice";

export const SHERMEEN_MATH_FORMULAS_INTRO =
  "These formulas are worth memorizing. Several of her wrong answers needed one of them, and not all of them appear on the SAT reference sheet:";

export const SHERMEEN_MATH_FORMULAS: RwSkillListItem[] = [
  {
    label: "Zero-product rule",
    text: "If AB = 0, then A = 0 or B = 0 (after you move everything to one side and factor)",
  },
  {
    label: "Factor theorem",
    text: "If x − r is a factor of f(x), then f(r) = 0",
  },
  {
    label: "Difference of squares",
    text: "a² − b² = (a − b)(a + b)",
  },
  {
    label: "Quadratic formula",
    text: "x = (−b ± √(b² − 4ac)) / (2a)",
  },
  {
    label: "Slope from two points",
    text: "m = (y₂ − y₁) / (x₂ − x₁)",
  },
  {
    label: "Radians to degrees",
    text: "degrees = radians × 180 / π",
  },
  {
    label: "Arc length",
    text: "arc length = (central angle ÷ 360) × circumference",
  },
  {
    label: "Exponential form",
    text: "N = A·2^(kt); doubling every d days means kt = 1 when t = d",
  },
];

export const SHERMEEN_TIMING_INTRO = [
  "The full diagnostic report includes a time chart for each module, comparing Shermeen's seconds per question to the average for other students. I only note timing patterns below when the chart shows something meaningful. Normal variation exists, and spending extra time on a hard question you eventually get right is not automatically a problem if the rest of the module stays on pace.",
];

export const SHERMEEN_TIMING_RW = [
  "Reading and Writing Module 1: Questions 10 and 11 were both easy command-of-evidence questions. She spent about 115 to 125 seconds on each, compared to an average of about 75 seconds, and got both wrong. That extra time did not translate into a correct answer, which points to a method issue rather than rushing. Question 13 was a hard evidence question she spent more than 210 seconds on and got right. That is slow but accurate; Module 1 did not show a clear pattern of rushed wrong answers at the end.",
  "Reading and Writing Module 2: Question 6 (text structure, medium) stands out. She spent about 215 seconds, more than triple the average of about 65 seconds, and got it wrong. That is her clearest Reading and Writing time sink on the test. Question 8 on the same module was the opposite pattern: about 25 seconds on a hard text-structure question she missed. Questions 23 through 27 were mostly answered at a normal pace with a mix of right and wrong, so I do not read this module as a simple \"ran out of time at the end\" story.",
];

export const SHERMEEN_TIMING_MATH = [
  "Math Module 1: From Question 11 onward, several questions took well above average time. Question 11 (exponential k) took 187 seconds and she marked k = 3 instead of 1/3. Questions 20 and 21 were wrong after 136 and 158 seconds. Question 14 was wrong in only 47 seconds because she stopped at h = 4 instead of h + k.",
  "Math Module 2: Question 2 took 283 seconds (n = 18 instead of 2). Questions 2 and 6 together consumed about 530 seconds. After that, Questions 16, 20, and 22 were all answered in 16 to 34 seconds and all wrong. Question 20 is especially telling: a factor-theorem problem answered in 19 seconds with a guess of 2. Questions 17 through 19 were correct at normal timing, so this is not a clean \"she ran out of time\" conclusion, but the fast wrong answers at the end are worth watching on the next practice test.",
];

export const SHERMEEN_SKIP_TIME = {
  reading:
    "Hard craft-and-structure and hard central-ideas questions in Module 1 were mostly correct. Cross-text connections was not a miss area. Session time is better spent on transitions, command of evidence, boundaries, form and structure, and rhetorical synthesis, not on broad passage review for difficulty alone.",
  math: "Easy Math questions were strong (92% correct). Ratios, two-variable data, margin of error, lines and angles, and area and volume in Module 1 were mostly correct. The data and basic-geometry base is already in good shape.",
};
