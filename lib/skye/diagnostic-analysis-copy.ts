/** Mentor narrative from the June 18 diagnostic. */

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

export const SKYE_OVERVIEW_INTRO = [
  "For someone just starting out, a diagnostic score around 1115 before she starts preparing for the SAT is not bad. The national average total score is 1029 among the College Board class of 2025 (graduating seniors who took the SAT, using each student's most recent score if they tested more than once), and she is already scoring slightly above that average. She achieved that score before starting to study, which shows me she has the capability to score much higher on the SAT with preparation and practice.",
  "During the math section, what I saw was that she struggled to identify what the question was asking and then set up the problem correctly. On the Reading and Writing section, she chose an answer the passage supports instead of the answer that matches what the question was specifically asking for. Both point to the same conclusion: she needs to learn all the types of questions on the SAT, how they present themselves, and how to identify what is being asked. That is foundational work to start right away. She has time before her target test date, and these are learnable skills. Below I break down her performance by section, then walk through each topic where she missed questions and what we will teach her to do differently.",
];

export const SKYE_OVERVIEW_INTRO_FOOTNOTE =
  "National average · College Board 2025 SAT Suite Annual Report (total-group mean, most recent score if retaken).";

export const SKYE_ADAPTIVE_INTRO = [
  "The Digital SAT is adaptive. After Module 1 in each section, the test chooses an easier or harder Module 2 based on how many questions you got right. If you miss too many easy and medium questions in Module 1, you land in the easier Module 2, which limits how high your score can go on that section. The rough cutoffs are about 18 correct out of 27 on Reading and Writing Module 1, and about 13 or 14 out of 22 on Math Module 1. It also matters whether the misses were on easy, medium, or hard questions.",
];

export const SKYE_ADAPTIVE_RW =
  "On Reading and Writing, she got 14 of 27 correct in Module 1 (51.2%), about four questions short of the cutoff for the harder Module 2. So her Reading and Writing Module 2 was composed of more easy and medium questions and fewer hard questions. As a result, her Reading and Writing score would likely cap around 600 to 650 even with a perfect Module 2. The first priority is fixing the four easiest Module 1 misses, because those are the most fixable and they determine which Module 2 she unlocks.";

export const SKYE_ADAPTIVE_MATH =
  "On Math, she got 11 of 22 correct in Module 1 (50.0%), missing the cutoff for the harder Module 2 by two or three questions. So her Math Module 2 included only one hard question. As a result, her score ceiling on Math was lower than it would have been if she had unlocked the harder module. Getting a few more Module 1 questions right on the next test would unlock a harder Module 2 and raise that ceiling.";

export const SKYE_RW_INTRO_LEAD =
  'While she has several skill areas where mistakes are costing her points, I believe the miss behind them is shared. She is unsure what the question is asking, so she looks for answers that "sound right" or that repeat something from the passage. That is common for students new to the SAT. You have to know the question types the SAT uses and what each type is looking for, or you get pulled toward answers that are logical but do not answer the question. It shows up three ways:';

export const SKYE_RW_INTRO_BULLETS = [
  "Transitions: first decide how the two sentences relate (contrast, cause and effect, addition, and so on), then pick the transition word that matches that relationship. On passage questions, the correct answer matches what the question asks for (main idea, structure, detail, and so on), not a phrase that simply appears in the text.",
  "Words in Context: use the sentence around the blank to predict the word before you read the answer choices. Check that the word fits the tone of the sentence and the grammar of the blank (including tense and what comes before it).",
  "Boundaries and modifiers: these questions follow standard punctuation rules. You decide whether you have two complete sentences, an interrupting phrase, or a phrase that must attach to a specific noun, then apply the comma, semicolon, or period rule that fits.",
];

export const SKYE_RW_SKILLS: RwSkillBlock[] = [
  {
    rank: 1,
    title: "Transitions · 4 misses on this diagnostic (3 in Module 1, all easy)",
    lead: "On transition questions, first identify how the two sentences relate, then choose the transition word that expresses that relationship. Do not start by reading the answer choices.",
    misses: [
      {
        q: "Q22 (Module 1)",
        text: 'The two sentences describe opposite effects of cortisol, so the relationship is contrast. The correct answer is "In contrast." The marked answer was "Thus," which signals cause and effect, not contrast.',
      },
      {
        q: "Q24 (Module 1)",
        text: 'The poem seems barren at first, then a critic finds rich material in it, so the relationship is contrast. The correct answer is "Nonetheless." The marked answer was "In turn," which does not fit.',
      },
      {
        q: "Q23 (Module 1)",
        text: 'The second sentence gives examples that support the first, so the relationship is confirmation or emphasis. The correct answer is "Indeed." The marked answer was "Consequently," which signals cause and effect.',
      },
      {
        q: "Q24 (Module 2)",
        text: 'The drama club is presented as one more activity alongside other writing activities, so the relationship is addition. The correct answer is "Furthermore." The marked answer was "Nonetheless," which signals contrast.',
      },
    ],
    body: [
      {
        kind: "p",
        text:
          "Transition questions repeat the same idea on every SAT: name the relationship between the two sentences, then match a transition word to that relationship. This is one of the most common miss types for students who have not yet memorized the transition word groups. It is also one of the fastest skills to fix with practice.",
      },
      {
        kind: "ol",
        intro: "Here is how we teach transitions in tutoring:",
        items: [
          "Learn the five relationship types that cover almost every transition question on the SAT: addition (the second sentence adds a similar point), contrast (the second sentence pushes against the first), cause and effect (the first sentence leads to the second), example (the second sentence is a specific case of the first), and emphasis or restatement (the second sentence restates or strengthens the first).",
          "Memorize which words belong to each group. Addition words include furthermore, moreover, in addition, also, similarly, and likewise. Contrast words include however, nonetheless, nevertheless, in contrast, on the other hand, conversely, still, and yet. Cause-and-effect words include therefore, thus, consequently, as a result, hence, and so. Example words include for example, for instance, namely, and specifically. Emphasis words include indeed, in fact, in other words, and that is. Drill sorting these words into groups until it feels automatic.",
          "On each question, state the relationship between the two sentences in plain words before you look at the choices. Then pick the word from the matching group. If two answer choices are both contrast words (or both cause-and-effect words), neither can be right, because the SAT only gives one word per relationship type.",
        ],
      },
    ],
  },
  {
    rank: 2,
    title: "Reading logic: structure, detail, main idea, and evidence · 5 misses (3 in Module 1)",
    lead: "On passage questions, match the answer to what the question asks for, not to a phrase or detail that sounds familiar from the text. Correct answers to main-idea and evidence questions are rarely copied word for word from the passage.",
    misses: [
      {
        q: "Q6 (Module 1, function)",
        text: 'The underlined sentence explains that the technology to detect the waves did not exist yet. The question asks what job that sentence does in the passage. The correct answer describes that function. The marked answer, "highlights the skepticism," describes content that is not in the text.',
      },
      {
        q: "Q8 (Module 1, detail)",
        text: "The question asks which person held a specific view. The marked answer attached the critics' position to Sullivan, who actually argued the opposite in the passage.",
      },
      {
        q: "Q13 (Module 1, evidence)",
        text: 'Ferguson\'s claim is that recovery varied by country. The marked answer cites "standardized" efforts and "uniform" results, which is the opposite of varied recovery.',
      },
      {
        q: "Q5 (Module 2, structure)",
        text: 'The passage presents an old belief and then new research that revises it. The question asks how the passage is organized. The marked answer summarizes surface content ("introduces differing factors but does not reconcile them") instead of describing that structure.',
      },
      {
        q: "Q8 (Module 2, main idea)",
        text: 'The question asks for the main idea of the whole passage. The marked answer, "they provide clear answers about early Christianity," turns one detail into the central point.',
      },
    ],
    body: [
      {
        kind: "p",
        text:
          "Before reading the passage for a question, read the question stem and decide what type of answer it wants. Most misses on this diagnostic came from answering a different type of question than the one that was asked.",
      },
      {
        kind: "ul",
        intro: "These are the main passage question types on the SAT:",
        items: [
          {
            label: "Main idea",
            text: "What is the overall point of the whole passage?",
          },
          {
            label: "Detail",
            text: "What specific fact did the passage state, and who said it?",
          },
          {
            label: "Function or purpose",
            text: "What does a particular sentence do in the passage, not what does it say?",
          },
          {
            label: "Structure",
            text: "How is the passage organized (for example, an old view followed by new research)?",
          },
          {
            label: "Command of evidence",
            text: "Which choice best supports or weakens the exact claim in the question?",
          },
          {
            label: "Inference",
            text: "What must be true based on the passage, often to fill in a blank?",
          },
        ],
      },
      {
        kind: "p",
        text:
          "Read the question first and name the type out loud if that helps. On this diagnostic, Q6 needed a function answer (what the sentence does), not a summary of what it says. The Module 2 main-idea question needed the point of the whole text, not one detail. The structure question needed how the passage is laid out, not a list of facts. Once the type is clear, eliminate any answer that answers a different type, even if it repeats more words from the passage.",
      },
    ],
  },
  {
    rank: 3,
    title: "Boundaries · 3 misses (2 in Module 1)",
    lead: "Boundary questions test punctuation where two parts of a sentence meet. You decide whether each side is a complete sentence, then choose the punctuation that fits: a comma, a semicolon, a period, a colon, or a comma plus a conjunction like and, but, or so.",
    misses: [
      {
        q: "Q18, Module 1",
        text: 'A semicolon was placed before "earning a second Nobel Prize," but that phrase is not a complete sentence on its own. A semicolon can only join two complete sentences.',
      },
      {
        q: "Q16, Module 2",
        text: 'Two complete sentences were joined with "and," but the comma before "and" was missing, which created a run-on sentence.',
      },
      {
        q: "Q17, Module 1",
        text: "A descriptive phrase interrupted the main sentence and needed a comma on both sides. The opening comma was there, but the closing comma was missing.",
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
            text: "Join them with a period, a semicolon, or a comma plus a conjunction (and, but, or so). Do not join them with a comma alone or with no punctuation.",
          },
          {
            label: "Complete sentence plus an incomplete phrase",
            text: "You may need a comma, no punctuation, or a colon if the first part introduces what follows.",
          },
          {
            label: "Interrupting phrase in the middle of a sentence",
            text: "Put a comma on both sides of the interrupting phrase.",
          },
          {
            label: "Dependent clause markers",
            text: "Words like because, although, while, since, when, if, after, and before often signal that part of the sentence cannot stand alone.",
          },
        ],
      },
      {
        kind: "p",
        text:
          "In tutoring we work in order: find the subject and verb on each side, decide whether each side is complete, then apply the punctuation rule. These misses are common on early diagnostics and usually improve quickly once the comma and semicolon rules are automatic.",
      },
    ],
  },
  {
    rank: 4,
    title: "Words in Context · 4 misses (2 in Module 1)",
    lead: "On Words in Context questions, use the sentence around the blank to predict the meaning and grammar of the missing word before you read the answer choices.",
    misses: [
      {
        q: "Q1, Module 1",
        text: 'The sentence is positive throughout, so the blank needs a positive word. The correct answer is "exemplifies." The marked answer was "impedes," which has a negative meaning and does not match the tone.',
      },
      {
        q: "Q2, Module 1",
        text: 'The sentence says the storm was approaching, so the blank needs a word that means "about to happen." The correct answer is "imminent." The marked answer was "transient" (temporary), which misses the time clue.',
      },
      {
        q: "Q3, Module 2",
        text: 'The device is described as a forerunner of computing, so the blank needs a word that means "comes before." The correct answer is "precursor." The marked answer was "relic," which suggests an old object but not sequence.',
      },
      {
        q: "Q1, Module 2",
        text: 'The blank follows "the chance to," so it needs a plain verb after "to." The correct answer is "criticize" (meaning evaluate in academic writing). The marked answer was "involved in," which does not fit the grammar.',
      },
    ],
    body: [
      {
        kind: "p",
        text:
          'Two of these misses were not vocabulary gaps. In Module 1 Q1, both "exemplifies" and "impedes" are common words; the miss was choosing a negative word in a positive sentence. In Module 2 Q1, the miss was grammar: after "the chance to," the blank must be a verb.',
      },
      {
        kind: "p",
        text:
          '"Imminent" and "precursor" were vocabulary misses, but the sentence still gave enough context to narrow the answer. The approaching storm points toward "imminent." A device that came before modern computers points toward "precursor."',
      },
      {
        kind: "p",
        text:
          "On Words in Context questions, use the step-by-step method first on every question. Add vocabulary study only for words that still miss after the sentence clues are being used consistently.",
      },
      {
        kind: "p",
        text:
          "Cover the answer choices, decide whether the blank should be positive, negative, or neutral, predict the rough meaning of the missing word, check that the word fits the grammar of the sentence, then choose the option that fits both meaning and grammar.",
      },
      {
        kind: "p",
        text:
          "We do not start with a huge vocabulary list. We focus on a short set of academic words that appear often on the SAT, plus words whose test meaning differs from everyday speech (criticize, qualify, sound, novel, arrest).",
      },
    ],
  },
  {
    rank: 5,
    title: "Rhetorical Synthesis · 3 misses (2 in Module 1, 1 blank in Module 2)",
    lead: "On rhetorical synthesis questions, read the stated goal in the question first, then pick the answer that does exactly what the goal asks. If the goal asks for an advantage, the answer must give an advantage. If the goal asks for a difference, the answer must show a difference.",
    misses: [
      {
        q: "Q26, Module 1",
        text: 'The goal was to identify an advantage of the new alloy. The marked answer said the alloy "requires complex manufacturing like other alloys," which is not an advantage and contradicts the notes.',
      },
      {
        q: "Q27, Module 1",
        text: "The goal was to identify a difference between two paintings. A weaker answer was chosen in 23 seconds. Slowing down long enough to hold the goal in mind helps eliminate choices that do not show a difference.",
      },
      {
        q: "Module 2, one question left blank",
        text: "One rhetorical synthesis question was left blank. A repeatable process (read the goal, then scan the notes) helps finish these without over-reading every note.",
      },
    ],
    body: [
      {
        kind: "p",
        text:
          "These questions give you bullet-point notes and ask you to combine them in a specific way. Read the question and identify the goal before you read the notes. The goal tells you what the correct answer must do.",
      },
      {
        kind: "ul",
        intro: "The process we use in tutoring:",
        items: [
          "Read the goal in the question first.",
          'Restate the goal in plain words (for example, "find an advantage" or "show a difference").',
          "Read only the notes that help with that goal.",
          "Eliminate any answer that does not do what the goal asks.",
          "Eliminate any answer that contradicts the notes.",
          "Choose the answer that both matches the goal and matches the notes.",
        ],
      },
      {
        kind: "p",
        text:
          "These questions are not asking for the longest or most interesting answer. They are asking for the answer that completes the specific task in the question.",
      },
    ],
  },
];

export const SKYE_RW_SKILLS_RANK_HEAD =
  "Reading and Writing topics to work on, ranked by how many points they cost on this diagnostic";

export const SKYE_MATH_INTRO = [
  "The math misses on this diagnostic are not about raw ability. The SAT asks familiar algebra and geometry topics in wording that can look unfamiliar on first read. On most missed questions, the pattern was uncertainty about how to start, then trying approaches until one seemed to fit. When it is unclear what the question is asking for, the solving method is unclear too.",
  "Module 1 had three easy misses and only two of seven medium questions correct. Medium questions are core SAT content. The two biggest topic gaps on this test were systems of equations (0 of 2 correct) and nonlinear equations (0 of 4 correct), both from Advanced Math (Algebra II level).",
  "Desmos helps only after a problem is set up correctly. If the question type is unclear or the setup is wrong, the calculator cannot fix the answer. In tutoring we work in this order: name what the question is asking, learn the method for that question type, then practice the by-hand or Desmos steps until they are automatic.",
  "That work has three parts: the underlying math skills the SAT tests, the formulas you need from memory (several are not on the reference sheet), and recognizing what each question is asking before you start calculating.",
];

export const MATH_WALKTHROUGH_ROWS: MathWalkthroughRow[] = [
  {
    question: "Q5 (M1, easy) systems, # of solutions",
    how: "Graph both lines in Desmos and count where they cross (once)",
    desmos: "Yes",
    formulaNeeded: "No",
    formulaName: "",
    marked: "Marked 2; two lines cross once, so the answer is 1",
  },
  {
    question: "Q7 (M1, easy) nonlinear + linear",
    how: "Graph y=64 and y=x²+8 in Desmos and read x, or set the expressions equal and solve x²=56",
    desmos: "Yes",
    formulaNeeded: "No",
    formulaName: "",
    marked: "Marked 4√14; correct is 2√14",
  },
  {
    question: "Q9 (M1, med) nonlinear with a constant",
    how: "Substitute each option (42, c, 1+c) and check both sides by hand",
    desmos: "No, by hand",
    formulaNeeded: "No",
    formulaName: "",
    marked: "Marked III only; correct is I and III because 42 is also a solution",
  },
  {
    question: "Q11 (M1, med) exponential growth",
    how: "By hand: 1000=500·2^(3k), so 3k=1 and k=1/3; or test each value of k",
    desmos: "No, by hand",
    formulaNeeded: "Yes",
    formulaName: "Exponential form (a·b^x)",
    marked: "Marked k=3 (the doubling period from the story); correct is k=1/3",
  },
  {
    question: "Q13 (M1, med) circle, radians",
    how: "By hand: add π/4 + π/6 = 5π/12, then convert to degrees (×180/π = 75°)",
    desmos: "Arithmetic only",
    formulaNeeded: "Yes",
    formulaName: "Radians to degrees",
    marked: "Marked 45 (angle U); the question asks for angle V, which is 75",
  },
  {
    question: "Q14 (M1, med) linear, intercepts",
    how: "Graph y=5x−20 in Desmos, read both intercepts (4 and −20), then add them",
    desmos: "Yes",
    formulaNeeded: "No",
    formulaName: "",
    marked: "Marked 4 (the value of h); the question asks for h+k, which is −16",
  },
  {
    question: "Q16 (M1, hard) radical equation",
    how: "Graph both sides in Desmos and read the smaller x, or square both sides and use the quadratic formula",
    desmos: "Yes",
    formulaNeeded: "Yes",
    formulaName: "Quadratic formula",
    marked: "Marked 2−4√2; correct is 4−4√2",
  },
  {
    question: "Q17 (M1, med) line from two points",
    how: "Plot both points in Desmos and test which answer line passes through both, or compute slope = 3/2 and build the equation",
    desmos: "Yes",
    formulaNeeded: "Yes",
    formulaName: "Slope from two points",
    marked: "Used slope 3; correct slope is 3/2 (the line with slope 3 passes through only one of the two points)",
  },
  {
    question: "Q18 (M1, hard) perpendicular lines",
    how: "Find the perpendicular slope (−4/3), graph both lines in Desmos, or test which answer point lies on the given line",
    desmos: "Yes",
    formulaNeeded: "Yes",
    formulaName: "Perpendicular slope (negative reciprocal)",
    marked: "Marked (32/25, −41/25), which is not on the given line; correct is (68/25, −49/25)",
  },
  {
    question: "Q21 (M1, hard) circle, arc length",
    how: "By hand: arc length ÷ circumference = central angle ÷ 360, then solve for the angle; or test each choice",
    desmos: "Arithmetic only",
    formulaNeeded: "Yes",
    formulaName: "Arc length",
    marked: "Marked 40 in 19 seconds; the answer must fall in the range 34 to 38",
  },
  {
    question: "Q22 (M1, hard) tangent line and parabola",
    how: "Graph both expressions in Desmos with a slider for c, slide until they touch once, read x=3; or set discriminant=0 and solve",
    desmos: "Yes (slider)",
    formulaNeeded: "Yes",
    formulaName: "Discriminant (b² − 4ac)",
    marked: "Marked −3; correct is 3",
  },
  {
    question: "Q2 (M2, easy) rearrange an equation",
    how: "By hand: divide every term by 10, or test with sample values for q and n",
    desmos: "No, by hand",
    formulaNeeded: "No",
    formulaName: "",
    marked: "Marked q/10 − 4n; correct is (q−4n)/10",
  },
  {
    question: "Q11 (M2, med) line from two points",
    how: "Plot both points in Desmos and test which equation fits, or compute slope = 2 and build the line",
    desmos: "Yes",
    formulaNeeded: "Yes",
    formulaName: "Slope from two points",
    marked: "Used slope 3; correct slope is 2 (the line with slope 3 passes through only one of the two points)",
  },
  {
    question: "Q18 (M2, med) exponential decay",
    how: "By hand write 20·(0.6)^x, or graph each choice in Desmos and check x=0 and x=1",
    desmos: "Yes",
    formulaNeeded: "Yes",
    formulaName: "Exponential form (a·b^x)",
    marked: "Marked 0.6(20)^x; correct is 20(0.6)^x",
  },
  {
    question: "Q22 (M2, hard) function composition",
    how: "Define h, then j(x)=h(x+2), graph y=j in Desmos and read the intercepts, or substitute x+2 by hand",
    desmos: "Yes",
    formulaNeeded: "No",
    formulaName: "",
    marked: "Marked 5 (sum of the original roots); correct is −1 after the shift",
  },
];

export const SKYE_MATH_AFTER_TABLE = [
  "Out of the 15 missed math questions, 10 can be solved with the built-in Desmos calculator once the problem is set up correctly. That still assumes you recognize the question type, enter the right equation or graph, and know which value on the screen is the answer.",
  "Nine of the 15 require a formula memorized that is not on the SAT reference sheet (six of those nine are in the Desmos group; three are solved by hand). The five that must be done entirely by hand are Q9, Q11 in Module 1, Q2 in Module 2, and the unit conversions in Q13 and Q21.",
  "The seven formulas listed below cover all nine questions that need one.",
];

export const SKYE_MATH_SKILLS_HEAD = "Math topics to work on from her misses";

export const SKYE_MATH_SKILLS_INTRO = [
  "The two clearest priorities are systems of equations and nonlinear equations. In Module 1 she missed every question in both: 0 of 2 on systems and 0 of 4 on nonlinear equations.",
  "If she had to focus on just two math skills right now, these are the two. Both show up often on the SAT and both showed up on her diagnostic.",
  "Both topics sit in Advanced Math on the SAT. That domain is about 35% of the Math section, roughly 15 of the 44 math questions. Systems and nonlinear equations together account for a large share of that block, which is why fixing them moves the score quickly.",
];

export const SKYE_MATH_SKILLS: RwSkillListItem[] = [
  {
    label: "Systems of equations",
    text: "Find where two lines cross, count how many solutions a system has, and write the equations correctly. (Q5, Q18)",
  },
  {
    label: "Factoring",
    text: "Use factoring and the zero-product property to solve equations like the one in Q9.",
  },
  {
    label: "Slope from two points",
    text: "Compute slope from two points and write the equation of the line. (Q17, M2 Q11)",
  },
  {
    label: "Exponential functions",
    text: 'Build an equation in the form a·b^x from a word problem (for example, "doubles every 3 days" or "decreases 40%"). (Q11, M2 Q18)',
  },
  {
    label: "Circle measures",
    text: "Convert radians to degrees and solve arc-length problems. (Q13, Q21)",
  },
  {
    label: "Perpendicular lines",
    text: "Use the negative reciprocal to find the slope of a perpendicular line. (Q18)",
  },
  {
    label: "Function transformations",
    text: "Understand how h(x+2) shifts a graph compared to h(x). (Q22 in Module 2)",
  },
  {
    label: "Equation manipulation",
    text: "Rearrange an equation by dividing every term or isolating a variable. (M2 Q2)",
  },
];

export const SKYE_MATH_QUESTION_TYPES =
  "A large part of SAT math is recognizing what the question is asking before you calculate. The SAT reuses the same question types, and the same topic can look different depending on the wording. Once you know the type, the formula or method usually follows. Until then, students often guess or plug in answer choices. In tutoring we learn what each type looks like. For example, two points and \"find the equation\" means write a line equation; \"how many solutions\" means find where lines cross; reading carefully for exactly what is asked (angle V and not U, h + k and not h alone) prevents stopping one step early.";

export const SKYE_MATH_FORMULAS_HEAD = "Formulas to memorize & practice";

export const SKYE_MATH_FORMULAS_INTRO =
  "These formulas are worth memorizing. Nine of the fifteen math misses on this diagnostic needed one of them, and none of them appear on the SAT reference sheet:";

export const SKYE_MATH_FORMULAS: RwSkillListItem[] = [
  {
    label: "Slope from two points",
    text: "m = (y₂ − y₁) / (x₂ − x₁)",
  },
  {
    label: "Quadratic formula",
    text: "x = (−b ± √(b² − 4ac)) / (2a)",
  },
  {
    label: "Discriminant",
    text: "b² − 4ac; when this equals zero, the equation has exactly one solution",
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
    text: "f(x) = a·b^x, where a is the starting value and b is the growth or decay factor",
  },
  {
    label: "Perpendicular slope",
    text: "flip the slope and change the sign (negative reciprocal)",
  },
];

export const SKYE_SKIP_TIME = {
  reading:
    "She answered inference questions correctly in both modules, and Cross-Text Connections was not a miss area. Most command-of-evidence questions were fine. Session time is better spent on transitions, passage question types, punctuation, and words in context, not on broad passage review.",
  math: "Problem-Solving and Data Analysis was strong in Module 1 (ratios, statistics, two-variable data, margin of error, probability were all correct), as were basic linear equations, lines and angles, and area and volume. The data and basic-geometry base is already in good shape.",
};
